(function () {
  "use strict";

  if (window.__autoMuteAudioInstalled) return;
  window.__autoMuteAudioInstalled = true;

  var TAG = "[AutoMuteAudio]";
  var STORAGE_KEYS = ["MUSIC_OPEN", "SOUND_OPEN", "CLICK_EFFECT_OPEN", "VIBRATE_OPEN"];
  var ENFORCE_INTERVAL_MS = 500;

  function warnOnce(key, err) {
    var flag = "__autoMuteAudioWarned_" + key;
    if (window[flag]) return;
    window[flag] = true;
    console.warn(TAG, key, err);
  }

  function safeRun(key, fn) {
    try {
      return fn();
    } catch (err) {
      warnOnce(key, err);
      return null;
    }
  }

  function setRawStorageOff() {
    safeRun("rawStorage", function () {
      var storage =
        window.localStorage ||
        (window.cc && cc.sys && cc.sys.localStorage) ||
        null;
      if (!storage) return;
      STORAGE_KEYS.forEach(function (key) {
        storage.setItem(key, "false");
      });
    });
  }

  function setGameStorageOff() {
    safeRun("gameStorage", function () {
      if (typeof window.__require !== "function") return;
      var mod = window.__require("LocalStorage");
      var storage = mod && mod.LocalStorage && mod.LocalStorage.instance;
      if (!storage || typeof storage.setBool !== "function") return;
      STORAGE_KEYS.forEach(function (key) {
        storage.setBool(key, false);
      });
    });
  }

  function muteFgui() {
    safeRun("fgui", function () {
      if (!window.fgui || !fgui.UIConfig) return;
      fgui.UIConfig.isSoundOpen = false;
      fgui.UIConfig.isVibrateOpen = false;
    });
  }

  function patchVibration() {
    safeRun("vibration", function () {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        try {
          window.navigator.vibrate(0);
        } catch (err) {}
        try {
          window.navigator.vibrate = function () {
            return false;
          };
        } catch (err) {
          Object.defineProperty(window.navigator, "vibrate", {
            configurable: true,
            value: function () {
              return false;
            }
          });
        }
      }

      ["wx", "HSDK"].forEach(function (name) {
        var api = window[name];
        if (!api) return;
        ["vibrateShort", "vibrateLong"].forEach(function (method) {
          api[method] = function () {};
        });
      });
    });
  }

  function patchHtmlMedia() {
    safeRun("htmlMediaPatch", function () {
      if (!window.HTMLMediaElement) return;
      var proto = window.HTMLMediaElement.prototype;
      if (proto.__autoMuteAudioPatched) return;
      proto.__autoMuteAudioPatched = true;

      var originalPlay = proto.play;
      if (typeof originalPlay === "function") {
        proto.play = function () {
          this.muted = true;
          this.volume = 0;
          return originalPlay.apply(this, arguments);
        };
      }
    });
  }

  function muteHtmlMedia() {
    safeRun("htmlMedia", function () {
      if (!document || !document.querySelectorAll) return;
      var list = document.querySelectorAll("audio,video");
      for (var i = 0; i < list.length; i++) {
        list[i].muted = true;
        list[i].volume = 0;
      }
    });
  }

  function patchAudioEngine() {
    return safeRun("ccAudioEnginePatch", function () {
      if (!window.cc || !cc.audioEngine) return false;
      var engine = cc.audioEngine;
      if (engine.__autoMuteAudioPatched) return true;
      engine.__autoMuteAudioPatched = true;

      function wrap(name, handler) {
        var original = engine[name];
        if (typeof original !== "function") return;
        engine[name] = function () {
          return handler.call(this, original, arguments);
        };
      }

      wrap("play", function (original, args) {
        args[2] = 0;
        return original.apply(this, args);
      });

      wrap("playMusic", function (original, args) {
        var id = original.apply(this, args);
        if (typeof this.setMusicVolume === "function") this.setMusicVolume(0);
        return id;
      });

      wrap("playEffect", function (original, args) {
        var clip = args[0];
        var loop = args[1] || false;
        return typeof this.play === "function"
          ? this.play(clip, loop, 0)
          : original.apply(this, args);
      });

      wrap("setVolume", function (original, args) {
        args[1] = 0;
        return original.apply(this, args);
      });

      wrap("setMusicVolume", function (original) {
        return original.call(this, 0);
      });

      wrap("setEffectsVolume", function (original) {
        return original.call(this, 0);
      });

      wrap("resume", function (original, args) {
        var id = original.apply(this, args);
        if (typeof this.setVolume === "function") this.setVolume(args[0], 0);
        return id;
      });

      wrap("resumeMusic", function (original, args) {
        var id = original.apply(this, args);
        if (typeof this.setMusicVolume === "function") this.setMusicVolume(0);
        return id;
      });

      if (engine._music) engine._music.volume = 0;
      if (engine._effect) engine._effect.volume = 0;
      if (typeof engine.setMusicVolume === "function") engine.setMusicVolume(0);
      if (typeof engine.setEffectsVolume === "function") engine.setEffectsVolume(0);
      if (typeof engine.stopMusic === "function") engine.stopMusic();
      if (typeof engine.stopAllEffects === "function") engine.stopAllEffects();
      return true;
    });
  }

  function muteSoundManager() {
    safeRun("soundManager", function () {
      if (typeof window.__require !== "function") return;
      var mod = window.__require("SoundManager");
      var manager = mod && mod.SoundManager && mod.SoundManager.instance;
      if (!manager) return;

      if (typeof manager.setMusicVolume === "function") manager.setMusicVolume(0);
      if (typeof manager.setEffectVolume === "function") manager.setEffectVolume(0);
      if (typeof manager.stopAllMusic === "function") manager.stopAllMusic();
      if (typeof manager.stopAllEffect === "function") manager.stopAllEffect();
    });
  }

  function enforceMute() {
    setRawStorageOff();
    setGameStorageOff();
    muteFgui();
    patchVibration();
    patchHtmlMedia();
    muteHtmlMedia();
    patchAudioEngine();
    muteSoundManager();
  }

  window.__autoMuteAudio = {
    apply: enforceMute,
    keys: STORAGE_KEYS.slice()
  };

  enforceMute();
  setInterval(enforceMute, ENFORCE_INTERVAL_MS);
  console.log(TAG + " music/effects/vibration switches are forced off.");
})();
