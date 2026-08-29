/* ============================================================================
 * 開場載入動畫（preloader）的保險機制
 * ----------------------------------------------------------------------------
 * 為什麼需要這支程式：
 *
 * script.js 裡的 loader() 只有在 Lottie 動畫送出 'complete' 事件時，
 * 才會把 #my-loader 收起來：
 *
 *     lottieAnimation.addEventListener('complete', function () { hideLoader(); });
 *
 * 而 #my-loader 是 position:fixed、z-index:9999、pointer-events:auto 的全螢幕遮罩。
 * 只要 complete 沒觸發，遮罩就永遠留著，整個網站的連結與按鈕全部點不動。
 *
 * complete 沒觸發的實際情形（都遇過）：
 *   - 分頁在背景開啟 → 瀏覽器凍結 requestAnimationFrame，動畫不會前進
 *   - lottie 函式庫（CDN）載入慢或被擋 → 程式每 100ms 重試，永遠等不到
 *   - chnyao-logo1.json 讀取失敗 → lottie 發的是 data_failed，原程式沒有處理
 *
 * 這支程式不改動原本的流程：動畫正常播完時，這裡什麼都不會做。
 * 只有在超過時限仍沒收起來時，才強制收起，確保網站至少是可用的。
 *
 * 動畫本身長度為 2 秒（chnyao-logo1.json：200 frames / 100 fps），
 * 因此 5 秒的時限對正常情況有足夠餘裕。
 * ========================================================================== */

(function () {
    'use strict';

    var MAX_WAIT_MS = 5000;
    var timer = null;

    function getLoader() {
        return document.getElementById('my-loader');
    }

    /** 遮罩是否仍蓋著畫面 */
    function isBlocking() {
        var el = getLoader();
        if (!el) return false;
        var s = window.getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden';
    }

    function forceHide(reason) {
        var el = getLoader();
        if (!el || !isBlocking()) return;

        el.classList.add('fade-out');
        window.setTimeout(function () {
            el.style.cssText = 'display: none';
        }, 600);

        // script.js 是在收起遮罩的同時才初始化 AOS。
        // 走到這條備援路徑代表那段沒執行到，這裡要補做，
        // 否則所有 data-aos 元素會停在 opacity:0，內容變成一片空白。
        if (typeof AOS !== 'undefined' && typeof AOS.init === 'function') {
            try {
                AOS.init(typeof aosSettings !== 'undefined' ? aosSettings : { duration: 1000 });
            } catch (e) {
                /* AOS 初始化失敗不該連帶讓遮罩留著 */
            }
        }

        if (window.console && window.console.warn) {
            window.console.warn('[loader-failsafe] 開場動畫未正常結束（' + reason + '），已強制收起遮罩。');
        }
    }

    function arm() {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
            forceHide('等待逾時 ' + MAX_WAIT_MS + 'ms');
        }, MAX_WAIT_MS);
    }

    arm();

    // 背景分頁的動畫會被凍結，complete 不會觸發。
    // 使用者切回這個分頁時重新計時，先給動畫一次正常播完的機會，
    // 播不完再強制收起。
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden && isBlocking()) arm();
    });
})();
