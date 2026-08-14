(function () {
    'use strict'

    window.__snowKingSpeedEnabled = false
    if (window.__snowKingSpeedTimer) {
        clearInterval(window.__snowKingSpeedTimer)
        window.__snowKingSpeedTimer = null
    }

    const startedAt = Date.now()
    const interval = setInterval(() => {
        if (Date.now() - startedAt > 60000) {
            clearInterval(interval)
            return
        }

        try {
            const module = window.__require && window.__require('NightmareBattlePanel')
            const Panel = module && module.NightmareBattlePanel
            const proto = Panel && Panel.prototype
            if (!proto) return

            if (proto.__snowKingOriginalStartBattle) {
                proto._startBattle = proto.__snowKingOriginalStartBattle
                delete proto.__snowKingOriginalStartBattle
            }
            proto._isSkipHooked = false
            clearInterval(interval)
            console.log('[SnowKing] 十殿加速已关闭')
        } catch (error) { }
    }, 500)
})()
