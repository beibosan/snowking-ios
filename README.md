# 雪花之王 iOS 兼容工程

这个目录是从现有 Android/WebView 版本整理出来的 iOS 工程骨架，入口为：

```text
SnowKingIOS/SnowKingIOS.xcodeproj
```

## 已实现

- 账号导入：通过 iOS 文件选择器导入 `.bin`，复制到 App 沙盒 `Documents/accounts`。
- 单开窗口：使用 `WKWebView` 加载内置 `www/index.html`。
- 多开窗口：支持横向多开和纵向四槽，多个账号各自创建独立 `WKWebView`。
- 剪贴板：保留 `Bridge`、`ClipboardBridge`、`ClipboardHostBridge`、`yunqiBridge` 名称。
- 账号 Bridge：保留 `AndroidBinBridge` 名称，并同步提供 `getBinData`、`getBinHex`、`getBinContentHash`、`getLoginInjectScript` 等方法。
- 并发 Bridge：保留 `ConcurrencyBridge.getMaxConcurrency()` 和 `getMaxRequestsPerFrame()`。
- 脚本注入：保留内置脚本开关，并支持从设置页导入/启用用户 `.js`。
- 阵容脚本：单开窗口会按设置注入 `lineup-manager.js`。

## iOS 边界

- iOS 的 `WKScriptMessageHandler` 是异步消息模型；本工程用页面加载前注入的 JS 对象模拟 Android 的同步 `@JavascriptInterface`。
- iOS 不支持 Android 风格的悬浮窗、后台常驻渲染和任意触摸事件转发；多开以 App 内多个 `WKWebView` 方式实现。
- 原生保存文件、选文件等能力在 iOS 上本质是异步授权流程，无法完全等价为同步 JS 返回值。

## 打包 IPA

需要在 macOS 上操作：

1. 用 Xcode 打开 `SnowKingIOS.xcodeproj`。
2. 选中 `SnowKing` target，设置 `Signing & Capabilities` 里的 Team。
3. 修改 `PRODUCT_BUNDLE_IDENTIFIER`，避免和其他 App 冲突。
4. 选择真机设备或 `Any iOS Device`。
5. 执行 `Product > Archive`。
6. 在 Organizer 里选择 `Distribute App` 导出 `.ipa`。

命令行方式示例：

```bash
xcodebuild -project SnowKingIOS.xcodeproj \
  -scheme SnowKing \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  archive \
  -archivePath build/SnowKing.xcarchive
```

导出 `.ipa` 还需要按你的证书类型准备 `ExportOptions.plist`。
