import UIKit
import WebKit

final class MultiWebViewController: UIViewController {
    enum Mode {
        case horizontal
        case vertical
    }

    private var activeAccounts: [Account]
    private var mode: Mode
    private let scrollView = UIScrollView()
    private let stackView = UIStackView()
    private var webViewsByAccountID: [String: WKWebView] = [:]
    private var focusedAccountID: String?

    init(accounts: [Account], mode: Mode) {
        self.activeAccounts = accounts
        self.mode = mode
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = Theme.page
        configureNavigation()
        configureLayout()
        render()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
        navigationController?.setToolbarHidden(true, animated: animated)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if isMovingFromParent || isBeingDismissed {
            for account in activeAccounts {
                AccountStore.shared.updateStatus(accountID: account.id, status: "待机", operation: "关闭多开")
            }
        }
    }

    private func configureNavigation() {
        title = mode == .vertical ? "纵向多开" : "横向多开"
        navigationItem.rightBarButtonItems = [
            UIBarButtonItem(image: UIImage(systemName: "xmark"), style: .plain, target: self, action: #selector(closeAll)),
            UIBarButtonItem(image: UIImage(systemName: "rectangle.grid.2x2"), style: .plain, target: self, action: #selector(toggleMode)),
            UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(reloadAll))
        ]
    }

    private func configureLayout() {
        scrollView.alwaysBounceVertical = true
        view.addSubview(scrollView)
        scrollView.pinToSafeArea(of: view)

        stackView.axis = .vertical
        stackView.spacing = 12
        stackView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(stackView)
        NSLayoutConstraint.activate([
            stackView.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor, constant: 12),
            stackView.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor, constant: -12),
            stackView.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor, constant: 12),
            stackView.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor, constant: -12),
            stackView.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor, constant: -24)
        ])
    }

    private func render() {
        title = mode == .vertical ? "纵向多开" : "横向多开"
        webViewsByAccountID.values.forEach {
            $0.navigationDelegate = nil
            $0.removeFromSuperview()
        }
        webViewsByAccountID.removeAll()
        stackView.arrangedSubviews.forEach {
            stackView.removeArrangedSubview($0)
            $0.removeFromSuperview()
        }

        let visibleAccounts = mode == .vertical ? Array(activeAccounts.prefix(4)) : activeAccounts
        guard !visibleAccounts.isEmpty else {
            navigationController?.popViewController(animated: true)
            return
        }

        if let focusedID = focusedAccountID,
           let focused = visibleAccounts.first(where: { $0.id == focusedID }) {
            stackView.addArrangedSubview(makeWindow(account: focused, height: 520, isFocused: true))
            let others = visibleAccounts.filter { $0.id != focusedID }
            if !others.isEmpty {
                renderGrid(accounts: others, columns: 2, height: 170)
            }
        } else if mode == .vertical {
            renderGrid(accounts: visibleAccounts, columns: 2, height: 320)
        } else if visibleAccounts.count == 1 {
            stackView.addArrangedSubview(makeWindow(account: visibleAccounts[0], height: 460, isFocused: false))
        } else {
            renderGrid(accounts: visibleAccounts, columns: 2, height: 250)
        }

        for account in visibleAccounts {
            AccountStore.shared.updateStatus(accountID: account.id, status: "运行中", operation: "多开运行")
        }
    }

    private func renderGrid(accounts: [Account], columns: Int, height: CGFloat) {
        var index = 0
        while index < accounts.count {
            let row = UIStackView()
            row.axis = .horizontal
            row.spacing = 10
            row.distribution = .fillEqually
            for _ in 0..<columns {
                if index < accounts.count {
                    row.addArrangedSubview(makeWindow(account: accounts[index], height: height, isFocused: false))
                    index += 1
                } else {
                    row.addArrangedSubview(UIView())
                }
            }
            stackView.addArrangedSubview(row)
            row.heightAnchor.constraint(equalToConstant: height).isActive = true
        }
    }

    private func makeWindow(account: Account, height: CGFloat, isFocused: Bool) -> UIView {
        let shell = UIView()
        shell.backgroundColor = Theme.card
        shell.layer.cornerRadius = 16
        shell.layer.borderColor = Theme.line.cgColor
        shell.layer.borderWidth = 2.5
        shell.clipsToBounds = true

        let titleBar = UIView()
        titleBar.backgroundColor = isFocused ? Theme.yellowSoft : Theme.card
        shell.addSubview(titleBar)
        titleBar.translatesAutoresizingMaskIntoConstraints = false

        let title = Theme.label(account.name, size: 12, weight: .black, color: Theme.ink)
        titleBar.addSubview(title)
        title.translatesAutoresizingMaskIntoConstraints = false

        let focus = windowButton(isFocused ? "arrow.down.right.and.arrow.up.left" : "arrow.up.left.and.arrow.down.right", accountID: account.id, action: #selector(toggleFocus(_:)))
        let refresh = windowButton("arrow.clockwise", accountID: account.id, action: #selector(reloadOne(_:)))
        let close = windowButton("xmark", accountID: account.id, action: #selector(closeOne(_:)))
        titleBar.addSubview(focus)
        titleBar.addSubview(refresh)
        titleBar.addSubview(close)

        let webView = SnowKingWebViewFactory.makeWebView(
            account: account,
            isolateStorage: true,
            receiver: self,
            windowCount: activeAccounts.count
        )
        webView.navigationDelegate = self
        shell.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        webViewsByAccountID[account.id] = webView

        NSLayoutConstraint.activate([
            titleBar.leadingAnchor.constraint(equalTo: shell.leadingAnchor),
            titleBar.trailingAnchor.constraint(equalTo: shell.trailingAnchor),
            titleBar.topAnchor.constraint(equalTo: shell.topAnchor),
            titleBar.heightAnchor.constraint(equalToConstant: 34),
            title.leadingAnchor.constraint(equalTo: titleBar.leadingAnchor, constant: 10),
            title.trailingAnchor.constraint(lessThanOrEqualTo: focus.leadingAnchor, constant: -8),
            title.centerYAnchor.constraint(equalTo: titleBar.centerYAnchor),
            focus.trailingAnchor.constraint(equalTo: refresh.leadingAnchor, constant: -6),
            refresh.trailingAnchor.constraint(equalTo: close.leadingAnchor, constant: -6),
            close.trailingAnchor.constraint(equalTo: titleBar.trailingAnchor, constant: -8),
            focus.centerYAnchor.constraint(equalTo: titleBar.centerYAnchor),
            refresh.centerYAnchor.constraint(equalTo: titleBar.centerYAnchor),
            close.centerYAnchor.constraint(equalTo: titleBar.centerYAnchor),
            focus.widthAnchor.constraint(equalToConstant: 24),
            focus.heightAnchor.constraint(equalToConstant: 24),
            refresh.widthAnchor.constraint(equalToConstant: 24),
            refresh.heightAnchor.constraint(equalToConstant: 24),
            close.widthAnchor.constraint(equalToConstant: 24),
            close.heightAnchor.constraint(equalToConstant: 24),
            webView.leadingAnchor.constraint(equalTo: shell.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: shell.trailingAnchor),
            webView.topAnchor.constraint(equalTo: titleBar.bottomAnchor),
            webView.bottomAnchor.constraint(equalTo: shell.bottomAnchor)
        ])
        shell.heightAnchor.constraint(equalToConstant: height).isActive = true
        SnowKingWebViewFactory.loadGame(in: webView)
        return shell
    }

    private func windowButton(_ systemName: String, accountID: String, action: Selector) -> UIButton {
        let button = UIButton(type: .system)
        button.setImage(UIImage(systemName: systemName), for: .normal)
        button.tintColor = Theme.ink
        button.backgroundColor = Theme.yellowSoft
        button.layer.cornerRadius = 12
        button.layer.borderWidth = 1.5
        button.layer.borderColor = Theme.line.cgColor
        button.accessibilityIdentifier = accountID
        button.addTarget(self, action: action, for: .touchUpInside)
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }

    @objc private func reloadAll() {
        webViewsByAccountID.values.forEach { $0.reload() }
    }

    @objc private func reloadOne(_ sender: UIButton) {
        guard let accountID = sender.accessibilityIdentifier else { return }
        webViewsByAccountID[accountID]?.reload()
    }

    @objc private func toggleFocus(_ sender: UIButton) {
        guard let accountID = sender.accessibilityIdentifier else { return }
        focusedAccountID = focusedAccountID == accountID ? nil : accountID
        render()
    }

    @objc private func closeOne(_ sender: UIButton) {
        guard let accountID = sender.accessibilityIdentifier else { return }
        activeAccounts.removeAll { $0.id == accountID }
        if focusedAccountID == accountID {
            focusedAccountID = nil
        }
        AccountStore.shared.updateStatus(accountID: accountID, status: "待机", operation: "关闭窗口")
        render()
    }

    @objc private func closeAll() {
        navigationController?.popViewController(animated: true)
    }

    @objc private func toggleMode() {
        mode = mode == .vertical ? .horizontal : .vertical
        focusedAccountID = nil
        render()
    }
}

extension MultiWebViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if let script = ScriptLoader.enabledInjectionScript(singleWindow: false) {
            webView.evaluateJavaScript(script)
        }
    }
}

extension MultiWebViewController: NativeBridgeReceiver {
    func handleBridgeMessage(_ body: [String: Any], source: WKWebView?) {}
}
