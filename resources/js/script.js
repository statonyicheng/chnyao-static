// 尋找所有指定父元素
const findParents = (element, tagName) => { let parents = [], parent = element.parentNode; for (; parent;)parent.tagName === tagName && parents.push(parent), parent = parent.parentNode; return parents };
// 尋找兄弟元素
function getSiblings(element, selector) { for (var siblings = [], sibling = element.parentNode.firstChild; sibling;)1 === sibling.nodeType && sibling !== element && (selector && !sibling.matches(selector) || siblings.push(sibling)), sibling = sibling.nextSibling; return siblings }

/*!
* metismenujs - v1.4.0
* MetisMenu: Collapsible menu plugin with Vanilla-JS
* https://github.com/onokumus/metismenujs#readme
*
* Made by Osman Nuri Okumus <onokumus@gmail.com> (https://github.com/onokumus)
* Under MIT License
*/
!function (t, e) { "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).MetisMenu = e() }(this, (function () { "use strict"; const t = { parentTrigger: "li", subMenu: "ul", toggle: !0, triggerElement: "a" }, e = { ACTIVE: "mm-active", COLLAPSE: "mm-collapse", COLLAPSED: "mm-collapsed", COLLAPSING: "mm-collapsing", METIS: "metismenu", SHOW: "mm-show" }; class s { constructor(e, i) { this.element = s.isElement(e) ? e : document.querySelector(e), this.config = Object.assign(Object.assign({}, t), i), this.disposed = !1, this.triggerArr = [], this.boundEventHandler = this.clickEvent.bind(this), this.init() } static attach(t, e) { return new s(t, e) } init() { const { METIS: t, ACTIVE: s, COLLAPSE: i } = e; this.element.classList.add(t); const n = [...this.element.querySelectorAll(this.config.subMenu)]; 0 !== n.length && n.forEach((t => { t.classList.add(i); const e = t.closest(this.config.parentTrigger); (null == e ? void 0 : e.classList.contains(s)) ? this.show(t) : this.hide(t); const n = null == e ? void 0 : e.querySelector(this.config.triggerElement); "true" !== (null == n ? void 0 : n.getAttribute("aria-disabled")) && (null == n || n.setAttribute("aria-expanded", "false"), null == n || n.addEventListener("click", this.boundEventHandler), this.triggerArr.push(n)) })) } clickEvent(t) { if (!this.disposed) { const e = null == t ? void 0 : t.currentTarget; e && "A" === e.tagName && t.preventDefault(); const s = e.closest(this.config.parentTrigger), i = null == s ? void 0 : s.querySelector(this.config.subMenu); this.toggle(i) } } update() { this.disposed = !1, this.init() } dispose() { this.triggerArr.forEach((t => { t.removeEventListener("click", this.boundEventHandler) })), this.disposed = !0 } on(t, e, s) { return this.element.addEventListener(t, e, s), this } off(t, e, s) { return this.element.removeEventListener(t, e, s), this } emit(t, e, s = !1) { const i = new CustomEvent(t, { bubbles: s, detail: e }); this.element.dispatchEvent(i) } toggle(t) { const s = t.closest(this.config.parentTrigger); (null == s ? void 0 : s.classList.contains(e.ACTIVE)) ? this.hide(t) : this.show(t) } show(t) { var s; const i = t, { ACTIVE: n, COLLAPSE: l, COLLAPSED: o, COLLAPSING: r, SHOW: c } = e; if (this.isTransitioning || i.classList.contains(r)) return; const a = () => { i.classList.remove(r), i.style.height = "", i.removeEventListener("transitionend", a), this.setTransitioning(!1), this.emit("shown.metisMenu", { shownElement: i }) }, h = i.closest(this.config.parentTrigger); null == h || h.classList.add(n); const d = null == h ? void 0 : h.querySelector(this.config.triggerElement); null == d || d.setAttribute("aria-expanded", "true"), null == d || d.classList.remove(o), i.style.height = "0px", i.classList.remove(l), i.classList.remove(c), i.classList.add(r); const g = [].slice.call(null === (s = null == h ? void 0 : h.parentNode) || void 0 === s ? void 0 : s.children).filter((t => t !== h)); this.config.toggle && g.length > 0 && g.forEach((t => { const e = t.querySelector(this.config.subMenu); e && this.hide(e) })), this.setTransitioning(!0), i.classList.add(l), i.classList.add(c), i.style.height = `${i.scrollHeight}px`, this.emit("show.metisMenu", { showElement: i }), i.addEventListener("transitionend", a) } hide(t) { const { ACTIVE: s, COLLAPSE: i, COLLAPSED: n, COLLAPSING: l, SHOW: o } = e, r = t; if (this.isTransitioning || !r.classList.contains(o)) return; this.emit("hide.metisMenu", { hideElement: r }); const c = r.closest(this.config.parentTrigger); null == c || c.classList.remove(s); const a = () => { r.classList.remove(l), r.classList.add(i), r.style.height = "", r.removeEventListener("transitionend", a), this.setTransitioning(!1), this.emit("hidden.metisMenu", { hiddenElement: r }) }; r.style.height = `${r.getBoundingClientRect().height}px`, r.style.height = `${r.offsetHeight}px`, r.classList.add(l), r.classList.remove(i), r.classList.remove(o), this.setTransitioning(!0), r.addEventListener("transitionend", a), r.style.height = "0px"; const h = null == c ? void 0 : c.querySelector(this.config.triggerElement); null == h || h.setAttribute("aria-expanded", "false"), null == h || h.classList.add(n) } setTransitioning(t) { this.isTransitioning = t } static isElement(t) { return Boolean(t.classList) } } return s }));
//# sourceMappingURL=metismenujs.min.js.map

/*!
* onoffcanvas https://github.com/onokumus/onoffcanvas
* An offcanvas plugin
* @version: 2.3.1
* @author: Osman Nuri Okumuş <onokumus@gmail.com> (https://onokumus.com)
* @license: MIT
*/
!function (e, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).OnoffCanvas = t() }(this, (function () { "use strict"; const e = { HIDE: "hide.onoffcanvas", SHOW: "show.onoffcanvas" }, t = "is-open", s = '[data-toggle="onoffcanvas"]', i = { createDrawer: !0, hideByEsc: !0 }; function n(e) { const t = []; return e.forEach((e => { const s = function (e) { let t = e.getAttribute("data-target"); t && "#" !== t || (t = e.getAttribute("href") || ""); try { return document.querySelectorAll(t).length > 0 ? t : null } catch (e) { throw new Error("Target Not Found!") } }(e); t.push(s) })), t } class r { constructor(e, t) { this.element = function (e) { return Boolean(e.classList) }(e) ? e : document.querySelector(e), this.config = Object.assign(Object.assign({}, i), t), this.triggerElements = Array.from(document.querySelectorAll(`${s}[href="#${this.element.id}"],\n      ${s}[data-target="#${this.element.id}"]`)), this.addAriaExpanded(this.triggerElements), this.triggerElements.forEach((e => { e.addEventListener("click", (e => { const t = e.target; t && "A" === t.tagName && e.preventDefault(), this.toggle() })) })), this.drawer = document.createElement("div"), this.drawer.classList.add("onoffcanvas-drawer") } static attachTo(e, t) { return new r(e, t) } static autoinit(e = i) { const t = n([...document.querySelectorAll(`${s}`)]);[...new Set(t)].forEach((t => { r.attachTo(t, e) })) } on(e, t) { return this.listen(e, t), this } toggle() { this.element.classList.contains(t) ? this.hide() : this.show() } show() { this.element.classList.contains(t) || (this.element.classList.add(t), this.addAriaExpanded(this.triggerElements), this.emit(e.SHOW, this.element), this.config.createDrawer && (document.documentElement.appendChild(this.drawer), this.drawer.classList.add("is-open"), this.drawer.addEventListener("click", this.hide.bind(this))), this.config.hideByEsc && window.addEventListener("keydown", (e => { "Escape" === e.key && this.hide() }))) } hide() { this.element.classList.contains(t) && (this.config.createDrawer && (this.drawer.classList.remove("is-open"), this.drawer.removeEventListener("click", this.hide.bind(this)), document.documentElement.removeChild(this.drawer)), this.element.classList.remove(t), this.addAriaExpanded(this.triggerElements), this.emit(e.HIDE, this.element)) } listen(e, t) { return this.element.addEventListener(e, t, !1), this } emit(e, t, s = !1) { const i = new CustomEvent(e, { detail: t, bubbles: s }); return this.element.dispatchEvent(i), this } addAriaExpanded(e) { const s = this.element.classList.contains(t); e.forEach((e => { e.setAttribute("aria-expanded", s.toString()) })) } } return r }));
//# sourceMappingURL=onoffcanvas.min.js.map

