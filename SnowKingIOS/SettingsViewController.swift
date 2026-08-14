import UIKit
import UniformTypeIdentifiers

final class SettingsViewController: UIViewController {
    private let tableView = UITableView(frame: .zero, style: .insetGrouped)

    private struct ToggleRow {
        let title: String
        let subtitle: String
        let icon: String
        let color: UIColor
        let get: () -> Bool
        let set: (Bool) -> Void
    }

    private lazy var toggles: [ToggleRow] = [
        ToggleRow(
            title: "十殿加速",
            subtitle: "启用游戏内十殿跳过脚本",
            icon: "bolt.fill",
            color: Theme.orangeSoft,
            get: { SettingsStore.shared.speedEnabled },
            set: { SettingsStore.shared.speedEnabled = $0 }
        ),
        ToggleRow(
            title: "阵容切换保存",
            subtitle: "单开窗口加载阵容管理脚本",
            icon: "square.stack.3d.up.fill",
            color: Theme.skySoft,
            get: { SettingsStore.shared.lineupEnabled },
            set: { SettingsStore.shared.lineupEnabled = $0 }
        ),
        ToggleRow(
            title: "声音关闭",
            subtitle: "加载自动静音脚本",
            icon: "speaker.slash.fill",
            color: Theme.pinkSoft,
            get: { SettingsStore.shared.soundMuted },
            set: { SettingsStore.shared.soundMuted = $0 }
        ),
        ToggleRow(
            title: "隐藏弹窗",
            subtitle: "隐藏首次登录弹窗",
            icon: "rectangle.badge.xmark",
            color: Theme.lavenderSoft,
            get: { SettingsStore.shared.popupHidden },
            set: { SettingsStore.shared.popupHidden = $0 }
        ),
        ToggleRow(
            title: "资源缓存",
            subtitle: "允许 WKWebView 缓存游戏资源",
            icon: "externaldrive.fill",
            color: Theme.mintSoft,
            get: { SettingsStore.shared.cacheEnabled },
            set: { SettingsStore.shared.cacheEnabled = $0 }
        ),
        ToggleRow(
            title: "后台暂停",
            subtitle: "离开窗口后由系统暂停渲染",
            icon: "pause.circle.fill",
            color: Theme.yellowSoft,
            get: { SettingsStore.shared.pauseBackground },
            set: { SettingsStore.shared.pauseBackground = $0 }
        )
    ]

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "设置"
        view.backgroundColor = Theme.page
        configureTable()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
        navigationController?.setToolbarHidden(true, animated: animated)
        tableView.reloadData()
    }

    private func configureTable() {
        tableView.backgroundColor = Theme.page
        tableView.dataSource = self
        tableView.delegate = self
        tableView.separatorStyle = .none
        view.addSubview(tableView)
        tableView.pinToSafeArea(of: view)
    }

    @objc private func toggleChanged(_ sender: UISwitch) {
        guard sender.tag < toggles.count else { return }
        toggles[sender.tag].set(sender.isOn)
    }

    private func makeIcon(_ systemName: String, color: UIColor) -> UIView {
        let box = UIView(frame: CGRect(x: 0, y: 0, width: 34, height: 34))
        box.backgroundColor = color
        box.layer.cornerRadius = 11
        box.layer.borderWidth = 2
        box.layer.borderColor = Theme.line.cgColor

        let image = UIImageView(image: UIImage(systemName: systemName))
        image.tintColor = Theme.ink
        image.contentMode = .scaleAspectFit
        image.translatesAutoresizingMaskIntoConstraints = false
        box.addSubview(image)
        NSLayoutConstraint.activate([
            image.centerXAnchor.constraint(equalTo: box.centerXAnchor),
            image.centerYAnchor.constraint(equalTo: box.centerYAnchor),
            image.widthAnchor.constraint(equalToConstant: 18),
            image.heightAnchor.constraint(equalToConstant: 18)
        ])
        return box
    }
}

