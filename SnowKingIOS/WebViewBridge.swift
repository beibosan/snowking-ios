import UIKit
import WebKit

protocol NativeBridgeReceiver: AnyObject {
    func handleBridgeMessage(_ body: [String: Any], source: WKWebView?)
}

final class BridgeMessageHandler: NSObject, WKScriptMessageHandler {
    weak var receiver: NativeBridgeReceiver?
    weak var webView: WKWebView?

    init(receiver: NativeBridgeReceiver?) {
        self.receiver = receiver
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        let body = Self.normalizedBody(from: message)
        NativeBridgeActions.handle(body, source: webView)
        receiver?.handleBridgeMessage(body, source: webView)
    }

    private static func normalizedBody(from message: WKScriptMessage) -> [String: Any] {
        var payload: [String: Any]

        if let dict = message.body as? [String: Any] {
            payload = dict
        } else if let text = message.body as? String,
                  let data = text.data(using: .utf8),
                  let dict = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any] {
            payload = dict
        } else {
            payload = ["value": message.body]
        }

        if payload["handler"] == nil {
            payload["handler"] = message.name
        }
        if payload["type"] == nil {
            payload["type"] = message.name
        }
        return payload
    }
}

final class RescacheSchemeHandler: NSObject, WKURLSchemeHandler {
    private var tasks: [ObjectIdentifier: URLSessionDataTask] = [:]

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let sourceURL = urlSchemeTask.request.url,
              let remoteURL = Self.remoteURL(for: sourceURL) else {
            urlSchemeTask.didFailWithError(URLError(.badURL))
            return
        }

        let taskID = ObjectIdentifier(urlSchemeTask as AnyObject)
        let task = URLSession.shared.dataTask(with: remoteURL) { [weak self] data, response, error in
            DispatchQueue.main.async {
                guard let self = self, self.tasks[taskID] != nil else { return }
                self.tasks[taskID] = nil

                if let error = error {
                    urlSchemeTask.didFailWithError(error)
                    return
                }

                let body = data ?? Data()
                let mime = response?.mimeType ?? Self.mimeType(for: remoteURL.pathExtension)
                let proxyResponse = URLResponse(
                    url: sourceURL,
                    mimeType: mime,
                    expectedContentLength: body.count,
                    textEncodingName: nil
                )
                urlSchemeTask.didReceive(proxyResponse)
                if !body.isEmpty {
                    urlSchemeTask.didReceive(body)
                }
                urlSchemeTask.didFinish()
            }
        }
        tasks[taskID] = task
        task.resume()
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
        let taskID = ObjectIdentifier(urlSchemeTask as AnyObject)
        tasks[taskID]?.cancel()
        tasks[taskID] = nil
    }

    private static func remoteURL(for url: URL) -> URL? {
        let host = url.host ?? ""
        let path = url.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        var remotePath = [host, path].filter { !$0.isEmpty }.joined(separator: "/")
        if remotePath.hasPrefix("res/") {
            remotePath.removeFirst("res/".count)
        }
        if !remotePath.hasPrefix("remote/") {
            remotePath = "remote/" + remotePath
        }
        return URL(string: "https://xxz-xyzw-res.hortorgames.com/\(remotePath)")
    }

    private static func mimeType(for ext: String) -> String {
        switch ext.lowercased() {
        case "js", "jsc":
            return "application/javascript"
        case "json":
            return "application/json"
        case "png":
            return "image/png"
        case "jpg", "jpeg":
            return "image/jpeg"
        case "mp3":
            return "audio/mpeg"
        case "wav":
            return "audio/wav"
        case "css":
            return "text/css"
        case "html":
            return "text/html"
        default:
            return "application/octet-stream"
        }
    }
}

enum SnowKingWebViewFactory {
    private static let handlerNames = [
        "snowkingBridge",
        "iosQuick",
        "iosScriptSwitch",
        "iosSaveStorage",
        "iosReadClipboard",
        "iosStorage",
        "iosWindowCount",
        "iosLoginState",
        "iosNewWindow",
        "iosSetTitle"
    ]

    static func makeWebView(
        account: Account?,
        isolateStorage: Bool,
        receiver: NativeBridgeReceiver?,
        windowCount: Int = 1
    ) -> WKWebView {
        let contentController = WKUserContentController()
        let bridge = BridgeScriptFactory.makeBridgeScript(
            account: account,
            isolateStorage: isolateStorage,
            windowCount: windowCount
        )
        contentController.addUserScript(WKUserScript(source: bridge, injectionTime: .atDocumentStart, forMainFrameOnly: false))

        let handler = BridgeMessageHandler(receiver: receiver)
        for name in handlerNames {
            contentController.add(handler, name: name)
        }

        let configuration = WKWebViewConfiguration()
        configuration.userContentController = contentController
        configuration.websiteDataStore = (isolateStorage || !SettingsStore.shared.cacheEnabled) ? .nonPersistent() : .default()
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = true
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.setURLSchemeHandler(RescacheSchemeHandler(), forURLScheme: "rescache")

        let webView = WKWebView(frame: .zero, configuration: configuration)
        handler.webView = webView
        webView.backgroundColor = .black
        webView.isOpaque = false
        webView.scrollView.backgroundColor = .black
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        return webView
    }

