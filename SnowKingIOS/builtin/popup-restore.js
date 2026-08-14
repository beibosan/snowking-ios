(function () {
    'use strict'

    window.__snowKingPopupHiddenDesired = false
    window.__snowKingFirstLoginPopupHidden = false

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

            if (manager.__snowKingOriginalSetActive) {
                manager.setActive = manager.__snowKingOriginalSetActive
                delete manager.__snowKingOriginalSetActive
                console.log('[SnowKing] 首次登录弹窗拦截已关闭')
            }
            clearInterval(interval)
        } catch (error) { }
    }, 500)
})()
