import UIKit
import UniformTypeIdentifiers

final class AccountListViewController: UIViewController {
    private enum Filter: String, CaseIterable {
        case all = "全部"
        case idle = "待机"
        case running = "运行中"
        case ungrouped = "未分组"
    }

    private let scrollView = UIScrollView()
    private let contentStack = UIStackView()
    private let toolbarGrid = UIStackView()
    private let tagStack = UIStackView()
    private let accountStack = UIStackView()
    private let searchField = UITextField()
    private let fab = UIButton(type: .system)

    private var accounts: [Account] = []
    private var filteredAccounts: [Account] = []
    private var selectedAccountIDs = Set<String>()
    private var isSelectionMode = false
    private var isSortAscending = true
    private var activeFilter: Filter = .all

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = Theme.page
        configureLayout()
        configureHeader()
        configureToolbar()
        configureGroups()
        configureAccountStack()
        configureFAB()
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(reloadAccounts),
            name: .snowKingAccountsChanged,
            object: nil
        )
        reloadAccounts()
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: animated)
        navigationController?.setToolbarHidden(true, animated: animated)
        reloadAccounts()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
    }

    private func configureLayout() {
        view.addSubview(scrollView)
        scrollView.pinToSafeArea(of: view)
        scrollView.alwaysBounceVertical = true

        contentStack.axis = .vertical
        contentStack.spacing = 14
        contentStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentStack)

        NSLayoutConstraint.activate([
            contentStack.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor, constant: 16),
            contentStack.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor, constant: -16),
            contentStack.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor, constant: 10),
            contentStack.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor, constant: -92),
            contentStack.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor, constant: -32)
        ])
    }

    private func configureHeader() {
        let topRow = UIStackView()
        topRow.axis = .horizontal
        topRow.alignment = .center
        topRow.spacing = 10

        let title = UILabel()
        title.text = "全部账号"
        title.font = .systemFont(ofSize: 26, weight: .black)
        title.textColor = Theme.ink
        title.setContentHuggingPriority(.required, for: .horizontal)

        let searchBox = UIView()
        searchBox.backgroundColor = Theme.yellowSoft
        searchBox.layer.cornerRadius = 18
        searchBox.layer.borderColor = Theme.line.cgColor
        searchBox.layer.borderWidth = 2.5

        let searchIcon = UIImageView(image: UIImage(systemName: "magnifyingglass"))
        searchIcon.tintColor = Theme.muted
        searchIcon.translatesAutoresizingMaskIntoConstraints = false

        searchField.placeholder = "搜索账号"
        searchField.font = .systemFont(ofSize: 13, weight: .semibold)
        searchField.textColor = Theme.ink
        searchField.borderStyle = .none
        searchField.clearButtonMode = .whileEditing
        searchField.addTarget(self, action: #selector(searchChanged), for: .editingChanged)
        searchField.translatesAutoresizingMaskIntoConstraints = false

        searchBox.addSubview(searchIcon)
        searchBox.addSubview(searchField)
        NSLayoutConstraint.activate([
            searchBox.heightAnchor.constraint(equalToConstant: 38),
            searchIcon.leadingAnchor.constraint(equalTo: searchBox.leadingAnchor, constant: 10),
            searchIcon.centerYAnchor.constraint(equalTo: searchBox.centerYAnchor),
            searchIcon.widthAnchor.constraint(equalToConstant: 15),
            searchIcon.heightAnchor.constraint(equalToConstant: 15),
            searchField.leadingAnchor.constraint(equalTo: searchIcon.trailingAnchor, constant: 6),
            searchField.trailingAnchor.constraint(equalTo: searchBox.trailingAnchor, constant: -10),
            searchField.topAnchor.constraint(equalTo: searchBox.topAnchor),
            searchField.bottomAnchor.constraint(equalTo: searchBox.bottomAnchor)
        ])

        let addButton = Theme.symbolButton("plus", background: Theme.mint, tint: Theme.ink)
        addButton.addTarget(self, action: #selector(showImportOptions), for: .touchUpInside)
        addButton.widthAnchor.constraint(equalToConstant: 40).isActive = true
        addButton.heightAnchor.constraint(equalToConstant: 40).isActive = true

        let settingsButton = Theme.symbolButton("gearshape.fill", background: Theme.lavenderSoft, tint: Theme.ink)
        settingsButton.addTarget(self, action: #selector(openSettings), for: .touchUpInside)
        settingsButton.widthAnchor.constraint(equalToConstant: 40).isActive = true
        settingsButton.heightAnchor.constraint(equalToConstant: 40).isActive = true

        topRow.addArrangedSubview(title)
        topRow.addArrangedSubview(searchBox)
        topRow.addArrangedSubview(addButton)
        topRow.addArrangedSubview(settingsButton)
        contentStack.addArrangedSubview(topRow)
    }

    private func configureToolbar() {
        toolbarGrid.axis = .vertical
        toolbarGrid.spacing = 8

        let row1 = UIStackView()
        row1.axis = .horizontal
        row1.spacing = 8
        row1.distribution = .fillEqually

        let row2 = UIStackView()
        row2.axis = .horizontal
        row2.spacing = 8
        row2.distribution = .fillEqually

        let vertical = Theme.toolButton(title: "纵向多开", systemName: "square.grid.2x2", background: Theme.skySoft)
        vertical.addTarget(self, action: #selector(openVerticalMulti), for: .touchUpInside)

        let horizontal = Theme.toolButton(title: "横向多开", systemName: "rectangle.split.2x1", background: Theme.pinkSoft)
        horizontal.addTarget(self, action: #selector(openHorizontalMulti), for: .touchUpInside)

        let batch = Theme.toolButton(title: "批量操作", systemName: "checklist", background: Theme.orangeSoft)
        batch.addTarget(self, action: #selector(toggleSelectionMode), for: .touchUpInside)

        let sort = Theme.toolButton(title: "排序", systemName: "arrow.up.arrow.down", background: Theme.mintSoft)
        sort.addTarget(self, action: #selector(toggleSort), for: .touchUpInside)

        [vertical, horizontal].forEach { row1.addArrangedSubview($0) }
        [batch, sort].forEach { row2.addArrangedSubview($0) }
        toolbarGrid.addArrangedSubview(row1)
        toolbarGrid.addArrangedSubview(row2)
        contentStack.addArrangedSubview(toolbarGrid)
    }

    private func configureGroups() {
        let groupRow = UIStackView()
        groupRow.axis = .horizontal
        groupRow.alignment = .center
        groupRow.spacing = 8

        let label = UILabel()
        label.text = "账号分组"
        label.font = .systemFont(ofSize: 15, weight: .black)
        label.textColor = Theme.ink

        let manage = pillButton("管理分组", color: Theme.lavenderSoft)
        manage.addTarget(self, action: #selector(showGroupMessage), for: .touchUpInside)

        let create = pillButton("新建分组", color: Theme.yellowSoft)
        create.addTarget(self, action: #selector(showGroupMessage), for: .touchUpInside)

        groupRow.addArrangedSubview(label)
        groupRow.addArrangedSubview(manage)
        groupRow.addArrangedSubview(create)
        groupRow.addArrangedSubview(UIView())
        contentStack.addArrangedSubview(groupRow)

        tagStack.axis = .horizontal
        tagStack.spacing = 7
        let tagScroll = UIScrollView()
        tagScroll.showsHorizontalScrollIndicator = false
        tagScroll.addSubview(tagStack)
        tagStack.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            tagStack.leadingAnchor.constraint(equalTo: tagScroll.contentLayoutGuide.leadingAnchor),
            tagStack.trailingAnchor.constraint(equalTo: tagScroll.contentLayoutGuide.trailingAnchor),
            tagStack.topAnchor.constraint(equalTo: tagScroll.contentLayoutGuide.topAnchor),
            tagStack.bottomAnchor.constraint(equalTo: tagScroll.contentLayoutGuide.bottomAnchor),
            tagStack.heightAnchor.constraint(equalTo: tagScroll.frameLayoutGuide.heightAnchor)
        ])
        tagScroll.heightAnchor.constraint(equalToConstant: 34).isActive = true
        contentStack.addArrangedSubview(tagScroll)
        rebuildTags()
    }

    private func configureAccountStack() {
        accountStack.axis = .vertical
        accountStack.spacing = 12
        contentStack.addArrangedSubview(accountStack)
    }

    private func configureFAB() {
        fab.setImage(UIImage(systemName: "plus"), for: .normal)
        fab.tintColor = .white
        fab.backgroundColor = Theme.accent
        fab.layer.cornerRadius = 30
        fab.layer.borderWidth = 3
        fab.layer.borderColor = Theme.line.cgColor
        fab.layer.shadowColor = Theme.line.cgColor
        fab.layer.shadowOpacity = 1
        fab.layer.shadowOffset = CGSize(width: 4, height: 4)
        fab.layer.shadowRadius = 0
        fab.addTarget(self, action: #selector(showImportOptions), for: .touchUpInside)
        fab.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(fab)
        NSLayoutConstraint.activate([
            fab.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -22),
            fab.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -22),
            fab.widthAnchor.constraint(equalToConstant: 60),
            fab.heightAnchor.constraint(equalToConstant: 60)
        ])
    }

    private func pillButton(_ title: String, color: UIColor) -> UIButton {
        let button = UIButton(type: .system)
        button.setTitle(title, for: .normal)
        button.setTitleColor(Theme.ink, for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 12, weight: .heavy)
        button.backgroundColor = color
        button.layer.cornerRadius = 16
        button.layer.borderWidth = 2
        button.layer.borderColor = Theme.line.cgColor
        button.contentEdgeInsets = UIEdgeInsets(top: 6, left: 10, bottom: 6, right: 10)
        return button
    }

    private func rebuildTags() {
        tagStack.arrangedSubviews.forEach {
            tagStack.removeArrangedSubview($0)
            $0.removeFromSuperview()
        }

        for filter in Filter.allCases {
            let button = pillButton(filter.rawValue, color: filter == activeFilter ? Theme.pink : Theme.card)
            button.setTitleColor(filter == activeFilter ? .white : Theme.ink, for: .normal)
            button.tag = Filter.allCases.firstIndex(of: filter) ?? 0
            button.addTarget(self, action: #selector(filterTapped(_:)), for: .touchUpInside)
            tagStack.addArrangedSubview(button)
        }
    }

    @objc private func reloadAccounts() {
        accounts = AccountStore.shared.load()
        applyFilterAndSort()
    }

    @objc private func searchChanged() {
        applyFilterAndSort()
    }

    @objc private func filterTapped(_ sender: UIButton) {
        guard sender.tag < Filter.allCases.count else { return }
        activeFilter = Filter.allCases[sender.tag]
        rebuildTags()
        applyFilterAndSort()
    }

    @objc private func toggleSort() {
        isSortAscending.toggle()
        applyFilterAndSort()
    }

    @objc private func toggleSelectionMode() {
        isSelectionMode.toggle()
        if !isSelectionMode {
            selectedAccountIDs.removeAll()
        }
        renderAccounts()
    }

    private func applyFilterAndSort() {
        let query = searchField.text?.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() ?? ""
        filteredAccounts = accounts.filter { account in
            let matchesQuery = query.isEmpty
                || account.name.lowercased().contains(query)
                || account.displayFileName.lowercased().contains(query)
                || account.status.lowercased().contains(query)
            guard matchesQuery else { return false }

            switch activeFilter {
            case .all, .ungrouped:
                return true
            case .idle:
                return localizedStatus(account.status).contains("待机")
            case .running:
                return localizedStatus(account.status).contains("运行")
            }
        }
        filteredAccounts.sort {
            isSortAscending
                ? $0.name.localizedStandardCompare($1.name) == .orderedAscending
                : $0.name.localizedStandardCompare($1.name) == .orderedDescending
        }
        selectedAccountIDs = selectedAccountIDs.intersection(Set(filteredAccounts.map { $0.id }))
        renderAccounts()
    }

    private func renderAccounts() {
        accountStack.arrangedSubviews.forEach {
            accountStack.removeArrangedSubview($0)
            $0.removeFromSuperview()
        }

        guard !filteredAccounts.isEmpty else {
            let empty = EmptyAccountsView()
            empty.addTarget(self, action: #selector(showImportOptions), for: .touchUpInside)
            accountStack.addArrangedSubview(empty)
            return
        }

        for (index, account) in filteredAccounts.enumerated() {
            let card = AccountCardView(
                account: account,
                index: index,
                isSelected: selectedAccountIDs.contains(account.id),
                selectionMode: isSelectionMode
            )
            card.tag = index
            card.addTarget(self, action: #selector(accountCardTapped(_:)), for: .touchUpInside)
            accountStack.addArrangedSubview(card)
        }
    }

    @objc private func accountCardTapped(_ sender: UIControl) {
        guard sender.tag < filteredAccounts.count else { return }
        let account = filteredAccounts[sender.tag]
        if isSelectionMode {
            if selectedAccountIDs.contains(account.id) {
                selectedAccountIDs.remove(account.id)
            } else {
                selectedAccountIDs.insert(account.id)
            }
            renderAccounts()
            return
        }
        showAccountActions(for: account)
    }

    @objc private func showImportOptions() {
        let alert = UIAlertController(title: "新增账号", message: nil, preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: ".bin 文件导入", style: .default) { [weak self] _ in
            self?.importAccounts()
        })
        alert.addAction(UIAlertAction(title: "微信扫码导入", style: .default) { [weak self] _ in
            self?.showMessage("当前 iOS 版先接入 .bin 导入；微信扫码需要补齐登录接口后再启用。")
        })
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))
        alert.popoverPresentationController?.sourceView = fab
        present(alert, animated: true)
    }

    private func importAccounts() {
        let binType = UTType(filenameExtension: "bin") ?? .data
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [binType, .data], asCopy: true)
        picker.delegate = self
        picker.allowsMultipleSelection = true
        present(picker, animated: true)
    }

    @objc private func openSettings() {
        navigationController?.pushViewController(SettingsViewController(), animated: true)
    }

    @objc private func openHorizontalMulti() {
        openMulti(mode: .horizontal)
    }

    @objc private func openVerticalMulti() {
        openMulti(mode: .vertical)
    }

    private func selectedAccountsForMulti(maxCount: Int? = nil) -> [Account] {
        let selected = filteredAccounts.filter { selectedAccountIDs.contains($0.id) }
        let base = selected
        if let maxCount = maxCount {
            return Array(base.prefix(maxCount))
        }
        return base
    }

    private func openMulti(mode: MultiWebViewController.Mode) {
        let chosen = selectedAccountsForMulti(maxCount: mode == .vertical ? 4 : nil)
        guard !chosen.isEmpty else {
            if filteredAccounts.isEmpty {
                showMessage("请先导入账号。")
            } else {
                isSelectionMode = true
                renderAccounts()
                showMessage("请先勾选要多开的账号。")
            }
            return
        }
        navigationController?.pushViewController(MultiWebViewController(accounts: chosen, mode: mode), animated: true)
    }

    private func showAccountActions(for account: Account) {
        let alert = UIAlertController(title: account.name, message: "账号操作", preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "启动账号", style: .default) { [weak self] _ in
            self?.navigationController?.pushViewController(GameWebViewController(account: account), animated: true)
        })
        alert.addAction(UIAlertAction(title: "关闭账号", style: .default) { [weak self] _ in
            AccountStore.shared.updateStatus(accountID: account.id, status: "待机", operation: "关闭账号")
            self?.reloadAccounts()
        })
        alert.addAction(UIAlertAction(title: "修改名称", style: .default) { [weak self] _ in
            self?.rename(account)
        })
        alert.addAction(UIAlertAction(title: "导出 .bin 文件", style: .default) { [weak self] _ in
            self?.export(account)
        })
        alert.addAction(UIAlertAction(title: "删除", style: .destructive) { [weak self] _ in
            AccountStore.shared.delete(account)
            self?.reloadAccounts()
        })
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))
        alert.popoverPresentationController?.sourceView = view
        present(alert, animated: true)
    }

    private func rename(_ account: Account) {
        let alert = UIAlertController(title: "修改名称", message: nil, preferredStyle: .alert)
        alert.addTextField { field in
            field.text = account.name
            field.clearButtonMode = .whileEditing
        }
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))
        alert.addAction(UIAlertAction(title: "保存", style: .default) { [weak self, weak alert] _ in
            let name = alert?.textFields?.first?.text ?? ""
            AccountStore.shared.rename(account, to: name)
            self?.reloadAccounts()
        })
        present(alert, animated: true)
    }

    private func export(_ account: Account) {
        let controller = UIActivityViewController(activityItems: [account.fileURL], applicationActivities: nil)
        controller.popoverPresentationController?.sourceView = view
        present(controller, animated: true)
    }

    @objc private func showGroupMessage() {
        showMessage("分组 UI 已还原；账号分组数据字段需要后续接入 AccountStore 后启用。")
    }

    private func showMessage(_ text: String) {
        let alert = UIAlertController(title: nil, message: text, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "知道了", style: .default))
        present(alert, animated: true)
    }

    private func localizedStatus(_ status: String) -> String {
        if status.contains("运行") || status.contains("杩") { return "运行中" }
        if status.contains("关闭") || status.contains("鍏") { return "已关闭" }
        return "待机"
    }
}

