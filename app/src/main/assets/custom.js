console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
);

// ==========================
// 1 JS 层面伪装 UA
// ==========================
Object.defineProperty(navigator, 'userAgent', {
    get: function () {
        return "Mozilla/5.0 (Linux; Android 13; Pixel 7) " +
               "AppleWebKit/537.36 (KHTML, like Gecko) " +
               "Chrome/121.0.0.0 Mobile Safari/537.36";
    }
});

console.log("当前 UA:", navigator.userAgent);

// ==========================
// 2 全部外部跳转逻辑
// ==========================
const openInExternal = (url) => {
    console.log("准备外部打开：", url);

    try {
        if (window.Android && window.Android.openExternal) {
            // 如果 PakePlus Android 提供了接口，就调用
            window.Android.openExternal(url);
            return;
        }
    } catch (err) {
        console.error("外部打开失败:", err);
    }

    // 兜底：内部跳转
    location.href = url;
};

// 点击事件 hook
const hookClick = (e) => {
    const origin = e.target.closest('a');
    if (origin && origin.href) {
        e.preventDefault();
        console.log('强制外部打开：', origin.href);
        openInExternal(origin.href);
    }
};

// 重写 window.open
window.open = function (url, target, features) {
    console.log('拦截 window.open:', url, target, features);
    openInExternal(url);
};

// 挂载事件监听
document.addEventListener('click', hookClick, { capture: true });