extension SettingsViewController: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        3
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0: return 1
        case 1: return toggles.count
        default: return 2
        }
    }

    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0: return "脚本"
        case 1: return "功能开关"
        default: return "文件与说明"
        }
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .subtitle, reuseIdentifier: nil)
        cell.backgroundColor = Theme.card
        cell.textLabel?.font = .systemFont(ofSize: 15, weight: .black)
        cell.textLabel?.textColor = Theme.ink
        cell.detailTextLabel?.font = .systemFont(ofSize: 12, weight: .semibold)
        cell.detailTextLabel?.textColor = Theme.muted

        switch indexPath.section {
        case 0:
            let count = ScriptStore.shared.list().count
            cell.textLabel?.text = "脚本管理"
            cell.detailTextLabel?.text = "已导入 \(count) 个脚本"
            cell.imageView?.image = UIImage(systemName: "doc.text.fill")
            cell.imageView?.tintColor = Theme.lavender
            cell.accessoryType = .disclosureIndicator
        case 1:
            let row = toggles[indexPath.row]
            cell.textLabel?.text = row.title
            cell.detailTextLabel?.text = row.subtitle
            cell.accessoryView = {
                let toggle = UISwitch()
                toggle.isOn = row.get()
                toggle.tag = indexPath.row
                toggle.addTarget(self, action: #selector(toggleChanged(_:)), for: .valueChanged)
                return toggle
            }()
            cell.selectionStyle = .none
            cell.imageView?.image = UIImage(systemName: row.icon)
            cell.imageView?.tintColor = Theme.ink
        default:
            if indexPath.row == 0 {
                cell.textLabel?.text = "文件导出位置"
                cell.detailTextLabel?.text = "Documents/exports"
                cell.imageView?.image = UIImage(systemName: "folder.fill")
                cell.imageView?.tintColor = Theme.accent
                cell.selectionStyle = .none
            } else {
                cell.textLabel?.text = "iOS 兼容版"
                cell.detailTextLabel?.text = "账号导入、多开、剪贴板、脚本注入与 GameData 启动链"
                cell.imageView?.image = UIImage(systemName: "iphone")
                cell.imageView?.tintColor = Theme.mint
                cell.selectionStyle = .none
            }
        }
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if indexPath.section == 0 {
            navigationController?.pushViewController(ScriptManagementViewController(), animated: true)
        }
    }
}

final class ScriptManagementViewController: UIViewController {
    private let tableView = UITableView(frame: .zero, style: .insetGrouped)
    private var scripts: [UserScriptItem] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "脚本管理"
        view.backgroundColor = Theme.page
        navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(importScript))
        configureTable()
        reloadScripts()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
        reloadScripts()
    }

    private func configureTable() {
        tableView.backgroundColor = Theme.page
        tableView.dataSource = self
        tableView.delegate = self
        tableView.separatorStyle = .none
        view.addSubview(tableView)
        tableView.pinToSafeArea(of: view)
    }

    private func reloadScripts() {
        scripts = ScriptStore.shared.list()
        tableView.reloadData()
    }

    @objc private func importScript() {
        let jsType = UTType(filenameExtension: "js") ?? .plainText
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [jsType, .plainText, .data], asCopy: true)
        picker.delegate = self
        picker.allowsMultipleSelection = true
        present(picker, animated: true)
    }

    @objc private func toggleChanged(_ sender: UISwitch) {
        guard sender.tag < scripts.count else { return }
        SettingsStore.shared.setScriptEnabled(sender.isOn, fileName: scripts[sender.tag].fileName)
        reloadScripts()
    }

    private func showMessage(_ text: String) {
        let alert = UIAlertController(title: nil, message: text, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "知道了", style: .default))
        present(alert, animated: true)
    }
}

extension ScriptManagementViewController: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        var imported = 0
        var failed = 0
        for url in urls {
            do {
                _ = try ScriptStore.shared.importScript(from: url)
                imported += 1
            } catch {
                failed += 1
            }
        }
        reloadScripts()
        showMessage(failed == 0 ? "已导入 \(imported) 个脚本" : "已导入 \(imported) 个，失败 \(failed) 个")
    }
}

extension ScriptManagementViewController: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        max(scripts.count, 1)
    }

    func tableView(_ tableView: UITableView, titleForFooterInSection section: Int) -> String? {
        "导入的 .js 会在游戏页面加载完成后注入。"
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .subtitle, reuseIdentifier: nil)
        cell.backgroundColor = Theme.card
        cell.textLabel?.font = .systemFont(ofSize: 15, weight: .black)
        cell.detailTextLabel?.font = .systemFont(ofSize: 12, weight: .semibold)
        cell.detailTextLabel?.textColor = Theme.muted

        if scripts.isEmpty {
            cell.textLabel?.text = "还没有用户脚本"
            cell.detailTextLabel?.text = "点击右上角 + 导入 .js"
            cell.imageView?.image = UIImage(systemName: "doc.badge.plus")
            cell.imageView?.tintColor = Theme.accent
            cell.selectionStyle = .none
            return cell
        }

        let item = scripts[indexPath.row]
        cell.textLabel?.text = item.fileName
        cell.detailTextLabel?.text = item.isEnabled ? "已启用" : "已停用"
        cell.imageView?.image = UIImage(systemName: "doc.text.fill")
        cell.imageView?.tintColor = item.isEnabled ? Theme.mint : Theme.muted
        let toggle = UISwitch()
        toggle.isOn = item.isEnabled
        toggle.tag = indexPath.row
        toggle.addTarget(self, action: #selector(toggleChanged(_:)), for: .valueChanged)
        cell.accessoryView = toggle
        cell.selectionStyle = .none
        return cell
    }

    func tableView(
        _ tableView: UITableView,
        trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath
    ) -> UISwipeActionsConfiguration? {
        guard !scripts.isEmpty, indexPath.row < scripts.count else { return nil }
        let item = scripts[indexPath.row]
        let delete = UIContextualAction(style: .destructive, title: "删除") { [weak self] _, _, completion in
            ScriptStore.shared.delete(item)
            self?.reloadScripts()
            completion(true)
        }
        return UISwipeActionsConfiguration(actions: [delete])
    }
}
