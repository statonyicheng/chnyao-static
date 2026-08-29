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
