import UIKit

enum BridgeScriptFactory {
    static func makeBridgeScript(account: Account?, isolateStorage: Bool, windowCount: Int = 1) -> String {
        let accountData = account.flatMap { try? AccountStore.shared.readData(for: $0) }
        let hash = accountData?.snowKingSHA256 ?? ""
        let decodedKey = hash.isEmpty ? "" : "snow_king_decoded_\(hash)"
        let decoded = decodedKey.isEmpty ? "" : UserDefaults.standard.string(forKey: decodedKey) ?? ""
        let binStorageKey = hash.isEmpty ? "" : "snow_king_bin_storage_\(hash)"
        let binStorage = binStorageKey.isEmpty ? "{}" : UserDefaults.standard.string(forKey: binStorageKey) ?? "{}"
        let deviceID = UIDevice.current.identifierForVendor?.uuidString ?? ""
        let clipboard = UIPasteboard.general.string ?? ""
        let savedBins: [[String: Any]]

        if let account = account, let accountData = accountData {
            savedBins = [[
                "id": account.id,
                "name": account.name,
                "fileName": account.displayFileName,
                "base64": accountData.base64EncodedString(),
                "hex": accountData.snowKingHex,
                "hash": hash
            ]]
        } else {
            savedBins = []
        }

        let scripts = ScriptStore.shared.list().map {
            [
                "fileName": $0.fileName,
                "name": $0.fileName,
                "enabled": $0.isEnabled
            ] as [String: Any]
        }

        let payload: [String: Any] = [
            "hasBin": accountData != nil,
            "accountId": account?.id ?? "",
            "accountName": account?.name ?? "",
            "binName": account?.displayFileName ?? "",
            "binBase64": accountData?.base64EncodedString() ?? "",
            "binHex": accountData?.snowKingHex ?? "",
            "binHash": hash,
            "decodedLoginInfo": decoded,
            "binStorage": binStorage,
            "deviceId": deviceID,
            "clipboard": clipboard,
            "isolateAccountStorage": isolateStorage,
            "accountStorageNamespace": isolateStorage ? hash : "",
            "windowCount": max(1, windowCount),
            "activeBinHashes": hash.isEmpty ? [String]() : [hash],
            "savedBins": savedBins,
            "quickBins": savedBins,
            "scripts": scripts,
            "loginInjectScript": makeLoginInjectScript(account: account, accountData: accountData)
        ]

        let nativeJSON = jsonObject(payload)
        return """
        (function(){
          var native = \(nativeJSON);

          function asString(value) {
            return value == null ? '' : String(value);
          }

          function clone(value) {
            try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
          }

          function post(type, payload) {
            try {
              payload = payload || {};
              payload.type = type;
              window.webkit.messageHandlers.snowkingBridge.postMessage(payload);
            } catch (_) {}
          }

          function postHandler(handler, payload) {
            try {
              payload = payload || {};
              payload.type = handler;
              if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[handler]) {
                window.webkit.messageHandlers[handler].postMessage(JSON.stringify(payload));
              } else {
                post(handler, payload);
              }
            } catch (_) {}
          }

          function getJSON(key, fallback) {
            try {
              var raw = localStorage.getItem(key);
              if (raw == null || raw === '') return clone(fallback);
              return JSON.parse(raw);
            } catch (_) {
              return clone(fallback);
            }
          }

          function setJSON(key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
          }

          function getList(key, fallback) {
            var value = getJSON(key, fallback || []);
            return Array.isArray(value) ? value : [];
          }

          function getActiveHashes() {
            var list = getList('__snowking_active_hashes', native.activeBinHashes || []);
            var current = native.binHash || '';
            if (current && list.indexOf(current) === -1) {
              list.push(current);
              setJSON('__snowking_active_hashes', list);
            }
            return list;
          }

          function seedSavedBins() {
            var saved = getList('__snowking_saved_bins', []);
            if (!saved.length && native.savedBins && native.savedBins.length) {
              saved = native.savedBins;
              setJSON('__snowking_saved_bins', saved);
            }
            return saved;
          }

          function seedQuickBins() {
            var quick = getList('__snowking_quick_bins', []);
            if (!quick.length) {
              quick = seedSavedBins();
              setJSON('__snowking_quick_bins', quick);
            }
            return quick;
          }

          window.__isIOSWKWebView = true;
          window.__snowKingClipboard = native.clipboard || '';

          var hostBridge = {
            copy: function(value) {
              var text = asString(value);
              window.__snowKingClipboard = text;
              post('copy', { value: text });
            },
            setClipboardData: function(value) {
              var text = asString(value);
              window.__snowKingClipboard = text;
              post('copy', { value: text });
            },
            paste: function() {
              postHandler('iosReadClipboard', {});
              return window.__snowKingClipboard || '';
            },
            getNativeBundleVersJson: function() {
              return '';
            },
            isManifestCacheStale: function() {
              return false;
            },
            clearAllResourceCaches: function() {
              post('clearCaches', {});
            },
            getDeviceId: function() {
              return native.deviceId || '';
            }
          };

          var binBridge = {
            hasBin: function() {
              return !!native.hasBin;
            },
            getBinData: function() {
              return native.binBase64 || '';
            },
            getBinBase64: function() {
              return native.binBase64 || '';
            },
            getBinHex: function() {
              return native.binHex || '';
            },
            getBinContentHash: function() {
              return native.binHash || '';
            },
            getBinName: function() {
              return native.binName || '';
            },
            getAccountName: function() {
              return native.accountName || '';
            },
            isAccountStorageIsolated: function() {
              return !!native.isolateAccountStorage;
            },
            getAccountStorageNamespace: function() {
              return native.accountStorageNamespace || '';
            },
            getDecodedLoginInfo: function() {
              try {
                var key = '__snowking_decoded_' + (native.binHash || '');
                return localStorage.getItem(key) || native.decodedLoginInfo || '';
              } catch (_) {
                return native.decodedLoginInfo || '';
              }
            },
            getDecodedLoginInfoJson: function() {
              return this.getDecodedLoginInfo();
            },
            cacheDecodedData: function(json) {
              var value = asString(json);
              try {
                var key = '__snowking_decoded_' + (native.binHash || '');
                localStorage.setItem(key, value);
              } catch (_) {}
              post('cacheDecodedData', {
                accountId: native.accountId || '',
                hash: native.binHash || '',
                json: value
              });
            },
            getLoginInjectScript: function() {
              return native.loginInjectScript || '';
            },
            getRoleToken: function() {
              return '';
            },
            refreshSession: function() {
              return false;
            },
            saveImage: function(name, data) {
              post('saveData', { name: asString(name), data: asString(data), mime: 'image/png' });
              return JSON.stringify({ ok: false, error: 'iOS saveImage is asynchronous' });
            },
            saveFile: function(name, data, mime) {
              post('saveData', { name: asString(name), data: asString(data), mime: asString(mime) });
              return JSON.stringify({ ok: false, error: 'iOS saveFile is asynchronous' });
            },
            saveDataUrl: function(name, data) {
              post('saveDataUrl', { name: asString(name), data: asString(data) });
              return JSON.stringify({ ok: false, error: 'iOS saveDataUrl is asynchronous' });
            }
          };

          var electronBridge = window.electronBridge || {};
          electronBridge.appVersion = electronBridge.appVersion || 'ios-wrapper';
          electronBridge.getSavedBins = function() {
            return Promise.resolve(seedSavedBins());
          };
          electronBridge.setSavedBins = function(list) {
            list = Array.isArray(list) ? list : [];
            setJSON('__snowking_saved_bins', list);
            postHandler('iosStorage', { key: 'savedBins', value: list });
            return Promise.resolve({ ok: true });
          };
          electronBridge.getQuickBins = function() {
            return Promise.resolve(seedQuickBins());
          };
          electronBridge.setQuickBins = function(list) {
            list = Array.isArray(list) ? list : [];
            setJSON('__snowking_quick_bins', list);
            postHandler('iosQuick', { event: 'setQuickBins', value: list });
            return Promise.resolve({ ok: true });
          };
          electronBridge.getScripts = function() {
            return Promise.resolve(getList('__snowking_scripts', native.scripts || []));
          };
          electronBridge.setScripts = function(list) {
            list = Array.isArray(list) ? list : [];
            setJSON('__snowking_scripts', list);
            postHandler('iosScriptSwitch', { event: 'setScripts', value: list });
            return Promise.resolve({ ok: true });
          };
          electronBridge.getWindowCount = function() {
            postHandler('iosWindowCount', {});
            return Promise.resolve(native.windowCount || 1);
          };
          electronBridge.getActiveBinHashes = function() {
            return Promise.resolve(getActiveHashes());
          };
          electronBridge.registerBinHash = function(hash) {
            hash = asString(hash);
            var list = getActiveHashes();
            if (hash && list.indexOf(hash) === -1) {
              list.push(hash);
              setJSON('__snowking_active_hashes', list);
            }
            postHandler('iosLoginState', { event: 'registerBinHash', hash: hash });
            return Promise.resolve({ ok: true });
          };
          electronBridge.unregisterBinHash = function(hash) {
            hash = asString(hash);
            var list = getActiveHashes().filter(function(item) { return item !== hash; });
            setJSON('__snowking_active_hashes', list);
            postHandler('iosLoginState', { event: 'unregisterBinHash', hash: hash });
            return Promise.resolve({ ok: true });
          };
          electronBridge.loadBinStorage = function(hash) {
            hash = asString(hash || native.binHash || '');
            if (!hash) return Promise.resolve({});
            if (hash === native.binHash && native.binStorage) {
              try { return Promise.resolve(JSON.parse(native.binStorage)); } catch (_) {}
            }
            return Promise.resolve(getJSON('__snowking_bin_storage_' + hash, {}));
          };
          electronBridge.saveBinStorage = function(hash, storage) {
            hash = asString(hash || native.binHash || '');
            if (hash) {
              setJSON('__snowking_bin_storage_' + hash, storage || {});
              postHandler('iosSaveStorage', { hash: hash, storage: storage || {} });
            }
            return Promise.resolve({ ok: true });
          };
          electronBridge.newWindow = function(payload) {
            postHandler('iosNewWindow', { payload: payload || {} });
            return Promise.resolve({ ok: false, reason: 'managed by native iOS shell' });
          };
          electronBridge.setWinTitle = function(title) {
            title = asString(title);
            try { document.title = title; } catch (_) {}
            postHandler('iosSetTitle', { title: title });
            return Promise.resolve({ ok: true });
          };
          electronBridge.relaunchApp = function() {
            post('relaunchApp', {});
            return Promise.resolve({ ok: false, reason: 'not supported on iOS' });
          };
          electronBridge.updateAsar = function() {
            return Promise.resolve({ ok: false, reason: 'not supported on iOS' });
          };
          electronBridge.claimLoginQueueEntry = function() {
            return Promise.resolve(null);
          };

          try {
            if (!navigator.clipboard) {
              navigator.clipboard = {};
            }
            if (!navigator.clipboard.writeText) {
              navigator.clipboard.writeText = function(value) {
                hostBridge.copy(value);
                return Promise.resolve();
              };
            }
            if (!navigator.clipboard.readText) {
              navigator.clipboard.readText = function() {
                postHandler('iosReadClipboard', {});
                return Promise.resolve(window.__snowKingClipboard || native.clipboard || '');
              };
            }
          } catch (_) {}

          window.Bridge = hostBridge;
          window.ClipboardBridge = hostBridge;
          window.ClipboardHostBridge = hostBridge;
          window.yunqiBridge = hostBridge;
          window.AndroidBinBridge = binBridge;
          window.electronBridge = electronBridge;
          window.ConcurrencyBridge = {
            getMaxConcurrency: function() { return 8; },
            getMaxRequestsPerFrame: function() { return 4; }
          };
          window.DownloadBridge = window.DownloadBridge || {
            saveBase64: function(name, mime, base64) {
              post('saveBase64', { name: asString(name), mime: asString(mime), base64: asString(base64) });
              return '';
            }
          };
          window.FilePickerBridge = window.FilePickerBridge || {
            pick: function(mime) {
              post('pickFile', { mime: asString(mime) });
              return '';
            }
          };
        })();
        """
    }

