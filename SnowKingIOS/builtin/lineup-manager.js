// ==UserScript==
// @name         咸鱼之王
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  切阵容
// @author       gmm
// @match        *://*/*
// @run-at       document-idle
// @grant        unsafeWindow
// ==/UserScript==

//英雄字典
const HERO_DICT = {
    101: { name: "司马懿", type: "魏国", avatar: "/team/simayi.png" },
    102: { name: "郭嘉", type: "魏国", avatar: "/team/guojia.png" },
    103: { name: "关羽", type: "蜀国", avatar: "/team/guanyu.png" },
    104: { name: "诸葛亮", type: "蜀国", avatar: "/team/zhugeliang.png" },
    105: { name: "周瑜", type: "吴国", avatar: "/team/zhouyu.png" },
    106: { name: "太史慈", type: "吴国", avatar: "/team/taishici.png" },
    107: { name: "吕布", type: "群雄", avatar: "/team/lvbu.png" },
    108: { name: "华佗", type: "群雄", avatar: "/team/huatuo.png" },
    109: { name: "甄姬", type: "魏国", avatar: "/team/zhenji.png" },
    110: { name: "黄月英", type: "蜀国", avatar: "/team/huangyueying.png" },
    111: { name: "孙策", type: "吴国", avatar: "/team/sunce.png" },
    112: { name: "贾诩", type: "群雄", avatar: "/team/jiaxu.png" },
    113: { name: "曹仁", type: "魏国", avatar: "/team/caoren.png" },
    114: { name: "姜维", type: "蜀国", avatar: "/team/jiangwei.png" },
    115: { name: "孙坚", type: "吴国", avatar: "/team/sunjian.png" },
    116: { name: "公孙瓒", type: "群雄", avatar: "/team/gongsunzan.png" },
    117: { name: "典韦", type: "魏国", avatar: "/team/dianwei.png" },
    118: { name: "赵云", type: "蜀国", avatar: "/team/zhaoyun.png" },
    119: { name: "大乔", type: "吴国", avatar: "/team/daqiao.png" },
    120: { name: "张角", type: "群雄", avatar: "/team/zhangjiao.png" },
    121: { name: "鲁肃", type: "吴国", avatar: "/team/lusu.png" },
    201: { name: "徐晃", type: "魏国", avatar: "/team/xuhuang.png" },
    202: { name: "荀彧", type: "魏国", avatar: "/team/xunyu.png" },
    203: { name: "典韦", type: "魏国", avatar: "/team/xiaodianwei.png" },
    204: { name: "张飞", type: "蜀国", avatar: "/team/zhangfei.png" },
    205: { name: "赵云", type: "蜀国", avatar: "/team/xiaozhaoyun.png" },
    206: { name: "庞统", type: "蜀国", avatar: "/team/pangtong.png" },
    207: { name: "鲁肃", type: "吴国", avatar: "/team/xiaolusu.png" },
    208: { name: "陆逊", type: "吴国", avatar: "/team/luxun.png" },
    209: { name: "甘宁", type: "吴国", avatar: "/team/ganning.png" },
    210: { name: "貂蝉", type: "群雄", avatar: "/team/diaochan.png" },
    211: { name: "董卓", type: "群雄", avatar: "/team/dongzhuo.png" },
    212: { name: "张角", type: "群雄", avatar: "/team/xiaozhangjiao.png" },
    213: { name: "张辽", type: "魏国", avatar: "/team/zhangliao.png" },
    214: { name: "夏侯惇", type: "魏国", avatar: "/team/xiahoudun.png" },
    215: { name: "许褚", type: "魏国", avatar: "/team/xuzhu.png" },
    216: { name: "夏侯渊", type: "魏国", avatar: "/team/xiahouyuan.png" },
    217: { name: "魏延", type: "蜀国", avatar: "/team/weiyan.png" },
    218: { name: "黄忠", type: "蜀国", avatar: "/team/huangzhong.png" },
    219: { name: "马超", type: "蜀国", avatar: "/team/machao.png" },
    220: { name: "马岱", type: "蜀国", avatar: "/team/madai.png" },
    221: { name: "吕蒙", type: "吴国", avatar: "/team/lvmeng.png" },
    222: { name: "黄盖", type: "吴国", avatar: "/team/huanggai.png" },
    223: { name: "蔡文姬", type: "魏国", avatar: "/team/caiwenji.png" },
    224: { name: "小乔", type: "吴国", avatar: "/team/xiaoqiao.png" },
    225: { name: "袁绍", type: "群雄", avatar: "/team/yuanshao.png" },
    226: { name: "华雄", type: "群雄", avatar: "/team/huaxiong.png" },
    227: { name: "颜良", type: "群雄", avatar: "/team/yanliang.png" },
    228: { name: "文丑", type: "群雄", avatar: "/team/wenchou.png" },
    301: { name: "周泰", type: "吴国", avatar: "/team/zhoutai.png" },
    302: { name: "许攸", type: "魏国", avatar: "/team/xuyou.png" },
    303: { name: "于禁", type: "魏国", avatar: "/team/yujin.png" },
    304: { name: "张星彩", type: "蜀国", avatar: "/team/zhangxingcai.png" },
    305: { name: "关银屏", type: "蜀国", avatar: "/team/guanyinping.png" },
    306: { name: "关平", type: "蜀国", avatar: "/team/guanping.png" },
    307: { name: "程普", type: "吴国", avatar: "/team/chengpu.png" },
    308: { name: "张昭", type: "吴国", avatar: "/team/zhangzhao.png" },
    309: { name: "陆绩", type: "吴国", avatar: "/team/luji.png" },
    310: { name: "吕玲绮", type: "群雄", avatar: "/team/lvlingqi.png" },
    311: { name: "潘凤", type: "群雄", avatar: "/team/panfeng.png" },
    312: { name: "邢道荣", type: "群雄", avatar: "/team/xingdaorong.png" },
    313: { name: "祝融夫人", type: "蜀国", avatar: "/team/zhurongfuren.png" },
    314: { name: "孟获", type: "蜀国", avatar: "/team/menghuo.png" },
};

const LINEUP_RULES = [
    {
        name: "吴国",
        required: [106, 111],
        colorProps: { color: "#f5222d", textColor: "#fff" }, // 红
    },
    {
        name: "姜维",
        required: [114, 111],
        colorProps: { color: "#237804", textColor: "#fff" }, // 最深绿
    },
    {
        name: "毒爆",
        required: [108, 112, 120],
        colorProps: { color: "#722ed1", textColor: "#fff" }, // 紫
    },
    {
        name: "吕赵",
        required: [107, 116, 118],
        colorProps: { color: "#faad14", textColor: "#fff" }, // 浅橙/金
    },
    {
        name: "三蜀",
        required: [104, 110, 118],
        colorProps: { color: "#389e0d", textColor: "#fff" }, // 中深绿
    },
    {
        name: "典韦",
        required: [117, 113],
        colorProps: { color: "#40a9ff", textColor: "#fff" }, // 浅蓝
    },
    {
        name: "司马懿",
        required: [101, 113],
        colorProps: { color: "#0050b3", textColor: "#fff" }, // 深蓝
    },
    {
        name: "关羽",
        required: [103],
        colorProps: { color: "#73d13d", textColor: "#fff" }, // 浅绿
    },
    {
        name: "吕布",
        required: [107, 116],
        forbidden: [118],
        colorProps: { color: "#f06f44ff", textColor: "#fff" }, // 深橙/红橙
    },
    {
        name: "控制毒",
        required: [120, 104, 110],
        colorProps: { color: "#722ed1", textColor: "#fff" }, // 紫
    },
    {
        name: "控制吴",
        required: [105, 104, 110],
        colorProps: { color: "#f5222d", textColor: "#fff" }, // 紫
    },
];

//鱼珠字典
const PearlMap = {
    1033007: { name: "碎盾" },
    1033008: { name: "冥想" },
    1033009: { name: "定心" },
    1033010: { name: "冰清" },
    1033011: { name: "攻心" },
    1033012: { name: "强权" },
    1033013: { name: "盾击" },
    1033014: { name: "合力" },
    1033015: { name: "仁心" },
    1033016: { name: "游龙" },
    1033017: { name: "回元" },
};

const FishMap = {
    1201: { name: "龙鱼·幽影" },
    1202: { name: "龙鱼·青龙" },
    1203: { name: "龙鱼·火镰" },
    1204: { name: "龙鱼·无双" },
    1205: { name: "龙鱼·永霜" },
    1206: { name: "龙鱼·八卦" },
    1207: { name: "龙鱼·紫电" },
    1208: { name: "龙鱼·青囊" },
    1209: { name: "龙鱼·洛神" },
    1210: { name: "龙鱼·机神" },
    1211: { name: "龙鱼·霸王" },
    1212: { name: "龙鱼·蚀骨" },
    1213: { name: "龙鱼·坚盾" },
    1214: { name: "龙鱼·麒麟" },
    1215: { name: "龙鱼·古锭" },
    1216: { name: "龙鱼·义从" },
    1217: { name: "龙鱼·恶来" },
    1218: { name: "龙鱼·龙胆" },
    1219: { name: "龙鱼·国色" },
    1220: { name: "龙鱼·天公" },

    1301: { name: "月尾" },
    1302: { name: "焰神" },
    1303: { name: "红蝶" },
    1304: { name: "赤羽" },
    1305: { name: "千年笛" },

    1401: { name: "四带胡椒" },
    1402: { name: "鬼狮子鱼" },
    1403: { name: "黑斑雀鲷" },
    1404: { name: "诅咒花椒" },
    1405: { name: "九斑刺豚" },
    1406: { name: "魔鬼刺镰" },
    1407: { name: "黄背刺鲷" },
    1408: { name: "黑鳍刺鲷" },
    1409: { name: "长棘刺鲷" },
    1410: { name: "粒突箱鲀" },
    1411: { name: "大跳跳鱼" },
    1412: { name: "蓝心胖头" },

    1501: { name: "钱胡椒" },
    1502: { name: "狮子鱼" },
    1503: { name: "塔雀鲷" },
    1504: { name: "紫斑鳅" },
    1505: { name: "密刺豚" },
    1506: { name: "长鳍镰" },

    1601: { name: "胖头鱼" },
    1602: { name: "青刺鲷" },
    1603: { name: "跳跳鱼" },
    1604: { name: "箱豚鱼" },

    1101: { name: "黄金锦鲤" },
    1102: { name: "利刃" },
    1103: { name: "惊涛" },
    1104: { name: "骇浪" },
    1105: { name: "星驰" },
    1106: { name: "公同心" },
    1107: { name: "母同心" },
    1108: { name: "公协力" },
    1109: { name: "母协力" },
    1110: { name: "月光" },
    1111: { name: "公铁血" },
    1112: { name: "母铁血" },
    1113: { name: "公丹心" },
    1114: { name: "母丹心" },
    1115: { name: "巨灵" },
    1116: { name: "公剑胆" },
    1117: { name: "母剑胆" },
    1118: { name: "璇玑" },
    1119: { name: "公琴心" },
    1120: { name: "母琴心" },
    1121: { name: "回响" },
};

//洗练颜色
const xiLianColor = {
    1: { color: "白色", value: "white" },
    2: { color: "绿色", value: "green" },
    3: { color: "蓝色", value: "blue" },
    4: { color: "紫色", value: "purple" },
    5: { color: "橙色", value: "orange" },
    6: { color: "红色", value: "red" },
};

const weapon = {
    1: "一支穿云箭",
    2: "皮鞋手机",
    3: "懦弱百合",
    4: "正义喇叭",
    5: "祖传大饼",
    6: "冰镇啤酒",
    7: "导演话筒",
    8: "驱蚊花露水",
    9: "止痒花露水",
};

const legacycolor = {
    1: { name: "虾米", value: "green" },
    2: { name: "入门", value: "blue" },
    3: { name: "高手", value: "purple" },
    4: { name: "宗师", value: "orange" },
    5: { name: "泰斗", value: "red" },
    6: { name: "至尊", value: "gold" },
    7: { name: "珍·至尊", value: "gold" },
};

