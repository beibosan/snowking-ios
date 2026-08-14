import CryptoKit
import Foundation

struct Account: Codable, Equatable {
    var id: String
    var name: String
    var storedFileName: String
    var status: String
    var lastOperation: String
    var updatedAt: TimeInterval

    init(id: String = UUID().uuidString, name: String, storedFileName: String) {
        self.id = id
        self.name = name
        self.storedFileName = storedFileName
        self.status = "待机"
        self.lastOperation = "导入账号"
        self.updatedAt = Date().timeIntervalSince1970
    }

    var fileURL: URL {
        AccountStore.accountsDirectory.appendingPathComponent(storedFileName, isDirectory: false)
    }

    var displayFileName: String {
        fileURL.lastPathComponent
    }
}

extension Data {
    var snowKingHex: String {
        map { String(format: "%02x", $0) }.joined()
    }

    var snowKingSHA256: String {
        SHA256.hash(data: self).map { String(format: "%02x", $0) }.joined()
    }
}
