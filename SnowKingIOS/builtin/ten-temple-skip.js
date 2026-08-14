// ==UserScript==
// @name         十殿试炼 - 自动跳过战斗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击出战后自动触发 QUICK_BATTLE，跳过十殿试炼战斗动画
// @author       Assistant
// @match        *://*
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = "[NightmareSkipHelper]";
    window.__snowKingSpeedEnabled = true;

    // 获取模块的通用函数
    const getModule = (name) => {
        try {
            const req = typeof unsafeWindow !== "undefined" ? unsafeWindow.__require : window.__require;
            return req ? req(name) : null;
        } catch (e) { return null; }
    };

    const injectHooks = () => {
        // 1. 获取战斗面板模块
        const NBPanelModule = getModule("NightmareBattlePanel");
        // 2. 获取战斗工厂模块（用于执行跳过逻辑）
        const ManagerFactory = getModule("manager-factory");

        if (NBPanelModule && NBPanelModule.NightmareBattlePanel && ManagerFactory) {
            const Proto = NBPanelModule.NightmareBattlePanel.prototype;

            // 防止重复 Hook
            if (!Proto._isSkipHooked) {
                Proto.__snowKingOriginalStartBattle = Proto._startBattle;
                const original_startBattle = Proto._startBattle;

                // Hook _startBattle 方法
                Proto._startBattle = async function(notify, frame = 0) {
                    // 执行原始逻辑：创建战斗、初始化数据
                    // 注意：由于原始方法是 async 的，这里必须使用 await 确保战斗初始化完成
                    const result = await original_startBattle.apply(this, arguments);

                    try {
                        // 战斗启动后，this.battleUIData 会被赋值，且 this._inBattle 会变为 true
                        if (this.battleUIData && ManagerFactory.QUICK_BATTLE) {
                            console.log(LOG_PREFIX, "检测到战斗开始，正在执行自动跳过...");
                            
                            // 立即执行跳过逻辑
                            ManagerFactory.QUICK_BATTLE(this.battleUIData);
                        } else {
                            console.warn(LOG_PREFIX, "跳过失败：未找到 battleUIData 或 QUICK_BATTLE 方法");
                        }
                    } catch (err) {
                        console.error(LOG_PREFIX, "自动跳过执行出错:", err);
                    }

                    return result;
                };

                Proto._isSkipHooked = true;
                console.log(LOG_PREFIX, "NightmareBattlePanel (十殿试炼) 自动跳过 Hook 已激活.");
            }
        }

        // 如果已经成功 Hook，可以返回 true 来停止定时器，或者保持运行以适配热更新
        return false;
    };

    // 每1.5秒检测一次模块是否加载
    const timer = setInterval(() => {
        if (!window.__snowKingSpeedEnabled) {
            clearInterval(timer);
            return;
        }
        injectHooks();
    }, 1500);
    window.__snowKingSpeedTimer = timer;

})();
//# sourceURL=十殿跳过.js
