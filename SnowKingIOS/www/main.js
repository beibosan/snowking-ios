if (!window.assetCacheWrapper) {
  window.assetCacheWrapper = true

  var needCache = function (url) {
    return (
      typeof url === 'string' &&
      (url.includes('.jsc') ||
        url.includes('.js') ||
        url.includes('.assets/') ||
        url.includes('/remote/') ||
        url.match(/\.(png|jpg|jpeg|mp3|wav|json|atlas|tmx)$/))
    )
  }

  var CACHE_NAME = 'game-cache-v1'
  var originalFetch = window.fetch

  window.fetch = async function (url, options) {
    if (!needCache(url)) return originalFetch(url, options)

    try {
      var cache = await caches.open(CACHE_NAME)
      var cached = await cache.match(url)
      if (cached) return cached

      var response = await originalFetch(url, options)
      if (response && response.ok) {
        cache.put(url, response.clone())
      }
      return response
    } catch (e) {
      return originalFetch(url, options)
    }
  }
}

window.xxtea = (function () {
  var delta = 0x9e3779b9
  function toUint8Array(v, includeLength) {
    var length = v.length
    var n = length << 2
    if (includeLength) {
      var m = v[length - 1]
      n -= 4
      if (m < n - 3 || m > n) {
        return null
      }
      n = m
    }
    var bytes = new Uint8Array(n)
    for (var i = 0; i < n; ++i) {
      bytes[i] = v[i >> 2] >> ((i & 3) << 3)
    }
    return bytes
  }

  function toUint32Array(bytes, includeLength) {
    var length = bytes.length
    var n = length >> 2
    if ((length & 3) !== 0) {
      ++n
    }
    var v
    if (includeLength) {
      v = new Uint32Array(n + 1)
      v[n] = length
    } else {
      v = new Uint32Array(n)
    }
    for (var i = 0; i < length; ++i) {
      v[i >> 2] |= bytes[i] << ((i & 3) << 3)
    }
    return v
  }

  function mx(sum, y, z, p, e, k) {
    return (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^ ((sum ^ y) + (k[(p & 3) ^ e] ^ z))
  }

  function fixk(k) {
    if (k.length < 16) {
      var key = new Uint8Array(16)
      key.set(k)
      k = key
    }
    return k
  }

  function encryptUint32Array(v, k) {
    var length = v.length
    var n = length - 1
    var y, z, sum, e, p, q
    z = v[n]
    sum = 0
    for (q = Math.floor(6 + 52 / length) | 0; q > 0; --q) {
      sum += delta
      e = (sum >>> 2) & 3
      for (p = 0; p < n; ++p) {
        y = v[p + 1]
        z = v[p] += mx(sum, y, z, p, e, k)
      }
      y = v[0]
      z = v[n] += mx(sum, y, z, p, e, k)
    }
    return v
  }

  function decryptUint32Array(v, k) {
    var length = v.length
    var n = length - 1
    var y, z, sum, e, p, q
    y = v[0]
    q = Math.floor(6 + 52 / length)
    for (sum = q * delta; sum !== 0; sum -= delta) {
      e = (sum >>> 2) & 3
      for (p = n; p > 0; --p) {
        z = v[p - 1]
        y = v[p] -= mx(sum, y, z, p, e, k)
      }
      z = v[n]
      y = v[0] -= mx(sum, y, z, p, e, k)
    }
    return v
  }

  function toBytes(str) {
    var n = str.length
    
    
    var bytes = new Uint8Array(n * 3)
    var length = 0
    for (var i = 0; i < n; i++) {
      var codeUnit = str.charCodeAt(i)
      if (codeUnit < 0x80) {
        bytes[length++] = codeUnit
      } else if (codeUnit < 0x800) {
        bytes[length++] = 0xc0 | (codeUnit >> 6)
        bytes[length++] = 0x80 | (codeUnit & 0x3f)
      } else if (codeUnit < 0xd800 || codeUnit > 0xdfff) {
        bytes[length++] = 0xe0 | (codeUnit >> 12)
        bytes[length++] = 0x80 | ((codeUnit >> 6) & 0x3f)
        bytes[length++] = 0x80 | (codeUnit & 0x3f)
      } else {
        if (i + 1 < n) {
          var nextCodeUnit = str.charCodeAt(i + 1)
          if (codeUnit < 0xdc00 && 0xdc00 <= nextCodeUnit && nextCodeUnit <= 0xdfff) {
            var rune = (((codeUnit & 0x03ff) << 10) | (nextCodeUnit & 0x03ff)) + 0x010000
            bytes[length++] = 0xf0 | (rune >> 18)
            bytes[length++] = 0x80 | ((rune >> 12) & 0x3f)
            bytes[length++] = 0x80 | ((rune >> 6) & 0x3f)
            bytes[length++] = 0x80 | (rune & 0x3f)
            i++
            continue
          }
        }
        throw new Error('Malformed string')
      }
    }
    return bytes.subarray(0, length)
  }

  function toShortString(bytes, n) {
    var charCodes = new Uint16Array(n)
    var i = 0,
      off = 0
    for (var len = bytes.length; i < n && off < len; i++) {
      var unit = bytes[off++]
      switch (unit >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          charCodes[i] = unit
          break
        case 12:
        case 13:
          if (off < len) {
            charCodes[i] = ((unit & 0x1f) << 6) | (bytes[off++] & 0x3f)
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        case 14:
          if (off + 1 < len) {
            charCodes[i] =
              ((unit & 0x0f) << 12) | ((bytes[off++] & 0x3f) << 6) | (bytes[off++] & 0x3f)
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        case 15:
          if (off + 2 < len) {
            var rune =
              (((unit & 0x07) << 18) |
                ((bytes[off++] & 0x3f) << 12) |
                ((bytes[off++] & 0x3f) << 6) |
                (bytes[off++] & 0x3f)) -
              0x10000
            if (0 <= rune && rune <= 0xfffff) {
              charCodes[i++] = ((rune >> 10) & 0x03ff) | 0xd800
              charCodes[i] = (rune & 0x03ff) | 0xdc00
            } else {
              throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16))
            }
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        default:
          throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16))
      }
    }
    if (i < n) {
      charCodes = charCodes.subarray(0, i)
    }
    return String.fromCharCode.apply(String, charCodes)
  }

  function toLongString(bytes, n) {
    var buf = []
    var charCodes = new Uint16Array(0x8000)
    var i = 0,
      off = 0
    for (var len = bytes.length; i < n && off < len; i++) {
      var unit = bytes[off++]
      switch (unit >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          charCodes[i] = unit
          break
        case 12:
        case 13:
          if (off < len) {
            charCodes[i] = ((unit & 0x1f) << 6) | (bytes[off++] & 0x3f)
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        case 14:
          if (off + 1 < len) {
            charCodes[i] =
              ((unit & 0x0f) << 12) | ((bytes[off++] & 0x3f) << 6) | (bytes[off++] & 0x3f)
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        case 15:
          if (off + 2 < len) {
            var rune =
              (((unit & 0x07) << 18) |
                ((bytes[off++] & 0x3f) << 12) |
                ((bytes[off++] & 0x3f) << 6) |
                (bytes[off++] & 0x3f)) -
              0x10000
            if (0 <= rune && rune <= 0xfffff) {
              charCodes[i++] = ((rune >> 10) & 0x03ff) | 0xd800
              charCodes[i] = (rune & 0x03ff) | 0xdc00
            } else {
              throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16))
            }
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        default:
          throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16))
      }
      if (i >= 0x7fff - 1) {
        var size = i + 1
        buf.push(String.fromCharCode.apply(String, charCodes.subarray(0, size)))
        n -= size
        i = -1
      }
    }
    if (i > 0) {
      buf.push(String.fromCharCode.apply(String, charCodes.subarray(0, i)))
    }
    return buf.join('')
  }

  function toString(bytes) {
    var n = bytes.length
    if (n === 0) return ''
    return n < 0x7fff ? toShortString(bytes, n) : toLongString(bytes, n)
  }

  function encrypt(data, key) {
    if (typeof data === 'string') data = toBytes(data)
    if (typeof key === 'string') key = toBytes(key)
    if (data === undefined || data === null || data.length === 0) {
      return data
    }
    return toUint8Array(
      encryptUint32Array(toUint32Array(data, true), toUint32Array(fixk(key), false)),
      false
    )
  }

  function encryptToString(data, key) {
    if (typeof Buffer.from === 'function') {
      return Buffer.from(encrypt(data, key)).toString('base64')
    } else {
      return new Buffer(encrypt(data, key)).toString('base64')
    }
  }

  function decrypt(data, key) {
    if (typeof data === 'string') {
      if (typeof Buffer.from === 'function') {
        data = Buffer.from(data, 'base64')
      } else {
        data = new Buffer(data, 'base64')
      }
    }
    if (typeof key === 'string') key = toBytes(key)
    if (data === undefined || data === null || data.length === 0) {
      return data
    }
    return toUint8Array(
      decryptUint32Array(toUint32Array(data, false), toUint32Array(fixk(key), false)),
      true
    )
  }

  function decryptToString(data, key) {
    return toString(decrypt(data, key))
  }

  return {
    toBytes,
    toString,
    encrypt,
    encryptToString,
    decrypt,
    decryptToString
  }
})()
window.convertAssets = function (url) {
  if (typeof url != 'string') {
    return url
  }
  if (!url.startsWith('assets/') || url.startsWith('assets/internal')) {
    return url
  }
  
  let cdnPath = url.slice(7)
  if (cdnPath.startsWith('main/')) {
    cdnPath = 'launcher/' + cdnPath.slice(5)
  }
  let newUrl = 'https://xxz-xyzw-res.hortorgames.com/remote/' + cdnPath
  if (url.startsWith('assets/game') || url.startsWith('assets/launcher') || url.startsWith('assets/main') || url.startsWith('assets/TEST_REMOTE_MODULE')) {
    if (url.endsWith('.js')) {
      newUrl += 'c'
    }
  }
  return newUrl
}

