import Foundation
import UniformTypeIdentifiers

extension Notification.Name {
    static let snowKingAccountsChanged = Notification.Name("snowKingAccountsChanged")
}

final class AccountStore {
    static let shared = AccountStore()

    static var documentsDirectory: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    static var accountsDirectory: URL {
        documentsDirectory.appendingPathComponent("accounts", isDirectory: true)
    }

    private let defaults = UserDefaults.standard
    private let accountsKey = "snow_king_accounts_ios"
    private let decoder = JSONDecoder()
    private let encoder = JSONEncoder()

    private init() {
        try? FileManager.default.createDirectory(at: Self.accountsDirectory, withIntermediateDirectories: true)
    }

    func load() -> [Account] {
        guard let data = defaults.data(forKey: accountsKey),
              let accounts = try? decoder.decode([Account].self, from: data) else {
            return []
        }
        return accounts.filter { FileManager.default.fileExists(atPath: $0.fileURL.path) }
    }

    func save(_ accounts: [Account]) {
        guard let data = try? encoder.encode(accounts) else { return }
        defaults.set(data, forKey: accountsKey)
        NotificationCenter.default.post(name: .snowKingAccountsChanged, object: nil)
    }

    @discardableResult
    func importFile(from url: URL) throws -> Account {
        try FileManager.default.createDirectory(at: Self.accountsDirectory, withIntermediateDirectories: true)

        let scoped = url.startAccessingSecurityScopedResource()
        defer {
            if scoped { url.stopAccessingSecurityScopedResource() }
        }

        let sourceName = url.lastPathComponent.isEmpty ? "account.bin" : url.lastPathComponent
        var safeName = sanitize(sourceName)
        if !safeName.lowercased().hasSuffix(".bin") {
            safeName += ".bin"
        }

        let id = UUID().uuidString
        let storedName = "\(id)_\(safeName)"
        let target = Self.accountsDirectory.appendingPathComponent(storedName, isDirectory: false)
        let data = try Data(contentsOf: url)
        try data.write(to: target, options: .atomic)

        var display = safeName
        if display.lowercased().hasSuffix(".bin") {
            display.removeLast(4)
        }

        var accounts = load()
        let account = Account(id: id, name: display, storedFileName: storedName)
        accounts.insert(account, at: 0)
        save(accounts)
        return account
    }

    func readData(for account: Account) throws -> Data {
        try Data(contentsOf: account.fileURL)
    }

    func delete(_ account: Account) {
        try? FileManager.default.removeItem(at: account.fileURL)
        save(load().filter { $0.id != account.id })
    }

    func rename(_ account: Account, to name: String) {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        var accounts = load()
        guard let index = accounts.firstIndex(where: { $0.id == account.id }) else { return }
        accounts[index].name = trimmed
        accounts[index].lastOperation = "重命名账号"
        accounts[index].updatedAt = Date().timeIntervalSince1970
        save(accounts)
    }

    func updateStatus(accountID: String, status: String, operation: String) {
        var accounts = load()
        guard let index = accounts.firstIndex(where: { $0.id == accountID }) else { return }
        accounts[index].status = status
        accounts[index].lastOperation = operation
        accounts[index].updatedAt = Date().timeIntervalSince1970
        save(accounts)
    }

    private func sanitize(_ name: String) -> String {
        let invalid = CharacterSet(charactersIn: "\\/:*?\"<>|")
        let parts = name.components(separatedBy: invalid).filter { !$0.isEmpty }
        let clean = parts.joined(separator: "_").trimmingCharacters(in: .whitespacesAndNewlines)
        return clean.isEmpty ? "account.bin" : clean
    }
}
