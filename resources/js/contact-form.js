/* ============================================================================
 * 聯絡我們 表單處理（靜態網站版）
 * ----------------------------------------------------------------------------
 * 原本的 PHP 後端會把表單存進 MySQL 再寄信。改成靜態網站後沒有後端，
 * 所以改由這支程式處理送出。
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 要設定的只有下面這一行 FORM_ENDPOINT                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * 【目前狀態】FORM_ENDPOINT 是空字串 → 使用「開啟郵件軟體」模式。
 *   使用者按送出後，會自動開啟他電腦的郵件軟體，收件人、主旨、內容都已填好，
 *   他只要按寄出即可。零設定、馬上能用，但使用者需要有設定好的郵件軟體。
 *
 * 【建議做法】改用 Formspree，使用者按送出就直接寄到公司信箱，體驗最好：
 *   1. 到 https://formspree.io 用 cyler.chung@chnyaoind.com.tw 註冊（免費方案每月 50 封）
 *   2. 建立一個 New Form，收件信箱填 cyler.chung@chnyaoind.com.tw
 *   3. 它會給你一段像 https://formspree.io/f/abcdwxyz 的網址
 *   4. 把那段網址貼到下面 FORM_ENDPOINT 的引號中間，存檔、推上 GitHub 即可
 *
 *   例：var FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
 * ========================================================================== */

var FORM_ENDPOINT = '';

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

    /** 送出成功後的提示視窗（沿用原本的 fancybox 彈窗） */
    function showSuccess() {
        form.reset();

        if (typeof Fancybox !== 'undefined') {
            Fancybox.show([{ src: '#submit-success', type: 'inline' }]);
            return;
        }

        loadScript(
            'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js',
            function () {
                Fancybox.bind('[data-fancybox]');
                Fancybox.show([{ src: '#submit-success', type: 'inline' }]);
            }
        );
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
                window.alert(
                    '很抱歉，表單傳送失敗。\n\n' +
                    '請直接來電 03-2606980，或寄信至 ' + FORM_MAILTO + '，謝謝您！'
                );
            })
            .then(function () {
                setBusy(false);
            });
    });
})();