window.loadJscAndDecode = async function (url, callback) {
  const jscRes = await fetch(url)
  const jscData = await jscRes.arrayBuffer()
  const jsCodeData = xxtea.decrypt(new Uint8Array(jscData), xxtea.toBytes('0Aed5E79bbEa69f8'))
  const decoder = new TextDecoder();
  let jsCode = decoder.decode(jsCodeData)
  
  jsCode = jsCode.replace(/cc\.assetManager\.loadAny=function\(\)\{\},?/g, '')
  jsCode = jsCode.replace(/\w+\.PlatformManager\.instance\.isH5&&\(cc\.assetManager\.loadBundle=function\(\)\{\}\),/g, '')
  
  jsCode = jsCode.replace('&&!f.instance.isH5){if(s=cc.assetManager.downloader.bundleVers', '){if(s=cc.assetManager.downloader.bundleVers')
  
  
  jsCode = jsCode.replace(/try\{var \w+=String\[\w+\(\d+\)\],\w+=\w+\(49,50,55,46,48,46,48,46,49\);\(CDN\[\w+\(\d+\)\]\(\w+\)\|\|SERVER\[\w+\(\d+\)\]\(\w+\)\|\|PLATFORM\[\w+\(\d+\)\]\(\w+\(104,53,119,101,98\)\)\)&&\(cc\[\w+\(\d+\)\]\[\w+\(\d+\)\]\[\w+\(\d+\)\]=function\(\)\{\}\)\}catch\(\w+\)\{\}/g, '/* [patched] RenderFlow anti-tamper removed */')
  
  
  jsCode = jsCode.replace(
    /setClipboard:\s*function\s*\(\w+\)\s*\{\s*(?:return\s+)?\w+\(\{\s*action:\s*"sdk-sync-passbord"[^}]*\}\s*\)[;,]?\s*\}/,
    'setClipboard: function(e) { try { if(window.__yunqi_setClip){window.__yunqi_setClip(e);} else { var d=(typeof e==="string")?e:((e&&(e.text!=null?e.text:e.data))||""); if(window.Bridge&&window.Bridge.setClipboardData){window.Bridge.setClipboardData(d);} else if(window.ClipboardBridge&&window.ClipboardBridge.copy){window.ClipboardBridge.copy(d);} } } catch(err){console.warn("[Patch] setClipboard err:",err);} }'
  )
  jsCode = jsCode.replace(
    /getClipboard:\s*function\s*\(\)\s*\{\s*return new Promise\(function\(\w+,\s*\w+\)\s*\{\s*\w+\(\{\s*action:\s*"sdk-get-passbord"\s*\}\)[^}]*\}[^}]*\}\)[;,]?\s*\}/,
    'getClipboard: function() { return new Promise(function(r) { try { if(window.Bridge&&window.Bridge.paste){r({text:window.Bridge.paste()||""});} else if(window.ClipboardBridge&&window.ClipboardBridge.paste){r({text:window.ClipboardBridge.paste()||""});} else{r({text:""});} } catch(e){r({text:""});} }); }'
  )
  callback(jsCode)
}

