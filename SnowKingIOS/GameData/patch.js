window.__yunqi_clipText = function (v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') {
    var s = v;
    if (s && (s.charAt(0) === '{' || s.charAt(0) === '[')) {
      try {
        var o = JSON.parse(s);
        if (o && typeof o === 'object') {
          if (o.text !== undefined && o.text !== null) return String(o.text);
          if (o.data !== undefined && o.data !== null) return String(o.data);
        }
      } catch (_) {}
    }
    return s;
  }
  if (typeof v === 'object') {
    if (v.text !== undefined && v.text !== null) return String(v.text);
    if (v.data !== undefined && v.data !== null) return String(v.data);
    try { return JSON.stringify(v); } catch (_) { return String(v); }
  }
  return String(v);
};

window.__yunqi_setClip = function (v) {
  var s = window.__yunqi_clipText(v);
  try {
    if (window.Bridge && typeof window.Bridge.setClipboardData === 'function') {
      window.Bridge.setClipboardData(s);
      return true;
    }
    if (window.ClipboardBridge && typeof window.ClipboardBridge.copy === 'function') {
      window.ClipboardBridge.copy(s);
      return true;
    }
  } catch (e) {
    console.warn('[Patch] 剪贴板写入失败:', e);
  }
  return false;
};

if (typeof window.wx === 'undefined') {
  var patchedOnShow = function (callback) {
    setTimeout(function () {
      try {
        callback({ scene: 0, query: {}, referrerInfo: {}, shareTicket: [] });
      } catch (_) {}
    }, 1000);
  };
  patchedOnShow.__yunqiPatched = true;
  window.wx = {
    getSystemInfo() { },
    onShow: patchedOnShow,
    onHide(callback) { },
  };
}

