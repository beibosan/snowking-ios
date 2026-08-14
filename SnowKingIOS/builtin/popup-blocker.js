(function () {
    'use strict'

    window.__snowKingPopupHiddenDesired = true
    if (window.__snowKingFirstLoginPopupHidden) return
    window.__snowKingFirstLoginPopupHidden = true

    const startedAt = Date.now()
    const interval = setInterval(() => {
        if (Date.now() - startedAt > 60000) {
            clearInterval(interval)
            return
        }

        try {
            const module = window.__require && window.__require('FirstFaceToPlayerManager')
            const Manager = module && module.FirstFaceToPlayerManager
            const manager = Manager && Manager.instance
            if (!manager) return

            if (!manager.__snowKingOriginalSetActive) {
                manager.__snowKingOriginalSetActive = manager.setActive
            }
            manager.setActive = function () { }
            clearInterval(interval)
            console.log('[SnowKing] 首次登录弹窗已隐藏')
        } catch (error) { }
    }, 500)
})()
