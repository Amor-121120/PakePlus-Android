console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

const downloadExts = [".apk", ".zip", ".rar", ".7z", ".exe", ".pdf", ".doc", ".xls"];

// 判断是不是下载链接
const isDownloadLink = (url) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return downloadExts.some(ext => lower.includes(ext));
};

// 尝试外部打开
const openInExternal = (url) => {
    console.log("准备外部打开：", url);

    try {
        if (window.Android && window.Android.openExternal) {
            window.Android.openExternal(url);
            return;
        }
    } catch (err) {
        console.error("外部打开失败:", err);
    }

    // 兜底：内部跳转
    location.href = url;
};

// 点击 hook
const hookClick = (e) => {
    const origin = e.target.closest('a');
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');

    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault();

        const url = origin.href;
        if (isDownloadLink(url)) {
            console.log('检测到下载链接，交给外部浏览器：', url);
            openInExternal(url);
        } else {
            console.log('普通跳转，内部打开：', url);
            location.href = url;
        }
    }
};

// 重写 window.open
window.open = function (url, target, features) {
    console.log('拦截 window.open:', url, target, features);
    if (isDownloadLink(url)) {
        console.log('检测到下载链接，外部打开');
        openInExternal(url);
    } else {
        console.log('普通跳转，内部打开');
        location.href = url;
    }
};

document.addEventListener('click', hookClick, { capture: true });