window.HSDK = {
  onLogin(data) {
    setTimeout(() => {
      data.listener({
        userSdk: {
          isNewUser: false
        }
      });
    }, 1000);
  },
  dialogLogin(data) {
    return new Promise((resolve) => {
      var result = {
        errCode: 0,
        errMsg: 'ok',
        userSdk: {
          isNewUser: false
        }
      };
      setTimeout(() => {
        if (typeof data === 'function') data(result);
        if (data && typeof data.listener === 'function') data.listener(result);
        if (data && typeof data.success === 'function') data.success(result);
        if (data && typeof data.complete === 'function') data.complete(result);
        resolve(result);
      }, 0);
    });
  },
  multiPlatformLogin(data) {
    return this.dialogLogin(data);
  },
  reportLoginState() { },
  onAddictionQuit() { },
  getGsSetting() { return {} },
  isRunInApp() { return false },
  openCustomerService() { },
  init(config, callback) { if (callback && callback.success) callback.success({}); },
  getAccountInfo(callback) { if (callback && callback.success) callback.success({}); },
  __switches: {},
  __switchesReady: false,
  _normalizeSwitches(data) {
    var payload = data;
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      if (payload.switches && typeof payload.switches === 'object') {
        payload = payload.switches;
      } else if (payload.data && typeof payload.data === 'object') {
        payload = payload.data;
      }
    }
    var switches = {};
    var skip = {
      errCode: true,
      errMsg: true,
      code: true,
      msg: true,
      data: true,
      switches: true,
      success: true,
      fail: true,
      complete: true,
      listener: true
    };
    var collect = function (value) {
      if (!value) return;
      if (typeof value === 'string') {
        switches[value] = false;
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(collect);
        return;
      }
      if (typeof value === 'object') {
        Object.keys(value).forEach(function (key) {
          if (skip[key]) return;
          var item = value[key];
          if (typeof item === 'boolean') {
            switches[key] = item;
          } else if (typeof item === 'number') {
            switches[key] = !!item;
          } else {
            switches[key] = false;
            collect(item);
          }
        });
      }
    };
    collect(payload);
    return switches;
  },
  _buildSwitchResult(switches) {
    var result = Object.assign({}, switches);
    var mirror = Object.assign({}, switches);
    try {
      Object.defineProperties(result, {
        errCode: { value: 0, enumerable: false },
        errMsg: { value: 'ok', enumerable: false },
        code: { value: 0, enumerable: false },
        msg: { value: 'ok', enumerable: false },
        data: { value: mirror, enumerable: false },
        switches: { value: mirror, enumerable: false }
      });
    } catch (e) { }
    return result;
  },
  initSwitches(data) {
    this.__switches = this._normalizeSwitches(data);
    this.__switchesReady = true;
    return Promise.resolve(this._buildSwitchResult(this.__switches));
  },
  checkSwitch(name) {
    return !!(this.__switches && this.__switches[name]);
  },
  checkSwitches(data, callback) {
    var switches = this._normalizeSwitches(data);
    this.__switches = switches;
    this.__switchesReady = true;
    var result = this._buildSwitchResult(switches);
    setTimeout(() => {
      if (typeof data === 'function') data(result);
      if (typeof callback === 'function') callback(result);
      if (data && typeof data.listener === 'function') data.listener(result);
      if (data && typeof data.success === 'function') data.success(result);
      if (data && typeof data.complete === 'function') data.complete(result);
    }, 0);
    return Promise.resolve(result);
  },
  getDeviceInfo(options, callback) {
    var result = this.getDeviceInfoSync();
    setTimeout(() => {
      if (typeof options === 'function') options(result);
      if (typeof callback === 'function') callback(result);
      if (options && typeof options.listener === 'function') options.listener(result);
      if (options && typeof options.success === 'function') options.success(result);
      if (options && typeof options.complete === 'function') options.complete(result);
    }, 0);
    return Promise.resolve(result);
  },
  getLaunchOptionsSync() { return {} },
  triggerGC() { },
  exitMiniProgram() { },
  navigateToMiniProgram() { },
  getDeviceInfoSync() {
    var raw = window._binLoginData && window._binLoginData._raw ? window._binLoginData._raw : {};
    var deviceId = raw.deviceUniqueId || '';
    try {
      if (!deviceId && window.yunqiBridge && typeof window.yunqiBridge.getDeviceId === 'function') {
        deviceId = window.yunqiBridge.getDeviceId() || '';
      }
    } catch (e) { }
    if (!deviceId) deviceId = window.__yunqi_deviceId || '';
    return {
      errCode: 0,
      errMsg: 'ok',
      platform: 'android',
      os: 'android',
      system: 'Android 15',
      brand: 'OnePlus',
      model: 'PJD110',
      deviceId: deviceId,
      deviceUniqueId: deviceId,
      language: 'zh_CN',
      version: '8.0.71',
      appVersion: '8.0.71',
      SDKVersion: '3.15.2',
      sdkVersion: '3.15.2',
      hsdkVersion: '1.10.15',
      netType: 'wifi',
      networkType: 'WIFI',
      pixelRatio: 2.625,
      screenWidth: 412,
      screenHeight: 906,
      windowWidth: 412,
      windowHeight: 906,
      benchmarkLevel: 50
    };
  },
  getSystemInfoSync() { return Object.assign({ platform: 'android' }, this.getDeviceInfoSync()); },
  showModal(options) { if (options && options.success) options.success({ confirm: true }); },
  showAlert(options) {
    var opts = options || {};
    if (typeof opts === 'string') {
      opts = { message: opts };
    }
    var result = { confirm: true };
    setTimeout(() => {
      if (typeof opts.success === 'function') opts.success(result);
      if (typeof opts.complete === 'function') opts.complete(result);
    }, 0);
    return Promise.resolve(result);
  },
  showToast() { },
  hideToast() { },
  showLoading() { },
  hideLoading() { },
  setClipboardData(options) {
    try {
      window.__yunqi_setClip(options);
      console.log('[Patch] 剪贴板写入成功（setClipboardData）');
      if (options && options.success) options.success();
    } catch (e) {
      console.warn('[Patch] 剪贴板写入失败:', e);
      if (options && options.success) options.success();
    }
  },
  getClipboardData(options) {
    try {
      var text = '';
      if (window.Bridge && window.Bridge.paste) {
        text = window.Bridge.paste() || '';
      } else if (window.ClipboardBridge && window.ClipboardBridge.paste) {
        text = window.ClipboardBridge.paste() || '';
      }
      if (options && options.success) options.success({ data: text });
    } catch (e) {
      if (options && options.success) options.success({ data: '' });
    }
  },
  getNoticeInfo(options, callback) {
    var noticeKey = options && options.p1 ? options.p1 : 'updateVersion';
    var noticePayload = '[]';
    var notice = {
      p1: noticeKey,
      p2: '',
      p3: '',
      param1: noticeKey,
      param2: noticePayload,
      param3: '',
      title: '',
      content: '',
      text: '',
      notice: '',
      enabled: false,
      enable: false
    };
    var makeNoticeList = function () {
      var target = [];
      target.list = target;
      target.notices = target;
      target.notice = null;
      target.param1 = notice.param1;
      target.param2 = notice.param2;
      target.param3 = notice.param3;
      target.hasNotice = false;
      target.needUpdate = false;
      if (typeof Proxy === 'function') {
        return new Proxy(target, {
          get: function (obj, prop) {
            if (prop === '0' || prop === 0) return notice;
            return obj[prop];
          }
        });
      }
      return target;
    };
    var list = makeNoticeList();
    var data = makeNoticeList();
    data.list = list;
    data.notices = list;
    data.notice = null;
    data.param1 = notice.param1;
    data.param2 = notice.param2;
    data.param3 = notice.param3;
    data.hasNotice = false;
    data.needUpdate = false;
    var result = makeNoticeList();
    result.errCode = 0;
    result.errMsg = 'ok';
    result.code = 0;
    result.msg = 'ok';
    result.data = data;
    result.list = list;
    result.notices = list;
    result.notice = notice;
    result.param1 = notice.param1;
    result.param2 = notice.param2;
    result.param3 = notice.param3;
    result.hasNotice = false;
    result.needUpdate = false;
    setTimeout(() => {
      if (typeof options === 'function') options(result);
      if (typeof callback === 'function') callback(result);
      if (options && typeof options.listener === 'function') options.listener(result);
      if (options && typeof options.success === 'function') options.success(result);
      if (options && typeof options.complete === 'function') options.complete(result);
    }, 0);
    return Promise.resolve(result);
  },
  getNotice(options, callback) {
    return this.getNoticeInfo(options, callback);
  },
  createRewardedVideoAd() {
    return {
      load: () => Promise.resolve(), show: () => Promise.resolve(),
      onLoad() {}, onError() {}, onClose() {},
      offLoad() {}, offError() {}, offClose() {}, destroy() {}
    };
  },
  exitApp(options) {
    var result = { errCode: 0, errMsg: 'ok', code: 0, msg: 'ok' };
    setTimeout(() => {
      if (typeof options === 'function') options(result);
      if (options && typeof options.success === 'function') options.success(result);
      if (options && typeof options.complete === 'function') options.complete(result);
    }, 0);
    return Promise.resolve(result);
  },
  reportBehavior() { },
  reportEvent() { },
  reportLogin() { },
  reportPayment() { }
};
var tgaMock = {
  track() { },
  tga: null
};
tgaMock.tga = tgaMock;
window.__HORTOR_SDK__ = {
  tga: tgaMock,
};