    static func javascriptString(_ value: String) -> String {
        guard let data = try? JSONSerialization.data(withJSONObject: [value]),
              let json = String(data: data, encoding: .utf8),
              json.count >= 2 else {
            return "''"
        }
        return String(json.dropFirst().dropLast())
    }

    static func jsonObject(_ object: Any) -> String {
        guard JSONSerialization.isValidJSONObject(object),
              let data = try? JSONSerialization.data(withJSONObject: object, options: []),
              let json = String(data: data, encoding: .utf8) else {
            return "{}"
        }
        return json
    }

    private static func makeLoginInjectScript(account: Account?, accountData: Data?) -> String {
        guard account != nil, accountData != nil else { return "" }
        var parts: [String] = []
        if let binLogin = ScriptLoader.bundledScript("bin-login.js", subdirectory: "GameData")
            ?? ScriptLoader.bundledScript("bin-login.js", subdirectory: "www") {
            parts.append(binLogin)
        }
        if let nativePatch = ScriptLoader.bundledScript("qvq-native-login-patch.js", subdirectory: "builtin") {
            parts.append(nativePatch)
        }
        if SettingsStore.shared.soundMuted,
           let autoMute = ScriptLoader.bundledScript("auto-mute.js", subdirectory: "builtin") {
            parts.append(autoMute)
        }
        return parts.joined(separator: "\n;\n")
    }
}
