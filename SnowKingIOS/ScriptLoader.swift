import Foundation

enum ScriptLoader {
    static func bundledScript(_ fileName: String, subdirectory: String) -> String? {
        guard let url = Bundle.main.url(forResource: fileName, withExtension: nil, subdirectory: subdirectory) else {
            return nil
        }
        return try? String(contentsOf: url, encoding: .utf8)
    }

    static func enabledInjectionScript(singleWindow: Bool) -> String? {
        let settings = SettingsStore.shared
        var snippets: [String] = []

        if settings.popupHidden {
            appendBundled("popup-blocker.js", subdirectory: "builtin", into: &snippets)
        } else {
            appendBundled("popup-restore.js", subdirectory: "builtin", into: &snippets)
        }

        if settings.speedEnabled {
            appendBundled("ten-temple-skip.js", subdirectory: "builtin", into: &snippets)
        } else {
            appendBundled("ten-temple-restore.js", subdirectory: "builtin", into: &snippets)
        }

        if settings.soundMuted {
            appendBundled("auto-mute.js", subdirectory: "builtin", into: &snippets)
        } else if settings.soundRestoreUntil > Date().timeIntervalSince1970 {
            appendBundled("auto-unmute.js", subdirectory: "builtin", into: &snippets)
        }

        if singleWindow && settings.lineupEnabled,
           let source = bundledScript("lineup-manager.js", subdirectory: "builtin") {
            snippets.append(wrap(
                name: "lineup-manager.js",
                source: "window.__lineupEnabled=true;try{localStorage.setItem('__lineup_enabled','1');}catch(_){ }\n\(source)"
            ))
        }

        for item in ScriptStore.shared.list() where item.isEnabled {
            guard let source = try? String(contentsOf: item.url, encoding: .utf8) else { continue }
            snippets.append(wrap(name: item.fileName, source: source))
        }

        guard !snippets.isEmpty else { return nil }
        let body = snippets.joined(separator: "\n")
        return """
        (function(){
          if(window.__snowKingScriptsLoaded){return;}
          window.__snowKingScriptsLoaded=true;
          setTimeout(function(){
            \(body)
          },500);
        })();
        """
    }

    private static func appendBundled(_ fileName: String, subdirectory: String, into snippets: inout [String]) {
        guard let source = bundledScript(fileName, subdirectory: subdirectory) else { return }
        snippets.append(wrap(name: fileName, source: source))
    }

    private static func wrap(name: String, source: String) -> String {
        """
        try {
        \(source)
        } catch (error) {
          console.error('[SnowKing Script] ' + \(BridgeScriptFactory.javascriptString(name)), error);
        }
        """
    }
}