    static func loadGame(in webView: WKWebView) {
        if let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "GameData") {
            webView.loadFileURL(indexURL, allowingReadAccessTo: Bundle.main.bundleURL)
            return
        }
        if let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
            webView.loadFileURL(indexURL, allowingReadAccessTo: Bundle.main.bundleURL)
            return
        }
        webView.loadHTMLString("<html><body style='font:16px -apple-system;padding:24px'>Missing GameData/index.html</body></html>", baseURL: nil)
    }
}

enum NativeBridgeActions {
    static func handle(_ body: [String: Any], source: WKWebView?) {
        guard let type = body["type"] as? String else { return }
        switch type {
        case "copy", "iosReadClipboard":
            handleClipboard(body, source: source)
        case "cacheDecodedData":
            let hash = body["hash"] as? String ?? ""
            let json = body["json"] as? String ?? ""
            guard !hash.isEmpty, !json.isEmpty else { return }
            UserDefaults.standard.set(json, forKey: "snow_king_decoded_\(hash)")
        case "iosStorage":
            saveStorageValue(body)
        case "iosSaveStorage":
            saveBinStorage(body)
        case "iosScriptSwitch":
            updateScriptSwitch(body)
        case "clearCaches":
            clearWebCache()
        case "saveBase64":
            saveBase64(body)
        case "iosQuick", "iosWindowCount", "iosLoginState", "iosNewWindow", "iosSetTitle":
            break
        case "saveData", "saveDataUrl", "pickFile", "relaunchApp":
            break
        default:
            break
        }
    }

    private static func handleClipboard(_ body: [String: Any], source: WKWebView?) {
        if let value = body["value"] as? String {
            UIPasteboard.general.string = value
        }
        let text = UIPasteboard.general.string ?? ""
        let jsText = BridgeScriptFactory.javascriptString(text)
        source?.evaluateJavaScript(
            """
            window.__snowKingClipboard = \(jsText);
            window.dispatchEvent(new CustomEvent('snowking:clipboard', { detail: { text: \(jsText) } }));
            """
        )
    }

    private static func saveStorageValue(_ body: [String: Any]) {
        guard let key = body["key"] as? String, !key.isEmpty else { return }
        let value = body["value"] ?? body["data"] ?? ""
        UserDefaults.standard.set(jsonString(value), forKey: "snow_king_ios_storage_\(key)")
    }

    private static func saveBinStorage(_ body: [String: Any]) {
        let hash = body["hash"] as? String ?? body["binHash"] as? String ?? ""
        guard !hash.isEmpty else { return }
        let value = body["storage"] ?? body["value"] ?? body["data"] ?? [:]
        UserDefaults.standard.set(jsonString(value), forKey: "snow_king_bin_storage_\(hash)")
    }

    private static func updateScriptSwitch(_ body: [String: Any]) {
        let fileName = body["fileName"] as? String
            ?? body["name"] as? String
            ?? body["script"] as? String
            ?? body["id"] as? String
            ?? ""
        guard !fileName.isEmpty, let enabled = body["enabled"] as? Bool else { return }
        SettingsStore.shared.setScriptEnabled(enabled, fileName: fileName)
    }

    private static func clearWebCache() {
        let dataTypes = WKWebsiteDataStore.allWebsiteDataTypes()
        WKWebsiteDataStore.default().removeData(
            ofTypes: dataTypes,
            modifiedSince: Date(timeIntervalSince1970: 0),
            completionHandler: {}
        )
    }

    private static func saveBase64(_ body: [String: Any]) {
        let rawName = (body["name"] as? String)?.trimmingCharacters(in: .whitespacesAndNewlines)
        let fileName = rawName?.isEmpty == false ? rawName! : "snowking-export.json"
        let base64 = body["base64"] as? String ?? ""
        guard let data = Data(base64Encoded: base64) else { return }
        let exports = AccountStore.documentsDirectory.appendingPathComponent("exports", isDirectory: true)
        try? FileManager.default.createDirectory(at: exports, withIntermediateDirectories: true)
        let safe = fileName.components(separatedBy: CharacterSet(charactersIn: "\\/:*?\"<>|")).joined(separator: "_")
        try? data.write(to: exports.appendingPathComponent(safe, isDirectory: false), options: .atomic)
    }

    private static func jsonString(_ value: Any) -> String {
        if let string = value as? String {
            return string
        }
        guard JSONSerialization.isValidJSONObject(value),
              let data = try? JSONSerialization.data(withJSONObject: value),
              let json = String(data: data, encoding: .utf8) else {
            return ""
        }
        return json
    }
}
