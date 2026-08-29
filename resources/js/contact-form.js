/* ============================================================================
 * 聯絡我們 表單處理（靜態網站版）
 * ----------------------------------------------------------------------------
 * 原本的 PHP 後端會把表單存進 MySQL 再寄信。改成靜態網站後沒有後端，
 * 所以改由這支程式處理送出。
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 目前使用 Formspree，訪客按送出就直接寄到 FORM_MAILTO 的信箱               │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * 【現況】FORM_ENDPOINT 已設定為 Formspree 表單網址。
 *   免費方案每月 50 封。用量與收件紀錄可到 https://formspree.io/forms 查看。
 *
 * 【要換收件信箱】到 Formspree 後台改該表單的 recipient，這支程式不用動。
 *   （下面的 FORM_MAILTO 只用於送出失敗時的提示文字，記得一起改。）
 *
 * 【要停用 Formspree】把 FORM_ENDPOINT 改回空字串 ''，
 *   表單會自動退回「開啟訪客電腦的郵件軟體」模式，仍可運作。
 * ========================================================================== */

var FORM_ENDPOINT = 'https://formspree.io/f/xqpkkrye';

// 收信信箱（郵件軟體模式與表單服務都會寄到這裡）
var FORM_MAILTO = 'cyler.chung@chnyaoind.com.tw';

// ----------------------------------------------------------------------------

