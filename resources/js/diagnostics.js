/* ============================================================================
 * 聯絡表單診斷面板（暫時性）
 * ----------------------------------------------------------------------------
 * 只有網址帶 ?diag=1 時才會啟動，一般訪客完全看不到、也不會執行任何邏輯。
 *
 * 用途：在無法直接操作對方電腦的情況下，讓對方只要「開網址 → 按送出 → 截圖」
 *       就能回報足夠的資訊，不需要打開開發者工具。
 *
 * 問題釐清後可以整支刪除，並移除 contact/index.html 裡對應的 <script>。
 * ========================================================================== */

(function () {
    'use strict';

    if (new URLSearchParams(location.search).get('diag') !== '1') return;

    var lines = [];
    var panel, body;

    function build() {
        panel = document.createElement('div');
        panel.style.cssText =
            'position:fixed;right:8px;bottom:8px;z-index:2147483647;width:min(430px,94vw);' +
            'max-height:65vh;overflow:auto;background:#0b1220;color:#d6e2ff;' +
            'font:12px/1.55 ui-monospace,Menlo,Consolas,monospace;border:2px solid #4a7cff;' +
            'border-radius:8px;padding:10px 12px;box-shadow:0 8px 30px rgba(0,0,0,.5);';

        var title = document.createElement('div');
        title.textContent = '● 表單診斷面板（?diag=1 才會出現）';
        title.style.cssText = 'font-weight:700;color:#7fffa8;margin-bottom:8px;';

        body = document.createElement('div');

        panel.appendChild(title);
        panel.appendChild(body);
        document.body.appendChild(panel);
    }

    function log(label, value, good) {
        lines.push({ label: label, value: String(value), good: good });
        render();
    }

    function render() {
        if (!body) return;
        body.innerHTML = lines.map(function (l) {
            var mark = l.good === true ? '✅' : l.good === false ? '❌' : '·';
            var colour = l.good === false ? '#ff8a8a' : l.good === true ? '#7fffa8' : '#d6e2ff';
            return '<div style="color:' + colour + ';word-break:break-all;margin-bottom:3px;">' +
                   mark + ' ' + l.label + ': ' + l.value + '</div>';
        }).join('');
        body.scrollTop = body.scrollHeight;
    }

    function start() {
        build();

        // --- 靜態環境檢查 ---
        var endpointOk = typeof FORM_ENDPOINT !== 'undefined' && !!FORM_ENDPOINT;
        log('contact-form.js', typeof FORM_ENDPOINT === 'undefined' ? '未載入' :
            (FORM_ENDPOINT || '(空字串＝舊版)'), endpointOk);

        var form = document.getElementById('contact-form');
        log('找到表單', form ? '是' : '否', !!form);

        var btn = form && form.querySelector('button[type=submit]');
        log('找到送出鈕', btn ? '是' : '否', !!btn);

        // 開場遮罩是頭號嫌疑犯，做成持續更新而非單次快照
        var pre = document.getElementById('my-loader');
        function loaderState() {
            if (!pre) return '無此元素';
            return getComputedStyle(pre).display;
        }
        log('開場遮罩', loaderState(), loaderState() === 'none' || !pre);
        var loaderTicks = 0;
        var loaderTimer = setInterval(function () {
            var i = lines.findIndex(function (l) { return l.label === '開場遮罩'; });
            if (i >= 0) {
                var v = loaderState();
                lines[i].value = v + '（第 ' + (++loaderTicks) + ' 秒）';
                lines[i].good = v === 'none' || !pre;
                render();
            }
            if (loaderTicks >= 12) clearInterval(loaderTimer);
        }, 1000);

        log('保險程式', document.querySelector('script[src*="loader-failsafe"]') ? '已載入' : '未載入',
            !!document.querySelector('script[src*="loader-failsafe"]'));

        log('連線', location.protocol, true);

        if (!btn) return;

        // --- 按鈕上方是否有東西擋住 ---
        function checkCover() {
            var r = btn.getBoundingClientRect();
            if (r.top < 0 || r.bottom > window.innerHeight) return '按鈕不在畫面內（請先捲到按鈕）';
            var el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            if (!el) return '取不到';
            if (el === btn || btn.contains(el)) return '沒有東西擋住';
            var cls = typeof el.className === 'string' ? el.className.split(' ')[0] : '';
            return '被擋住 → ' + el.tagName + (el.id ? '#' + el.id : '') + (cls ? '.' + cls : '');
        }
        window.addEventListener('scroll', function () {
            var i = lines.findIndex(function (l) { return l.label === '按鈕上方'; });
            var v = checkCover();
            var g = v === '沒有東西擋住';
            if (i >= 0) { lines[i].value = v; lines[i].good = g; render(); }
        }, { passive: true });
        log('按鈕上方', checkCover(), checkCover() === '沒有東西擋住');

        // --- 事件與網路即時追蹤 ---
        log('—— 以下請按下「送出表單」後產生 ——', '', null);

        btn.addEventListener('click', function () { log('收到按鈕 click', '是', true); }, true);
        form.addEventListener('submit', function () { log('收到表單 submit', '是', true); }, true);

        var origFetch = window.fetch;
        window.fetch = function (url, opts) {
            log('送出請求', String(url), true);
            return origFetch.apply(this, arguments).then(function (res) {
                log('伺服器回應', 'HTTP ' + res.status, res.ok);
                return res;
            }).catch(function (err) {
                log('連線失敗', err && err.message ? err.message : String(err), false);
                throw err;
            });
        };

        window.addEventListener('error', function (e) {
            log('JS 錯誤', (e.message || '') + ' @ ' + (e.filename || '').split('/').pop() + ':' + (e.lineno || ''), false);
        });
        window.addEventListener('unhandledrejection', function (e) {
            log('未處理的例外', String(e.reason), false);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 800); });
    } else {
        setTimeout(start, 800);
    }
})();
