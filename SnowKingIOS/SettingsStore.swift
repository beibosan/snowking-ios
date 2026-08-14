import Foundation

final class SettingsStore {
    static let shared = SettingsStore()

    private let defaults = UserDefaults.standard

    private init() {}

    var speedEnabled: Bool {
        get { bool("speed_enabled", default: true) }
        set { defaults.set(newValue, forKey: "speed_enabled") }
    }

    var lineupEnabled: Bool {
        get { bool("lineup_enabled", default: true) }
        set { defaults.set(newValue, forKey: "lineup_enabled") }
    }

    var soundMuted: Bool {
        get { bool("sound_muted", default: false) }
        set {
            defaults.set(newValue, forKey: "sound_muted")
            defaults.set(newValue ? 0 : Date().addingTimeInterval(15).timeIntervalSince1970, forKey: "sound_restore_until")
        }
    }

    var popupHidden: Bool {
        get { bool("popup_hidden", default: false) }
        set { defaults.set(newValue, forKey: "popup_hidden") }
    }

    var cacheEnabled: Bool {
        get { bool("cache_enabled", default: true) }
        set { defaults.set(newValue, forKey: "cache_enabled") }
    }

    var pauseBackground: Bool {
        get { bool("pause_background", default: true) }
        set { defaults.set(newValue, forKey: "pause_background") }
    }

    var soundRestoreUntil: TimeInterval {
        defaults.double(forKey: "sound_restore_until")
    }

    func isScriptEnabled(fileName: String) -> Bool {
        defaults.bool(forKey: "script_\(fileName)")
    }

    func setScriptEnabled(_ enabled: Bool, fileName: String) {
        defaults.set(enabled, forKey: "script_\(fileName)")
    }

    private func bool(_ key: String, default defaultValue: Bool) -> Bool {
        guard defaults.object(forKey: key) != nil else { return defaultValue }
        return defaults.bool(forKey: key)
    }
}