// svg-inject 
!function (o, l) { var r, a, s = "createElement", g = "getElementsByTagName", b = "length", E = "style", d = "title", y = "undefined", k = "setAttribute", w = "getAttribute", x = null, A = "__svgInject", C = "--inject-", S = new RegExp(C + "\d+", "g"), I = "LOAD_FAIL", t = "SVG_NOT_SUPPORTED", L = "SVG_INVALID", v = ["src", "alt", "onload", "onerror"], j = l[s]("a"), G = typeof SVGRect != y, f = { useCache: !0, copyAttributes: !0, makeIdsUnique: !0 }, N = { clipPath: ["clip-path"], "color-profile": x, cursor: x, filter: x, linearGradient: ["fill", "stroke"], marker: ["marker", "marker-end", "marker-mid", "marker-start"], mask: x, pattern: ["fill", "stroke"], radialGradient: ["fill", "stroke"] }, u = 1, c = 2, O = 1; function T(e) { return (r = r || new XMLSerializer).serializeToString(e) } function P(e, r) { var t, n, i, o, a = C + O++, f = /url\("?#([a-zA-Z][\w:.-]*)"?\)/g, u = e.querySelectorAll("[id]"), c = r ? [] : x, l = {}, s = [], d = !1; if (u[b]) { for (i = 0; i < u[b]; i++)(n = u[i].localName) in N && (l[n] = 1); for (n in l) (N[n] || [n]).forEach((function (e) { s.indexOf(e) < 0 && s.push(e) })); s[b] && s.push(E); var v, p, m, h = e[g]("*"), y = e; for (i = -1; y != x;) { if (y.localName == E) (m = (p = y.textContent) && p.replace(f, (function (e, r) { return c && (c[r] = 1), "url(#" + r + a + ")" }))) !== p && (y.textContent = m); else if (y.hasAttributes()) { for (o = 0; o < s[b]; o++)v = s[o], (m = (p = y[w](v)) && p.replace(f, (function (e, r) { return c && (c[r] = 1), "url(#" + r + a + ")" }))) !== p && y[k](v, m);["xlink:href", "href"].forEach((function (e) { var r = y[w](e); /^\s*#/.test(r) && (r = r.trim(), y[k](e, r + a), c && (c[r.substring(1)] = 1)) })) } y = h[++i] } for (i = 0; i < u[b]; i++)t = u[i], c && !c[t.id] || (t.id += a, d = !0) } return d } function V(e, r, t, n) { if (r) { r[k]("data-inject-url", t); var i = e.parentNode; if (i) { n.copyAttributes && function c(e, r) { for (var t, n, i, o = e.attributes, a = 0; a < o[b]; a++)if (n = (t = o[a]).name, -1 == v.indexOf(n)) if (i = t.value, n == d) { var f, u = r.firstElementChild; u && u.localName.toLowerCase() == d ? f = u : (f = l[s + "NS"]("http://www.w3.org/2000/svg", d), r.insertBefore(f, u)), f.textContent = i } else r[k](n, i) }(e, r); var o = n.beforeInject, a = o && o(e, r) || r; i.replaceChild(a, e), e[A] = 1, m(e); var f = n.afterInject; f && f(e, a) } } else D(e, n) } function p() { for (var e = {}, r = arguments, t = 0; t < r[b]; t++) { var n = r[t]; for (var i in n) n.hasOwnProperty(i) && (e[i] = n[i]) } return e } function _(e, r) { if (r) { var t; try { t = function i(e) { return (a = a || new DOMParser).parseFromString(e, "text/xml") }(e) } catch (o) { return x } return t[g]("parsererror")[b] ? x : t.documentElement } var n = l.createElement("div"); return n.innerHTML = e, n.firstElementChild } function m(e) { e.removeAttribute("onload") } function n(e) { console.error("SVGInject: " + e) } function i(e, r, t) { e[A] = 2, t.onFail ? t.onFail(e, r) : n(r) } function D(e, r) { m(e), i(e, L, r) } function F(e, r) { m(e), i(e, t, r) } function M(e, r) { i(e, I, r) } function q(e) { e.onload = x, e.onerror = x } function R(e) { n("no img element") } var e = function z(e, r) { var t = p(f, r), h = {}; function n(a, f) { f = p(t, f); var e = function (r) { var e = function () { var e = f.onAllFinish; e && e(), r && r() }; if (a && typeof a[b] != y) { var t = 0, n = a[b]; if (0 == n) e(); else for (var i = function () { ++t == n && e() }, o = 0; o < n; o++)u(a[o], f, i) } else u(a, f, e) }; return typeof Promise == y ? e() : new Promise(e) } function u(u, c, e) { if (u) { var r = u[A]; if (r) Array.isArray(r) ? r.push(e) : e(); else { if (q(u), !G) return F(u, c), void e(); var t = c.beforeLoad, n = t && t(u) || u[w]("src"); if (!n) return "" === n && M(u, c), void e(); var i = []; u[A] = i; var l = function () { e(), i.forEach((function (e) { e() })) }, s = function f(e) { return j.href = e, j.href }(n), d = c.useCache, v = c.makeIdsUnique, p = function (r) { d && (h[s].forEach((function (e) { e(r) })), h[s] = r) }; if (d) { var o, a = function (e) { if (e === I) M(u, c); else if (e === L) D(u, c); else { var r, t = e[0], n = e[1], i = e[2]; v && (t === x ? (t = P(r = _(n, !1), !1), e[0] = t, e[2] = t && T(r)) : t && (n = function o(e) { return e.replace(S, C + O++) }(i))), r = r || _(n, !1), V(u, r, s, c) } l() }; if (typeof (o = h[s]) != y) return void (o.isCallbackQueue ? o.push(a) : a(o)); (o = []).isCallbackQueue = !0, h[s] = o } !function m(e, r, t) { if (e) { var n = new XMLHttpRequest; n.onreadystatechange = function () { if (4 == n.readyState) { var e = n.status; 200 == e ? r(n.responseXML, n.responseText.trim()) : 400 <= e ? t() : 0 == e && t() } }, n.open("GET", e, !0), n.send() } }(s, (function (e, r) { var t = e instanceof Document ? e.documentElement : _(r, !0), n = c.afterLoad; if (n) { var i = n(t, r) || t; if (i) { var o = "string" == typeof i; r = o ? i : T(t), t = o ? _(i, !0) : i } } if (t instanceof SVGElement) { var a = x; if (v && (a = P(t, !1)), d) { var f = a && T(t); p([a, r, f]) } V(u, t, s, c) } else D(u, c), p(L); l() }), (function () { M(u, c), p(I), l() })) } } else R() } return G && function i(e) { var r = l[g]("head")[0]; if (r) { var t = l[s](E); t.type = "text/css", t.appendChild(l.createTextNode(e)), r.appendChild(t) } }('img[onload^="' + e + '("]{visibility:hidden;}'), n.setOptions = function (e) { t = p(t, e) }, n.create = z, n.err = function (e, r) { e ? 2 != e[A] && (q(e), G ? (m(e), M(e, t)) : F(e, t), r && (m(e), e.src = r)) : R() }, o[e] = n }("SVGInject"); "object" == typeof module && "object" == typeof module.exports && (module.exports = e) }(window, document);


// plugin activeNavigation
// !function ($) { $.fn.activeNavigation = function (selector, activeClass) { var pathname = window.location.pathname, extension_position, href, hrefs = []; $(selector).find("a").each((function () { extension_position = $(this).attr("href").lastIndexOf("."), href = extension_position >= 0 ? $(this).attr("href").substr(0, extension_position) : $(this).attr("href"), pathname.indexOf(href) > -1 && hrefs.push($(this)) })), hrefs.length && (hrefs.sort((function (a, b) { return b.attr("href").length - a.attr("href").length })), hrefs[0].closest("li").addClass(activeClass)) } }(jQuery);
function activeNavigation(selector, activeClass) { var pathname = window.location.pathname, extension_position, href, hrefs = []; selector.querySelectorAll("a").forEach((function (e) { extension_position = e.getAttribute("href").lastIndexOf("."), href = extension_position >= 0 ? e.getAttribute("href").substr(0, extension_position) : e.getAttribute("href"), pathname.indexOf(href) > -1 && hrefs.push(e) })), hrefs.length && (hrefs.sort((function (a, b) { return b.getAttribute("href").length - a.getAttribute("href").length })), findParents(hrefs[0], "LI").forEach(e => { e.classList.add(activeClass) })) }


// plugin Lavalamp
// (() => {
//     "use strict"; var __webpack_modules__ = {
//         "./src/lavalamp.class.ts":
// /*!*******************************!*\
//   !*** ./src/lavalamp.class.ts ***!
//   \*******************************/function (__unused_webpack_module, exports) { var __assign = this && this.__assign || function () { return (__assign = Object.assign || function (t) { for (var s, i = 1, n = arguments.length; i < n; i++)for (var p in s = arguments[i]) Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]); return t }).apply(this, arguments) }; Object.defineProperty(exports, "__esModule", { value: !0 }); var Lavalamp = function () { function Lavalamp(wrapper, customSettings) { var _this = this, defaultSettings = { easing: "ease", duration: 700, margins: !1, setOnClick: !1, initActiveQuery: ".active", enableHover: !0, delayOn: 0, delayOff: 0, enableFocus: !1, deepFocus: !1 }; this.settings = __assign(__assign({}, defaultSettings), customSettings), this.wrapper = wrapper, this.wrapper.classList.add("lavalamp"); for (var i = 0; i < this.wrapper.children.length; i++)this.wrapper.children[i].classList.add("lavalamp__item"); this.children = wrapper.querySelectorAll(".lavalamp__item"), this.activeElement = wrapper.querySelector(this.settings.initActiveQuery), this.lavalampObject = document.createElement("div"), this.lavalampObject.classList.add("lavalamp__object"), this.lavalampObject.style.transitionDuration = this.settings.duration / 1e3 + "s", this.wrapper.prepend(this.lavalampObject), this.settings.enableHover && this.children.forEach((function (element) { element.addEventListener("mouseenter", _this.mouseEnter.bind(_this)), element.addEventListener("mouseleave", _this.mouseLeave.bind(_this)) })), this.settings.deepFocus ? this.wrapper.querySelectorAll("*").forEach((function (element) { element.addEventListener("focusin", _this.focusIn.bind(_this)), element.addEventListener("focusout", _this.focusOut.bind(_this)) })) : this.settings.enableFocus && this.children.forEach((function (element) { element.addEventListener("focusin", _this.focusIn.bind(_this)), element.addEventListener("focusout", _this.focusOut.bind(_this)) })), this.settings.setOnClick && this.children.forEach((function (element) { element.addEventListener("mousedown", _this.setOnClick.bind(_this)) })), window.addEventListener("DOMContentLoaded", (function () { _this.reposition(_this.activeElement) })) } return Lavalamp.prototype.setOnClick = function (e) { this.activeElement = e.target, this.reposition(e.target) }, Lavalamp.prototype.mouseEnter = function (e) { var _this = this; this.isHovered = !0, setTimeout((function () { _this.isHovered && !_this.isFocused && _this.reposition(e.target) }), this.settings.delayOn) }, Lavalamp.prototype.mouseLeave = function () { var _this = this; this.isHovered = !1, setTimeout((function () { _this.isHovered || _this.isFocused || _this.reposition(_this.activeElement) }), this.settings.delayOff) }, Lavalamp.prototype.focusIn = function (e) { var _this = this; this.isFocused = !0; var lavalampItem = e.target; lavalampItem.classList.contains("lavalamp__item") || (lavalampItem = lavalampItem.closest(".lavalamp__item")), setTimeout((function () { _this.reposition(lavalampItem) }), this.settings.delayOn) }, Lavalamp.prototype.focusOut = function () { var _this = this; this.isFocused = !1, setTimeout((function () { _this.reposition(_this.activeElement) }), this.settings.delayOff) }, Lavalamp.prototype.reposition = function (target) { var _this = this, style = window.getComputedStyle(target), marginTop = parseFloat(style.marginLeft) || 0, marginLeft = parseFloat(style.marginLeft) || 0, marginRight = parseFloat(style.marginRight) || 0, marginBottom = parseFloat(style.marginBottom) || 0, width = target.offsetWidth, height = target.offsetHeight, offsetTop = target.offsetTop, offsetLeft = target.offsetLeft; this.settings.margins && (offsetLeft -= marginLeft, offsetTop -= marginTop, width = width + marginLeft + marginRight, height = height + marginTop + marginBottom), this.isAnimating = !0, this.lavalampObject.style.width = width + "px", this.lavalampObject.style.height = height + "px", this.lavalampObject.style.transform = "translate(" + offsetLeft + "px," + offsetTop + "px)", setTimeout((function () { _this.isAnimating = !1 }), this.settings.duration) }, Lavalamp }(); window.Lavalamp = Lavalamp }
//     }, __webpack_module_cache__ = {}; function __webpack_require__(moduleId) { if (__webpack_module_cache__[moduleId]) return __webpack_module_cache__[moduleId].exports; var module = __webpack_module_cache__[moduleId] = { exports: {} }; return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.exports } __webpack_require__("./src/lavalamp.class.ts")
// })();








//loading
var aosSettings = {
    duration: 1000,
}
var myLoader = document.querySelectorAll('#my-loader');
if (myLoader.length > 0) {
    loader();
} else {
    window.onload = () => {
        AOS.init(aosSettings);
    }
}

//scrollto
function myScrollTo(targetId) {
    var header = document.querySelector('nav.navbar');
    var headerOffset = header.offsetHeight;
    var offsetTarget = document.querySelector(targetId).getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({
        top: offsetTarget,
        behavior: 'smooth'

    });
}

// css parallax
function calcularPorcentajeRecorrido() {
    var e = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('*[class*="fa--"]').forEach((t) => {
        var n,
            o = t;
        if (t.classList.contains("fa--parent")) {
            for (o = t.parentElement; o && !o.classList.contains("fa--iparent");)
                o = o.parentElement;
            o || (o = t.parentElement);
        }
        n = o.getBoundingClientRect();
        var a = ((e - n.top) / (n.height + e)).toFixed(3);
        (a = Math.min(Math.max(a, 0), 1)), t.style.setProperty("--fa-percent", a);
    });
}

window.addEventListener("load", function () {
    calcularPorcentajeRecorrido(),

        window.addEventListener("scroll", calcularPorcentajeRecorrido);
});

// css mouseover
function throttle(e, t) {
    let o, s;
    return function (...n) {
        const a = this;
        s
            ? (clearTimeout(o),
                (o = setTimeout(function () {
                    Date.now() - s >= t && (e.apply(a, n), (s = Date.now()));
                }, t - (Date.now() - s))))
            : (e.apply(a, n), (s = Date.now()));
    };
}
var FA_hoverMouse = function (e) {
    console.log("mouse enter"),
        e.forEach(function (e) {
            if (!e.hasAttribute("data-fa-initialized")) {
                var t,
                    o = e.classList.contains("fa--mouse-3d"),
                    s = e,
                    n = !1,
                    a = e.getBoundingClientRect();
                o &&
                    (e.parentNode.classList.contains("fa--mouse-3d-wrapper")
                        ? (s = t = e.parentNode)
                        : ((t = document.createElement("div")).classList.add(
                            "fa--mouse-3d-wrapper"
                        ),
                            e.parentNode.insertBefore(t, e),
                            t.appendChild(e),
                            (s = t)),
                        window.addEventListener("load", function () {
                            (a = t.getBoundingClientRect()),
                                (t.style.perspective = 2 * a.width + "px");
                        }));
                var i = throttle(function (t) {
                    n &&
                        requestAnimationFrame(function () {
                            if (((a = e.getBoundingClientRect()), o)) {
                                let o = ((a.height / 2 - (t.clientY - a.top)) / 5) * 0.3,
                                    s = ((a.width / 2 - (t.clientX - a.left)) / -5) * 0.3;
                                (e.style.getPropertyValue("--fa-mouse-x") === o.toString() &&
                                    e.style.getPropertyValue("--fa-mouse-y") === s.toString()) ||
                                    (e.style.setProperty("--fa-mouse-x", o),
                                        e.style.setProperty("--fa-mouse-y", s));
                            } else {
                                var s = { x: t.pageX, y: t.pageY },
                                    n = {
                                        x: a.left + window.pageXOffset + a.width / 2,
                                        y: a.top + window.pageYOffset + a.height / 2,
                                    },
                                    i = s.x - n.x,
                                    r = s.y - n.y;
                                e.style.setProperty("--fa-mouse-x", i),
                                    e.style.setProperty("--fa-mouse-y", r),
                                    e.style.setProperty("--fa-mouse-r", i);
                            }
                        });
                }, 10);
                s.addEventListener("mouseenter", function () {
                    [...e.classList].some((e) => e.startsWith("fb-anim--")) &&
                        ((e.style.opacity = "1"), e.style.removeProperty("--fb-anim-name")),
                        (n = !0),
                        o && (e.style.transition = "transform 0.35s ease"),
                        window.addEventListener("mousemove", i);
                }),
                    s.addEventListener("mouseleave", function () {
                        (n = !1),
                            window.removeEventListener("mousemove", i),
                            requestAnimationFrame(function () {
                                e.style.setProperty("--fa-mouse-x", "0"),
                                    e.style.setProperty("--fa-mouse-y", "0"),
                                    o || e.style.setProperty("--fa-mouse-r", "0");
                            });
                    }),
                    e.setAttribute("data-fa-initialized", "true");
            }
        });
};
FA_hoverMouse(
    document.querySelectorAll(".fa--mouse-move, .fa--mouse-follow, .fa--mouse-3d")
);

// text.js
function splitTextFB(e) {
    e.forEach((e) => {
        if (e.querySelector(".fb-word")) return;
        const t = e.textContent.trim();
        let n = 0;
        const d = e.classList.contains("fb-anim--word"),
            o = (e, t = !1, o = []) => {
                const i = document.createElement("span");
                return (
                    i.classList.add("fb-word", ...o),
                    i.setAttribute("aria-hidden", "true"),
                    t
                        ? ((i.innerText = e),
                            d && i.style.setProperty("--fa-t", `${n.toFixed(3)}s`),
                            (n += 0.5))
                        : ([...e].forEach((e) => {
                            const t = document.createElement("span");
                            (t.innerText = e),
                                t.style.setProperty("--fa-t", `${n.toFixed(3)}s`),
                                i.appendChild(t),
                                (n += 0.1);
                        }),
                            (n += 0.1)),
                    i
                );
            },
            i = [...e.children].find((e) => e.textContent.trim() === t),
            r = i || e;
        r.setAttribute("aria-label", t);
        const a = i ? [...i.childNodes] : [...e.childNodes];
        (r.innerHTML = ""),
            a.forEach((e) =>
                ((e, t) => {
                    if (e.nodeType === Node.TEXT_NODE)
                        e.textContent
                            .trim()
                            .split(" ")
                            .forEach((e) => {
                                e && t.appendChild(o(e, d)),
                                    t.appendChild(document.createTextNode(" "));
                            });
                    else if (e.nodeType === Node.ELEMENT_NODE) {
                        if ("BR" === e.tagName) return void t.appendChild(e.cloneNode());
                        const n = "SPAN" === e.tagName ? [...e.classList] : [];
                        e.textContent
                            .trim()
                            .split(" ")
                            .forEach((e) => {
                                e && t.appendChild(o(e, d, n)),
                                    t.appendChild(document.createTextNode(" "));
                            });
                    }
                })(e, r)
            );
    });
}
document.addEventListener("DOMContentLoaded", () => {
    splitTextFB(document.querySelectorAll('[class*="fb-anim--text"]'));
});



/*====================================
*     LOADER
======================================*/
function loader(_success) {
    var obj = document.querySelector('.preloader');
    
    // 檢查Lottie是否已載入
    function initLottie() {
        if (typeof lottie !== 'undefined') {
            // 載入Lottie動畫
            try {
                var lottieAnimation = lottie.loadAnimation({
                    container: document.getElementById('loader-lottie'),
                    renderer: 'svg',
                    loop: false, // 不循環播放
                    autoplay: true,
                    path: resources_path + '_img/layout/chnyao-logo1.json'
                });
            } catch (error) {
                console.error('Error loading Lottie animation:', error);
                // 如果Lottie載入失敗，直接隱藏loader
                hideLoader();
            }
            
                        // 定義隱藏loader的函數
            function hideLoader() {
                if (document.readyState === 'complete') {
                    obj.classList.add('fade-out');
                    setTimeout(function() {
                        obj.style.cssText = 'display: none';
                        AOS.init(aosSettings);
                    }, 600);
                } else {
                    window.onload = function () {
                        obj.classList.add('fade-out');
                        setTimeout(function() {
                            obj.style.cssText = 'display: none';
                            AOS.init();
                        }, 600);
                    }
                }
                
                if (_success) {
                    return _success();
                }
            }
            
            // 監聽Lottie動畫完成事件
            lottieAnimation.addEventListener('complete', function() {
                hideLoader();
            });
        } else {
            // 如果Lottie還沒載入，等待一下再試
            setTimeout(initLottie, 100);
        }
    }
    
    // 開始初始化Lottie
    initLottie();
}


function aniText(containerSelector, aosEffect, targetClass, delaySeconds = 0.1) {
    document.querySelectorAll(containerSelector).forEach(function (container) {
        let elementsToAnimate = targetClass ? container.querySelectorAll('.' + targetClass) : [container];
        let totalDelay = 0;

        elementsToAnimate.forEach(function (element) {
            let text = element.innerText;
            element.innerHTML = ''; // 清空原本的文字

            for (let i = 0; i < text.length; i++) {
                let span = document.createElement('span');
                if (text[i] === ' ') {
                    span.innerHTML = '&nbsp;'; // 處理空格
                } else {
                    span.textContent = text[i];
                    span.style.transitionDelay = `${totalDelay * delaySeconds}s`;
                    span.setAttribute('data-aos', aosEffect);
                    totalDelay++;
                }
                element.appendChild(span);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {

    // 選取所有.has-mega-menu元素
    const hasMegaMenuItems = document.querySelectorAll('.navbar-nav .has-mega-menu');

    // 顯示.mega-menu元素並將對應的內容克隆到.mega-menu中
    function showMegaMenu() {
        const megaMenu = document.querySelector('.mega-menu');
        const container = megaMenu.querySelector('.container');
        const innerMenu = this.querySelector('ul');

        if (megaMenu && container && innerMenu) {
            container.innerHTML = ''; // 清除.container的內容
            const clonedMenu = innerMenu.cloneNode(true); // 克隆ul
            clonedMenu.classList.remove('dropdown-menu'); // 清除.dropdown-menu這個class name
            container.appendChild(clonedMenu); // 將克隆的ul添加到.container中
            megaMenu.style.display = 'block';

            if (this.classList.contains('nav-product-mega-menu')) {
                // megaMenu.classList.add('product-mega-menu');
                clonedMenu.classList.add('product-mega-menu');
            } else if (this.classList.contains('nav-brand-mega-menu')) {
                // megaMenu.classList.add('brand-mega-menu');
                clonedMenu.classList.add('brand-mega-menu');
            }
        }
    }

    // 隱藏.mega-menu元素並清除添加的class
    function hideMegaMenu() {
        const megaMenu = document.querySelector('.mega-menu');
        if (megaMenu) {
            megaMenu.style.display = 'none';
            megaMenu.classList.remove('product-mega-menu', 'brand-mega-menu');
        }
    }

    // 遍歷所有.has-mega-menu元素並添加事件監聽器
    hasMegaMenuItems.forEach(item => {
        item.addEventListener('mouseenter', showMegaMenu);
        item.addEventListener('mouseleave', hideMegaMenu);
    });

    // 為.mega-menu元素添加事件監聽器
    const megaMenu = document.querySelector('.mega-menu');
    if (megaMenu) {
        megaMenu.addEventListener('mouseenter', () => {
            megaMenu.style.display = 'block';
        });
        megaMenu.addEventListener('mouseleave', hideMegaMenu);
    }



    

    var mySVGsToInject = document.querySelectorAll('.svg');

    // Do the injection
    SVGInject(mySVGsToInject, {
        makeIdsUnique: false
    });


    // header clone for metismenu
    //// 新增一個offcanvas區塊
    var offCanvasDiv = document.createElement('div');
    offCanvasDiv.setAttribute('id', 'left-aside');
    offCanvasDiv.className = 'onoffcanvas is-fixed is-left left-aside';
    document.querySelector('body').prepend(offCanvasDiv);
    //// clone hamburger
    var navbarToggler = document.querySelector('.onoffcanvas-toggler').cloneNode(true);

    //// close header
    var arrow = document.createElement('div');
    arrow.classList.add('arrows');

    var header = document.querySelector('.navbar .navbar-nav');
    var cloneHeader = header.cloneNode(true);
    cloneHeader.removeAttribute('class');
    cloneHeader.setAttribute('id', 'metismenu');
    cloneHeader.classList.add('metismenu', 'left-menu');
    //// 先去掉所有屬性
    cloneHeader.querySelectorAll('ul').forEach(e => e.removeAttribute('class'));
    // cloneHeader.querySelectorAll('li').forEach(e => e.removeAttribute('class'));
    cloneHeader.querySelectorAll('li').forEach(e => {
        if (e.classList.contains('nav-brand-mega-menu')) {
            e.removeAttribute('class');
            e.classList.add('nav-brand-mega-menu');
        } else {
            e.removeAttribute('class');
        }
    });
    cloneHeader.querySelectorAll('a').forEach(e => e.removeAttribute('class'));



    offCanvasDiv.prepend(cloneHeader);
    offCanvasDiv.prepend(navbarToggler);
    leftAsideCanvas = new OnoffCanvas(offCanvasDiv);


    activeNavigation(cloneHeader, 'mm-active');


    const leftMetisMenu = new MetisMenu('#metismenu', {
        triggerElement: '.arrows'
    });








    var mmCollapse = cloneHeader.querySelectorAll('.mm-collapse');
    mmCollapse.forEach(e => {
        if (e.closest('li').classList.contains('mm-active')) {
            e.classList.add('mm-show');
        }
        getSiblings(e, 'a').forEach(el => {
            el.classList.add('has-submenu');
            el.appendChild(arrow.cloneNode(true));
        });
    });
    leftMetisMenu.update();

    var expanded = cloneHeader.querySelectorAll('.mm-active > a > .arrows');

    if (expanded) {
        expanded.forEach(e => e.setAttribute('aria-expanded', true))
    }


    var subMenuTrigger = document.querySelectorAll('.arrows');
    subMenuTrigger.forEach(e => {
        e.addEventListener('click', function (el) {
            el.preventDefault();
            return false;
        });
    });

    var headerLI = header.querySelectorAll('li');
    headerLI.forEach(e => {
        var hasSubmenu = e.querySelectorAll('ul');

        hasSubmenu.forEach(el => {
            findParents(el, 'LI').forEach(element => {
                element.classList.add('has-submenu')
            })
        })
    });







    // 編輯器內的youtube iframe 自適應
    const iframes = document.querySelectorAll('.editor iframe');

    for (const iframe of iframes) {
        if (iframe.getAttribute('src').indexOf('yout') >= 0) {
            // 將原本的 src 屬性值儲存到 data-src 屬性
            iframe.setAttribute('data-src', iframe.getAttribute('src'));
            // 移除原本的 src 屬性
            iframe.removeAttribute('src');

            const thisW = iframe.getAttribute('width');
            const wrapDiv = document.createElement('div');
            wrapDiv.classList.add('ratio', 'ratio-16x9');
            wrapDiv.style.width = '100%';
            wrapDiv.style.maxWidth = `${thisW}px`;
            iframe.parentNode.insertBefore(wrapDiv, iframe);
            wrapDiv.appendChild(iframe);
            iframe.classList.add('embed-responsive-item', 'lazy');
        }
    }
    // lazyLoadInstance.update();
    var lazyLoadInstance = new LazyLoad({
        // Your custom settings go here
    });

    // 編輯器 rwd table
    const tables = document.querySelectorAll('.editor table');

    for (const table of tables) {
        // const thisW = iframe.getAttribute('width');
        const wrapDiv = document.createElement('div');
        wrapDiv.classList.add('table-responsive');
        table.parentNode.insertBefore(wrapDiv, table);
        wrapDiv.appendChild(table);
        table.classList.add('table');
    }


    // back to top


    document.querySelector('#back-to-top').addEventListener('click', function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return false;
    });

    // back to top icon fixed on footer



    // document.addEventListener('scroll', function () {
    //     const scrollTop = window.pageYOffset,
    //         scrollTopButton = document.querySelector('#back-to-top'),
    //         footer = document.querySelector('footer'),
    //         footerH = footer.offsetHeight;
    //     if (scrollTop >= 300) {
    //         scrollTopButton.style.bottom = '50px';
    //         if (scrollTopButton.getBoundingClientRect().top + window.pageYOffset + scrollTopButton.offsetHeight >= footer.offsetTop - 10) {
    //             scrollTopButton.style.position = 'absolute';
    //             scrollTopButton.style.bottom = `${footerH}px`;
    //         }
    //         if (document.documentElement.scrollTop + window.innerHeight < footer.offsetTop) {
    //             scrollTopButton.style.position = 'fixed';
    //             scrollTopButton.style.bottom = '50px';
    //         }
    //     } else {
    //         scrollTopButton.style.bottom = '-50px';
    //     }
    // });

    document.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset,
            scrollTopButton = document.querySelector('#right-float-box'),
            goTop = scrollTopButton.querySelector('#back-to-top'),
            footer = document.querySelector('footer'),
            header = document.querySelector('nav.navbar'),
            footerH = footer.offsetHeight;
        if (scrollTop >= 300) {
            scrollTopButton.style.bottom = '50px';
            goTop.style.cssText += 'opacity: 1';
            header.classList.add('scroll');
            if (scrollTopButton.getBoundingClientRect().top + window.pageYOffset + scrollTopButton.offsetHeight >= footer.offsetTop - 10) {
                scrollTopButton.style.position = 'absolute';
                scrollTopButton.style.bottom = `${footerH}px`;
            }
            if (document.documentElement.scrollTop + window.innerHeight < footer.offsetTop) {
                scrollTopButton.style.position = 'fixed';
                scrollTopButton.style.bottom = '50px';
            }
        } else {
            header.classList.remove('scroll');
            scrollTopButton.style.bottom = '50px';
            goTop.style.cssText -= 'opacity: 1';
        }
    });


    var nav = document.querySelectorAll('.navbar-nav');

    nav.forEach(function (e) {
        activeNavigation(e, 'active');
    });
    var asideMenu = document.querySelectorAll('.aside-list');

    asideMenu.forEach(function (e) {
        activeNavigation(e, 'mm-active');
    });

    var once = false;

    asideMenu.forEach((list, index) => {
        var asideMenu = document.querySelectorAll('.aside-menu');
        var hasSubmenu = list.querySelector('.mm-active > ul');
        if (hasSubmenu) {
            var menu = new MetisMenu(list).on('shown.metisMenu', function (event) {
                if (!once) {
                    var showEl = event.detail.shownElement;
                    var showTarget = showEl.previousElementSibling;
                    showTarget.setAttribute('aria-expanded', 'true');

                    asideMenu.forEach(e => {
                        e.classList.add('deactive');
                    })
                    once = true;
                }
            });
        } else {
            var menu = new MetisMenu(list);
            asideMenu.forEach(e => {
                e.classList.add('deactive');
            })
        }

    })

    var mBtn = document.querySelectorAll('.m-button');
    mBtn.forEach((el, index) => {
        el.addEventListener('click', e => {
            var bl = e.target.nextElementSibling;
            bl.classList.toggle('active');
            e.target.classList.toggle('active');
        })
    })










    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {






    } else {



    }


    // $(document).mouseup(function(e) {
    //     var _con = $('.hamburger.is-active , .navbar-collapse.show'); // 设置目标区域
    //     if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
    //         _con.removeClass('active action is-active show');
    //     }
    // });






});


// document.addEventListener("touchstart", function () { }, false);