(function () {
    'use strict';

    // 适配页面上下文（油猴中通过 unsafeWindow 访问页面对象）
    const pageWindow = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;
    let presetteamInfo = null;

    // 将字典数据复制到 IIFE 内部，确保可以访问
    const HERO_DICT_LOCAL = HERO_DICT;
    const FishMap_LOCAL = FishMap;
    const weapon_LOCAL = weapon;

    // ===== 导出桥接（DownloadBridge）=====
    // 检测是否为 PC 端（Windows 系统且非移动设备）
    var isPC = typeof navigator !== 'undefined' &&
               /Win32|Win64|Windows/.test(navigator.userAgent) &&
               !/Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    // PC端直接导出到 Downloads 根目录，避免子目录创建失败导致文件丢失
    var defaultTargetDir = isPC ? 'Downloads' : 'Download';

    if (!window.DownloadBridge) {
        window.DownloadBridge = {
            saveBase64: function (fileName, mimeType, base64Data) {
                var targetDir = defaultTargetDir;
                var path = targetDir + '/' + fileName;
                try {
                    window.parent.postMessage({
                        type: 'SAVE_DOWNLOAD_FILE',
                        data: {
                            fileName: fileName,
                            mimeType: mimeType || 'application/json',
                            b64: base64Data,
                            targetDir: targetDir,
                            platform: isPC ? 'pc' : 'mobile'
                        }
                    }, '*');

                    try {
                        var backupKey = '__download_backup__' + fileName;
                        localStorage.setItem(backupKey, JSON.stringify({
                            b64: base64Data,
                            mime: mimeType || 'application/json',
                            time: Date.now()
                        }));
                        var backupKeys = [];
                        for (var i = 0; i < localStorage.length; i++) {
                            var k = localStorage.key(i);
                            if (k && k.indexOf('__download_backup__') === 0) backupKeys.push(k);
                        }
                        if (backupKeys.length > 5) {
                            backupKeys.sort();
                            for (var j = 0; j < backupKeys.length - 5; j++) {
                                localStorage.removeItem(backupKeys[j]);
                            }
                        }
                    } catch (e) { }

                    return path;
                } catch (e) {
                    console.error('[DownloadBridge] saveBase64 error:', e);
                    return null;
                }
            }
        };
        console.log('[DownloadBridge] ✅ 已就绪, 导出目录: ' + defaultTargetDir + '/');
    }

    // ===================== 1. 全局工具函数 ======================
    // 英雄头像 URL 缓存（heroId -> url，仅缓存成功结果）
    const _heroIconUrlCache = new Map();
    // 通过游戏的 cc.assetManager + AvatarConf 获取英雄真实头像 URL
    // 参考模拟对战.js：通过 window.__require('Configs') 获取 AvatarConf
    function loadHeroIconUrl(heroId) {
        if (!heroId) return Promise.resolve('');
        const key = String(heroId);
        if (_heroIconUrlCache.has(key)) return Promise.resolve(_heroIconUrlCache.get(key));
        try {
            const win = pageWindow;
            const req = win.__require || win.require;
            if (typeof req !== 'function') return Promise.resolve('');
            let Configs = null;
            try { Configs = req('Configs'); } catch (e) { }
            if (!Configs || !Configs.AvatarConf) return Promise.resolve('');
            const avatarConf = Configs.AvatarConf.getById ? Configs.AvatarConf.getById(parseInt(heroId)) : null;
            const iconPath = avatarConf && avatarConf.smallHeadIcon;
            if (!iconPath) return Promise.resolve('');
            const cc = win.cc;
            const iconsBundle = cc && cc.assetManager && cc.assetManager.bundles.get('icons');
            if (!iconsBundle) return Promise.resolve('');
            return new Promise((resolve) => {
                iconsBundle.load(iconPath, cc.Texture2D, (err, texture) => {
                    if (err || !texture) { resolve(''); return; }
                    let url = texture.nativeUrl || texture.url || texture._nativeUrl || '';
                    if (url.startsWith('assets/')) {
                        url = 'https://xxz-xyzw-res.hortorgames.com/remote/' + url.substring(7);
                    }
                    _heroIconUrlCache.set(key, url);
                    resolve(url);
                });
            });
        } catch (e) {
            return Promise.resolve('');
        }
    }

    // 给一个已经创建好的元素异步设置真实头像（成功后用 <img> 覆盖原占位文本）
    function applyHeroIcon(containerEl, heroId) {
        if (!containerEl || !heroId) return;
        loadHeroIconUrl(heroId).then((url) => {
            if (!url) return;
            const img = document.createElement('img');
            img.src = url;
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;';
            img.onerror = function () {
                if (this.src.endsWith('.png')) this.src = this.src.replace('.png', '.pvr');
                else if (this.src.endsWith('.pvr')) this.src = this.src.replace('.pvr', '.png');
                else this.style.display = 'none';
            };
            containerEl.innerHTML = '';
            containerEl.appendChild(img);
        }).catch(() => { });
    }

    // 显示浮窗提示（带进度和类型）
    function showTip(text, type = 'info') {
        const tip = document.createElement('div');
        tip.innerText = `${text}`;
        tip.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff5555' : '#2196F3'};
                color: #fff;
                padding: 8px 24px;
                border-radius: 8px;
                font-family: 'Microsoft YaHei', Arial;
                font-size: 14px;
                z-index: 100000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                min-width: 320px;
                text-align: center;
                animation: slideIn 0.3s, fadeOut 0.3s 2.7s;
            `;
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 3000);
    }



    // 延迟函数
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // ===================== IndexDB 相关函数 ======================
    const DB_NAME = 'XianyuKingDB';
    const STORE_NAME = 'lineups';

    // 初始化 IndexDB
    const initIndexDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                }
            };
        });
    };

    // 从 IndexDB 读取数据
    const readFromIndexDB = async (key) => {
        try {
            const db = await initIndexDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(key);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result?.value || null);
            });
        } catch (e) {
            console.error('从 IndexDB 读取失败:', e);
            return null;
        }
    };

    // 写入数据到 IndexDB
    const writeToIndexDB = async (key, value) => {
        try {
            const db = await initIndexDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ key, value });

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(true);
            });
        } catch (e) {
            console.error('写入 IndexDB 失败:', e);
            return false;
        }
    };

    // 迁移 localStorage 数据到 IndexDB
    const migrateLocalStorageToIndexDB = async () => {
        try {
            const keys = Object.keys(localStorage);
            const lineupKeys = keys.filter(k => k.startsWith('saved_lineups_'));

            for (const key of lineupKeys) {
                const data = localStorage.getItem(key);
                if (data) {
                    await writeToIndexDB(key, JSON.parse(data));
                    localStorage.removeItem(key);
                    console.log(`已迁移并删除 ${key} 的 localStorage 数据`);
                }
            }

            if (lineupKeys.length > 0) {
                console.log(`成功迁移 ${lineupKeys.length} 个键的数据到 IndexDB`);
            }
        } catch (e) {
            console.error('迁移数据失败:', e);
        }
    };

    // 在脚本开始时执行数据迁移
    migrateLocalStorageToIndexDB().catch(e => console.error('初始化迁移失败:', e));

    // ===================== 缓存相关函数（全局） ======================
    // 获取缓存key - 使用 saved_lineups_ + roleId
    const getCacheKey = () => {
        const roleId = pageWindow.ROLE?.roleId || 'default';
        return `saved_lineups_${roleId}`;
    };

    // 从 IndexDB 加载缓存数据（返回数组）
    const loadFromCache = async () => {
        try {
            const key = getCacheKey();
            const data = await readFromIndexDB(key);
            return data || [];
        } catch (e) {
            console.error('加载缓存失败:', e);
            return [];
        }
    };

    // 保存阵容到 IndexDB（数组格式，追加）
    const saveLineupToCache = async (lineupData) => {
        try {
            const key = getCacheKey();
            const existing = await loadFromCache();
            existing.unshift(lineupData); // 添加到数组开头
            await writeToIndexDB(key, existing);
            return existing;
        } catch (e) {
            console.error('保存缓存失败:', e);
            return null;
        }
    };

    // 清空缓存
    const clearCache = async () => {
        try {
            const db = await initIndexDB();
            const key = getCacheKey();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(key);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    showTip('缓存已清空', 'success');
                    resolve(true);
                };
            });
        } catch (e) {
            console.error('清空缓存失败:', e);
        }
    };

    // ===================== 2. 初始化配置 ======================
    const config = {
        isArena: false,
    };

    // ===================== 3. 创建控制面板 ======================
    (function createUI() {
        // 避免重复注入
        if (document.getElementById('arenaPanel')) return;

        // 主面板（默认隐藏）
        const panel = document.createElement('div');
        panel.id = 'arenaPanel';
        panel.style.cssText = `
                position: fixed;
                left:5%;
                right:5%;
                top: 60px;
                bottom: 60px;
                overflow-y:scroll;
                scrollbar-width: none;
                background: #1e1e1e;
                border: 1px solid #555;
                border-radius: 8px;
                color: #fff;
                padding: 16px;
                z-index: 10000;
                font-family: Arial;
                font-size: 13px;
                box-shadow: 0 6px 16px rgba(0,0,0,0.4);
                display: none;
            `;
        document.body.appendChild(panel);

        // ----- 浮动入口图标（悬浮球） -----
        /****
        if (document.getElementById('lineupFloatingBtn')) return;
        const floatBtn = document.createElement('div');
        floatBtn.id = 'lineupFloatingBtn';
        floatBtn.innerHTML = '⚔';
        floatBtn.title = '打开阵容管理';
        floatBtn.style.cssText = `
                position: fixed;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                font-size: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10001;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
                transition: all 0.3s ease;
                user-select: none;
                font-family: Arial, sans-serif;
            `;
        floatBtn.onmouseenter = () => {
            floatBtn.style.transform = 'translateY(-50%) scale(1.12)';
            floatBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.7)';
        };
        floatBtn.onmouseleave = () => {
            floatBtn.style.transform = 'translateY(-50%) scale(1)';
            floatBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.5)';
        };
        floatBtn.onclick = () => {
            if (typeof window.__openLineupPanel === 'function') {
                window.__openLineupPanel();
            }
        };
        document.body.appendChild(floatBtn);
    })();
*/

        // ----- 浮动入口图标（悬浮球）：已迁移至游戏面板内定位 -----
    })();

    // ===================== 注入按钮到游戏阵容面板（定位参考 队伍切换优化版） ======================
    function injectButtonToGamePanel() {
        let checkCount = 0;
        const maxChecks = 120;

        const interval = setInterval(() => {
            checkCount++;
            if (checkCount >= maxChecks) {
                clearInterval(interval);
                console.error('[切阵容] 注入超时');
                return;
            }

            if (typeof unsafeWindow.__require !== 'function' || typeof unsafeWindow.fgui !== 'object') {
                return;
            }

            try {
                const HeroTeamPanel = unsafeWindow.__require('HeroTeamPanel');
                if (!HeroTeamPanel || !HeroTeamPanel.HeroTeamPanel) return;

                clearInterval(interval);
                hookHeroTeamPanel(HeroTeamPanel.HeroTeamPanel);
            } catch (e) {
                // 模块尚未加载，继续等待
            }
        }, 500);
    }

    function hookHeroTeamPanel(PanelClass) {
        const originalOnShow = PanelClass.prototype.onShow;

        PanelClass.prototype.onShow = function () {
            originalOnShow.apply(this, arguments);

            if (!this._customLineupBtn) {
                try {
                    addCustomButton(this);
                } catch (e) {
                    console.error('[切阵容] 创建按钮失败:', e);
                }
            }
        };

        // 面板隐藏时清理
        const originalOnHide = PanelClass.prototype.onHide;
        PanelClass.prototype.onHide = function () {
            if (this._customLineupBtn) {
                this._customLineupBtn.dispose();
                this._customLineupBtn = null;
            }
            originalOnHide.apply(this, arguments);
        };
    }

    function addCustomButton(panel) {
        const helpButton = panel.ui.m_btnHelp;
        if (!helpButton) {
            console.error('[切阵容] 找不到帮助按钮');
            return;
        }

        const customButton = unsafeWindow.fgui.UIPackage.createObject('ui_common', 'BtnInfo2');
        if (!customButton) {
            console.error('[切阵容] 创建按钮失败');
            return;
        }

        const btn = customButton.asButton;

        // 大小 = 帮助按钮大小（同队伍切换优化版）
        btn.setSize(helpButton.width, helpButton.height);

        // 定位：帮助按钮左侧 10px（同队伍切换优化版）
        const buttonSpacing = 10;
        btn.setPosition(
            helpButton.x - btn.width - buttonSpacing,
            helpButton.y
        );

        btn.icon = '';
        btn.title = '';

        // 隐藏按钮内部的三条横线图标
        try {
            if (btn.numChildren > 0) {
                for (let i = 0; i < btn.numChildren; i++) {
                    const child = btn.getChildAt(i);
                    if (child && child.name === 'n0') {
                        child.visible = false;
                    }
                }
            }
        } catch (e) {
            console.error('[切阵容] 隐藏子元素失败:', e);
        }

        // 添加 ⚔ 文字标签（图标样式保持不变）
        try {
            const textField = new unsafeWindow.fgui.GTextField();
            textField.name = 'customLabel';
            textField.text = '⚔';
            textField.fontSize = 28;
            textField.bold = true;
            textField.color = 0xffffff;
            textField.singleLine = true;

            textField.shadowOffset = new unsafeWindow.cc.Vec2(0, 2);
            textField.shadowColor = new unsafeWindow.cc.Color(122, 69, 48, 200);

            const textX = (btn.width - 28) / 2;
            const textY = (btn.height - 28) / 2 - 5;
            textField.setPosition(textX, textY);

            textField.visible = true;
            textField.touchable = false;

            btn.addChild(textField);
            try { btn.setChildIndex(textField, btn.numChildren - 1); } catch (_) { }
        } catch (e) {
            console.error('[切阵容] 添加文字失败:', e);
        }

        // 点击事件：打开阵容管理面板
        btn.onClick(() => {
            console.log('[切阵容] 打开阵容管理');
            if (typeof window.__openLineupPanel === 'function') {
                window.__openLineupPanel();
            }
        });

        panel.ui.addChild(btn);
        panel._customLineupBtn = btn;
    }

    // 原生应用使用顶部“阵容保存”按钮作为唯一入口。



		//注入面板结束
		
		
    async function sendWithPromise(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await pageWindow.ws.sendAsync(params);
                resolve(res.rawData)
            } catch (e) {
                reject()
            }

        })

    }

    const COMMAND_DELAY = 100;

    async function applyLineup(lineup) {
        try {
            showTip(`正在应用阵容: ${lineup.name}...`, 'info');

            const presetTeamResult = await sendWithPromise({ cmd: 'presetteam_getinfo', params: {} });
            await delay(COMMAND_DELAY);

            const currentTeamId = presetTeamResult?.useTeamId || presetTeamResult?.presetTeamInfo?.useTeamId || 1;

            if (lineup.teamId !== currentTeamId) {
                //showTip(`此阵容仅适用于阵容槽位 ${lineup.teamId}，当前槽位为 ${currentTeamId}`, 'error');              
                await sendWithPromise({ cmd: 'presetteam_saveteam', params: {"teamId":lineup.teamId} });
                //return;      //改为先切换到目标阵容，再执行更换阵容
            }

            lineup.applying = true;
            const errors = [];

            const getTeamHeroes = (data) => {
                const { battleTeam, heros } = data;
                if (!battleTeam) return [];
                const battleTeamHeroes = [];
                for (const [id, hero] of heroes.entries()) {
                    for (const [id2, hero2] of battleTeam.entries()) {
                        if (hero.value.heroId === hero2.value.heroId) {
                            battleTeamHeroes.push(hero.value);
                        }
                    }

                }
                return battleTeamHeroes.
                    map((h) => {
                        return {
                            ...h,
                            position: h.battleTeamSlot,
                        }
                    }).
                    sort((a, b) => a.position - b.position);
            };

            const fetchLatestData = async (teamId = null) => {
                const roleInfo = pageWindow.ROLE
                await delay(COMMAND_DELAY);
                const heroes = roleInfo.heroes._data || {};
                const battleTeam = roleInfo.battleTeam._data || {};
                const pearlMapData = roleInfo.pearlMap || roleInfo?.pearlMap || {};
                const artifactBooksData = roleInfo.artifactBooks || roleInfo?.artifactBooks || {};
                const targetTeamId = teamId || currentTeamId;
                return {
                    heroes,
                    battleTeam,
                    pearlMap: pearlMapData,
                    artifactBooks: artifactBooksData,
                };
            };

            const targetHeroes = [...(lineup.heroes || [])];

            let data = await fetchLatestData();
            const { heroes } = data
            let currentHeroes = getTeamHeroes(data);

            const currentHeroIds = new Set(currentHeroes.map((h) => h.heroId));
            const targetHeroIds = new Set(targetHeroes.map((h) => h.heroId));

            // ===== 装备匹配工具函数 =====
            // 比较两个 quenches 数组的相似度（返回匹配的属性数量）
            function calcQuenchSimilarity(savedQuenches, currentQuenches) {
                if (!savedQuenches || !currentQuenches) return 0;
                let score = 0;
                for (const sq of savedQuenches) {
                    for (const cq of currentQuenches) {
                        if (sq.attrId === cq.attrId && sq.attrNum === cq.attrNum && sq.colorId === cq.colorId) {
                            score++;
                            break;
                        }
                    }
                }
                return score;
            }

            // 计算一套装备（4件）的总相似度
            function calcEquipSetSimilarity(savedEquips, heroEquips) {
                if (!savedEquips || !heroEquips) return 0;
                let totalScore = 0;
                for (let i = 0; i < Math.min(savedEquips.length, heroEquips.length); i++) {
                    const saved = savedEquips[i];
                    const current = heroEquips[i]?.bindServerData || {};
                    const quenchesRaw = current.quenches instanceof Map ? Array.from(current.quenches.values()) : Object.values(current.quenches || {});
                    const quenches2Raw = current.quenches2 instanceof Map ? Array.from(current.quenches2.values()) : Object.values(current.quenches2 || {});
                    const curQuenches = quenchesRaw.map(q => ({
                        attrId: q.value?.attrId ?? q.attrId,
                        attrNum: q.value?.attrNum ?? q.attrNum,
                        colorId: q.value?.colorId ?? q.colorId,
                    }));
                    const curQuenches2 = quenches2Raw.map(q => ({
                        attrId: q.value?.attrId ?? q.attrId,
                        attrNum: q.value?.attrNum ?? q.attrNum,
                        colorId: q.value?.colorId ?? q.colorId,
                    }));
                    totalScore += calcQuenchSimilarity(saved.quenches, curQuenches);
                    totalScore += calcQuenchSimilarity(saved.quenches2, curQuenches2);
                }
                return totalScore;
            }

            // 根据 equips 数据找到装备持有者
            // 优先 enchantUId 精确匹配，否则用 quenches 相似度匹配
            function findEquipHolder(savedEquips, allHeroes, targetHeroId) {
                if (!savedEquips || savedEquips.length === 0) {
                    console.debug('[装备匹配] savedEquips 为空，跳过');
                    return null;
                }

                // 检查是否所有装备都是空的（无enchantUId，无quenches）
                const allEmpty = savedEquips.every(eq =>
                    (!eq.enchantUId || eq.enchantUId === 0) &&
                    (!eq.enchantUId2 || eq.enchantUId2 === 0) &&
                    (!eq.quenches || eq.quenches.length === 0) &&
                    (!eq.quenches2 || eq.quenches2.length === 0)
                );
                if (allEmpty) {
                    console.debug(`[装备匹配] 保存的装备全为空，寻找当前装备也为空的英雄...`);
                    // 找一个当前装备也全空的英雄
                    for (const [id, hero] of allHeroes.entries()) {
                        const heroEquips = hero.value?.equips || [];
                        if (heroEquips.length === 0) continue;
                        const heroAllEmpty = heroEquips.every(equip => {
                            const sd = equip.bindServerData || {};
                            const q = sd.quenches instanceof Map ? sd.quenches.size : Object.keys(sd.quenches || {}).length;
                            const q2 = sd.quenches2 instanceof Map ? sd.quenches2.size : Object.keys(sd.quenches2 || {}).length;
                            return (!sd.enchantUId || sd.enchantUId === 0) &&
                                (!sd.enchantUId2 || sd.enchantUId2 === 0) &&
                                q === 0 && q2 === 0;
                        });
                        if (heroAllEmpty) {
                            console.debug(`[装备匹配] ✅ 找到装备全空的英雄: ${id}`);
                            return Number(id);
                        }
                    }
                    console.debug(`[装备匹配] ❌ 未找到装备全空的英雄，直接使用目标英雄 ${targetHeroId}`);
                    return targetHeroId;
                }

                console.debug('[装备匹配] 开始匹配，保存的装备数据:', JSON.stringify(savedEquips));

                // 条件1：优先根据 enchantUId 匹配
                for (const savedEquip of savedEquips) {
                    if (savedEquip.enchantUId && savedEquip.enchantUId !== 0) {
                        console.debug(`[装备匹配] 尝试 enchantUId 精确匹配: ${savedEquip.enchantUId}`);
                        for (const [id, hero] of allHeroes.entries()) {
                            const heroEquips = hero.value?.equips || [];
                            for (const equip of heroEquips) {
                                const sd = equip.bindServerData || {};
                                if (sd.enchantUId === savedEquip.enchantUId || sd.enchantUId2 === savedEquip.enchantUId) {
                                    console.debug(`[装备匹配] ✅ enchantUId ${savedEquip.enchantUId} 精确匹配到英雄 ${id}`);
                                    return Number(id);
                                }
                            }
                        }
                        console.debug(`[装备匹配] enchantUId ${savedEquip.enchantUId} 未找到匹配`);
                    }
                    if (savedEquip.enchantUId2 && savedEquip.enchantUId2 !== 0) {
                        console.debug(`[装备匹配] 尝试 enchantUId2 精确匹配: ${savedEquip.enchantUId2}`);
                        for (const [id, hero] of allHeroes.entries()) {
                            const heroEquips = hero.value?.equips || [];
                            for (const equip of heroEquips) {
                                const sd = equip.bindServerData || {};
                                if (sd.enchantUId === savedEquip.enchantUId2 || sd.enchantUId2 === savedEquip.enchantUId2) {
                                    console.debug(`[装备匹配] ✅ enchantUId2 ${savedEquip.enchantUId2} 精确匹配到英雄 ${id}`);
                                    return Number(id);
                                }
                            }
                        }
                        console.debug(`[装备匹配] enchantUId2 ${savedEquip.enchantUId2} 未找到匹配`);
                    }
                }

                console.debug('[装备匹配] enchantUId 匹配失败，开始 quenches 相似度匹配...');

                // 条件2：根据 quenches 相似度匹配
                let bestMatchId = null;
                let bestScore = 0;
                const scoreMap = [];
                for (const [id, hero] of allHeroes.entries()) {
                    const heroEquips = hero.value?.equips || [];
                    const score = calcEquipSetSimilarity(savedEquips, heroEquips);
                    if (score > 0) {
                        scoreMap.push({ heroId: Number(id), score });
                    }
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatchId = Number(id);
                    }
                }

                // 打印前5名得分
                scoreMap.sort((a, b) => b.score - a.score);
                console.debug('[装备匹配] 相似度前5名:', JSON.stringify(scoreMap.slice(0, 5)));

                // 计算匹配度百分比（总可能得分 = 所有装备的 quenches + quenches2 属性总数）
                const totalPossible = savedEquips.reduce((sum, eq) => {
                    return sum + (eq.quenches?.length || 0) + (eq.quenches2?.length || 0);
                }, 0);
                const matchPercent = totalPossible > 0 ? (bestScore / totalPossible) * 100 : 0;
                console.debug(`[装备匹配] 匹配度: ${matchPercent.toFixed(1)}% (${bestScore}/${totalPossible})`);

                if (matchPercent <= 90) {
                    console.debug(`[装备匹配] ❌ 匹配度 ${matchPercent.toFixed(1)}% <= 90%，无法匹配`);
                    return null;
                }

                console.debug(`[装备匹配] ✅ quenches 相似度匹配到英雄 ${bestMatchId}，得分: ${bestScore}`);
                return bestMatchId;
            }

            showTip('正在上阵英雄...', 'warning');
            currentHeroIds.clear();
            currentHeroes.forEach((h) => currentHeroIds.add(h.heroId));

            // 先处理有装备的英雄（按位置顺序）
            showTip('正在处理装备匹配...', 'warning');

            // 按位置顺序处理（0-4）
            for (let position = 0; position < 5; position++) {
                const targetHero = targetHeroes.find(h => h.position === position);
                if (!targetHero || !targetHero.equips || targetHero.equips.length === 0) {
                    // 兼容旧数据：如果没有 equips 但有 attachmentUid，跳过
                    if (!targetHero || (!targetHero.attachmentUid || targetHero.attachmentUid === -1)) {
                        console.debug(`[布阵] 位置 ${position}: 无目标英雄或无装备数据，跳过`);
                        continue;
                    }
                }

                console.debug(`[布阵] ===== 处理位置 ${position}, 目标英雄: ${targetHero.heroId} =====`);
                console.debug(`[布阵] 目标英雄保存的equips:`, JSON.stringify(targetHero.equips?.map(e => ({
                    part: e.part,
                    enchantUId: e.enchantUId,
                    enchantUId2: e.enchantUId2,
                    quenchesCount: e.quenches?.length || 0,
                    quenches2Count: e.quenches2?.length || 0,
                }))));

                // 获取最新数据
                const latestData = await fetchLatestData();
                const latestHeroes = latestData.heroes;
                currentHeroes = getTeamHeroes(latestData);

                // 用新的 equips 匹配逻辑找到装备持有者
                let targetHolderId = null;
                if (targetHero.equips && targetHero.equips.length > 0) {
                    targetHolderId = findEquipHolder(targetHero.equips, latestHeroes, targetHero.heroId);
                }

                if (!targetHolderId) {
                    console.debug(`[布阵] 位置 ${position}: 未匹配到装备持有者，跳过`);
                    continue;
                }

                // 检查匹配到的是不是目标英雄自己
                if (targetHolderId === targetHero.heroId) {
                    console.debug(`[布阵] 位置 ${position}: 装备持有者就是目标英雄 ${targetHolderId}，直接上阵即可`);
                }

                console.debug(`[布阵] 位置 ${position}: 装备匹配结果 -> 持有者英雄ID: ${targetHolderId}`);


                const targetHolderInTeam = currentHeroes.find(h => h.heroId === targetHolderId);

                console.log('curQuenchs:', targetHero.curQuenchs, targetHolderInTeam);
                //翻面
                if (targetHero.curQuenchs && targetHolderInTeam) {
                    const curQuenchs = targetHero.curQuenchs;
                    for (let i = 0; i < curQuenchs.length; i++) {
                        if (curQuenchs[i] != targetHolderInTeam.equips[i].bindServerData.curQuenchId) {
                            console.log(`发现curQuenchId不匹配，需要翻面，位置: ${i + 1}`);
                            await sendWithPromise({ cmd: 'equipment_changequench', params: { heroId: targetHolderInTeam.heroId, part: i + 1 } });
                        }
                    }
                }



                // 检查目标attachmentUid是否已经在其他地方上阵
                if (targetHolderInTeam) {
                    // 目标持有者已在阵容，检查是否在目标位置
                    if (targetHolderInTeam.position !== position) {


                        // 目标持有者在其他位置
                        const holderPosition = targetHolderInTeam.position;
                        const heroAtTargetPosition = currentHeroes.find(h => h.position === position);

                        // 第一步：先下阵holder的位置
                        try {
                            console.log(`第一步：下阵holder ${targetHolderId} 从位置 ${holderPosition}`);
                            await sendWithPromise({
                                cmd: 'hero_gobackbattle',
                                params: { slot: holderPosition }
                            });
                            console.log(`已下阵: ${targetHolderId} 从位置 ${holderPosition}`);
                        } catch (err) {
                            console.error('下阵holder失败:', err);
                        }
                        await delay(COMMAND_DELAY);

                        // 第二步：如果目标位置有英雄，先上到holder的位置
                        if (heroAtTargetPosition) {
                            try {
                                console.log(`第二步：上阵 ${heroAtTargetPosition.heroId} 到位置 ${holderPosition}`);
                                await sendWithPromise({
                                    cmd: 'hero_gointobattle',
                                    params: {
                                        heroId: heroAtTargetPosition.heroId,
                                        slot: holderPosition
                                    }
                                });
                                console.log(`已上阵: ${heroAtTargetPosition.heroId} 到位置 ${holderPosition}`);
                            } catch (err) {
                                console.error('上阵英雄失败:', err);
                            }
                            await delay(COMMAND_DELAY);
                        }

                        // 第三步：把holder上到target的位置
                        try {
                            console.log(`第三步：上阵holder ${targetHolderId} 到位置 ${position}`);
                            await sendWithPromise({
                                cmd: 'hero_gointobattle',
                                params: {
                                    heroId: targetHolderId,
                                    slot: position
                                }
                            });
                            console.log(`已上阵: ${targetHolderId} 到位置 ${position}`);
                        } catch (err) {
                            console.error('上阵holder失败:', err);
                        }
                        await delay(COMMAND_DELAY);
                    } else {
                        console.log(`目标持有者 ${targetHolderId} 已在位置 ${position}，无需操作`);
                    }
                } else {
                    // 目标持有者不在阵容
                    // 先检查目标位置是否有英雄
                    const currentHeroAtPosition = currentHeroes.find(h => h.position === position);

                    if (currentHeroAtPosition) {
                        // 位置有英雄，先下阵（加trycatch）
                        try {
                            console.log(`下阵英雄: ${currentHeroAtPosition.heroId} 从位置 ${position}`);
                            await sendWithPromise({
                                cmd: 'hero_gobackbattle',
                                params: { slot: position }
                            });
                            console.log(`已下阵: ${currentHeroAtPosition.heroId} 从位置 ${position}`);
                        } catch (err) {
                            console.error('下阵失败:', err);
                        }
                        await delay(COMMAND_DELAY);
                    }

                    // 再上阵目标持有者
                    try {
                        console.log(`上阵英雄: ${targetHolderId} 到位置 ${position}`);
                        await sendWithPromise({
                            cmd: 'hero_gointobattle',
                            params: {
                                heroId: targetHolderId,
                                slot: position
                            }
                        });
                        console.log(`已上阵: ${targetHolderId} 到位置 ${position}`);
                    } catch (err) {
                        console.error('上阵失败:', err);
                    }
                    await delay(COMMAND_DELAY);
                }
                // await delay(5000);
            }


            //保存记录attachhmentuid和几号装备
            console.log(`enchantMap:`, lineup.enchantMap);
            console.log(`now enchantMap:`, pageWindow.ROLE.enchantMap);
            //{"当前装备id":"提供赐福装备id"}

            if (lineup.enchantMap) {
                const keys = Object.keys(lineup.enchantMap)
                const values = Object.values(lineup.enchantMap)
                //{"提供赐福装备id":"当前装备id}
                // 直接遍历 entries，同时获取 key 和 value
                for (const [key, value] of Object.entries(lineup.enchantMap)) {
                    // 直接使用 value 和 key
                    console.log(`key: ${key}, value: ${value}`);
                    let holder = findHolderByEnchantUId(Number(key), heroes)
                    //根据key（提供者id）去遍历最新的map，看看是否有，有的话根据持有者的value去获得持有者的数据
                    let nowKeyHolder = null
                    let nowKeyHolderValue = null
                    let nowValueHolder = null
                    let nowValueHolderKey = null
                    for (const [key2, value2] of pageWindow.ROLE.enchantMap.entries()) {
                        if (key2 == key) {
                            console.log(`最新nowKeyHolder持有者: ${key2}, 当前英雄: ${value2}`);

                            nowKeyHolder = findHolderByEnchantUId(Number(value2), heroes)
                            nowKeyHolderValue = value2
                            console.log(`最新nowKeyHolder持有者: ${key}, 当前英雄: ${nowKeyHolder.target.heroId}`);
                        }

                        if (value2 == value) {
                            console.log(`最新nowValueHolder持有者: ${key2}, 当前英雄: ${value2}`);
                            nowValueHolder = findHolderByEnchantUId(Number(key2), heroes)
                            nowValueHolderKey = key2
                            console.log(`最新nowValueHolder持有者: ${key2}, 当前英雄: ${nowValueHolder.target.heroId}`);
                        }
                    }
                    console.log('yan nowKeyHolder', nowKeyHolder);

                    const target = findHolderByEnchantUId(Number(value), heroes)

                    //先把自身的脱下来
                    if (nowValueHolder) {
                        console.log(`先把自身的脱下来`);
                        try {
                            await sendWithPromise({
                                cmd: 'equipment_cancelenchant', params: {
                                    heroId: nowValueHolder.target.heroId,
                                    part: nowValueHolder.part,
                                    enchantUId: nowValueHolderKey,
                                }
                            });
                        } catch (err) {
                            console.error('脱下失败:', err);
                        }
                    }

                    //先把自身的脱下来
                    //120 4 3
                    //:116,"part":4,"enchantUId":1  true
                    if (nowKeyHolder) {
                        console.log(`把nowKeyHolder的脱下来`);
                        try {
                            await sendWithPromise({
                                cmd: 'equipment_cancelenchant', params: {
                                    heroId: holder.target.heroId,
                                    part: nowKeyHolder.part,
                                    enchantUId: key,
                                }
                            });
                        } catch (err) {
                            console.error('脱下失败:', err);
                        }
                    }

                    // if (nowKeyHolder) {
                    //     let quenchId
                    //     if(nowKeyHolder.target.heroId==target.heroId){
                    //         quenchId = target.curQuenchId^1
                    //     }else{
                    //         holder = findHolderByEnchantUId(Number(key), heroes)
                    //         quenchId = holder.curQuenchId^1
                    //     }
                    //     await sendWithPromise({
                    //         cmd: 'equipment_enchant', params: {
                    //             oriHeroId:  holder.target.heroId,
                    //             oriPart: holder.part,
                    //             tarHeroId:target.target.heroId,
                    //             oriQuenchId: quenchId^1//哪一面  ^1取反的意思
                    //         }
                    //     });
                    // }else{
                    const { target: targetInfo, part, curQuenchId } = target

                    let quenchId

                    if (!nowKeyHolder) {
                        quenchId = target.curQuenchId ^ 1
                        console.log('yan curQuenchId1', target.curQuenchId ^ 1)

                    } else {
                        holder = findHolderByEnchantUId(Number(key), heroes)
                        // console.log('yan curQuenchId2',curQuenchId)
                        console.log('yan curQuenchId2', holder.curQuenchId)

                        quenchId = curQuenchId
                    }
                    await sendWithPromise({
                        cmd: 'equipment_enchant', params: {
                            oriHeroId: holder.target.heroId,
                            oriPart: part,
                            tarHeroId: targetInfo.heroId,
                            oriQuenchId: key & 1 ? 0 : 1 //哪一面  ^1取反的意思
                        }
                    });
                    // }
                }
            }

            //根据enchantUId找到所属的英雄
            function findHolderByEnchantUId(uid, heroes) {
                let arr = Array.from(heroes)
                let res = null;
                // 循环所有英雄
                for (let index = 0; index < arr.length; index++) {
                    const item = arr[index][1].value
                    //循环英雄的装备
                    for (let i = 0; i < item.equips.length; i++) {
                        const e = item.equips[i];
                        //判断装备的enchantUId是否等于uid
                        if (e.bindServerData.enchantUId === uid || e.bindServerData.enchantUId2 === uid) {
                            res = {
                                target: item,
                                part: i + 1,
                                curQuenchId: e.bindServerData.curQuenchId,
                            };
                            break;
                        }
                    }

                }
                return res
            }


            // 调整位置
            showTip('正在调整位置...', 'warning');
            await delay(COMMAND_DELAY);
            const data2 = await fetchLatestData();
            await delay(COMMAND_DELAY);
            currentHeroes = getTeamHeroes(data2);

            // for (const targetHero of targetHeroes) {
            for (let position = 0; position < 5; position++) {
                const targetHero = targetHeroes.find(h => h.position === position);
                if (!targetHero) {
                    continue;
                }

                console.log(`处理英雄: ${targetHero.heroId} 目标位置: ${targetHero.position}`);

                // 重新获取最新的当前阵容
                const latestData = await fetchLatestData();
                await delay(COMMAND_DELAY);
                currentHeroes = getTeamHeroes(latestData);
                console.log('最新当前阵容:', currentHeroes);

                const currentHero = currentHeroes.find((h) => h.position === position);

                console.log('yan', currentHero, targetHero);

                try {
                    await sendWithPromise({ cmd: 'hero_exchange', params: { heroId: currentHero.heroId, targetHeroId: targetHero.heroId } });
                } catch (err) { }
            }

            // 最终检查阵容
            const finalData = await fetchLatestData();
            await delay(COMMAND_DELAY);
            currentHeroes = getTeamHeroes(finalData);
            console.log('最终阵容:', currentHeroes);
            // return
            const hasLevelData = currentHeroes.some((h) => h.level && h.level > 0);
            if (hasLevelData) {
                const levelData = await fetchLatestData();
                const currentHeroesData = levelData.heroes;

                let levelApplied = 0;
                for (const targetHero of targetHeroes) {
                    if (!targetHero.level || targetHero.level <= 0) continue;
                    const heroData = currentHeroesData.get(targetHero.heroId);
                    console.log('yan heroData', heroData, currentHeroesData, String(targetHero.heroId));

                    console.log('yan targetHerotargetHero', targetHero, targetHero.level);

                    const currentLevel = heroData?.value?.level || 1;
                    const currentOrder = heroData?.value?.order || 0;

                    if (currentLevel !== targetHero.level) {
                        const result = await applyHeroLevel(
                            targetHero.heroId,
                            targetHero.level,
                            currentLevel,
                            currentOrder,
                            targetHero.position,
                        );

                        if (result.success) {
                            levelApplied++;
                        }
                    }
                }

                if (levelApplied > 0) {
                    showTip(`已应用 ${levelApplied} 个武将等级配置`, 'success');
                }
            }

            showTip('正在更改鱼灵...', 'warning');
            const hasFishData = lineup.heroes.some((h) => h.pearlId || h.fishId);
            if (hasFishData) {
                let fishApplied = 0;

                for (const targetHero of targetHeroes) {

                    const fishData = await fetchLatestData();
                    const currentHeroes = fishData.heroes;
                    const pearlMap = fishData.pearlMap || {};
                    const artifactBooks = fishData.artifactBooks || {};

                    const artifactToHero = {};


                    for (const [id, hero] of currentHeroes.entries()) {
                        if (hero.value.artifactId && hero.value.artifactId !== -1) {
                            artifactToHero[hero.value.artifactId] = Number(hero.value.heroId);
                        }

                    }

                    const fishToArtifact = {};
                    for (const [fishId, book] of artifactBooks.entries()) {
                        if (book.artifactId && book.artifactId !== -1) {
                            fishToArtifact[Number(fishId)] = book.artifactId;
                        }
                    }

                    if (!targetHero.fishId && !targetHero.pearlId) continue;

                    let artifactId = null;
                    let pearlId = targetHero.pearlId || 0;
                    console.log('yan targetHero', targetHero);

                    if (targetHero.fishId) {
                        artifactId = fishToArtifact[targetHero.fishId];
                        console.log('yan artifactId', artifactId);

                    }

                    if (!artifactId && targetHero.pearlId) {
                        const pearlData = pearlMap[targetHero.pearlId];
                        console.log('yan pearlData', pearlData);

                        if (pearlData?.artifactId && pearlData.artifactId !== -1) {
                            artifactId = pearlData.artifactId;
                        }
                    }
                    console.log('yan artifactId', artifactId);

                    if (!artifactId) continue;

                    const currentHolderId = artifactToHero[artifactId];
                    console.log('yan currentHolderId', currentHolderId);

                    if (currentHolderId === targetHero.heroId) {
                        continue;
                    }

                    if (currentHolderId) {
                        try {
                            await sendWithPromise({ cmd: 'artifact_unload', params: { heroId: currentHolderId } });
                        } catch (err) { }
                        await delay(COMMAND_DELAY);
                    }

                    try {
                        await sendWithPromise({ cmd: 'artifact_load', params: { heroId: targetHero.heroId, itemId: artifactId, pearlId: pearlId } });
                        fishApplied++;
                    } catch (err) { }
                    await delay(COMMAND_DELAY);
                }

                if (fishApplied > 0) {
                    showTip(`已应用 ${fishApplied} 个鱼灵配置`, 'warning');
                }

                // 鱼珠
                let skillApplied = 0;
                let skillData = await fetchLatestData();
                let latestPearlMap
                const processedPearlIds = new Set();
                const pearlIdsToHandle = targetHeroes.filter((h) => h.pearlId).map((h) => h.pearlId);

                for (const pearlId of pearlIdsToHandle) {
                    if (processedPearlIds.has(pearlId)) continue;
                    skillData = await fetchLatestData();
                    latestPearlMap = skillData.pearlMap || {};
                    console.log('yan latestPearlMap', latestPearlMap, pearlId)
                    const targetHero = targetHeroes.find((h) => h.pearlId === pearlId);
                    const currentPearlData = latestPearlMap[pearlId];
                    const currentSkillId = currentPearlData?.skillId || null;
                    const targetSkillId = targetHero?.skillId || null;

                    // 如果目标没有技能，且当前有技能，则卸载技能
                    if (!targetSkillId) {
                        if (currentSkillId) {
                            try {
                                await sendWithPromise({ cmd: 'pearl_unloadskill', params: { pearlId: pearlId } });
                                skillApplied++;
                                processedPearlIds.add(pearlId);
                            } catch (err) { }
                            await delay(COMMAND_DELAY);
                        }
                        continue;
                    }

                    if (currentSkillId === targetSkillId) {
                        continue;
                    }
                    // 获取当前鱼珠那个英雄上
                    const holderPearlInfo = Array.from(latestPearlMap.entries()).find((arr) => {
                        const holderInfo = arr[1]
                        let pid = holderInfo.pearlId
                        console.log('yan pid', pid, pearlId)

                        if (Number(pid) === pearlId) return false;
                        const data = holderInfo;
                        console.log('yan data', data, data?.skillId, targetSkillId)
                        return data?.skillId === targetSkillId;
                    });
                    console.log('yan holderPearlInfo', holderPearlInfo)
                    const holderPearlId = holderPearlInfo ? holderPearlInfo[1].pearlId : null
                    console.log('yan holderPearlId', holderPearlId)
                    // 如果目标有技能，且当前没有技能，则加载技能
                    if (holderPearlId && !processedPearlIds.has(Number(holderPearlId))) {
                        try {
                            console.log('yan 互换 pearlId', pearlId, Number(holderPearlId));
                            await sendWithPromise({ cmd: 'pearl_exchangeskill', params: { pearlId1: pearlId, pearlId2: Number(holderPearlId) } });
                            skillApplied += 2;
                            // processedPearlIds.add(pearlId);
                            // processedPearlIds.add(Number(holderPearlId));
                        } catch (err) { }
                        await delay(COMMAND_DELAY);
                    } else {
                        console.log('yan pearl_replaceskill', pearlId, targetSkillId)
                        try {
                            await sendWithPromise({ cmd: 'pearl_replaceskill', params: { pearlId: pearlId, skillId: targetSkillId } });
                            skillApplied++;
                            processedPearlIds.add(pearlId);
                        } catch (err) { }
                        await delay(COMMAND_DELAY);
                    }
                }

                if (skillApplied > 0) {
                    showTip(`已切换 ${skillApplied} 个鱼珠技能`, 'warning');
                }
            }
        } catch (error) {
            showTip('应用阵容失败: ' + (error.message || '未知错误'), 'error');
            console.error('应用阵容失败:', error);
        } finally {
            lineup.applying = false;
        }

        // return

        try {
            console.debug('[布阵后处理] 进入武器/宠物/科技处理阶段, lineup.petUId:', lineup.petUId, ', lineup.weaponId:', lineup.weaponId);



            if (lineup.weaponId !== undefined && lineup.weaponId !== null) {
                console.log('yan currentWeaponId', ROLE.lordWeaponId, lineup.weaponId)
                if (ROLE.lordWeaponId !== lineup.weaponId) {
                    showTip('正在更改玩具...', 'warning');
                    try {
                        await sendWithPromise({ cmd: 'lordweapon_changedefaultweapon', params: { weaponId: lineup.weaponId } });
                        const weaponName = weapon_LOCAL[lineup.weaponId] || lineup.weaponId;
                        showTip(`玩具已切换为: ${weaponName}`, 'warning');
                    } catch (err) { }
                    await delay(COMMAND_DELAY);
                }
            }

            // 宠物上阵
            console.log(`[宠物] lineup.petUId: ${lineup.petUId}, 当前宠物: ${pageWindow.ROLE?.pet?.petUId}`);
            if (lineup.petUId) {
                const currentPetUId = pageWindow.ROLE?.pet?.petUId;
                if (currentPetUId !== lineup.petUId) {
                    showTip('正在切换宠物...', 'warning');
                    console.log(`[宠物] 准备发送 pet_load, params:`, { slotUId: { slot: lineup.teamId, uId: lineup.petUId } });
                    try {
                        const petResult = await sendWithPromise({ cmd: 'pet_load', params: { slotUId: { slot: lineup.teamId, uId: lineup.petUId } } });
                        console.log(`[宠物] ✅ 已切换宠物: ${lineup.petUId}, 返回:`, petResult);
                        showTip('宠物已切换', 'success');
                    } catch (err) {
                        console.error('[宠物] ❌ 宠物切换失败:', err);
                    }
                    await delay(COMMAND_DELAY);
                } else {
                    console.log(`[宠物] 当前宠物已是 ${lineup.petUId}，无需切换`);
                }
            } else {
                console.log('[宠物] lineup 中无 petUId 数据，跳过（需重新保存阵容）');
            }

            // 水晶（玩具翻面）切换：在阵容/宠物布置完之后再翻面，避免被上阵流程覆盖
            try {
                const targetTrumpId = lineup.trumpId;
                if (targetTrumpId !== undefined && targetTrumpId !== null && Number(targetTrumpId) !== 0) {
                    const curTrumpId = pageWindow.ROLE?.trumpId ?? 0;
                    if (Number(curTrumpId) !== Number(targetTrumpId)) {
                        // heroId 字段实为 trumpId（参考 trump_change params 形如 {"heroId":204}）
                        showTip('正在切换水晶...', 'warning');
                        console.log(`[水晶] 当前 trumpId=${curTrumpId}，目标 trumpId=${targetTrumpId}，发送 trump_change`);
                        try {
                            await sendWithPromise({ cmd: 'trump_change', params: { heroId: Number(targetTrumpId) } });
                            showTip('水晶已切换', 'success');
                        } catch (err) {
                            console.error('[水晶] ❌ 切换失败:', err);
                        }
                        await delay(COMMAND_DELAY);
                    } else {
                        console.log(`[水晶] 当前 trumpId 已是 ${curTrumpId}，无需翻面`);
                    }
                } else {
                    console.log('[水晶] lineup 未保存 trumpId 或为 0，跳过翻面');
                }
            } catch (e) {
                console.error('[水晶] 翻面流程异常:', e);
            }

            if (lineup.legionResearch && Object.keys(lineup.legionResearch).length > 0) {
                const syncResult = await syncLegionResearch(lineup.legionResearch);
                // console.log(syncResult.message, 'success');
            }
            showTip("阵容已应用完毕", 'success');

        } catch (e) {
            console.error('科技/武器同步失败:', e);
        }
    }

    async function syncLegionResearch(targetResearch) {
        showTip('开始更改科技...', 'warning');

        if (!targetResearch || Object.keys(targetResearch).length === 0) {
            return { success: true, message: '无科技数据需要同步' };
        }

        const roleInfo = await sendWithPromise({ cmd: 'role_getroleinfo', params: {} });
        await delay(COMMAND_DELAY);
        const role = roleInfo?.role || roleInfo;
        const currentResearchRaw = pageWindow.ROLE?.legionResearch || {};

        const currentResearch = {};
        if (currentResearchRaw instanceof Map) {
            for (const [key, value] of currentResearchRaw.entries()) {
                const keyNum = typeof key === 'string' ? Number(key) : key;
                currentResearch[keyNum] = value;
            }
        } else {
            for (const [key, value] of Object.entries(currentResearchRaw)) {
                currentResearch[Number(key)] = value;
            }
        }
        console.log('currentResearch converted:', currentResearch);
        const LEGION_TECH_MAX_LEVEL = {
            101: 60,
            102: 50,
            103: 40,
            104: 30,
            105: 20,
            106: 20,
            107: 20,
            108: 20,
            109: 30,
            110: 30,
            111: 30,
            112: 30,
            113: 30,
            114: 30,
            201: 60,
            202: 50,
            203: 40,
            204: 30,
            205: 20,
            206: 20,
            207: 20,
            208: 20,
            209: 30,
            210: 30,
            211: 30,
            212: 30,
            213: 30,
            214: 30,
            301: 60,
            302: 50,
            303: 40,
            304: 30,
            305: 20,
            306: 20,
            307: 20,
            308: 20,
            309: 30,
            310: 30,
            311: 30,
            312: 30,
            313: 30,
            314: 30,
            401: 60,
            402: 50,
            403: 40,
            404: 30,
            405: 20,
            406: 20,
            407: 20,
            408: 20,
            409: 30,
            410: 30,
            411: 30,
            412: 30,
            413: 30,
            414: 30,
            501: 60,
            502: 50,
            503: 40,
            504: 30,
            505: 20,
            506: 20,
            507: 20,
            508: 20,
            509: 30,
            510: 30,
            511: 30,
            512: 30,
            513: 30,
            514: 30,
            601: 60,
            602: 50,
            603: 40,
            604: 30,
            605: 20,
            606: 20,
            607: 20,
            608: 20,
            609: 30,
            610: 30,
            611: 30,
            612: 30,
            613: 30,
            614: 30,
        };
        const LEGION_TECH_TYPE_MAP = {
            1: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
            2: [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214],
            3: [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314],
            4: [401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414],
            5: [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514],
            6: [601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614],
        };

        const LEGION_TECH_RESET_TYPE_MAP = {
            1: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
            2: [601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614],
            3: [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514],
            4: [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214],
            5: [401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414],
            6: [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314],
        };

        const typesToReset = new Set();

        // for (const [techIdStr, targetLevel] of Object.entries(targetResearch)) {
        //     const techId = Number(techIdStr);
        //     const currentLevel = currentResearch[techId] || 0;
        //     const type = Math.floor(techId / 100);

        //     if (currentLevel !== targetLevel) {
        //         typesToReset.add(type);
        //     }
        // }

        for (const type of [1, 2, 3, 4, 5, 6]) {
            const techIds = LEGION_TECH_RESET_TYPE_MAP[type];
            for (const techId of techIds) {
                const currentLevel = currentResearch[techId] || 0;
                const targetLevel = targetResearch[techId] || 0;
                if (currentLevel !== targetLevel) {
                    console.log("yan currentLevel", currentLevel, "targetLevel", targetLevel, 'techId', techId);

                    console.log("yan type", type);
                    typesToReset.add(type);
                    break;
                }
            }
        }

        if (typesToReset.size === 0) {
            return { success: true, message: '科技配置已匹配，无需调整' };
        }

        for (const type of [...typesToReset].sort((a, b) => a - b)) {
            try {
                await sendWithPromise({ cmd: 'legion_resetresearch', params: { advanced: false, type: type } });
            } catch (err) { }
            await delay(COMMAND_DELAY);
        }
        for (const [techIdStr, targetLevel] of Object.entries(targetResearch)) {
            showTip(`techId:${techIdStr},正在更改科技...`, 'warning');
            const techId = Number(techIdStr);
            if (targetLevel <= 0) continue;

            const legionResearchObj = Object.fromEntries(pageWindow.ROLE.legionResearch)
            let curTechNum = legionResearchObj[techId]
            console.log(`yan curTechNum:${curTechNum} , targetLevel:${targetLevel}`)
            if (curTechNum >= targetLevel) continue
            const maxLevel = LEGION_TECH_MAX_LEVEL[techId] || 30;
            const isMax = targetLevel >= maxLevel;

            if (isMax) {
                try {
                    await sendWithPromise({ cmd: 'legion_research', params: { isMax: true, researchId: techId } });
                } catch (err) { }
                await delay(COMMAND_DELAY);
            } else {
                for (let i = 0; i < targetLevel; i++) {
                    try {
                        await sendWithPromise({ cmd: 'legion_research', params: { isMax: false, researchId: techId } });
                    } catch (err) { }
                    await delay(COMMAND_DELAY);
                }
            }
            console.log('yan cur level' + JSON.stringify(Object.fromEntries(pageWindow.ROLE.legionResearch)))
        }

        return { success: true, message: '所有配置已同步！' };
    }

    const LEVEL_ORDER_THRESHOLDS = [
        { level: 100, order: 1 },
        { level: 200, order: 2 },
        { level: 300, order: 3 },
        { level: 500, order: 4 },
        { level: 700, order: 5 },
        { level: 900, order: 6 },
        { level: 1100, order: 7 },
        { level: 1300, order: 8 },
        { level: 1500, order: 9 },
        { level: 1800, order: 10 },
        { level: 2100, order: 11 },
        { level: 2400, order: 12 },
        { level: 2800, order: 13 },
        { level: 3200, order: 14 },
        { level: 3600, order: 15 },
        { level: 4000, order: 16 },
        { level: 4500, order: 17 },
        { level: 5000, order: 18 },
        { level: 5500, order: 19 },
    ];

    const UPGRADE_OPTIONS = [50, 10, 5, 1];

    const getNextOrderLevel = (currentLevel) => {
        for (const threshold of LEVEL_ORDER_THRESHOLDS) {
            if (currentLevel < threshold.level) {
                return threshold.level;
            }
        }
        return null;
    };

    const getOrder = (level) => {
        let order = 0;
        for (const threshold of LEVEL_ORDER_THRESHOLDS) {
            if (level >= threshold.level) {
                order = threshold.order;
            } else {
                break;
            }
        }
        return order;
    };

    async function applyHeroLevel(heroId, targetLevel, currentLevel, currentOrder = 0, slot = -1) {
        if (!targetLevel || targetLevel <= 0) {
            return { success: true, message: '无目标等级' };
        }

        let actualCurrentLevel = currentLevel;
        let actualCurrentOrder = currentOrder;

        if (actualCurrentLevel > targetLevel) {
            if (slot >= 0) {
                try {
                    await sendWithPromise({ cmd: 'hero_gobackbattle', params: { slot: slot } });
                } catch (err) { }
                await delay(COMMAND_DELAY);
            }

            try {
                const result = await sendWithPromise({ cmd: 'hero_rebirth', params: { heroId: heroId } });
                if (result?.role?.heroes?.[heroId]?.level !== undefined) {
                    actualCurrentLevel = result.role.heroes[heroId].level;
                } else {
                    actualCurrentLevel = 1;
                }
                if (result?.role?.heroes?.[heroId]?.order !== undefined) {
                    actualCurrentOrder = result.role.heroes[heroId].order;
                } else {
                    actualCurrentOrder = 0;
                }
            } catch (err) { }
            await delay(COMMAND_DELAY);

            if (slot >= 0) {
                try {
                    await sendWithPromise({ cmd: 'hero_gointobattle', params: { heroId: heroId, slot: slot } });
                } catch (err) { }
                await delay(COMMAND_DELAY);
            }
        }

        const expectedOrder = getOrder(actualCurrentLevel);
        if (actualCurrentOrder < expectedOrder) {
            try {
                const result = await sendWithPromise({ cmd: 'hero_heroupgradeorder', params: { heroId: heroId } });
                if (result?.role?.heroes?.[heroId]?.order !== undefined) {
                    actualCurrentOrder = result.role.heroes[heroId].order;
                } else {
                    actualCurrentOrder = expectedOrder;
                }
            } catch (err) { }
            await delay(COMMAND_DELAY);
        }

        if (actualCurrentLevel >= targetLevel) {
            return { success: true, message: '等级已达标' };
        }

        while (actualCurrentLevel < targetLevel) {
            const nextOrderLevel = getNextOrderLevel(actualCurrentLevel);
            const maxAllowed = nextOrderLevel ? nextOrderLevel - actualCurrentLevel : targetLevel - actualCurrentLevel;
            const remaining = targetLevel - actualCurrentLevel;
            const stepLimit = Math.min(maxAllowed, remaining);

            let upgradeNum = 1;
            for (const num of UPGRADE_OPTIONS) {
                if (num <= stepLimit) {
                    upgradeNum = num;
                    break;
                }
            }

            try {
                await sendWithPromise({ cmd: 'hero_heroupgradelevel', params: { heroId: heroId, upgradeNum: upgradeNum } });
                actualCurrentLevel += upgradeNum;
            } catch (err) { }
            await delay(COMMAND_DELAY);

            if (nextOrderLevel && actualCurrentLevel >= nextOrderLevel) {
                try {
                    const result = await sendWithPromise({ cmd: 'hero_heroupgradeorder', params: { heroId: heroId } });
                    if (result?.role?.heroes?.[heroId]?.order !== undefined) {
                        actualCurrentOrder = result.role.heroes[heroId].order;
                    } else {
                        actualCurrentOrder++;
                    }
                } catch (err) { }
                await delay(COMMAND_DELAY);
            }
        }

        return { success: true, message: `等级已升至 ${actualCurrentLevel}` };
    }

    // ===================== 5. 队伍信息弹窗 ======================
    async function createTeamInfoPanel(data) {
        const existingPanel = document.getElementById('teamInfoModal');
        if (existingPanel) existingPanel.remove();

        // 打开面板时，从接口获取当前槽位
        let currentTeamId = 1;
        try {
            const presetTeamResult = await sendWithPromise({ cmd: 'presetteam_getinfo', params: {} });

            // 尝试从多个可能的位置获取 useTeamId
            currentTeamId = presetTeamResult?.useTeamId ||
                presetTeamResult?.useTeamid ||
                presetTeamResult?.presetTeamInfo?.useTeamId ||
                presetTeamResult?.presetTeamInfo?.useTeamid ||
                1;

            console.log('从接口获取当前槽位:', currentTeamId, '完整返回:', presetTeamResult);
        } catch (e) {
            console.error('获取当前槽位失败:', e);
            currentTeamId = 1;
        }

        const modal = document.createElement('div');
        modal.id = 'teamInfoModal';
        modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 15, 26, 0.95);
                z-index: 99999;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                isolation: isolate;
            `;

        const panel = document.createElement('div');
        panel.style.cssText = `
                background: #ffffff;
                border-radius: 12px;
                width: 95%;
                max-height: 85vh;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                position: relative;
                isolation: isolate;
                background-clip: padding-box;
            `;

        const header = document.createElement('div');
        header.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 14px;
                border-bottom: 1px solid #f0f0f0;
            `;

        const title = document.createElement('h2');
        title.innerText = '队伍管理';
        title.style.cssText = `
                margin: 0;
                color: #333;
                font-size: 15px;
                font-weight: 600;
                line-height: 1.2;
            `;

        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
                font-size: 20px;
                cursor: pointer;
                color: #999;
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
            `;
        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#f5f5f5';
            closeBtn.style.color = '#666';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = '#999';
        };
        closeBtn.onclick = () => {
            modal.remove();
        };

        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        const content = document.createElement('div');
        content.style.cssText = `
                padding: 8px 12px 12px;
                background: #f5f5f5;
                display: flex;
                flex-direction: column;
                height: calc(85vh - 50px);
            `;

        // 按钮组
        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = `
                display: flex;
                gap: 6px;
                margin-bottom: 6px;
                flex-shrink: 0;
            `;

        // 导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.innerText = '导出';
        exportBtn.style.cssText = `
                background: #FF9800;
                color: white;
                border: none;
                padding: 6px 6px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                line-height: 1.2;
                flex: 1;
                font-weight: 500;
            `;
        exportBtn.onclick = async () => {
            try {
                const cacheKey = getCacheKey();
                const lineups = await loadFromCache();
                const exportData = {
                    [cacheKey]: lineups
                };

                const dataStr = JSON.stringify(exportData, null, 2);
                const roleId = pageWindow.ROLE?.roleId || 'default';
                const fileName = `阵容配置-${roleId}.json`;

                // PC端直接使用浏览器原生下载，避免宿主未实现SAVE_DOWNLOAD_FILE导致假成功
                if (isPC) {
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    showTip(`已导出: ${fileName} 到系统下载目录`, 'success');
                } else if (window.DownloadBridge) {
                    const base64 = btoa(unescape(encodeURIComponent(dataStr)));
                    const savedPath = window.DownloadBridge.saveBase64(fileName, 'application/json', base64);
                    if (savedPath) {
                        showTip(`已导出到: ${savedPath}`, 'success');
                    } else {
                        showTip('导出失败: 保存文件失败', 'error');
                    }
                } else {
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    showTip('已导出阵容数据（浏览器下载）', 'success');
                }
            } catch (e) {
                showTip('导出失败: ' + (e.message || '未知错误'), 'error');
                console.error('导出失败:', e);
            }
        };

        // 导入按钮
        const importBtn = document.createElement('button');
        importBtn.innerText = '导入';
        importBtn.style.cssText = `
                background: #9C27B0;
                color: white;
                border: none;
                padding: 6px 6px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                line-height: 1.2;
                flex: 1;
                font-weight: 500;
            `;
        importBtn.onclick = async () => {
            if (window.FilePickerBridge) {
                window.__filePickerCallback = async (text, fileName) => {
                    if (!text) {
                        showTip('未选择文件或读取失败', 'warning');
                        return;
                    }
                    try {
                        const importedData = JSON.parse(text);
                        const cacheKey = getCacheKey();

                        let lineups = null;
                        if (importedData[cacheKey]) {
                            lineups = importedData[cacheKey];
                        } else {
                            const firstKey = Object.keys(importedData)[0];
                            if (firstKey) {
                                lineups = importedData[firstKey];
                            }
                        }

                        if (!lineups || !Array.isArray(lineups)) {
                            showTip('导入数据格式错误', 'error');
                            return;
                        }

                        const existingData = await readFromIndexDB(cacheKey);
                        let existingLineups = existingData || [];
                        const existingIds = new Set(existingLineups.map(lineup => lineup.id));
                        const newLineups = lineups.filter(lineup => !existingIds.has(lineup.id));
                        const mergedLineups = [...existingLineups, ...newLineups];

                        await writeToIndexDB(cacheKey, mergedLineups);

                        const message = newLineups.length > 0
                            ? `已成功导入 ${newLineups.length} 个新阵容数据（去重后）`
                            : '导入的阵容已存在，未添加重复数据';
                        showTip(message, newLineups.length > 0 ? 'success' : 'warning');

                        await createTeamInfoPanel({});
                    } catch (e) {
                        showTip('导入失败: ' + (e.message || '未知错误'), 'error');
                        console.error('导入失败:', e);
                    }
                };
                window.FilePickerBridge.pick('application/json');
            } else {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        try {
                            const importedData = JSON.parse(event.target.result);
                            const cacheKey = getCacheKey();

                            let lineups = null;
                            if (importedData[cacheKey]) {
                                lineups = importedData[cacheKey];
                            } else {
                                const firstKey = Object.keys(importedData)[0];
                                if (firstKey) {
                                    lineups = importedData[firstKey];
                                }
                            }

                            if (!lineups || !Array.isArray(lineups)) {
                                showTip('导入数据格式错误', 'error');
                                return;
                            }

                            const existingData = await readFromIndexDB(cacheKey);
                            let existingLineups = existingData || [];
                            const existingIds = new Set(existingLineups.map(lineup => lineup.id));
                            const newLineups = lineups.filter(lineup => !existingIds.has(lineup.id));
                            const mergedLineups = [...existingLineups, ...newLineups];

                            await writeToIndexDB(cacheKey, mergedLineups);

                            const message = newLineups.length > 0
                                ? `已成功导入 ${newLineups.length} 个新阵容数据（去重后）`
                                : '导入的阵容已存在，未添加重复数据';
                            showTip(message, newLineups.length > 0 ? 'success' : 'warning');

                            await createTeamInfoPanel({});
                        } catch (e) {
                            showTip('导入失败: ' + (e.message || '未知错误'), 'error');
                            console.error('导入失败:', e);
                        }
                    };
                    reader.readAsText(file);
                };
                input.click();
            }
        };

        // 保存按钮 - 类似 Vue 的 saveCurrentLineup
        const saveBtn = document.createElement('button');
        saveBtn.innerText = '保存阵容';
        saveBtn.style.cssText = `
                background: #4CAF50;
                color: white;
                border: none;
                padding: 6px 6px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                line-height: 1.2;
                flex: 1;
                font-weight: 500;
            `;
        saveBtn.onclick = async () => {
            try {
                // 获取完整的角色信息（类似 Vue 的 saveCurrentLineup）
                const roleInfo = await sendWithPromise({ cmd: 'role_getroleinfo', params: {} });
                await delay(500);

                const role = roleInfo?.role || roleInfo;
                const heroes = role?.heroes || {};
                const artifactBooks = role?.artifactBooks || {};
                const pearlMap = role?.pearlMap || {};
                const legionResearch = role?.legionResearch || {};
                const battleTeam = role?.battleTeam || {};

                console.log('battleTeam:', battleTeam);
                console.log('heroes:', heroes);

                // 获取预设队伍信息（用于获取当前槽位和玩具信息）
                const presetTeamResult = await sendWithPromise({ cmd: 'presetteam_getinfo', params: {} });

                console.log('presetTeamResult:', presetTeamResult);

                // 处理数据结构 - 优先使用顶级的 useTeamId 或 useTeamid
                let useTeamId = presetTeamResult?.useTeamId || presetTeamResult?.useTeamid;

                // 如果没有找到，尝试其他路径
                if (!useTeamId) {
                    const presetInfo = presetTeamResult?.presetTeamInfo;
                    if (typeof presetInfo === 'object' && presetInfo !== null) {
                        useTeamId = presetInfo.useTeamId || presetInfo.useTeamid;
                    }
                }

                // 最后的默认值
                useTeamId = useTeamId || 1;

                // 获取玩具信息
                let presetInfo = presetTeamResult?.presetTeamInfo;

                // 如果是嵌套的 presetTeamInfo.presetTeamInfo，取内层
                if (presetInfo?.presetTeamInfo) {
                    presetInfo = presetInfo.presetTeamInfo;
                }

                // 获取对应槽位的队伍数据（主要用于获取 weaponId）
                const teamData = presetInfo?.[useTeamId] || presetInfo?.[String(useTeamId)] || {};
                const weaponId = role?.lordWeaponId || teamData?.weapon?.weaponId || null;

                console.log('解析后的数据:', { useTeamId, battleTeam, weaponId });

                // 校验 battleTeam 是否为空
                if (Object.keys(battleTeam).length === 0) {
                    throw new Error(`未找到有效的阵容数据。请确保已配置当前阵容`);
                }

                // 构建鱼灵映射
                const fishAssignments = {};
                for (const [fishId, book] of Object.entries(artifactBooks)) {
                    if (book.artifactId && book.artifactId !== -1) {
                        fishAssignments[book.artifactId] = Number(fishId);
                    }
                }

                // 构建英雄数据
                console.log('battleTeam:', battleTeam);
                console.log('heroes:', heroes);
                console.log('artifactBooks:', artifactBooks);
                console.log('pearlMap:', pearlMap);

                const heroesData = [];
                for (const [position, heroInfo] of Object.entries(battleTeam)) {
                    if (!heroInfo || !heroInfo.heroId) {
                        console.log(`跳过无效的英雄数据 position=${position}:`, heroInfo);
                        continue;
                    }

                    // 根据 heroId 匹配 heroes 中的英雄数据
                    const heroId = heroInfo.heroId;
                    const heroData = heroes[String(heroId)];
                    console.log('heroData:', heroData);
                    if (!heroData) {
                        console.log(`未找到 heroId=${heroId} 的英雄数据`);
                        continue;
                    }

                    const artifactId = heroData?.artifactId || null;
                    const fishId = artifactId ? fishAssignments[artifactId] : null;
                    const pearlId = heroData?.pearlId || null;
                    const pearlData = pearlMap ? pearlMap[pearlId] : null;
                    const curQuenchs = Object.values(heroData.equipment).map(item => item.curQuenchId || 0);

                    // 从 pageWindow.ROLE 中获取 equips（接口返回的数据没有 equips 字段）
                    const roleHeroData = pageWindow.ROLE.heroes._data.get(heroId) || pageWindow.ROLE.heroes._data.get(String(heroId));
                    const roleEquips = roleHeroData?.value?.equips || roleHeroData?.equips || [];
                    console.log(`[保存调试] 英雄 ${heroId} roleEquips长度:`, roleEquips.length, roleEquips[0]);

                    // 保存 equips 数据（用于装备匹配）
                    const equipsData = roleEquips.map(equip => {
                        const sd = equip.bindServerData || {};
                        // quenches 是 Map，用 Array.from 提取 values
                        const quenchesMap = sd.quenches instanceof Map ? Array.from(sd.quenches.values()) : Object.values(sd.quenches || {});
                        const quenches2Map = sd.quenches2 instanceof Map ? Array.from(sd.quenches2.values()) : Object.values(sd.quenches2 || {});
                        const quenchesArr = quenchesMap.map(q => ({
                            attrId: q.value?.attrId ?? q.attrId,
                            attrNum: q.value?.attrNum ?? q.attrNum,
                            colorId: q.value?.colorId ?? q.colorId,
                        }));
                        const quenches2Arr = quenches2Map.map(q => ({
                            attrId: q.value?.attrId ?? q.attrId,
                            attrNum: q.value?.attrNum ?? q.attrNum,
                            colorId: q.value?.colorId ?? q.colorId,
                        }));
                        return {
                            enchantUId: sd.enchantUId || 0,
                            enchantUId2: sd.enchantUId2 || 0,
                            part: equip._part || 0,
                            quenches: quenchesArr,
                            quenches2: quenches2Arr,
                        };
                    });

                    console.log(`[保存] 英雄 ${heroId} 的 equips 数据:`, JSON.stringify(equipsData));

                    const heroCard = {
                        curQuenchs,
                        position: Number(position),
                        heroId: heroId,
                        level: heroData?.level || null,
                        attachmentUid: heroData?.attachmentUid || null,
                        equips: equipsData,
                        fishId: fishId || null,
                        pearlId: pearlId,
                        skillId: pearlData?.skillId || null,
                        slotMap: pearlData?.slotMap || null,
                        power: heroData?.power || null,
                        attack: heroData?.attack || null,
                        hp: heroData?.hp || null,
                        speed: heroData?.speed || null,
                    };
                    heroesData.push(heroCard);
                    console.log(`构建英雄数据 position=${position}:`, heroCard);
                }

                // 校验英雄数据
                if (heroesData.length === 0) {
                    throw new Error(`阵容中没有有效的英雄数据，请检查阵容配置`);
                }

                //{"当前装备id":"提供赐福装备id"}
                console.log('yan role.enchantMap', role.enchantMap)

                // 保存当前 weaponId 对应的真实等级，作为「记录值」存盘（避免后续显示时读实时值）
                let savedWeaponLevel = null;
                try {
                    const lw = pageWindow.ROLE && pageWindow.ROLE.lordWeapon;
                    if (lw && weaponId != null) {
                        let entry = null;
                        if (typeof lw.get === 'function') {
                            entry = lw.get(weaponId) || lw.get(Number(weaponId)) || lw.get(String(weaponId));
                        } else if (typeof lw === 'object') {
                            entry = lw[weaponId] || lw[String(weaponId)];
                        }
                        if (entry && entry.level != null) savedWeaponLevel = Number(entry.level);
                    }
                } catch (_) { }

                // 构建阵容数据结构（类似 Vue 的 lineup）
                const lineupData = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                    name: `阵容${useTeamId} - ${new Date().toLocaleTimeString()}`,
                    heroes: heroesData,
                    teamId: useTeamId,
                    savedAt: Date.now(),
                    weaponId: weaponId,
                    weaponLevel: savedWeaponLevel,
                    petUId: pageWindow.ROLE?.pet?.petUId || null,
                    // 水晶（玩具翻面）信息：trumpId 当前使用，trumpId2 背面未使用；未开启翻面时 trumpId2 为 0
                    trumpId: pageWindow.ROLE?.trumpId ?? 0,
                    trumpId2: pageWindow.ROLE?.trumpId2 ?? 0,
                    // 额外保存完整数据以便恢复
                    presetTeamInfo: presetInfo,
                    artifactBooks: artifactBooks,
                    pearlMap: pearlMap,
                    legionResearch: legionResearch,
                    enchantMap: role.enchantMap
                };

                // 保存到 IndexDB（数组格式）
                const savedLineups = await saveLineupToCache(lineupData);

                if (savedLineups) {
                    showTip(`阵容已保存: ${lineupData.name}`, 'success');
                    console.log('保存的阵容数据:', lineupData);
                    console.log('当前所有阵容:', savedLineups);
                    // 刷新弹窗显示
                    await createTeamInfoPanel({});
                }
            } catch (e) {
                showTip('保存阵容失败: ' + (e.message || '未知错误'), 'error');
                console.error('保存阵容失败:', e);
            }
        };

        buttonGroup.appendChild(saveBtn);
        buttonGroup.appendChild(importBtn);
        buttonGroup.appendChild(exportBtn);
        content.appendChild(buttonGroup);

        // 创建可滚动的列表容器
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                padding-right: 8px;
                scrollbar-width: none;
            `;

        // 隐藏滚动条（Chrome、Safari、Edge）
        listContainer.style.msOverflowStyle = 'none';

        // 为 WebKit 浏览器添加 CSS 规则隐藏滚动条
        if (!document.querySelector('style[data-hide-scrollbar]')) {
            const style = document.createElement('style');
            style.setAttribute('data-hide-scrollbar', 'true');
            style.textContent = `
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `;
            document.head.appendChild(style);
        }
        listContainer.classList.add('hide-scrollbar');

        // 从缓存加载所有保存的阵容
        const savedLineups = await loadFromCache();

        // currentTeamId 已在函数开始处从接口获取

        console.log('当前槽位ID:', currentTeamId, '保存的阵容:', savedLineups);

        // ── 玩具等级回填 ──────────────────────────────────────────────
        // 当前已切到 currentTeamId，扫描该槽位下所有 lineup，凡 weaponLevel 为 null/undefined 的，
        // 用 ROLE.lordWeapon 实时数据回填并写回数据库；其它槽位由于实际 lordWeapon 不一定一致，不动。
        try {
            const lw = pageWindow.ROLE && pageWindow.ROLE.lordWeapon;
            if (lw && currentTeamId != null) {
                let dirty = false;
                for (const l of savedLineups) {
                    if (!l || Number(l.teamId) !== Number(currentTeamId)) continue;
                    if (l.weaponId == null) continue;
                    if (l.weaponLevel != null) continue; // 已有记录值跳过
                    let entry = null;
                    if (typeof lw.get === 'function') {
                        entry = lw.get(l.weaponId) || lw.get(Number(l.weaponId)) || lw.get(String(l.weaponId));
                    } else if (typeof lw === 'object') {
                        entry = lw[l.weaponId] || lw[String(l.weaponId)];
                    }
                    if (entry && entry.level != null) {
                        l.weaponLevel = Number(entry.level);
                        dirty = true;
                        console.log('[玩具等级回填] lineup', l.id, 'weaponId=', l.weaponId, '回填 level=', l.weaponLevel);
                    }
                }
                if (dirty) {
                    try {
                        await writeToIndexDB(getCacheKey(), savedLineups);
                        console.log('[玩具等级回填] 已写回数据库');
                    } catch (e) {
                        console.log('[玩具等级回填] 写回失败', e);
                    }
                }
            }
        } catch (e) {
            console.log('[玩具等级回填] 异常', e);
        }

        // 收集所有可用的槽位 tab：仅取保存数据里实际出现过的 teamId + 当前槽位
        // 不再硬编码 1~5，避免显示玩家未解锁的槽位
        const tabIdSet = new Set();
        savedLineups.forEach(l => {
            if (l && l.teamId != null) tabIdSet.add(Number(l.teamId));
        });
        if (currentTeamId) tabIdSet.add(Number(currentTeamId));
        const tabIds = Array.from(tabIdSet).filter(n => Number.isFinite(n) && n > 0).sort((a, b) => a - b);

        // 当前激活的 tab，默认为当前槽位
        let activeTeamId = Number(currentTeamId) || tabIds[0] || 1;

        // ── Tabs 容器 ──────────────────────────────────────────────────
        const tabsBar = document.createElement('div');
        tabsBar.id = 'lineup-tabs-bar';
        tabsBar.style.cssText = `
                display: flex;
                gap: 6px;
                margin: 0 0 6px 0;
                overflow-x: auto;
                overflow-y: hidden;
                padding: 0;
                scrollbar-width: none;
            `;
        tabsBar.classList.add('hide-scrollbar');

        const tabBtns = {};
        const renderTabStyle = (btn, active) => {
            btn.style.cssText = `
                    flex: 0 0 auto;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    line-height: 1.2;
                    cursor: pointer;
                    border: 1px solid ${active ? '#2196F3' : '#E0E0E0'};
                    background: ${active ? '#2196F3' : '#FFFFFF'};
                    color: ${active ? '#FFFFFF' : '#555'};
                    transition: all .15s;
                    user-select: none;
                    white-space: nowrap;
                `;
        };

        // 渲染指定 tab 下的阵容卡片
        const renderListForTab = (teamId) => {
            // 清空旧内容
            listContainer.innerHTML = '';

            const filtered = savedLineups.filter(l => Number(l.teamId) === Number(teamId));

            if (filtered.length === 0) {
                const emptyPlaceholder = document.createElement('div');
                emptyPlaceholder.style.cssText = `
                        background: #ffffff;
                        border-radius: 12px;
                        padding: 40px 20px;
                        text-align: center;
                        color: #999;
                        font-size: 14px;
                    `;
                if (savedLineups.length === 0) {
                    emptyPlaceholder.innerHTML = `
                            <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                            <div style="font-weight: 500; color: #666; margin-bottom: 8px;">暂无保存的阵容</div>
                            <div style="font-size: 12px;">点击"保存阵容"保存当前配置</div>
                        `;
                } else {
                    emptyPlaceholder.innerHTML = `
                            <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
                            <div style="font-weight: 500; color: #666; margin-bottom: 8px;">第${teamId}槽暂无阵容</div>
                            <div style="font-size: 12px;">切到该槽位后保存当前配置即可在此查看</div>
                        `;
                }
                listContainer.appendChild(emptyPlaceholder);
                return;
            }

            filtered.forEach(lineup => {
                const originalIndex = savedLineups.indexOf(lineup);
                console.log('[renderListForTab] 渲染卡片 originalIndex=', originalIndex, 'lineup.teamId=', lineup.teamId, '此时currentTeamId=', currentTeamId);
                listContainer.appendChild(createLineupCard(lineup, originalIndex, currentTeamId));
            });
        };

        const switchTab = (teamId) => {
            activeTeamId = Number(teamId);
            Object.keys(tabBtns).forEach(k => renderTabStyle(tabBtns[k], Number(k) === activeTeamId));
            renderListForTab(activeTeamId);
        };

        // 构建 tab 按钮
        tabIds.forEach(tid => {
            const count = savedLineups.filter(l => Number(l.teamId) === tid).length;
            const btn = document.createElement('div');
            btn.dataset.teamId = String(tid);
            const isCurrent = tid === Number(currentTeamId);
            btn.innerText = `槽位${tid}${isCurrent ? '·当前' : ''}${count > 0 ? ` (${count})` : ''}`;
            renderTabStyle(btn, tid === activeTeamId);
            btn.onclick = () => switchTab(tid);
            tabBtns[tid] = btn;
            tabsBar.appendChild(btn);
        });

        content.appendChild(tabsBar);
        content.appendChild(listContainer);

        console.log('[版本标识 v2] 即将首次渲染 activeTeamId=', activeTeamId, 'tabIds=', JSON.stringify(tabIds), 'currentTeamId=', currentTeamId);
        // 首次渲染
        renderListForTab(activeTeamId);
        console.log('[版本标识 v2] 首次渲染完成');

        // 添加 Powered by gmm 文本
        const poweredByText = document.createElement('div');
        poweredByText.style.cssText = `
                text-align: center;
                padding: 12px;
                font-size: 12px;
                color: #999;
            `;
        poweredByText.innerText = 'Powered by 怪猫猫';
        content.appendChild(poweredByText);

        panel.appendChild(content);
        modal.appendChild(panel);
        document.body.appendChild(modal);

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    // 当前展开 actionBar 的卡片索引（同一时刻只允许一个展开）
    if (typeof window.__currentExpandedLineupIndex === 'undefined') {
        window.__currentExpandedLineupIndex = -1;
        // 全局点击：点击空白处收起当前展开的 actionBar
        document.addEventListener('click', function (e) {
            const idx = window.__currentExpandedLineupIndex;
            if (idx < 0) return;
            const card = document.getElementById(`lineup-card-${idx}`);
            if (card && !card.contains(e.target)) {
                const bar = document.getElementById(`lineup-action-bar-${idx}`);
                if (bar) {
                    bar.style.maxHeight = '0px';
                    bar.style.opacity = '0';
                    bar.style.marginTop = '0px';
                    bar.style.paddingTop = '0px';
                    bar.style.paddingBottom = '0px';
                }
                window.__currentExpandedLineupIndex = -1;
            }
        }, true);
    }

    // 创建保存的阵容卡片
    function createLineupCard(lineup, index, currentTeamId) {
        console.log('[createLineupCard] 调用 index=', index, 'lineup.teamId=', lineup.teamId, 'currentTeamId参数=', currentTeamId);
        const card = document.createElement('div');
        card.id = `lineup-card-${index}`;
        card.style.cssText = `
                background: #ffffff;
                border-radius: 12px;
                padding:8px 16px;
                margin-bottom: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                cursor: pointer;
            `;

        const header = document.createElement('div');
        header.id = `lineup-header-${index}`;
        header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            `;

        const leftSection = document.createElement('div');
        leftSection.id = `lineup-left-${index}`;
        leftSection.style.cssText = 'flex: 1 1 0%;display: flex;flex-direction: column;justify-content: space-between;height:60px;';

        // 计算总战力
        let totalPower = 0;
        (lineup.heroes || []).forEach(hero => {
            totalPower += hero.power || 0;
        });

        // 提取阵容名字（去掉时间戳）
        let displayName = lineup.name || '未命名阵容';
        // 如果名字包含 " - " 时间戳，只取前面部分
        if (displayName.includes(' - ')) {
            displayName = displayName.split(' - ')[0];
        }

        // 阵容名称容器（用于编辑模式切换）
        const lineupNameContainer = document.createElement('div');
        lineupNameContainer.id = `lineup-name-container-${index}`;
        lineupNameContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
            `;

        // 阵容名称 + 总战力
        const lineupName = document.createElement('div');
        lineupName.id = `lineup-name-${index}`;
        lineupName.innerText = `${displayName}`;
        lineupName.style.cssText = `
                font-size: 16px;
                font-weight: 600;
                color: #333;
            `;

        lineupNameContainer.appendChild(lineupName);

        // 玩具信息（在名称和日期之间）
        const toyContainer = document.createElement('div');
        toyContainer.id = `lineup-toys-${index}`;
        toyContainer.style.cssText = `
                font-size: 11px;
                color: #666;
                text-align: left;
            `;

        // 显示阵容的武器（玩具）—— 等级使用保存时的记录值 lineup.weaponLevel，不再读取实时数据
        if (lineup.weaponId !== undefined && lineup.weaponId !== null) {
            const weaponName = weapon_LOCAL[lineup.weaponId] || lineup.weaponId;

            // 兼容字段：weaponLevel 为 null/undefined 表示「未知」（如复制过来但未切换过去过）
            const hasLevel = (lineup.weaponLevel !== undefined && lineup.weaponLevel !== null);
            const weaponLevel = hasLevel ? Number(lineup.weaponLevel) : null;

            if (hasLevel) {
                const isLv1 = weaponLevel === 1;
                if (isLv1) {
                    // 等级 1 整行红色提醒
                    toyContainer.innerHTML =
                        `<span style="color:#E53935;">玩具: ${weaponName}（记录:${weaponLevel}）</span>`;
                } else {
                    toyContainer.innerText = `玩具: ${weaponName}（记录:${weaponLevel}）`;
                }
            } else {
                // 未知：复制过来还没切到该槽位过，无法获取真实等级
                toyContainer.innerHTML =
                    `玩具: ${weaponName}<span style="color:#FF9800;">（记录:未知）</span>`;
            }
        } else {
            toyContainer.innerText = '玩具: 无';
        }

        leftSection.appendChild(lineupNameContainer);
        leftSection.appendChild(toyContainer);

        // 保存时间（放到左下角）
        const savedTime = lineup.savedAt ? new Date(lineup.savedAt).toLocaleString() : '未知时间';
        const dateTime = document.createElement('div');
        dateTime.id = `lineup-datetime-${index}`;
        dateTime.innerText = savedTime;
        dateTime.style.cssText = `
                font-size: 11px;
                color: #999;
                text-align: left;
                line-height: 1.4;
            `;

        leftSection.appendChild(dateTime);

        const rightSection = document.createElement('div');
        rightSection.id = `lineup-right-${index}`;
        rightSection.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                flex-shrink: 0;
            `;

        // 右侧英雄头像区（上2下3，圆形居中）
        const heroAvatarRight = document.createElement('div');
        heroAvatarRight.id = `lineup-right-heroes-${index}`;
        heroAvatarRight.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            `;
        const sortedAllHeroes = (lineup.heroes || [])
            .slice()
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .slice(0, 5);

        const buildMiniAvatar = (hero) => {
            const wrap = document.createElement('div');
            wrap.style.cssText = `
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
                    border: 1.5px solid #ccc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                    flex-shrink: 0;
                `;
            if (hero) {
                const heroInfo = HERO_DICT_LOCAL[hero.heroId];
                const heroName = heroInfo ? heroInfo.name : `英雄${hero.heroId}`;
                const placeholder = document.createElement('span');
                placeholder.innerText = heroName.substring(0, 1);
                placeholder.style.cssText = 'font-size: 10px; font-weight: bold; color: #333;';
                wrap.appendChild(placeholder);
                applyHeroIcon(wrap, hero.heroId);
            } else {
                wrap.style.opacity = '0.35';
            }
            return wrap;
        };

        const rowTop = document.createElement('div');
        rowTop.style.cssText = 'display:flex; gap:4px; justify-content:center;';
        const rowBottom = document.createElement('div');
        rowBottom.style.cssText = 'display:flex; gap:4px; justify-content:center;';
        // 上 2 个
        for (let i = 0; i < 2; i++) {
            rowTop.appendChild(buildMiniAvatar(sortedAllHeroes[i]));
        }
        // 下 3 个
        for (let i = 2; i < 5; i++) {
            rowBottom.appendChild(buildMiniAvatar(sortedAllHeroes[i]));
        }
        heroAvatarRight.appendChild(rowTop);
        heroAvatarRight.appendChild(rowBottom);
        rightSection.appendChild(heroAvatarRight);

        // 滑出式按钮容器（隐藏在卡片下方，点击 item 时滑出）
        const btnGroup = document.createElement('div');
        btnGroup.id = `lineup-action-bar-${index}`;
        btnGroup.style.cssText = `
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 10px;
                width: 100%;
                max-height: 0px;
                opacity: 0;
                overflow: hidden;
                margin-top: 0px;
                padding-top: 0px;
                padding-bottom: 0px;
                transition: max-height 0.15s ease, opacity 0.15s ease, margin-top 0.15s ease, padding-top 0.15s ease, padding-bottom 0.15s ease;
            `;

        // 应用按钮
        const applyBtn = document.createElement('button');
        applyBtn.id = `apply-btn-${index}`;
        applyBtn.innerText = '应  用';
        applyBtn.style.cssText = `
                background: #4CAF50;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 14px;
                font-size: 11px;
                cursor: pointer;
            `;
        applyBtn.onclick = async () => {
            if (lineup.applying) {
                showTip('正在应用阵容，请稍候...', 'warning');
                return;
            }
            // 设置按钮为加载状态
            applyBtn.disabled = true;
            applyBtn.innerText = '运行中';
            applyBtn.style.opacity = '0.6';
            applyBtn.style.cursor = 'not-allowed';

            try {
                await applyLineup(lineup);
            } catch (error) {
                console.error('应用阵容出错:', error);
            } finally {
                // 恢复按钮状态
                applyBtn.disabled = false;
                applyBtn.innerText = '应  用';
                applyBtn.style.opacity = '1';
                applyBtn.style.cursor = 'pointer';
            }
        };

        // 编辑按钮
        const editBtn = document.createElement('button');
        editBtn.id = `edit-btn-${index}`;
        editBtn.innerText = '编  辑';
        editBtn.style.cssText = `
                background: #2196F3;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 14px;
                font-size: 11px;
                cursor: pointer;
                flex-shrink: 0;
            `;

        let isEditing = false;

        editBtn.onclick = async (e) => {
            e.stopPropagation();

            if (!isEditing) {
                // 进入编辑模式
                isEditing = true;
                editBtn.innerText = '保  存';
                editBtn.style.background = '#4CAF50';

                // 隐藏原名称，显示输入框
                lineupName.style.display = 'none';

                const editInput = document.createElement('input');
                editInput.id = `edit-input-${index}`;
                editInput.type = 'text';
                editInput.value = displayName;
                editInput.style.cssText = `
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 8px;
                        border: 2px solid #2196F3;
                        border-radius: 4px;
                        color: #333;
                        width:60%;
                    `;

                lineupNameContainer.insertBefore(editInput, lineupName);
                editInput.focus();
                editInput.select();

                // 失去焦点自动保存
                editInput.addEventListener('blur', () => {
                    if (isEditing) {
                        editBtn.click();
                    }
                });
            } else {
                // 保存编辑
                const editInput = document.getElementById(`edit-input-${index}`);
                const newName = editInput.value.trim() || displayName;

                if (newName === displayName) {
                    // 没有改变，直接退出编辑
                    if (editInput && editInput.parentNode) {
                        editInput.remove();
                    }
                    lineupName.style.display = 'block';
                    isEditing = false;
                    editBtn.innerText = '编  辑';
                    editBtn.style.background = '#2196F3';
                    showTip('名字未修改', 'info');
                    return;
                }

                // 更新缓存中的阵容名字
                try {
                    const savedLineups = await loadFromCache();
                    if (savedLineups[index]) {
                        // 保留原时间戳，更新名字部分
                        const originalName = savedLineups[index].name;
                        let timeStamp = '';
                        if (originalName.includes(' - ')) {
                            timeStamp = ' - ' + originalName.split(' - ')[1];
                        }
                        savedLineups[index].name = newName + timeStamp;
                        await writeToIndexDB(getCacheKey(), savedLineups);

                        // 更新 lineup 对象
                        lineup.name = savedLineups[index].name;

                        // 更新显示
                        lineupName.innerText = `${newName}`;
                        editInput.remove();
                        lineupName.style.display = 'block';
                        isEditing = false;
                        editBtn.innerText = '编  辑';
                        editBtn.style.background = '#2196F3';
                        displayName = newName;

                        showTip('阵容名字已保存', 'success');
                    }
                } catch (e) {
                    showTip('保存失败: ' + (e.message || '未知错误'), 'error');
                    console.error('保存阵容名字失败:', e);
                }
            }
        };

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.id = `delete-btn-${index}`;
        deleteBtn.innerText = '删  除';
        deleteBtn.style.cssText = `
                background: #f44336;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 14px;
                font-size: 11px;
                cursor: pointer;
            `;
        deleteBtn.onclick = async () => {
            // WebView 环境下原生 confirm 不可用（无 Activity 绑定），改用自定义内联确认弹窗
            const confirmed = await new Promise((resolve) => {
                const mask = document.createElement('div');
                mask.style.cssText = `
                    position: fixed; left: 0; top: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); z-index: 999999;
                    display: flex; align-items: center; justify-content: center;
                `;
                const box = document.createElement('div');
                box.style.cssText = `
                    background: #fff; border-radius: 8px; padding: 16px 18px;
                    width: 78%; max-width: 320px; box-shadow: 0 6px 24px rgba(0,0,0,0.25);
                    font-size: 14px; color: #333;
                `;
                const msg = document.createElement('div');
                msg.style.cssText = 'margin-bottom: 14px; line-height: 1.5; word-break: break-all;';
                msg.innerText = `确定要删除阵容 "${lineup.name}" 吗？`;
                const btnRow = document.createElement('div');
                btnRow.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px;';
                const cancelBtn = document.createElement('button');
                cancelBtn.innerText = '取消';
                cancelBtn.style.cssText = `
                    background: #ccc; color: #333; border: none;
                    padding: 6px 14px; border-radius: 14px; font-size: 12px; cursor: pointer;
                `;
                const okBtn = document.createElement('button');
                okBtn.innerText = '删除';
                okBtn.style.cssText = `
                    background: #f44336; color: #fff; border: none;
                    padding: 6px 14px; border-radius: 14px; font-size: 12px; cursor: pointer;
                `;
                const close = (val) => {
                    if (mask.parentNode) mask.parentNode.removeChild(mask);
                    resolve(val);
                };
                cancelBtn.onclick = () => close(false);
                okBtn.onclick = () => close(true);
                mask.onclick = (e) => { if (e.target === mask) close(false); };
                btnRow.appendChild(cancelBtn);
                btnRow.appendChild(okBtn);
                box.appendChild(msg);
                box.appendChild(btnRow);
                mask.appendChild(box);
                document.body.appendChild(mask);
            });
            if (confirmed) {
                // 从缓存中删除
                const savedLineups = await loadFromCache();
                const updatedLineups = savedLineups.filter((_, i) => i !== index);
                await writeToIndexDB(getCacheKey(), updatedLineups);
                showTip('阵容已删除', 'success');
                // 刷新弹窗
                await createTeamInfoPanel({});
            }
        };

        // 阻止按钮点击触发卡片收起
        [applyBtn, editBtn, deleteBtn].forEach(b => {
            const oldClick = b.onclick;
            b.onclick = function (ev) {
                ev.stopPropagation();
                if (oldClick) return oldClick.call(this, ev);
            };
        });

        btnGroup.appendChild(applyBtn);
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);

        // [DEBUG] 复制按钮判断日志
        console.log('[复制按钮判断] index=', index,
            'lineup.teamId=', lineup.teamId, '(类型:', typeof lineup.teamId, ')',
            'currentTeamId=', currentTeamId, '(类型:', typeof currentTeamId, ')',
            'Number(lineup.teamId)=', Number(lineup.teamId),
            'Number(currentTeamId)=', Number(currentTeamId),
            '是否显示复制按钮=', Number(lineup.teamId) !== Number(currentTeamId));

        // 复制按钮（仅当该阵容不是当前阵容槽时显示）
        if (Number(lineup.teamId) !== Number(currentTeamId)) {
            console.log('[复制按钮] 进入分支，准备创建复制按钮 index=', index);
            const copyBtn = document.createElement('button');
            copyBtn.id = `copy-btn-${index}`;
            copyBtn.innerText = '复  制';
            copyBtn.style.cssText = `
                background: #9C27B0;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 14px;
                font-size: 11px;
                cursor: pointer;
            `;
            copyBtn.onclick = async (ev) => {
                ev.stopPropagation();
                // 弹出槽位选择对话框（多选 checkbox）
                const targetSlots = await new Promise(async (resolve) => {
                    const mask = document.createElement('div');
                    mask.style.cssText = `
                        position: fixed; left: 0; top: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.5); z-index: 999999;
                        display: flex; align-items: center; justify-content: center;
                    `;
                    const box = document.createElement('div');
                    box.style.cssText = `
                        background: #fff; border-radius: 8px; padding: 16px 18px;
                        width: 78%; max-width: 320px; box-shadow: 0 6px 24px rgba(0,0,0,0.25);
                        font-size: 14px; color: #333;
                    `;
                    const title = document.createElement('div');
                    title.style.cssText = 'margin-bottom: 12px; font-weight: 600; font-size: 15px;';
                    title.innerText = '复制到以下阵容槽（可多选）';
                    const tip = document.createElement('div');
                    tip.style.cssText = 'margin-bottom: 10px; font-size: 12px; color: #888;';
                    tip.innerText = `源阵容：${(lineup.name || '').split(' - ')[0]}（槽${lineup.teamId}）`;
                    const slotList = document.createElement('div');
                    slotList.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;';
                    // 仅展示「已保存阵容里出现过的槽位 + 当前槽位」（与顶部 tab 一致），排除源阵容自身槽位
                    let dynamicTabIds = [];
                    try {
                        const cachedAll = await loadFromCache();
                        const set = new Set();
                        (cachedAll || []).forEach(l => {
                            if (l && l.teamId != null) set.add(Number(l.teamId));
                        });
                        if (currentTeamId) set.add(Number(currentTeamId));
                        dynamicTabIds = Array.from(set)
                            .filter(n => Number.isFinite(n) && n > 0)
                            .sort((a, b) => a - b);
                    } catch (e) {
                        console.log('[复制按钮] 计算槽位列表失败', e);
                    }
                    const allSlots = dynamicTabIds.filter(sid => Number(sid) !== Number(lineup.teamId));
                    const checkboxes = {};
                    if (allSlots.length === 0) {
                        const emptyTip = document.createElement('div');
                        emptyTip.style.cssText = 'padding: 12px 0; font-size: 12px; color: #999; text-align: center;';
                        emptyTip.innerText = '暂无可复制到的目标槽位';
                        slotList.appendChild(emptyTip);
                    }
                    allSlots.forEach(sid => {
                        if (Number(sid) === Number(lineup.teamId)) return; // 排除自身槽位
                        const row = document.createElement('label');
                        row.style.cssText = 'display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; padding: 4px 0;';
                        const cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.value = String(sid);
                        cb.style.cssText = 'width: 16px; height: 16px;';
                        const label = document.createElement('span');
                        const isCurrent = Number(sid) === Number(currentTeamId);
                        label.innerText = `槽位${sid}${isCurrent ? '（当前）' : ''}`;
                        row.appendChild(cb);
                        row.appendChild(label);
                        slotList.appendChild(row);
                        checkboxes[sid] = cb;
                    });
                    const btnRow = document.createElement('div');
                    btnRow.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px;';
                    const cancelBtn = document.createElement('button');
                    cancelBtn.innerText = '取消';
                    cancelBtn.style.cssText = `
                        background: #ccc; color: #333; border: none;
                        padding: 6px 14px; border-radius: 14px; font-size: 12px; cursor: pointer;
                    `;
                    const okBtn = document.createElement('button');
                    okBtn.innerText = '确定';
                    okBtn.style.cssText = `
                        background: #9C27B0; color: #fff; border: none;
                        padding: 6px 14px; border-radius: 14px; font-size: 12px; cursor: pointer;
                    `;
                    const close = (val) => {
                        if (mask.parentNode) mask.parentNode.removeChild(mask);
                        resolve(val);
                    };
                    cancelBtn.onclick = () => close(null);
                    okBtn.onclick = () => {
                        const selected = Object.keys(checkboxes)
                            .filter(k => checkboxes[k].checked)
                            .map(k => Number(k));
                        close(selected);
                    };
                    mask.onclick = (e) => { if (e.target === mask) close(null); };
                    btnRow.appendChild(cancelBtn);
                    btnRow.appendChild(okBtn);
                    box.appendChild(title);
                    box.appendChild(tip);
                    box.appendChild(slotList);
                    box.appendChild(btnRow);
                    mask.appendChild(box);
                    document.body.appendChild(mask);
                });

                if (!targetSlots || targetSlots.length === 0) {
                    if (targetSlots && targetSlots.length === 0) {
                        showTip('未选择目标槽位', 'info');
                    }
                    return;
                }

                try {
                    const allLineups = await loadFromCache();
                    // 深拷贝原阵容，避免引用污染
                    const baseClone = JSON.parse(JSON.stringify(lineup));
                    const baseName = (baseClone.name || '未命名阵容').split(' - ')[0];
                    targetSlots.forEach(sid => {
                        const copy = JSON.parse(JSON.stringify(baseClone));
                        copy.teamId = sid;
                        copy.name = `${baseName} - ${new Date().toLocaleTimeString()}`;
                        // 复制到其他槽位，玩具等级未知（其它槽位的 lordWeapon 等级与源槽位不一定一致）
                        // 等到下次玩家切到该槽位时，再用真实数据回填
                        copy.weaponLevel = null;
                        allLineups.push(copy);
                    });
                    await writeToIndexDB(getCacheKey(), allLineups);
                    showTip(`已复制到槽位：${targetSlots.join('、')}`, 'success');
                    // 刷新弹窗
                    await createTeamInfoPanel({});
                } catch (e) {
                    showTip('复制失败: ' + (e.message || '未知错误'), 'error');
                    console.error('复制阵容失败:', e);
                }
            };
            btnGroup.appendChild(copyBtn);
        }

        // 展开/收起按钮
        const expandBtn = document.createElement('button');
        expandBtn.id = `expand-btn-${index}`;
        expandBtn.innerText = '展  开';
        expandBtn.style.cssText = `
                background: #FF9800;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 14px;
                font-size: 11px;
                cursor: pointer;
            `;
        let isExpanded = false;

        // 英雄详情区域
        const detailContainer = document.createElement('div');
        detailContainer.id = `lineup-detail-${index}`;
        detailContainer.style.cssText = `
                display: none;
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #eee;
            `;

        expandBtn.onclick = (ev) => {
            ev.stopPropagation();
            isExpanded = !isExpanded;
            expandBtn.innerText = isExpanded ? '收  起' : '展  开';
            if (isExpanded) {
                detailContainer.style.display = 'block';
                if (detailContainer.children.length === 0) {
                    renderHeroDetails(detailContainer, lineup.heroes || [], index);
                } else {
                    // 对未加载成功头像的容器重试
                    detailContainer.querySelectorAll('[id^="hero-avatar-"]').forEach(el => {
                        if (!el.querySelector('img')) {
                            const heroId = el.dataset.heroId;
                            if (heroId) applyHeroIcon(el, parseInt(heroId));
                        }
                    });
                }
            } else {
                detailContainer.style.display = 'none';
            }
        };

        btnGroup.appendChild(expandBtn);

        header.appendChild(leftSection);
        header.appendChild(rightSection);
        card.appendChild(header);
        // actionBar 放在 header 下方，整张 card 内
        card.appendChild(btnGroup);

        // 点击整个 item 切换 actionBar 展开/收起
        card.addEventListener('click', (ev) => {
            // 点击到内部按钮、输入框时不切换
            const tag = (ev.target && ev.target.tagName) || '';
            if (tag === 'BUTTON' || tag === 'INPUT') return;

            const cur = window.__currentExpandedLineupIndex;
            // 关闭其他已展开的 actionBar
            if (cur >= 0 && cur !== index) {
                const otherBar = document.getElementById(`lineup-action-bar-${cur}`);
                if (otherBar) {
                    otherBar.style.maxHeight = '0px';
                    otherBar.style.opacity = '0';
                    otherBar.style.marginTop = '0px';
                    otherBar.style.paddingTop = '0px';
                    otherBar.style.paddingBottom = '0px';
                }
            }
            const isOpen = btnGroup.style.maxHeight && btnGroup.style.maxHeight !== '0px';
            if (isOpen) {
                btnGroup.style.maxHeight = '0px';
                btnGroup.style.opacity = '0';
                btnGroup.style.marginTop = '0px';
                btnGroup.style.paddingTop = '0px';
                btnGroup.style.paddingBottom = '0px';
                window.__currentExpandedLineupIndex = -1;
            } else {
                btnGroup.style.maxHeight = '45px';
                btnGroup.style.opacity = '1';
                btnGroup.style.marginTop = '6px';
                btnGroup.style.paddingTop = '6px';
                btnGroup.style.paddingBottom = '3px';
                window.__currentExpandedLineupIndex = index;
            }
        });

        // 英雄头像行 - 按position排序，最多5个不换行（已隐藏，改为展开显示详情）
        const heroesRow = document.createElement('div');
        heroesRow.id = `heroes-row-${index}`;
        heroesRow.style.cssText = `
                display: none;
                justify-content: space-between;
                flex-wrap: nowrap;
                min-height: 60px;
                padding: 8px 0;
                overflow-x: auto;
            `;

        // 按position排序英雄，只取前5个
        const heroes = (lineup.heroes || []).slice(0, 5);

        if (heroes.length === 0) {
            // 没有英雄数据时显示占位
            const emptyHeroes = document.createElement('div');
            emptyHeroes.id = `empty-heroes-${index}`;
            emptyHeroes.style.cssText = `
                    color: #999;
                    font-size: 12px;
                    padding: 20px;
                    text-align: center;
                    width: 100%;
                `;
            emptyHeroes.innerText = '暂无英雄数据';
            heroesRow.appendChild(emptyHeroes);
        } else {
            const sortedHeroes = heroes.sort((a, b) => (a.position || 0) - (b.position || 0));
            sortedHeroes.forEach((hero, idx) => {
                const heroAvatar = createLineupHeroAvatar(hero, index, idx);
                heroesRow.appendChild(heroAvatar);
            });
        }

        card.appendChild(heroesRow);
        card.appendChild(detailContainer);

        return card;
    }

    // 渲染英雄详情
    function renderHeroDetails(container, heroes, lineupIndex) {
        if (!heroes || heroes.length === 0) {
            container.innerHTML = '<div style="color: #999; text-align: center; padding: 20px;">暂无英雄数据</div>';
            return;
        }

        const sortedHeroes = [...heroes].sort((a, b) => (a.position || 0) - (b.position || 0));

        sortedHeroes.forEach((hero, idx) => {
            const heroInfo = HERO_DICT_LOCAL[hero.heroId];
            const heroName = heroInfo ? heroInfo.name : `英雄${hero.heroId}`;

            let fishName = '';
            let fishId = hero.fishId;
            if (!fishId && hero.pearlId) {
                const pearlIdStr = String(hero.pearlId);
                if (pearlIdStr.includes('_')) {
                    fishId = pearlIdStr.split('_')[0];
                } else {
                    fishId = pearlIdStr;
                }
            }
            if (fishId && FishMap_LOCAL && FishMap_LOCAL[fishId]) {
                fishName = FishMap_LOCAL[fishId].name;
            }

            let skillName = '';
            if (hero.skillId && PearlMap) {
                const skillInfo = PearlMap[hero.skillId];
                if (skillInfo) {
                    skillName = skillInfo.name;
                }
            }

            const heroCard = document.createElement('div');
            heroCard.id = `hero-card-${lineupIndex}-${idx}`;
            heroCard.style.cssText = `
                    background: #f9f9f9;
                    border-radius: 8px;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    gap: 12px;
                `;

            const avatarDiv = document.createElement('div');
            avatarDiv.id = `hero-avatar-${lineupIndex}-${idx}`;
            avatarDiv.dataset.heroId = String(hero.heroId);
            avatarDiv.style.cssText = `
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                    color: #333;
                    flex-shrink: 0;
                    overflow: hidden;
                `;
            avatarDiv.innerText = heroName.substring(0, 2);
            // 异步加载真实英雄头像（来自游戏 AvatarConf）
            applyHeroIcon(avatarDiv, hero.heroId);

            const infoDiv = document.createElement('div');
            infoDiv.id = `hero-info-${lineupIndex}-${idx}`;
            infoDiv.style.cssText = `flex: 1;`;

            const nameRow = document.createElement('div');
            nameRow.id = `hero-position-${lineupIndex}-${idx}`;
            nameRow.style.cssText = `font-weight: 600; font-size: 14px; color: #333; margin-bottom: 4px;`;
            nameRow.innerText = `${hero.position + 1 ?? idx}`;

            const attrRow = document.createElement('div');
            attrRow.id = `hero-attr-${lineupIndex}-${idx}`;
            attrRow.style.cssText = `display: flex; flex-wrap: wrap; gap: 6px; font-size: 12px; color: #666;align-items: center;justify-content: flex-start;`;

            if (hero.level) {
                const levelTag = document.createElement('span');
                levelTag.id = `hero-level-${lineupIndex}-${idx}`;
                levelTag.style.cssText = `background: #ff5722; color: white; padding: 2px 6px; border-radius: 4px;`;
                levelTag.innerText = `Lv.${hero.level}`;
                attrRow.appendChild(levelTag);
            }

            if (hero.speed) {
                const speedTag = document.createElement('span');
                speedTag.id = `hero-speed-${lineupIndex}-${idx}`;
                speedTag.style.cssText = `background: #2196F3; color: white; padding: 2px 6px; border-radius: 4px;`;
                speedTag.innerText = `速度: ${hero.speed}`;
                attrRow.appendChild(speedTag);
            }

            if (fishName) {
                const fishTag = document.createElement('span');
                fishTag.id = `hero-fish-${lineupIndex}-${idx}`;
                fishTag.style.cssText = `background: #4CAF50; color: white; padding: 2px 6px; border-radius: 4px;`;
                fishTag.innerText = fishName;
                attrRow.appendChild(fishTag);
            }

            if (skillName) {
                const skillTag = document.createElement('span');
                skillTag.id = `hero-skill-${lineupIndex}-${idx}`;
                skillTag.style.cssText = `background: #9c27b0; color: white; padding: 2px 6px; border-radius: 4px;`;
                skillTag.innerText = skillName;
                attrRow.appendChild(skillTag);
            }


            infoDiv.appendChild(attrRow);

            heroCard.appendChild(avatarDiv);
            heroCard.appendChild(infoDiv);
            heroCard.appendChild(nameRow);
            container.appendChild(heroCard);
        });
    }

    // 创建阵容中的英雄头像（包含下方信息）
    function createLineupHeroAvatar(hero, lineupIndex, heroIndex) {
        // 获取英雄信息
        const heroInfo = HERO_DICT_LOCAL[hero.heroId];
        const heroName = heroInfo ? heroInfo.name : `英雄${hero.heroId}`;
        const heroType = heroInfo ? heroInfo.type : '';

        // 获取鱼灵信息 - 通过 fishId 或 pearlId 映射
        let fishName = '';
        let fishId = hero.fishId;

        // 如果有 pearlId，尝试从 pearlMap 获取 fishId
        if (!fishId && hero.pearlId) {
            const pearlIdStr = String(hero.pearlId);
            if (pearlIdStr.includes('_')) {
                fishId = pearlIdStr.split('_')[0];
            } else {
                fishId = pearlIdStr;
            }
        }

        if (fishId && FishMap_LOCAL && FishMap_LOCAL[fishId]) {
            fishName = FishMap_LOCAL[fishId].name;
        }

        // 创建容器
        const container = document.createElement('div');
        container.id = `lineup-hero-avatar-${lineupIndex}-${heroIndex}`;
        container.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            `;

        // 英雄头像框
        const avatar = document.createElement('div');
        avatar.id = `lineup-hero-head-${lineupIndex}-${heroIndex}`;
        avatar.style.cssText = `
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
                border-radius: 8px;
                border: 2px solid #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                overflow: hidden;
            `;

        // 英雄名称（显示前2个字，作为头像加载前的占位）
        const heroNameText = document.createElement('span');
        heroNameText.innerText = heroName.substring(0, 2);
        heroNameText.style.cssText = `
                font-size: 14px;
                font-weight: bold;
                color: #333;
                text-align: center;
            `;
        avatar.appendChild(heroNameText);

        // 异步加载真实英雄头像（来自游戏 AvatarConf）
        applyHeroIcon(avatar, hero.heroId);

        container.appendChild(avatar);

        // 下方信息区域 - 竖向排列
        const infoContainer = document.createElement('div');
        infoContainer.id = `lineup-hero-info-${lineupIndex}-${heroIndex}`;
        infoContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                font-size: 10px;
                color: #666;
            `;

        // 等级
        if (hero.level) {
            const levelText = document.createElement('div');
            levelText.id = `lineup-hero-level-${lineupIndex}-${heroIndex}`;
            levelText.innerText = `Lv.${hero.level}`;
            levelText.style.cssText = `
                    background: #ff5722;
                    color: white;
                    padding: 1px 4px;
                    border-radius: 3px;
                    font-weight: bold;
                    font-size: 9px;
                `;
            infoContainer.appendChild(levelText);
        }

        // 速度
        if (hero.speed) {
            const speedText = document.createElement('div');
            speedText.id = `lineup-hero-speed-${lineupIndex}-${heroIndex}`;
            speedText.innerText = `速${hero.speed}`;
            speedText.style.cssText = `
                    color: #2196F3;
                    font-weight: 500;
                `;
            infoContainer.appendChild(speedText);
        }

        // 鱼灵 - 显示完整名称，加宽
        if (fishName) {
            const fishText = document.createElement('div');
            fishText.id = `lineup-hero-fish-${lineupIndex}-${heroIndex}`;
            fishText.innerText = fishName;
            fishText.style.cssText = `
                    background: #4CAF50;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-weight: bold;
                    font-size: 10px;
                    white-space: nowrap;
                    min-width: 40px;
                    text-align: center;
                `;
            infoContainer.appendChild(fishText);
        }

        container.appendChild(infoContainer);

        // 构建详细的tooltip
        let tooltip = `${heroName}`;
        if (heroType) tooltip += ` [${heroType}]`;
        if (hero.level) tooltip += `\n等级: ${hero.level}`;
        if (hero.power) tooltip += `\n战力: ${formatNumber(hero.power)}`;
        if (hero.attack) tooltip += `\n攻击: ${formatNumber(hero.attack)}`;
        if (hero.hp) tooltip += `\n生命: ${formatNumber(hero.hp)}`;
        if (hero.speed) tooltip += `\n速度: ${hero.speed}`;
        if (fishName) {
            tooltip += `\n鱼灵: ${fishName}`;
        }
        if (hero.pearlId) {
            tooltip += `\n珍珠ID: ${hero.pearlId}`;
        }
        container.title = tooltip;

        return container;
    }

    function createHeroAvatar(hero) {
        const avatar = document.createElement('div');

        // 根据游戏品质颜色：2=紫色, 3=橙色
        const colorMap = {
            1: '#cccccc',  // 白色/灰色
            2: '#9c27b0',  // 紫色
            3: '#ff9800',  // 橙色
            4: '#ff5722',  // 红色
            5: '#ffd700'   // 金色
        };
        const borderColor = colorMap[hero.color] || '#cccccc';

        // 获取英雄名称
        const heroInfo = HERO_DICT_LOCAL[hero.heroId];
        const heroName = heroInfo ? heroInfo.name : `英雄${hero.heroId}`;
        const heroType = heroInfo ? heroInfo.type : '';

        avatar.style.cssText = `
                width: 48px;
                height: 48px;
                background: #f5f5f5;
                border-radius: 8px;
                border: 2px solid ${borderColor};
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            `;

        const heroIdText = document.createElement('span');
        heroIdText.innerText = heroName;
        heroIdText.style.cssText = `
                font-size: 12px;
                font-weight: bold;
                color: #333;
                text-align: center;
                line-height: 1.2;
            `;

        const starBadge = document.createElement('div');
        starBadge.innerText = hero.star;
        starBadge.style.cssText = `
                position: absolute;
                bottom: 0;
                right: 0;
                background: #ff9800;
                color: white;
                font-size: 10px;
                padding: 1px 4px;
                border-radius: 4px 0 0 0;
                min-width: 16px;
                text-align: center;
                font-weight: bold;
            `;

        avatar.appendChild(heroIdText);
        avatar.appendChild(starBadge);

        // 构建详细的tooltip信息
        let tooltip = `${heroName}`;
        if (heroType) tooltip += ` [${heroType}]`;
        tooltip += `\n等级: ${hero.level}`;
        tooltip += `\n星级: ${hero.star}`;
        tooltip += `\n阶级: ${hero.order}`;
        tooltip += `\n战力: ${formatNumber(hero.power)}`;
        if (hero.artifactId && hero.artifactId > 0) {
            const artifactName = FishMap_LOCAL[hero.artifactId] ? FishMap_LOCAL[hero.artifactId].name : `神器${hero.artifactId}`;
            tooltip += `\n神器: ${artifactName}`;
        }
        if (hero.pearlId && hero.pearlId > 0) {
            tooltip += `\n珍珠: ${hero.pearlId}`;
        }

        avatar.title = tooltip;

        return avatar;
    }

    function formatNumber(num) {
        if (!num) return '0';
        if (num >= 100000000) {
            return (num / 100000000).toFixed(2) + '亿';
        } else if (num >= 10000) {
            return (num / 10000).toFixed(2) + '万';
        }
        return num.toString();
    }

    // ─── 洗练自动同步 IndexedDB ─────────────────────────────────────────────
    (function initQuenchSync() {
        if (!pageWindow.WsEvent) {
            // WsEvent 还没就绪，延迟重试
            setTimeout(initQuenchSync, 2000);
            return;
        }


        var lockedTargets = null;  // [{ lineupIdx, heroIdx, equipIdx, score }]
        var lastMatchTime = 0;
        var pendingQuenches = null; // 暂存最新的 quenches 数据
        var debounceTimer = null;
        var MATCH_TIMEOUT = 10000; // 10秒超时重新匹配
        var DEBOUNCE_DELAY = 3000; // 3秒防抖

        /**
         * 从 ROLE.heroes 获取英雄当前 4 件装备的 quenches
         * 返回 [{part, quenches: [{attrId, attrNum, colorId}]}]
         */
        function getCurrentEquips(heroId) {
            try {
                var roleHeroData = pageWindow.ROLE.heroes._data.get(heroId)
                    || pageWindow.ROLE.heroes._data.get(String(heroId));
                var equips = roleHeroData?.value?.equips || roleHeroData?.equips || [];
                return equips.map(function (equip) {
                    var sd = equip.bindServerData || {};
                    var qMap = sd.quenches instanceof Map
                        ? Array.from(sd.quenches.values())
                        : Object.values(sd.quenches || {});
                    return {
                        part: equip._part || sd.part || 0,
                        quenches: qMap.map(function (q) {
                            return {
                                attrId: q.value?.attrId ?? q.attrId,
                                attrNum: q.value?.attrNum ?? q.attrNum,
                                colorId: q.value?.colorId ?? q.colorId
                            };
                        })
                    };
                });
            } catch (e) {
                console.error('[洗练同步] 获取当前装备失败:', e);
                return [];
            }
        }

        /**
         * 计算两组装备的匹配度（排除指定 part）
         * savedEquips: 阵容中保存的 equips 数组
         * currentEquips: 当前 ROLE 中的装备数组
         * excludePart: 被洗练的 part，不参与匹配
         */
        function calcMatchScore(savedEquips, currentEquips, excludePart) {
            var totalPoints = 0;
            var matchedPoints = 0;

            for (var i = 0; i < currentEquips.length; i++) {
                var cur = currentEquips[i];
                if (cur.part === excludePart) continue;

                // 找 savedEquips 中同 part 的装备
                var saved = null;
                for (var j = 0; j < savedEquips.length; j++) {
                    if (savedEquips[j].part === cur.part) { saved = savedEquips[j]; break; }
                }
                if (!saved) continue;

                // 比较 quenches（每条比 attrId + colorId）
                var curQ = cur.quenches || [];
                var savedQ = saved.quenches || [];
                var len = Math.min(curQ.length, savedQ.length);
                for (var k = 0; k < len; k++) {
                    totalPoints++;
                    if (curQ[k].attrId === savedQ[k].attrId && curQ[k].colorId === savedQ[k].colorId) {
                        matchedPoints++;
                    }
                }
                // 没比较到的条目也算 totalPoints
                totalPoints += Math.abs(curQ.length - savedQ.length);
            }

            return totalPoints === 0 ? 0 : matchedPoints / totalPoints;
        }

        /**
         * 判断当前水晶与阵容保存的水晶是否"同一套"
         * 装备与水晶在游戏内是绑定关系：水晶 id 命中即视为同套装备（含正反面互换）
         * 命中条件：当前 trumpId 等于阵容 trumpId 或 trumpId2；或当前 trumpId2 等于阵容 trumpId
         * 任一为 0/缺失视为未启用，直接返回 false 不参与短路
         */
        function isTrumpMatch(lineup) {
            try {
                var lt1 = Number(lineup.trumpId || 0);
                var lt2 = Number(lineup.trumpId2 || 0);
                var ct1 = Number(pageWindow.ROLE?.trumpId || 0);
                var ct2 = Number(pageWindow.ROLE?.trumpId2 || 0);
                if (!lt1 && !lt2) return false;        // 阵容没记录水晶
                if (!ct1 && !ct2) return false;        // 当前没启用水晶
                if (lt1 && (lt1 === ct1 || lt1 === ct2)) return true;
                if (lt2 && (lt2 === ct1 || lt2 === ct2)) return true;
                return false;
            } catch (e) {
                return false;
            }
        }

        /**
         * 在 IndexedDB 中寻找所有匹配的阵容+英雄+装备（匹配度>=70%的全部返回）
         * 优化：水晶 id 命中（含正反面互换）直接判定为同套装备，跳过 quenches 评分
         */
        async function findMatchTargets(heroId, excludePart, currentEquips) {
            var lineups = await loadFromCache();
            if (!lineups || lineups.length === 0) return [];

            var matches = [];

            for (var i = 0; i < lineups.length; i++) {
                var heroes = lineups[i].heroes || [];
                var trumpHit = isTrumpMatch(lineups[i]);
                for (var j = 0; j < heroes.length; j++) {
                    if (heroes[j].heroId != heroId) continue;
                    var savedEquips = heroes[j].equips || [];
                    if (savedEquips.length === 0) continue;

                    // 水晶命中 → 直接视为同套装备（score=1）
                    var score = trumpHit ? 1 : calcMatchScore(savedEquips, currentEquips, excludePart);
                    if (score >= 0.7) {
                        var equipIdx = -1;
                        for (var k = 0; k < savedEquips.length; k++) {
                            if (savedEquips[k].part === excludePart) {
                                equipIdx = k;
                                break;
                            }
                        }
                        if (equipIdx >= 0) {
                            matches.push({ lineupIdx: i, heroIdx: j, equipIdx: equipIdx, score: score, trumpHit: trumpHit });
                        }
                    }
                }
            }

            console.log('[洗练同步] 匹配结果: 找到 ' + matches.length + ' 个目标', matches);
            return matches;
        }

        /**
         * 防抖写入 IndexedDB（更新所有匹配的阵容）
         */
        function debouncedWrite() {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async function () {
                if (!lockedTargets || lockedTargets.length === 0 || !pendingQuenches) return;
                try {
                    var lineups = await loadFromCache();
                    var updated = 0;
                    for (var i = 0; i < lockedTargets.length; i++) {
                        var t = lockedTargets[i];
                        if (t.lineupIdx < lineups.length
                            && t.heroIdx < lineups[t.lineupIdx].heroes.length
                            && t.equipIdx >= 0
                            && t.equipIdx < lineups[t.lineupIdx].heroes[t.heroIdx].equips.length) {

                            lineups[t.lineupIdx].heroes[t.heroIdx].equips[t.equipIdx].quenches = pendingQuenches;
                            updated++;
                            console.log('[洗练同步] ✅ 更新阵容:', lineups[t.lineupIdx].name,
                                'heroIdx:', t.heroIdx, 'equipIdx:', t.equipIdx);
                        }
                    }
                    if (updated > 0) {
                        await writeToIndexDB(getCacheKey(), lineups);
                        console.log('[洗练同步] ✅ 已写入 IndexedDB，共更新 ' + updated + ' 个阵容');
                    }
                } catch (e) {
                    console.error('[洗练同步] 写入失败:', e);
                }
                pendingQuenches = null;
            }, DEBOUNCE_DELAY);
        }

        // 用 onSendWithRecv 订阅洗练：send 拿 heroId+part，recv 拿新 quenches
        var lastSendData = null;
        pageWindow.WsEvent.onSendWithRecv('equipment_quench',
            // onSend：记录请求中的 heroId 和 part
            // 注意：send 消息的业务参数在 msg.params（不是 msg.data，msg.data 不存在）
            function (msg) {
                var p = msg.params || {};
                lastSendData = {
                    heroId: p.heroId,
                    part: p.part
                };
                console.log('[洗练同步] 发送洗练请求: heroId=' + lastSendData.heroId + ' part=' + lastSendData.part);
            },
            // onRecv：处理响应
            async function (msg) {
                try {
                    if (!lastSendData) return;
                    var heroId = lastSendData.heroId;
                    var part = lastSendData.part;
                    if (!heroId || !part) return;

                    // 从 response 中提取新的 quenches
                    // 注意：recv 消息的业务数据在 msg.rawData（带字段名的对象，RespMsg 实例字段）
                    var data = msg.rawData || {};
                    var roleData = data.role || {};
                    var heroesMap = roleData.heroes || {};
                    var heroRespData = heroesMap[heroId] || heroesMap[String(heroId)];
                    var equipmentMap = heroRespData?.equipment || {};
                    var newEquipData = equipmentMap[part] || equipmentMap[String(part)];
                    var newQuenchesObj = newEquipData?.quenches || {};

                    // 转换 quenches 对象为数组格式
                    var newQuenchesArr = Object.values(newQuenchesObj).map(function (q) {
                        return { attrId: q.attrId, attrNum: q.attrNum, colorId: q.colorId };
                    });

                    var now = Date.now();

                    // 判断是否需要重新匹配（首次 或 超过10秒）
                    if (!lockedTargets || (now - lastMatchTime) > MATCH_TIMEOUT) {
                        var currentEquips = getCurrentEquips(heroId);
                        var targets = await findMatchTargets(heroId, part, currentEquips);
                        if (targets.length > 0) {
                            lockedTargets = targets;
                            lastMatchTime = now;
                            console.log('[洗练同步] 锁定 ' + targets.length + ' 个目标');
                        } else {
                            console.log('[洗练同步] 未找到匹配阵容 (score < 70%)');
                            lockedTargets = null;
                            return;
                        }
                    } else {
                        lastMatchTime = now; // 刷新时间，保持10秒窗口
                    }

                    // 暂存最新数据，触发防抖写入
                    pendingQuenches = newQuenchesArr;
                    debouncedWrite();

                } catch (e) {
                    console.error('[洗练同步] 处理失败:', e);
                }
            },
            { respCmd: 'equipment_quenchresp' }
        );

        console.log('[洗练同步] 已初始化，监听 equipment_quench (send+recv)');
    })();

    // ===================== 运行时开关 ======================
    // __applyLineup() - 由 patch.js SET_LINEUP 调用来启用/禁用
    window.__applyLineup = function() {
        if (window.__lineupEnabled) {
            console.log('[阵容] 已启用');
        } else {
            console.log('[阵容] 已禁用');
            var modal = document.getElementById('teamInfoModal');
            if (modal) modal.remove();
        }
    };

    // __openLineupPanel() - 供状态栏"阵容"按钮调用
    window.__openLineupPanel = async function() {
        if (!window.__lineupEnabled) return false;
        if (document.getElementById('teamInfoModal')) return;
        var cachedData = await loadFromCache();
        if (cachedData) {
            presetteamInfo = cachedData;
            await createTeamInfoPanel(presetteamInfo);
        } else {
            presetteamInfo = { presetTeamInfo: {}, useTeamId: 1 };
            await createTeamInfoPanel(presetteamInfo);
            showTip('暂无缓存数据，请点击保存阵容获取', 'info');
        }
        return true;
    };

    // 初始化：检查开关状态
    var _lineupStored = localStorage.getItem('__lineup_enabled');
    if (_lineupStored === '1') {
        window.__lineupEnabled = true;
        console.log('[阵容] 已启用 (从 localStorage 恢复)');
    }

})();
