(function () {
  "use strict";

  var STORAGE_KEYS = ["MUSIC_OPEN", "SOUND_OPEN", "CLICK_EFFECT_OPEN", "VIBRATE_OPEN"];

  function safeRun(fn) {
    try { fn(); } catch (error) { }
  }

  safeRun(function () {
    var storage = window.localStorage || (window.cc && cc.sys && cc.sys.localStorage);
    if (!storage) return;
    STORAGE_KEYS.forEach(function (key) { storage.setItem(key, "true"); });
  });

  safeRun(function () {
    if (typeof window.__require !== "function") return;
    var mod = window.__require("LocalStorage");
    var storage = mod && mod.LocalStorage && mod.LocalStorage.instance;
    if (!storage || typeof storage.setBool !== "function") return;
    STORAGE_KEYS.forEach(function (key) { storage.setBool(key, true); });
  });

  safeRun(function () {
    if (window.fgui && fgui.UIConfig) {
      fgui.UIConfig.isSoundOpen = true;
      fgui.UIConfig.isVibrateOpen = true;
    }
  });

  safeRun(function () {
    if (!window.cc || !cc.audioEngine) return;
    var engine = cc.audioEngine;
    if (typeof engine.setMusicVolume === "function") engine.setMusicVolume(1);
    if (typeof engine.setEffectsVolume === "function") engine.setEffectsVolume(1);
    if (typeof engine.resumeMusic === "function") engine.resumeMusic();
    if (typeof engine.resumeAllEffects === "function") engine.resumeAllEffects();
  });

  safeRun(function () {
    if (typeof window.__require !== "function") return;
    var mod = window.__require("SoundManager");
    var manager = mod && mod.SoundManager && mod.SoundManager.instance;
    if (!manager) return;
    if (typeof manager.setMusicVolume === "function") manager.setMusicVolume(1);
    if (typeof manager.setEffectVolume === "function") manager.setEffectVolume(1);
  });

  safeRun(function () {
    var media = document.querySelectorAll("audio,video");
    for (var i = 0; i < media.length; i++) {
      media[i].muted = false;
      media[i].volume = 1;
    }
  });

  console.log("[SnowKing] sound restored");
})();