extension AccountListViewController: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        var imported = 0
        var failed = 0
        for url in urls {
            do {
                _ = try AccountStore.shared.importFile(from: url)
                imported += 1
            } catch {
                failed += 1
            }
        }
        reloadAccounts()
        showMessage(failed == 0 ? "已导入 \(imported) 个账号" : "已导入 \(imported) 个，失败 \(failed) 个")
    }
}

private final class AccountCardView: UIControl {
    init(account: Account, index: Int, isSelected: Bool, selectionMode: Bool) {
        super.init(frame: .zero)
        Theme.borderedCard(self)

        let row = UIStackView()
        row.axis = .horizontal
        row.alignment = .center
        row.spacing = 12
        row.isUserInteractionEnabled = false
        addSubview(row)
        row.pinToEdges(of: self, insets: UIEdgeInsets(top: 12, left: 12, bottom: 12, right: 12))

        let avatar = UILabel()
        avatar.text = String(account.name.prefix(1)).isEmpty ? "号" : String(account.name.prefix(1))
        avatar.textAlignment = .center
        avatar.textColor = .white
        avatar.font = .systemFont(ofSize: 19, weight: .black)
        avatar.backgroundColor = [Theme.pink, Theme.accent, Theme.mint, Theme.orange, Theme.lavender, Theme.coral][index % 6]
        avatar.layer.cornerRadius = 15
        avatar.layer.borderColor = Theme.line.cgColor
        avatar.layer.borderWidth = 2.5
        avatar.clipsToBounds = true
        avatar.widthAnchor.constraint(equalToConstant: 52).isActive = true
        avatar.heightAnchor.constraint(equalToConstant: 52).isActive = true

        let textStack = UIStackView()
        textStack.axis = .vertical
        textStack.spacing = 5

        let titleRow = UIStackView()
        titleRow.axis = .horizontal
        titleRow.alignment = .center
        titleRow.spacing = 6

        let name = UILabel()
        name.text = account.name
        name.font = .systemFont(ofSize: 16, weight: .black)
        name.textColor = Theme.ink
        name.lineBreakMode = .byTruncatingTail

        let status = StatusBadge(text: Self.displayStatus(account.status))
        titleRow.addArrangedSubview(name)
        titleRow.addArrangedSubview(status)
        titleRow.addArrangedSubview(UIView())

        let meta = UILabel()
        meta.text = account.displayFileName
        meta.font = .systemFont(ofSize: 12, weight: .semibold)
        meta.textColor = Theme.muted
        meta.lineBreakMode = .byTruncatingMiddle

        let operation = UILabel()
        operation.text = "最后操作：\(Self.displayOperation(account.lastOperation))"
        operation.font = .systemFont(ofSize: 11, weight: .medium)
        operation.textColor = Theme.muted

        textStack.addArrangedSubview(titleRow)
        textStack.addArrangedSubview(meta)
        textStack.addArrangedSubview(operation)

        let accessory = UIImageView(image: UIImage(systemName: selectionMode ? (isSelected ? "checkmark.circle.fill" : "circle") : "ellipsis.circle"))
        accessory.tintColor = isSelected ? Theme.mint : Theme.muted
        accessory.widthAnchor.constraint(equalToConstant: 24).isActive = true

        row.addArrangedSubview(avatar)
        row.addArrangedSubview(textStack)
        row.addArrangedSubview(accessory)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private static func displayStatus(_ status: String) -> String {
        if status.contains("运行") || status.contains("杩") { return "运行中" }
        if status.contains("关闭") || status.contains("鍏") { return "已关闭" }
        return "待机"
    }

    private static func displayOperation(_ operation: String) -> String {
        if operation.contains("导入") || operation.contains("瀵") { return "导入账号" }
        if operation.contains("启动") || operation.contains("鍚") { return "启动账号" }
        if operation.contains("关闭") || operation.contains("鍏") { return "关闭账号" }
        if operation.contains("多开") || operation.contains("澶") { return "多开运行" }
        if operation.contains("重命名") || operation.contains("閲") { return "重命名账号" }
        return operation.isEmpty ? "待机" : operation
    }
}

private final class StatusBadge: UILabel {
    init(text: String) {
        super.init(frame: .zero)
        self.text = "● \(text)"
        textAlignment = .center
        font = .systemFont(ofSize: 10, weight: .black)
        textColor = Theme.ink
        backgroundColor = text.contains("运行") ? Theme.mint : (text.contains("关闭") ? Theme.orangeSoft : Theme.yellowSoft)
        layer.cornerRadius = 10
        layer.borderWidth = 1.8
        layer.borderColor = Theme.line.cgColor
        clipsToBounds = true
        setContentHuggingPriority(.required, for: .horizontal)
        heightAnchor.constraint(equalToConstant: 21).isActive = true
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override var intrinsicContentSize: CGSize {
        let size = super.intrinsicContentSize
        return CGSize(width: size.width + 14, height: 21)
    }
}

private final class EmptyAccountsView: UIControl {
    init() {
        super.init(frame: .zero)
        Theme.borderedCard(self)
        backgroundColor = Theme.yellowSoft

        let stack = UIStackView()
        stack.axis = .vertical
        stack.alignment = .center
        stack.spacing = 8
        stack.isUserInteractionEnabled = false
        addSubview(stack)
        stack.pinToEdges(of: self, insets: UIEdgeInsets(top: 28, left: 18, bottom: 28, right: 18))

        let icon = UIImageView(image: UIImage(systemName: "tray.and.arrow.down.fill"))
        icon.tintColor = Theme.ink
        icon.widthAnchor.constraint(equalToConstant: 34).isActive = true
        icon.heightAnchor.constraint(equalToConstant: 34).isActive = true

        let title = UILabel()
        title.text = "还没有账号"
        title.font = .systemFont(ofSize: 17, weight: .black)
        title.textColor = Theme.ink

        let subtitle = UILabel()
        subtitle.text = "点击右下角 + 导入 .bin 文件"
        subtitle.font = .systemFont(ofSize: 13, weight: .semibold)
        subtitle.textColor = Theme.muted

        stack.addArrangedSubview(icon)
        stack.addArrangedSubview(title)
        stack.addArrangedSubview(subtitle)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
