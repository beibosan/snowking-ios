import UIKit
import WebKit

final class GameWebViewController: UIViewController {
    private var account: Account
    private var webView: WKWebView?
    private let container = UIView()
    private let progress = UIProgressView(progressViewStyle: .bar)
    private var progressObservation: NSKeyValueObservation?

    init(account: Account) {
        self.account = account
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        title = account.name
        configureNavigation()
        configureLayout()
        rebuildWebView()
        AccountStore.shared.updateStatus(accountID: account.id, status: "运行中", operation: "启动账号")
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
        navigationController?.setToolbarHidden(true, animated: animated)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if isMovingFromParent || isBeingDismissed {
            AccountStore.shared.updateStatus(accountID: account.id, status: "待机", operation: "关闭窗口")
        }
    }

    private func configureNavigation() {
        navigationItem.rightBarButtonItems = [
            UIBarButtonItem(image: UIImage(systemName: "xmark"), style: .plain, target: self, action: #selector(closeWindow)),
            UIBarButtonItem(image: UIImage(systemName: "gearshape"), style: .plain, target: self, action: #selector(openSettings)),
            UIBarButtonItem(title: "阵容", style: .plain, target: self, action: #selector(openLineupManager)),
            UIBarButtonItem(title: "切换", style: .plain, target: self, action: #selector(showAccountSwitcher)),
            UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(reloadGame))
        ]
    }

    private func configureLayout() {
        view.addSubview(container)
        container.pinToSafeArea(of: view)

        progress.translatesAutoresizingMaskIntoConstraints = false
        progress.progressTintColor = Theme.accent
        view.addSubview(progress)
        NSLayoutConstraint.activate([
            progress.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            progress.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            progress.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor)
        ])
    }

    private func rebuildWebView() {
        progressObservation = nil
        webView?.navigationDelegate = nil
        webView?.uiDelegate = nil
        webView?.removeFromSuperview()

        let webView = SnowKingWebViewFactory.makeWebView(account: account, isolateStorage: false, receiver: self)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        container.addSubview(webView)
        webView.pinToEdges(of: container)
        progressObservation = webView.observe(\.estimatedProgress, options: [.new]) { [weak self] webView, _ in
            self?.progress.progress = Float(webView.estimatedProgress)
            self?.progress.isHidden = webView.estimatedProgress >= 1
        }
        self.webView = webView
        SnowKingWebViewFactory.loadGame(in: webView)
    }

    @objc private func reloadGame() {
        webView?.reload()
    }

    @objc private func openSettings() {
        navigationController?.pushViewController(SettingsViewController(), animated: true)
    }

    @objc private func closeWindow() {
        navigationController?.popViewController(animated: true)
    }

    @objc private func showAccountSwitcher() {
        let accounts = AccountStore.shared.load()
        let alert = UIAlertController(title: "切换账号", message: nil, preferredStyle: .actionSheet)
        for item in accounts {
            alert.addAction(UIAlertAction(title: item.name, style: .default) { [weak self] _ in
                self?.switchToAccount(item)
            })
        }
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))
        alert.popoverPresentationController?.sourceView = view
        present(alert, animated: true)
    }

    private func switchToAccount(_ next: Account) {
        guard next.id != account.id else { return }
        AccountStore.shared.updateStatus(accountID: account.id, status: "待机", operation: "切换账号")
        account = next
        title = next.name
        AccountStore.shared.updateStatus(accountID: next.id, status: "运行中", operation: "启动账号")
        rebuildWebView()
    }

    @objc private func openLineupManager() {
        guard SettingsStore.shared.lineupEnabled else {
            showMessage("请先在设置中开启阵容切换保存。")
            return
        }
        webView?.evaluateJavaScript(
            """
            (function(){
              try {
                if (typeof window.__openLineupPanel !== 'function') return false;
                window.__lineupEnabled = true;
                window.__openLineupPanel();
                return true;
              } catch (e) {
                console.error('[lineup] open failed', e);
                return false;
              }
            })();
            """
        ) { [weak self] result, _ in
            if (result as? Bool) != true {
                self?.showMessage("阵容功能正在加载，请稍后再试。")
            }
        }
    }

    private func showMessage(_ text: String) {
        let alert = UIAlertController(title: nil, message: text, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "知道了", style: .default))
        present(alert, animated: true)
    }
}

extension GameWebViewController: WKNavigationDelegate, WKUIDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if let script = ScriptLoader.enabledInjectionScript(singleWindow: true) {
            webView.evaluateJavaScript(script)
        }
    }
}

extension GameWebViewController: NativeBridgeReceiver {
    func handleBridgeMessage(_ body: [String: Any], source: WKWebView?) {
        guard let type = body["type"] as? String else { return }
        if type == "saveBase64" {
            showMessage("文件已保存到 App 的 Documents/exports 目录。")
        }
    }
}
