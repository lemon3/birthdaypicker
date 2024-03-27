/*!
* BirthdayPicker v0.1.19
* https://lemon3.github.io/birthdaypicker
*/
var A = Object.defineProperty;
var N = Object.getOwnPropertySymbols;
var W = Object.prototype.hasOwnProperty, k = Object.prototype.propertyIsEnumerable;
var D = (s, e, t) => e in s ? A(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, b = (s, e) => {
  for (var t in e || (e = {}))
    W.call(e, t) && D(s, t, e[t]);
  if (N)
    for (var t of N(e))
      k.call(e, t) && D(s, t, e[t]);
  return s;
};
var Y = (s, e, t) => (D(s, typeof e != "symbol" ? e + "" : e, t), t);
const v = { en: { year: "Year", month: "Month", day: "Day" }, de: { year: "Jahr", month: "Monat", day: "Tag" }, fr: { year: "Année", month: "Mois", day: "Jour" } }, _ = (s, e, t, a) => ((r, n, i, h) => {
  if (n)
    for (const l in n)
      r.setAttribute(l, n[l]);
  if (i)
    for (const l in i)
      r.style[l] = i[l];
  return h && (r.innerHTML = h), r;
})(document.createElement(s), e, t, a), C = (s) => +s % 4 == 0 && +s % 100 != 0 || +s % 400 == 0, F = { _s: /* @__PURE__ */ new WeakMap(), put(s, ...e) {
  this._s.has(s) || this._s.set(s, /* @__PURE__ */ new Map());
  let t = this._s.get(s);
  if (e.length > 1)
    return t.set(e[0], e[1]), this;
  if (typeof e[0] == "object")
    for (const a in e[0])
      t.set(a, e[0][a]);
  else
    t.set(e[0]);
  return this;
}, get(s, e) {
  return !!this._s.has(s) && (e ? this._s.get(s).get(e) : this._s.get(s));
}, has(s, e) {
  return this._s.has(s) && this._s.get(s).has(e);
}, remove(s, e) {
  if (!this._s.has(s))
    return !1;
  let t = this._s.get(s).delete(e);
  return this._s.get(s).size === 0 && this._s.delete(s), t;
} }, E = (s, e, t) => {
  if (s = parseFloat(s, 10), isNaN(s))
    return NaN;
  if (e = parseFloat(e, 10), (t = parseFloat(t, 10)) < e) {
    let a = t;
    t = e, e = a;
  }
  return !isNaN(e) && s < e ? e : !isNaN(t) && s > t ? t : s;
};
let u = [];
const w = "birthdaypicker", S = "data-" + w, O = ["short", "long", "numeric"], j = ["ymd", "ydm", "myd", "mdy", "dmy", "dym"], g = ["init", "datechange", "daychange", "monthchange", "yearchange", "kill"], L = "option", y = /* @__PURE__ */ new Date(), f = { y: y.getFullYear(), m: y.getMonth() + 1, d: y.getDate(), t: y.getTime() };
let M = !1;
const p = (s) => s === !0 || s === "true" || s === 1 || s === "1";
class o {
  constructor(e, t) {
    Y(this, "_onSelect", (e) => {
      e.target === this._year.el ? this._yearWasChanged(+e.target.value) : e.target === this._month.el ? this._monthWasChanged(+e.target.value) : e.target === this._day.el && this._dayWasChanged(+e.target.value), this._dateChanged();
    });
    if (!e)
      return { error: !0 };
    if ((e = typeof e == "string" ? document.querySelector(e) : e) === null || e.length === 0)
      return { error: !0 };
    if (e.dataset.bdpInit)
      return o.getInstance(e);
    e.dataset.bdpInit = !0, u.push(this), F.put(e, "instance", this);
    const a = ((r, n, i = null) => {
      if (!r)
        return !1;
      if (n === void 0 || r.dataset[n] === void 0)
        return r.dataset;
      let h;
      try {
        h = JSON.parse(r.dataset[n].replace(/'/g, '"'));
      } catch (d) {
      }
      if (typeof h != "object") {
        h = r.dataset[n];
        const d = {};
        h = h.replace(/ /g, "");
        const c = h.split(",");
        c.length > 1 ? c.forEach((T) => {
          const [x, I] = T.split(":");
          d[x.replace(/'/g, "")] = I.replace(/'/g, "");
        }) : d[n] = h, h = d;
      }
      let l = {}, m = n.length;
      return Object.entries(r.dataset).forEach((d) => {
        if (d[0].toLowerCase().indexOf(n) >= 0 && d[0].length > m) {
          let c = d[0][m].toLowerCase() + d[0].substring(m + 1);
          (i === null || i && i[c] !== void 0) && (l[c] = d[1]);
        }
      }), Object.assign(h, l);
    })(e, w, o.defaults);
    this.options = t, this.settings = Object.assign({}, o.defaults, a, t), this.element = e, this.settings.autoInit && this.init();
  }
  _parseDate(e) {
    typeof e != "object" && (e = e.replaceAll("-", "/"));
    const t = Date.parse(e);
    return isNaN(t) ? !1 : { year: (e = new Date(t)).getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
  }
  _getIdx(e, t) {
    if (e && !isNaN(t || t === void 0)) {
      for (let a, r = 0; r < e.length; r++)
        if (a = e[r], +a.value == +t)
          return r;
    }
  }
  _updateSelectBox(e, t) {
    const a = this[e].el;
    a.selectedIndex = this._getIdx(a.childNodes, t);
  }
  _dateChanged() {
    this.settings.selectFuture || this._noFutureDate(f.y, f.m, f.d), this._triggerEvent(g[1]);
  }
  _setYear(e, t = !0) {
    return e = E(e, this._yearEnd, this._yearStart), this.currentYear !== e && (this._updateSelectBox("_year", e), this._yearWasChanged(e), t && this._dateChanged(), !0);
  }
  _setMonth(e, t = !0) {
    return e = E(e, 1, 12), this.currentMonth !== e && (this._updateSelectBox("_month", e), this._monthWasChanged(e), t && this._dateChanged(), !0);
  }
  _setDay(e, t = !0) {
    return e = E(e, 1, this.getDaysPerMonth()), this.currentDay !== e && (this._updateSelectBox("_day", e), this._dayWasChanged(e), t && this._dateChanged(), !0);
  }
  _setDate({ year: e, month: t, day: a }) {
    this._monthChangeTriggeredLater = t !== this.currentMonth;
    let r = this._setYear(e, !1), n = this._setMonth(t, !1), i = this._setDay(a, !1);
    (r || n || i) && this._dateChanged(), this._monthChangeTriggeredLater = !1;
  }
  _getMonthText(e) {
    return this.settings.monthFormat !== "numeric" ? e : this.settings.leadingZero && +e < 10 ? "0" + e : "" + e;
  }
  _create() {
    const e = this.settings;
    j.indexOf(e.arrange) < 0 && (e.arrange = "ymd");
    const t = { y: "year", m: "month", d: "day" };
    e.arrange.split("").forEach((n) => {
      const i = t[n];
      let h, l = e[i + "El"];
      l && l.nodeName !== void 0 ? h = l : (l = l || "[" + S + "-" + i + "]", h = this.element.querySelector(l)), h && !h.dataset.init || (h = _("select"), this.element.append(h)), h.setAttribute("aria-label", `select ${i}`), e.className && (h.classList.add(e.className), h.classList.add(`${e.className}-${i}`)), h.dataset.init = !0;
      const m = "change", d = this._onSelect, c = !1;
      h.addEventListener(m, d, c), this._registeredEventListeners.push({ element: h, eventName: m, listener: d, option: c }), this["_" + i] = { el: h, df: document.createDocumentFragment(), name: i }, this._date.push(this["_" + i]);
    });
    const a = _(L, { value: "" });
    e.placeholder && this._date.forEach((n) => {
      const i = o.i18n[e.locale][n.name], h = a.cloneNode();
      h.innerHTML = i, n.df.appendChild(h);
    });
    for (let n = this._yearStart; n >= this._yearEnd; n--) {
      const i = a.cloneNode();
      i.value = n, i.innerHTML = n, this._year.df.append(i);
    }
    let r;
    this.monthFormat[e.monthFormat].forEach((n, i) => {
      const h = a.cloneNode();
      h.value = i + 1, h.innerHTML = this._getMonthText(n), this._month.df.append(h);
    });
    for (let n = 1; n <= 31; n++) {
      r = e.leadingZero && n < 10 ? "0" + n : n;
      const i = _(L, { value: n }, "", r);
      this._day.df.append(i);
    }
    this._date.forEach((n) => n.el.append(n.df));
  }
  _updateDays(e) {
    let t = this.getDaysPerMonth(e);
    const a = this.settings.placeholder ? 1 : 0, r = this._day.el.children.length - a;
    if (t !== r)
      if (t === void 0 && (t = 31), t - r > 0)
        for (let n = r; n < t; n++) {
          let i = _(L, { value: n + 1 }, "", "" + (n + 1));
          this._day.el.append(i);
        }
      else {
        for (let n = r; n > t; n--)
          this._day.el.children[n + a - 1].remove();
        this.currentDay > t && (this.settings.roundDownDay ? this._setDay(t, !1) : this._dayWasChanged(void 0));
      }
  }
  _triggerEvent(e, t) {
    const a = b({ instance: this, year: +this._year.el.value, month: +this._month.el.value, day: +this._day.el.value, date: this.getDate() }, t), r = new CustomEvent(e, { detail: a });
    this.element.dispatchEvent(r), this.eventFired[e] = r, ((n, i, h) => {
      let l = n.getAttribute("on" + i);
      new Function("e", "{" + l + "}").call(n, h);
    })(this.element, e, r);
  }
  _noFutureDate(e, t, a) {
    if (this._disabled.length && (this._disabled.forEach((n) => {
      n.disabled = !1;
    }), this._disabled = []), this.currentYear < e || !this.currentYear || !this.currentYear && !this.currentMonth && !this.currentDay)
      return !1;
    this.currentYear > e && this._setYear(e, !1), this._month.el.childNodes.forEach((n) => {
      n.value > t && (n.disabled = !0, this._disabled.push(n));
    });
    const r = this.currentMonth > t;
    return r && this._setMonth(t, !1), t === this.currentMonth && (this._day.el.childNodes.forEach((n) => {
      n.value > a && (n.disabled = !0, this._disabled.push(n));
    }), (r || this.currentDay > a) && this._setDay(a, !1)), !0;
  }
  _dayWasChanged(e) {
    this.currentDay = e, this._triggerEvent(g[2]);
  }
  _monthWasChanged(e) {
    this.currentMonth = e, this._triggerEvent(g[3]), this._updateDays(e);
  }
  _yearWasChanged(e) {
    this.currentYear = e, this._daysPerMonth[1] = C(e) ? 29 : 28, this._triggerEvent(g[4]), this._monthChangeTriggeredLater || this.currentMonth !== 2 || this._updateDays(this.currentMonth);
  }
  _updateDayList() {
    const e = this.settings.placeholder ? 1 : 0;
    for (let t = 0; t < 9; t++)
      this._day.el.childNodes[t + e].innerHTML = (this.settings.leadingZero ? "0" : "") + (t + 1);
  }
  _updateMonthList() {
    const e = this.settings.monthFormat, t = this.settings.placeholder ? 1 : 0;
    this.monthFormat[e].forEach((a, r) => {
      this._month.el.childNodes[r + t].innerHTML = this._getMonthText(a);
    });
  }
  useLeadingZero(e) {
    (e = p(e)) !== this.settings.leadingZero && (this.settings.leadingZero = e, this.settings.monthFormat === "numeric" && this._updateMonthList(), this._updateDayList());
  }
  getDaysPerMonth(e = this.currentMonth) {
    return this._daysPerMonth[+e - 1];
  }
  setMonthFormat(e) {
    return !!this.monthFormat[e] && (e !== this.settings.monthFormat && (this.settings.monthFormat = e, this._updateMonthList()), !0);
  }
  setLanguage(e) {
    if (e === this.settings.locale || ("" + e).length < 2 || ("" + e).length > 2)
      return !1;
    o.createLocale(e);
    const t = o.i18n[e];
    if (this.settings.placeholder && this._date.forEach((r) => {
      r.el.childNodes[0].innerHTML = t[r.name];
    }), this.monthFormat = t.monthFormat, this.settings.locale = e, this.settings.monthFormat === "numeric")
      return !1;
    let a = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((r, n) => {
      this._month.el.childNodes[a + n].innerHTML = r;
    }), this._triggerEvent(g[1]);
  }
  setDate(e) {
    let t = this._parseDate(e);
    return t && this._setDate(t), t;
  }
  resetDate(e = !1) {
    let t = this.startDate && e ? this.startDate : { year: void 0, month: void 0, day: void 0 };
    this._setDate(t);
  }
  addEventListener(e, t, a) {
    if (g.indexOf(e) < 0 || typeof t != "function")
      return !1;
    this.element.addEventListener(e, t, a), this._registeredEventListeners.push({ element: this.element, eventName: e, listener: t, option: a }), this.eventFired[e] && t.call(this.element, this.eventFired[e]);
  }
  removeEventListener(e, t, a) {
    this.element.removeEventListener(e, t, a);
  }
  kill() {
    if (this.eventFired = {}, this._registeredEventListeners && this._registeredEventListeners.forEach((e) => e.element.removeEventListener(e.eventName, e.listener, e.option)), this.settings.className) {
      const e = this.settings.className;
      ["year", "month", "day"].forEach((t) => {
        const a = e + "-" + t, r = this.element.querySelector("." + a);
        r && (r.classList.remove(e), r.classList.remove(a));
      });
    }
    this._triggerEvent(g[5]);
  }
  isLeapYear(e = this.currentYear) {
    return e === void 0 ? void 0 : C(e);
  }
  getDateString(e) {
    if (!e) {
      const a = this.getDate();
      return a && a.toLocaleDateString(this.settings.locale);
    }
    if (!this.currentYear || !this.currentMonth || !this.currentDay)
      return "";
    let t = e.toLowerCase();
    return t = t.replace(/yyyy/g, this.currentYear), t = t.replace(/yy/g, ("" + this.currentYear).slice(2)), t = t.replace(/mm/g, ("0" + this.currentMonth).slice(-2)), t = t.replace(/m/g, this.currentMonth), t = t.replace(/dd/g, ("0" + this.currentDay).slice(-2)), t = t.replace(/d/g, this.currentDay), t;
  }
  getDate() {
    return this.currentYear && this.currentMonth && this.currentDay ? new Date(Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay)) : "";
  }
  init() {
    if (this.initialized)
      return !0;
    this.initialized = !0, this.eventFired = {}, this._registeredEventListeners = [], this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], this._date = [], this._disabled = [];
    const e = this.settings;
    if (e.placeholder = p(e.placeholder), e.leadingZero = p(e.leadingZero), e.selectFuture = p(e.selectFuture), e.maxYear === "now" ? this._yearStart = f.y : this._yearStart = e.maxYear, this._yearStart -= +e.minAge, e.minYear ? this._yearEnd = +e.minYear : this._yearEnd = this._yearStart - +e.maxAge, o.createLocale(e.locale), this.monthFormat = o.i18n[e.locale].monthFormat, this._create(), this._triggerEvent(g[0]), e.defaultDate) {
      const t = this.setDate(e.defaultDate === "now" ? (/* @__PURE__ */ new Date()).toString() : e.defaultDate);
      this.currentYear = t.year, this.currentMonth = t.month, this.currentDay = t.day, this.startDate = t;
    }
  }
}
o.i18n = {}, o.currentLocale = "en", o.getInstance = (s) => F.get(s, "instance"), o.createLocale = (s) => {
  if (s && s.length === 2 || (s = "en"), o.i18n[s])
    return o.i18n[s];
  let e = /* @__PURE__ */ new Date("2000-01-15"), t = { monthFormat: {} };
  for (let n = 0; n < 12; n++)
    e.setMonth(n), O.forEach((i) => {
      t.monthFormat[i] = t.monthFormat[i] || [], t.monthFormat[i].push(e.toLocaleDateString(s, { month: i }));
    });
  const a = "BirthdayPickerLocale";
  let r = v[s] ? v[s] : v.en;
  return window[a] && window[a][s] && (r = Object.assign({}, r, window[a][s])), o.i18n[s] = Object.assign(t, r), t;
}, o.setMonthFormat = (s) => {
  u.forEach((e) => {
    e.setMonthFormat(s);
  });
}, o.setLanguage = (s) => {
  o.currentLocale = s, u.forEach((e) => {
    e.setLanguage(s);
  });
}, o.killAll = () => !!u.length && (u.forEach((s) => {
  o.kill(s);
}), u = [], !0), o.kill = (s) => {
  if (!s || (s.element || (s = o.getInstance(s)), !s))
    return !1;
  s.kill();
  const e = s.element;
  return e.dataset.bdpInit = !1, delete e.dataset.bdpInit, F.remove(e, "instance"), M = !1, !0;
}, o.defaults = { minYear: null, maxYear: "now", minAge: 0, maxAge: 100, monthFormat: "short", placeholder: !0, className: null, defaultDate: null, autoInit: !0, leadingZero: !0, locale: "en", selectFuture: !1, arrange: "ymd", yearEl: null, monthEl: null, dayEl: null, roundDownDay: !0 }, o.init = () => {
  if (M)
    return !1;
  M = !0, o.createLocale(o.currentLocale);
  let s = document.querySelectorAll("[" + S + "]");
  return s.length !== 0 && (s.forEach((e) => {
    new o(e);
  }), u);
};
if (globalThis.getDomData)
  for (const s of Object.keys(globalThis.getDomData))
    globalThis[s] = globalThis.getDomData[s];
export {
  o as default
};
