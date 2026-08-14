import Foundation

struct UserScriptItem: Equatable {
    var fileName: String
    var url: URL
    var isEnabled: Bool
}

final class ScriptStore {
    static let shared = ScriptStore()

    static var scriptsDirectory: URL {
        AccountStore.documentsDirectory.appendingPathComponent("scripts", isDirectory: true)
    }

    private init() {
        try? FileManager.default.createDirectory(at: Self.scriptsDirectory, withIntermediateDirectories: true)
    }

    func list() -> [UserScriptItem] {
        let urls = (try? FileManager.default.contentsOfDirectory(
            at: Self.scriptsDirectory,
            includingPropertiesForKeys: [.contentModificationDateKey],
            options: [.skipsHiddenFiles]
        )) ?? []

        return urls
            .filter { $0.pathExtension.lowercased() == "js" }
            .sorted { $0.lastPathComponent.localizedStandardCompare($1.lastPathComponent) == .orderedAscending }
            .map {
                UserScriptItem(
                    fileName: $0.lastPathComponent,
                    url: $0,
                    isEnabled: SettingsStore.shared.isScriptEnabled(fileName: $0.lastPathComponent)
                )
            }
    }

    @discardableResult
    func importScript(from url: URL) throws -> UserScriptItem {
        try FileManager.default.createDirectory(at: Self.scriptsDirectory, withIntermediateDirectories: true)
        let scoped = url.startAccessingSecurityScopedResource()
        defer {
            if scoped { url.stopAccessingSecurityScopedResource() }
        }

        var name = sanitize(url.lastPathComponent.isEmpty ? "script.js" : url.lastPathComponent)
        if !name.lowercased().hasSuffix(".js") {
            name += ".js"
        }
        let target = Self.scriptsDirectory.appendingPathComponent(name, isDirectory: false)
        let data = try Data(contentsOf: url)
        try data.write(to: target, options: .atomic)
        SettingsStore.shared.setScriptEnabled(true, fileName: name)
        return UserScriptItem(fileName: name, url: target, isEnabled: true)
    }

    func delete(_ item: UserScriptItem) {
        try? FileManager.default.removeItem(at: item.url)
        SettingsStore.shared.setScriptEnabled(false, fileName: item.fileName)
    }

    private func sanitize(_ name: String) -> String {
        let invalid = CharacterSet(charactersIn: "\\/:*?\"<>|")
        let parts = name.components(separatedBy: invalid).filter { !$0.isEmpty }
        let clean = parts.joined(separator: "_").trimmingCharacters(in: .whitespacesAndNewlines)
        return clean.isEmpty ? "script.js" : clean
    }
}