window._hsdkInit = 1;
window.checkUpdate = 1;

(function() {
  function enableSelection() {
    var style = document.createElement('style');
    style.id = 'copy-enable-style';
    style.textContent = [
      'input, textarea, [contenteditable="true"],',
      '.room-number, .copy-content, .text-selectable {',
      '  user-select: text !important;',
      '  -webkit-user-select: text !important;',
      '}'
    ].join('\n');
    if (!document.getElementById('copy-enable-style')) {
      document.head.appendChild(style);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enableSelection);
  } else {
    setTimeout(enableSelection, 500);
  }
})();

(function() {
  if (window.Element && Element.prototype && !Element.prototype.__yunqi_sivPatched) {
    var _origScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function() {
      try {
        var tag = (this.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return; 
      } catch (_) {}
      return _origScrollIntoView.apply(this, arguments);
    };
    Element.prototype.__yunqi_sivPatched = true;
  }
  window.addEventListener('scroll', function() {
    if (window.pageYOffset) window.scrollTo(0, 0);
  }, true);
})();

(function() {
  var protectAttempts = 0;
  function protectRenderFlow() {
    protectAttempts++;
    if (typeof cc === 'undefined' || !cc.RenderFlow) {
      if (protectAttempts < 60) setTimeout(protectRenderFlow, 500);
      return;
    }
    var origUpdateRenderData = cc.RenderFlow.prototype._updateRenderData;
    if (!origUpdateRenderData) return;
    Object.defineProperty(cc.RenderFlow.prototype, '_updateRenderData', {
      get: function() { return origUpdateRenderData; },
      set: function(v) {
        if (typeof v === 'function' && v.toString().replace(/\s/g, '') === 'function(){}') {
          console.warn('[Patch] 阻止恶意代码覆盖 _updateRenderData');
          return;
        }
        origUpdateRenderData = v;
      },
      configurable: false
    });
    console.log('[Patch] RenderFlow._updateRenderData 已保护');
  }
  setTimeout(protectRenderFlow, 100);
})();

(function () {
  function patchCcPath() {
    if (typeof cc === 'undefined' || !cc.path) return false;
    var origBasename = cc.path.basename;
    if (typeof origBasename !== 'function') return false;
    if (origBasename.__yunqi_safe__) return true;
    var safe = function (t, e) {
      if (t == null) return '';
      try { return origBasename.call(this, t, e); } catch (_) { return ''; }
    };
    safe.__yunqi_safe__ = true;
    cc.path.basename = safe;
    var keys = ['dirname', 'mainFileName', 'changeExtname'];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var orig = cc.path[k];
      if (typeof orig === 'function' && !orig.__yunqi_safe__) {
        (function (origFn) {
          var wrap = function () {
            if (arguments[0] == null) return '';
            try { return origFn.apply(this, arguments); } catch (_) { return ''; }
          };
          wrap.__yunqi_safe__ = true;
          cc.path[k] = wrap;
        })(orig);
      }
    }
    console.log('[Patch] cc.path.{basename,dirname,mainFileName,changeExtname} undefined 守卫已安装');
    return true;
  }
  if (!patchCcPath()) {
    var attempts = 0;
    var timer = setInterval(function () {
      if (patchCcPath() || ++attempts >= 60) clearInterval(timer);
    }, 200);
  }
})();