(function () {
    'use strict';

    var form = document.getElementById('contact-form');
    if (!form) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.querySelector('span') : null;
    var submitLabelText = submitLabel ? submitLabel.textContent : '';

    /** 顯示／清除單一欄位的錯誤狀態 */
    function setFieldError(field, hasError) {
        var wrap = field.closest('.form-floating');
        if (!wrap) return;
        wrap.classList.toggle('has-error', hasError);
    }

    /** 驗證整張表單，回傳第一個有問題的欄位（都正確則回傳 null） */
    function validateForm() {
        var firstInvalid = null;

        form.querySelectorAll('[required]').forEach(function (field) {
            var value = field.value.trim();
            var invalid = value === '';

            if (!invalid && field.type === 'email') {
                invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            }

            setFieldError(field, invalid);
            if (invalid && !firstInvalid) firstInvalid = field;
        });

        return firstInvalid;
    }

    // 使用者重新輸入時即時清掉錯誤提示
    form.querySelectorAll('[required]').forEach(function (field) {
        field.addEventListener('input', function () {
            setFieldError(field, false);
        });
    });

    /** 組出跟原後台一樣格式的信件內容 */
    function buildMessage(data) {
        return '姓名：' + data.name + '\n' +
               '電話：' + data.tel + '\n' +
               '電子信箱：' + data.email + '\n' +
               '主旨：' + data.subject + '\n' +
               '問題內容：\n' + data.info;
    }

    /**
     * 送出後的提示視窗。
     *
     * 刻意不使用 Fancybox：這一頁沒有任何 [data-fancybox] 元素，common.js 因此
     * 不會預載它，等到按下送出才臨時去 CDN 抓，CDN 慢或被擋就完全沒有回饋，
     * 使用者只會覺得「按了沒反應」。這裡改用自帶的 overlay，不依賴任何外部資源。
     *
     * @param {string} title   標題
     * @param {string} bodyHtml 內文（HTML）
     * @param {boolean} isError 是否為錯誤樣式
     */
    function showDialog(title, bodyHtml, isError) {
        var existing = document.getElementById('cf-dialog');
        if (existing) existing.remove();

        var overlay = document.createElement('div');
        overlay.id = 'cf-dialog';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.style.cssText =
            'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;' +
            'justify-content:center;padding:20px;background:rgba(0,0,0,.55);';

        var box = document.createElement('div');
        box.style.cssText =
            'position:relative;max-width:520px;width:100%;max-height:85vh;overflow:auto;' +
            'background:#fff;border-radius:12px;padding:40px 28px 32px;text-align:center;' +
            'box-shadow:0 12px 40px rgba(0,0,0,.25);font-size:16px;line-height:1.8;color:#222;';

        box.innerHTML =
            '<div style="font-size:40px;line-height:1;margin-bottom:16px;">' +
                (isError ? '⚠️' : '✉️') +
            '</div>' +
            '<div style="font-size:20px;font-weight:700;margin-bottom:16px;">' + title + '</div>' +
            '<div>' + bodyHtml + '</div>';

        var close = document.createElement('button');
        close.type = 'button';
        close.setAttribute('aria-label', '關閉');
        close.textContent = '×';
        close.style.cssText =
            'position:absolute;top:8px;right:14px;border:0;background:none;cursor:pointer;' +
            'font-size:32px;line-height:1;color:#888;padding:4px 8px;';

        var ok = document.createElement('button');
        ok.type = 'button';
        ok.textContent = '關閉';
        ok.style.cssText =
            'margin-top:26px;border:0;border-radius:999px;cursor:pointer;padding:11px 40px;' +
            'font-size:16px;background:#1b3a6b;color:#fff;';

        function dismiss() {
            overlay.remove();
            document.removeEventListener('keydown', onKey);
        }
        function onKey(e) {
            if (e.key === 'Escape') dismiss();
        }

        close.addEventListener('click', dismiss);
        ok.addEventListener('click', dismiss);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) dismiss();
        });
        document.addEventListener('keydown', onKey);

        box.appendChild(close);
        box.appendChild(ok);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        ok.focus();
    }

    /** 送出成功 */
    function showSuccess() {
        form.reset();

        // 沿用原本 #submit-success 區塊的文案，維持與舊版一致。
        // 只取 <p>，跳過原本的 FontAwesome 圖示（這裡已有自己的圖示，
        // 且 FA 沒載入時會留下一塊空白）。
        var source = document.getElementById('submit-success');
        var paragraphs = source ? source.querySelectorAll('p') : [];
        var bodyHtml = paragraphs.length
            ? Array.prototype.map.call(paragraphs, function (p) { return p.outerHTML; }).join('')
            : '<p>我們已收到您的來信，將儘速回覆您。</p>';

        showDialog('已收到您的來信', bodyHtml, false);
    }

    function setBusy(busy) {
        if (!submitBtn) return;
        submitBtn.disabled = busy;
        if (submitLabel) submitLabel.textContent = busy ? '傳送中…' : submitLabelText;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // 蜜罐欄位有值 = 機器人填的，安靜地不處理
        var honeypot = form.querySelector('[name="company_website"]');
        if (honeypot && honeypot.value !== '') return;

        var firstInvalid = validateForm();
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        var data = {
            name: form.name.value.trim(),
            tel: form.tel.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            info: form.info.value.trim()
        };

        // --- 模式一：未設定 FORM_ENDPOINT → 開啟使用者的郵件軟體 ---
        if (!FORM_ENDPOINT) {
            var mailto = 'mailto:' + FORM_MAILTO +
                '?subject=' + encodeURIComponent('網站聯絡我們：' + data.subject) +
                '&body=' + encodeURIComponent(buildMessage(data));

            window.location.href = mailto;
            showSuccess();
            return;
        }

        // --- 模式二：已設定 FORM_ENDPOINT → 直接送出到表單服務 ---
        setBusy(true);

        fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
        })
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                showSuccess();
            })
            .catch(function () {
                showDialog(
                    '表單傳送失敗',
                    '<p>很抱歉，表單目前無法送出。</p>' +
                    '<p>請直接來電 <a href="tel:03-2606980">03-2606980</a>，' +
                    '或寄信至 <a href="mailto:' + FORM_MAILTO + '">' + FORM_MAILTO + '</a>，謝謝您！</p>',
                    true
                );
            })
            .then(function () {
                setBusy(false);
            });
    });
})();
