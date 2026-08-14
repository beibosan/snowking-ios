(function () {
  'use strict';
  var LOG = '[YunqiLogin]';

  if (window.__yunqiNativeLoginPatchInstalled) {
    if (window.__yunqiTryNativeLoginPatch) {
      window.__yunqiTryNativeLoginPatch();
    }
    return;
  }
  window.__yunqiNativeLoginPatchInstalled = true;

  function log() {
    try {
      console.log.apply(console, arguments);
    } catch (e) {}
  }
  if (!window.__yunqiFetchHooked && typeof window.fetch === 'function') {
    window.__yunqiFetchHooked = true;
    var _yunqiOrigFetch = window.fetch;
    window.fetch = function (url, options) {
      try {
        var urlStr = typeof url === 'string' ? url : (url && url.url ? url.url : '');
        if (urlStr.indexOf('/login/manifest') !== -1) {
          return _yunqiOrigFetch.apply(this, arguments).then(function (response) {
            return response.clone().text().then(function (text) {
              try {
                var obj = JSON.parse(text);
                if (obj && obj.body) {
                  if (obj.body.forceUpdate !== undefined) obj.body.forceUpdate = false;
                  if (obj.body.forceVer !== undefined) obj.body.forceVer = '';
                  if (obj.body.latestVer !== undefined) obj.body.latestVer = '';
                  log(LOG, 'manifest forceUpdate 已中和');
                }
                return new Response(JSON.stringify(obj), {
                  status: response.status, statusText: response.statusText, headers: response.headers
                });
              } catch (e) {
                return new Response(text, {
                  status: response.status, statusText: response.statusText, headers: response.headers
                });
              }
            });
          });
        }
      } catch (_) {}
      return _yunqiOrigFetch.apply(this, arguments);
    };
  }

  if (typeof AndroidBinBridge === 'undefined') {
    return;
  }

  if (!window.__yunqiServerCacheCleared) {
    window.__yunqiServerCacheCleared = true;
    try {
      ['serverId', 'currentServerId', 'selectServerId', 'selectedServerId', 'lastServerId'].forEach(function (k) {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
    } catch (e) {}
  }

  window.__yunqiPendingLoginCalls = window.__yunqiPendingLoginCalls || [];

  function replayPendingLogin() {
    var q = window.__yunqiPendingLoginCalls || [];
    if (!q.length || !window.__yunqiNativeAccount) return;
    window.__yunqiPendingLoginCalls = [];
    q.forEach(function (job) {
      try {
        Promise.resolve(job.fn.apply(job.ctx, job.args)).then(job.resolve, job.reject);
      } catch (e) {
        console.error(LOG, 'replay failed', e);
        try {
          job.reject(e);
        } catch (_) {}
      }
    });
  }

  function pauseLoginCall(label, fn, ctx, args) {
    return new Promise(function (resolve, reject) {
      window.__yunqiPendingLoginCalls.push({
        fn: fn,
        ctx: ctx,
        args: Array.prototype.slice.call(args || []),
        resolve: resolve,
        reject: reject
      });
      log(LOG, label + ' paused until account ready');
    });
  }

  function hasServerIdField(p) {
    return p && p.serverId !== undefined && p.serverId !== null && String(p.serverId) !== '';
  }

  function applyAccountFields(t, a) {
    t.platformExt = a.platformExt;
    t.info = a.info;
    return t;
  }

  function patchLoginService(LS) {
    if (!LS) return;
    if (LS.authUser && !LS.authUser.__yunqiNativePatched) {
      var origAuth = LS.authUser;
      var wrappedAuth = function (p) {
        var a = window.__yunqiNativeAccount;
        if (!a) {
          return pauseLoginCall('auth', wrappedAuth, this, arguments);
        }
        var t = applyAccountFields(Object.assign({}, p || {}), a);
        if (a.serverId && window.__yunqiFirstAuth !== false && !hasServerIdField(p)) {
          t.serverId = a.serverId;
        }
        window.__yunqiFirstAuth = false;
        return origAuth.call(this, t);
      };
      wrappedAuth.__yunqiNativePatched = true;
      wrappedAuth.__yunqiNativeOrig = origAuth;
      LS.authUser = wrappedAuth;
    }
    if (LS.serverList && !LS.serverList.__yunqiNativePatched) {
      var origSL = LS.serverList;
      var wrappedSL = function (p) {
        var a = window.__yunqiNativeAccount;
        if (!a) {
          return pauseLoginCall('server list', wrappedSL, this, arguments);
        }
        var isFirst = window.__yunqiFirstServerList !== false;
        var t = applyAccountFields(Object.assign({}, p || {}), a);
        if (a.payload && a.payload.info) {
          if (isFirst) {
            t = Object.assign({}, a.payload, t);
          } else {
            var payloadNoServer = Object.assign({}, a.payload);
            delete payloadNoServer.serverId;
            t = Object.assign({}, payloadNoServer, t);
          }
        }
        if (a.serverId && isFirst && !hasServerIdField(p)) {
          t.serverId = a.serverId;
        }
        window.__yunqiFirstServerList = false;
        return origSL.call(this, t);
      };
      wrappedSL.__yunqiNativePatched = true;
      wrappedSL.__yunqiNativeOrig = origSL;
      LS.serverList = wrappedSL;
    }
  }

  function patchIsolate(di) {
    if (!di || !di.Isolate || di.Isolate.__yunqiNativePatched) return;
    var OrigIso = di.Isolate;
    var WrappedIso = function () {
      var args = Array.prototype.slice.call(arguments);
      var inst = new (Function.prototype.bind.apply(OrigIso, [null].concat(args)))();
      try {
        patchLoginService(inst && inst.LoginService);
      } catch (e) {}
      return inst;
    };
    try {
      WrappedIso.prototype = OrigIso.prototype;
      Object.keys(OrigIso).forEach(function (k) {
        WrappedIso[k] = OrigIso[k];
      });
    } catch (e) {}
    WrappedIso.__yunqiNativePatched = true;
    WrappedIso.__yunqiNativeOrig = OrigIso;
    di.Isolate = WrappedIso;
  }

  function getHex() {
    try {
      return AndroidBinBridge.getBinHex() || '';
    } catch (e) {
      return '';
    }
  }

  function hexToBytes(hex) {
    if (!hex) return null;
    var len = Math.floor(hex.length / 2);
    var out = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      out[i] = parseInt(hex.substr(i * 2, 2), 16) || 0;
    }
    return out;
  }

  function base64ToBytes(b64) {
    if (!b64) return null;
    try {
      var binaryStr = atob(b64);
      var out = new Uint8Array(binaryStr.length);
      for (var i = 0; i < binaryStr.length; i++) {
        out[i] = binaryStr.charCodeAt(i);
      }
      return out;
    } catch (e) {
      return null;
    }
  }

  function getBinBytes() {
    var hex = getHex();
    if (hex) return hexToBytes(hex);
    try {
      return base64ToBytes(AndroidBinBridge.getBinData());
    } catch (e) {
      return null;
    }
  }

  function xDecryptBytes(bytes) {
    if (bytes.length < 4) return bytes;
    var b2 = bytes[2], b3 = bytes[3];
    var t = ((b2 >> 6 & 1) << 7) | ((b2 >> 4 & 1) << 6) |
            ((b2 >> 2 & 1) << 5) | ((b2 & 1) << 4) |
            ((b3 >> 6 & 1) << 3) | ((b3 >> 4 & 1) << 2) |
            ((b3 >> 2 & 1) << 1) | (b3 & 1);
    var copy = new Uint8Array(bytes);
    for (var i = copy.length - 1; i >= 4; i--) {
      copy[i] = copy[i] ^ t;
    }
    return copy.subarray(4);
  }

  function isPxFormat(bytes) {
    return bytes && bytes.length > 4 && bytes[0] === 0x70 && bytes[1] === 0x78;
  }

  function isPlFormat(bytes) {
    return bytes && bytes.length > 4 && bytes[0] === 0x70 && bytes[1] === 0x6c;
  }

  function bytesToJsonStr(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) {
      s += String.fromCharCode(bytes[i]);
    }
    return s;
  }

  function accountFromRaw(raw) {
    var payload = null;
    var platformExt = 'mix';
    var info = null;
    var serverId = null;
    if (raw && raw.info) {
      payload = raw;
      platformExt = raw.platformExt || 'mix';
      info = typeof raw.info === 'object' ? JSON.stringify(raw.info) : raw.info;
      serverId = raw.serverId || null;
    } else {
      info = JSON.stringify(raw || {});
      payload = {
        platform: 'hortor',
        platformExt: platformExt,
        info: info,
        serverId: null,
        scene: 0,
        referrerInfo: '',
        rtt: 0
      };
    }
    return {
      payload: payload,
      platformExt: platformExt,
      info: info,
      serverId: serverId,
      platform: raw && raw.platform ? raw.platform : 'hortor',
      oriPlatform: raw && raw.oriPlatform ? raw.oriPlatform : '',
      scene: raw && raw.scene !== undefined ? raw.scene : 0,
      referrerInfo: raw && raw.referrerInfo !== undefined ? raw.referrerInfo : {},
      deviceUniqueId: raw && raw.deviceUniqueId ? raw.deviceUniqueId : ''
    };
  }

  function decodeAccount(dm) {
    var cached = null;
    try {
      cached = AndroidBinBridge.getDecodedLoginInfo();
    } catch (e) {}
    if (cached) {
      try {
        var fromCache = accountFromRaw(JSON.parse(cached));
        if (fromCache && fromCache.info) {
          log(LOG, '使用原生缓存 loginInfo');
          return fromCache;
        }
      } catch (e) {}
    }

    var bytes = getBinBytes();
    if (!bytes || !bytes.length) {
      return null;
    }

    var decoded = null;
    try {
      if (isPxFormat(bytes)) {
        decoded = dm.decMsg(xDecryptBytes(bytes).buffer, {
          decrypt: function (d) { return d; },
          encrypt: dm.lz4XorEncode
        });
      } else if (isPlFormat(bytes)) {
        decoded = dm.decMsg(bytes.buffer, {
          decrypt: dm.lz4XorDecode,
          encrypt: dm.lz4XorEncode
        });
      } else if (bytes[0] === 0x7b) {
        var jsonStr = bytesToJsonStr(bytes);
        var d0Data = JSON.parse(jsonStr);
        if (d0Data && d0Data.encryptCombUser) {
          decoded = {
            _raw: {
              platform: 'hortor',
              oriPlatform: '',
              platformExt: d0Data.platformExt || 'mix',
              info: jsonStr,
              serverId: d0Data.serverId || null,
              scene: 0,
              referrerInfo: {},
              deviceUniqueId: d0Data.deviceUniqueId || d0Data.deviceId || '',
              rtt: 0
            }
          };
        } else if (d0Data && d0Data.info) {
          decoded = { _raw: d0Data };
        } else {
          decoded = dm.decMsg(bytes.buffer, {
            decrypt: dm.lz4XorDecode,
            encrypt: dm.lz4XorEncode
          });
        }
      } else {
        decoded = dm.decMsg(bytes.buffer, {
          decrypt: dm.lz4XorDecode,
          encrypt: dm.lz4XorEncode
        });
      }
    } catch (e) {
      console.error(LOG, 'decode failed', e);
      return null;
    }

    var raw = decoded && (decoded._raw || decoded.rawData || decoded);
    var acc = accountFromRaw(raw);
    if (acc && acc.info && typeof AndroidBinBridge.cacheDecodedData === 'function') {
      try {
        AndroidBinBridge.cacheDecodedData(JSON.stringify(acc.payload || raw));
      } catch (ce) {}
    }
    return acc && acc.info ? acc : null;
  }

  var __yunqiRequireHooked = false;
  function installRequireHook() {
    if (__yunqiRequireHooked) return;
    if (typeof window.__require !== 'function') return;
    __yunqiRequireHooked = true;
    var origRequire = window.__require;
    window.__require = function (name) {
      var mod = origRequire.apply(this, arguments);
      try {
        if (mod && mod.LoginService) patchLoginService(mod.LoginService);
        if (mod && mod.Isolate) patchIsolate(mod);
        if (mod && typeof mod === 'object') {
          for (var k in mod) {
            try {
              var v = mod[k];
              if (v && typeof v === 'object') {
                if (v.forceUpdate !== undefined && v.forceUpdate !== false) v.forceUpdate = false;
                if (typeof v.checkUpdate === 'function' && !v.checkUpdate.__yunqiNeutralized) {
                  var noop = function () { return false; };
                  noop.__yunqiNeutralized = true;
                  v.checkUpdate = noop;
                }
              }
              if (typeof v === 'function' && !v.__yunqiNeutralized) {
                var fn = String(k).toLowerCase();
                if (fn.indexOf('checkversion') !== -1 || fn.indexOf('checkupdate') !== -1 ||
                    fn.indexOf('forceupdate') !== -1 || fn.indexOf('showupdate') !== -1) {
                  var noop2 = function () { return false; };
                  noop2.__yunqiNeutralized = true;
                  mod[k] = noop2;
                }
              }
            } catch (_) {}
          }
        }
      } catch (_) {}
      return mod;
    };
    for (var key in origRequire) {
      if (origRequire.hasOwnProperty(key)) {
        try { window.__require[key] = origRequire[key]; } catch (_) {}
      }
    }
    log(LOG, '__require hook 已安装');
  }

  var __yunqiSendAsyncHooked = false;
  var __yunqiSendAsyncFirstServerId = true;
  function installSendAsyncFallbackHook() {
    if (__yunqiSendAsyncHooked) return true;
    try {
      if (!window.o4e || !window.o4e.HttpDelegate || !window.o4e.HttpDelegate.prototype) return false;
      var proto = window.o4e.HttpDelegate.prototype;
      if (typeof proto.sendAsync !== 'function') return false;
      if (proto.sendAsync.__yunqiBinFallback) { __yunqiSendAsyncHooked = true; return true; }
      var origSendAsync = proto.sendAsync;
      proto.sendAsync = function (e) {
        try {
          var a = window.__yunqiNativeAccount;
          var payload = a && a.payload;
          if (payload && e && e.params && Object.prototype.hasOwnProperty.call(e.params, 'info')) {
            var gameServerId = e.params.serverId;
            e.params = Object.assign({}, payload, gameServerId ? { serverId: gameServerId } : {});
            if (__yunqiSendAsyncFirstServerId) {
              __yunqiSendAsyncFirstServerId = false;
              if (a.serverId) e.params.serverId = a.serverId;
            }
          }
        } catch (_) {}
        return origSendAsync.apply(this, arguments);
      };
      proto.sendAsync.__yunqiBinFallback = true;
      __yunqiSendAsyncHooked = true;
      log(LOG, 'o4e.HttpDelegate.sendAsync hook 已安装（账号 payload 注入 + 保留场景 serverId）');
      return true;
    } catch (_) {
      return false;
    }
  }

  function tryPatch() {
    if (typeof window.__require !== 'function') return false;
    installRequireHook();
    installSendAsyncFallbackHook();
    try {
      var diDirect = window.__require('data-index');
      if (diDirect) {
        if (diDirect.LoginService) patchLoginService(diDirect.LoginService);
        patchIsolate(diDirect);
      }
    } catch (_) {}
    var dm = null;
    try {
      dm = window.__require('13');
    } catch (_) {
      dm = null;
    }
    if (!dm) return false;
    try {
      var acc = decodeAccount(dm);
      if (acc && acc.info) {
        window.__yunqiNativeAccount = acc;
        window._binLoginData = { _raw: acc.payload };
        log(
          LOG,
          'account injected',
          AndroidBinBridge.getBinName && AndroidBinBridge.getBinName(),
          acc.serverId || ''
        );
        replayPendingLogin();
        return true;
      }
      log(LOG, 'native bridge ready, waiting account');
      return false;
    } catch (e) {
      console.error(LOG, 'patch error', e);
      return false;
    }
  }

  window.__yunqiTryNativeLoginPatch = tryPatch;

  window.__yunqi_reloadNativeAccount = function () {
    window.__yunqiNativeAccount = null;
    window._binLoginData = null;
    __yunqiSendAsyncFirstServerId = true;
    window.__yunqiFirstServerList = true;
    window.__yunqiFirstAuth = true;
    var ok = tryPatch();
    if (ok) replayPendingLogin();
    return ok;
  };

  window.__yunqi_setBinLoginData = function (data) {
    if (!data) return;
    var raw = data._raw || data;
    window._binLoginData = data._raw ? data : { _raw: raw };
    window.__yunqiNativeAccount = accountFromRaw(raw);
    replayPendingLogin();
  };

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (tryPatch() && tries > 20) {
      clearInterval(timer);
    }
    if (tries > 300) {
      clearInterval(timer);
      timer = setInterval(function () {
        tryPatch();
      }, 1000);
    }
  }, 100);
  tryPatch();
})();