(function() {
  var hooked = false;
  var hookAttempts = 0;

  function tryHookTexture() {
    hookAttempts++;
    if (typeof cc === 'undefined' || !cc.Texture2D || !cc.director) {
      if (hookAttempts < 60) setTimeout(tryHookTexture, 500);
      return;
    }
    if (hooked) return;
    hooked = true;

    var origInit = cc.Texture2D.prototype.initWithData;
    if (origInit) {
      cc.Texture2D.prototype.initWithData = function() {
        var r = origInit.apply(this, arguments);
        try {
          var s = cc.director.getScene();
          if (s) s._renderFlag |= cc.RenderFlow.FLAG_OPACITY;
        } catch(e) {}
        return r;
      };
    }

    var origHandle = cc.Texture2D.prototype.handleLoadedTexture;
    if (origHandle) {
      cc.Texture2D.prototype.handleLoadedTexture = function() {
        var r = origHandle.apply(this, arguments);
        try {
          var s = cc.director.getScene();
          if (s) s._renderFlag |= cc.RenderFlow.FLAG_OPACITY;
        } catch(e) {}
        return r;
      };
    }

    console.log('[Patch] Texture invalidation hooks installed');
  }

  var count = 0;
  var interval = setInterval(function() {
    count++;
    if (!hooked) tryHookTexture();
    try {
      if (typeof cc !== 'undefined' && cc.director) {
        var s = cc.director.getScene();
        if (s) s._renderFlag |= cc.RenderFlow.FLAG_OPACITY;
      }
    } catch(e) {}
    if (count >= 120) clearInterval(interval); 
  }, 500);
})();

(function() {
  try {
    if (window.Bridge && window.Bridge.isManifestCacheStale && window.Bridge.isManifestCacheStale()) {
      localStorage.removeItem('_yunqi_manifest_cache')
      console.log('[Patch] native 已标记 manifest 过期，已清除 localStorage')
    }
  } catch (_) {}
})();

(function() {
  function _setClipText(t) { window.__yunqi_setClip(t); }
  function _setClipData(options) {
    var ok = false;
    try {
      ok = window.__yunqi_setClip(options);
      if (options && typeof options.success === 'function') options.success({ errMsg: 'setClipboardData:ok' });
    } catch (e) {
      if (options && typeof options.fail === 'function') options.fail({ errMsg: 'setClipboardData:fail ' + e });
    } finally {
      if (options && typeof options.complete === 'function') options.complete({ errMsg: ok ? 'setClipboardData:ok' : 'setClipboardData:fail' });
    }
  }
  function _applyOverrides() {
    var targets = [window, window.wx, window.HSDK, window.__HORTOR_SDK__];
    for (var i = 0; i < targets.length; i++) {
      var o = targets[i];
      if (!o) continue;
      o.setClipboard = _setClipText;
      o.setClipboardData = _setClipData;
    }
  }
  _applyOverrides();
  setTimeout(_applyOverrides, 1500);
  setTimeout(_applyOverrides, 4000);
  setTimeout(_applyOverrides, 8000);
  
  if (!navigator.clipboard) navigator.clipboard = {};
  navigator.clipboard.writeText = function(t) { window.__yunqi_setClip(t); return Promise.resolve(); };
  navigator.clipboard.readText = function() {
    return new Promise(function(resolve) {
      try {
        if (typeof Bridge !== 'undefined' && Bridge && typeof Bridge.paste === 'function') {
          resolve(Bridge.paste() || '');
        } else { resolve(''); }
      } catch(_) { resolve(''); }
    });
  };
})();