window.boot = async function () {
  var MANIFEST_CACHE_KEY = '_yunqi_manifest_cache'

  function clearManifestLocalCache() {
    try { localStorage.removeItem(MANIFEST_CACHE_KEY) } catch (_) {}
  }

  function saveManifestLocalCache(bundleVers) {
    try { localStorage.setItem(MANIFEST_CACHE_KEY, JSON.stringify(bundleVers)) } catch (_) {}
  }

  function loadManifestLocalCache() {
    try {
      var cached = localStorage.getItem(MANIFEST_CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (_) {
      return null
    }
  }

  function manifestFingerprint(bundleVers) {
    return JSON.stringify(bundleVers)
  }

  function loadNativeBundleVers() {
    try {
      if (!window.Bridge || !window.Bridge.getNativeBundleVersJson) return null
      var json = window.Bridge.getNativeBundleVersJson()
      if (!json) return null
      return JSON.parse(json)
    } catch (e) {
      console.warn('[boot] native bundleVers 解析失败:', e.message)
      return null
    }
  }

  function clearAllResourceCaches() {
    try {
      if (window.Bridge && window.Bridge.clearAllResourceCaches) {
        window.Bridge.clearAllResourceCaches()
        console.log('[boot] 已触发 CDN 全量缓存清理')
      }
    } catch (_) {}
  }

  try {
    if (window.Bridge && window.Bridge.isManifestCacheStale && window.Bridge.isManifestCacheStale()) {
      clearManifestLocalCache()
      console.log('[boot] native 标记 manifest 过期，已清除 localStorage')
    }
  } catch (_) {}

  var fetchManifestFresh = async function () {
    try {
      var settingsRes = await fetch(
        'https://xxz-xyzw.hortorgames.com/login/manifest?platform=hortor&version=0.1.0-androidh5',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json,text/plain,*/*',
            'Accept-Encoding': 'gzip,deflate,br',
            'Content-Type': 'application/json;charset=UTF-8',
            Host: 'xxz-xyzw.hortorgames.com',
            'Content-Length': '0'
          }
        }
      )
      var settingsTxt = await settingsRes.text()
      var settingsObj = JSON.parse(settingsTxt)
      return JSON.parse(settingsObj.body.bundleVers)
    } catch (e) {
      console.warn('[boot] manifest 网络请求失败:', e.message)
      return null
    }
  }

  var cachedManifest = loadManifestLocalCache()
  var nativeManifest = loadNativeBundleVers()
  var bundleVers

  if (cachedManifest && nativeManifest &&
      manifestFingerprint(cachedManifest) === manifestFingerprint(nativeManifest)) {
    bundleVers = cachedManifest
    console.log('[boot] manifest 与 Splash 缓存一致，跳过网络校验与 CDN 清理')
  } else {
    var freshManifest = await fetchManifestFresh()
    if (!freshManifest) {
      freshManifest = nativeManifest
      if (freshManifest) console.warn('[boot] manifest 网络失败，使用 Splash native 结果参与校验')
    }

    if (freshManifest && cachedManifest) {
      if (manifestFingerprint(cachedManifest) === manifestFingerprint(freshManifest)) {
        bundleVers = cachedManifest
        console.log('[boot] manifest 与缓存一致，跳过 CDN 全量清理')
      } else {
        console.log('[boot] manifest 已变化，全量清理 CDN 缓存并更新 bundleVers')
        clearAllResourceCaches()
        clearManifestLocalCache()
        bundleVers = freshManifest
        saveManifestLocalCache(freshManifest)
      }
    } else if (freshManifest) {
      bundleVers = freshManifest
      saveManifestLocalCache(freshManifest)
      console.log('[boot] 无本地 manifest 缓存，使用远端并写入缓存')
    } else if (cachedManifest) {
      bundleVers = cachedManifest
      console.warn('[boot] manifest 拉取失败，降级使用 localStorage 缓存')
    } else {
      console.error('[boot] manifest 获取失败且无缓存，无法启动')
      return
    }
  }

  if (bundleVers.launcher && !bundleVers.main) {
    bundleVers.main = bundleVers.launcher
  }
  if (bundleVers.COMMIT_ID || bundleVers.commitId) {
    window.COMMIT_ID = bundleVers.COMMIT_ID || bundleVers.commitId
  }
  var configCommitId = bundleVers.CONFIG_COMMIT_ID || bundleVers.configCommitId || bundleVers.configVersion || bundleVers.config || bundleVers.configs
  var resourcesCommitId = bundleVers.RESOURCES_COMMIT_ID || bundleVers.resourcesCommitId || bundleVers.resourceVersion || bundleVers.resourcesVersion || bundleVers.resources || bundleVers.res || bundleVers.main || bundleVers.launcher
  if (configCommitId) {
    window.CONFIG_COMMIT_ID = configCommitId
  }
  if (resourcesCommitId) {
    window.RESOURCES_COMMIT_ID = resourcesCommitId
  }
  Object.assign(window._CCSettings.bundleVers, bundleVers)

  var settings = window._CCSettings
  window._CCSettings = undefined
  var onProgress = null

  var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES
  var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL
  var MAIN = cc.AssetManager.BuiltinBundleName.MAIN
  function setLoadingDisplay() {
    
    var splash = document.getElementById('splash')
    var progressBar = splash.querySelector('.progress-bar span')
    onProgress = function (finish, total) {
      var percent = (100 * finish) / total
      if (progressBar) {
        progressBar.style.width = percent.toFixed(2) + '%'
      }
    }
    splash.style.display = 'block'
    progressBar.style.width = '0%'

    cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
      splash.style.display = 'none'
    })
  }

  var onStart = function () {
    cc.view.enableRetina(true)
    cc.view.resizeWithBrowserSize(true)

    if (cc.sys.isBrowser) {
      cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
        var splash = document.getElementById('splash');
        if (splash) splash.style.display = 'none';
      });
    }

    if (cc.sys.isMobile) {
      if (settings.orientation === 'landscape') {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)
      } else if (settings.orientation === 'portrait') {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT)
      }
    }

    if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
      var maxC = 16, maxR = 8
      try {
        if (window.ConcurrencyBridge) {
          maxC = window.ConcurrencyBridge.getMaxConcurrency() || 16
          maxR = window.ConcurrencyBridge.getMaxRequestsPerFrame() || 8
        }
      } catch (e) { console.warn('[boot] ConcurrencyBridge 获取失败:', e.message) }
      cc.assetManager.downloader.maxConcurrency = maxC
      cc.assetManager.downloader.maxRequestsPerFrame = maxR
    }

    if (cc.assetManager.pipeline) {
      cc.assetManager.pipeline.insert(0, cc.AssetManager.Pipeline.CacheDownloader)
    }

    var launchScene = settings.launchScene
    var bundle = cc.assetManager.bundles.find(function (b) {
      return b.getSceneInfo(launchScene)
    })

    bundle.loadScene(launchScene, null, onProgress, function (err, scene) {
      if (!err) {
        cc.director.runSceneImmediate(scene)
        if (cc.sys.isBrowser) {
          
          var canvas = document.getElementById('GameCanvas')
          canvas.style.visibility = ''
          var div = document.getElementById('GameDiv')
          if (div) {
            div.style.backgroundImage = ''
          }
          console.log('Success to load scene: ' + launchScene)
        }
      }
    })
  }

  var option = {
    id: 'GameCanvas',
    debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
    showFPS: settings.debug,
    frameRate: 120,
    groupList: settings.groupList,
    collisionMatrix: settings.collisionMatrix
  }

  cc.assetManager.init({
    bundleVers: settings.bundleVers,
    remoteBundles: settings.remoteBundles,
    server: settings.server
  })

  var bundleRoot = [INTERNAL]
  settings.hasResourcesBundle && bundleRoot.push(RESOURCES)

  var totalTasks = bundleRoot.length + 2 
  var count = 0
  var mainBundleLoaded = false
  function cb(err) {
    if (err) return console.error(err.message, err.stack)
    count++
    if (count >= totalTasks) {
      cc.game.run(option, onStart)
    }
  }

  cc.assetManager.loadScript(
    settings.jsList.map(function (x) {
      return 'src/' + x
    }),
    cb
  )

  for (var i = 0; i < bundleRoot.length; i++) {
    cc.assetManager.loadBundle(bundleRoot[i], cb)
  }

  cc.assetManager.loadBundle(MAIN, cb)
}
