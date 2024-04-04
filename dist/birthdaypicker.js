/*!
* BirthdayPicker v0.1.20
* https://lemon3.github.io/birthdaypicker
*/
var I = Object.defineProperty;
var b = Object.getOwnPropertySymbols;
var O = Object.prototype.hasOwnProperty, W = Object.prototype.propertyIsEnumerable;
var D = (s, e, t) => e in s ? I(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, N = (s, e) => {
  for (var t in e || (e = {}))
    O.call(e, t) && D(s, t, e[t]);
  if (b)
    for (var t of b(e))
      W.call(e, t) && D(s, t, e[t]);
  return s;
};
var Y = (s, e, t) => (D(s, typeof e != "symbol" ? e + "" : e, t), t);
const v = { en: { year: "Year", month: "Month", day: "Day" }, de: { year: "Jahr", month: "Monat", day: "Tag" }, fr: { year: "Année", month: "Mois", day: "Jour" } }, _ = (s, e, t, r) => ((n, a, i, o) => {
  if (a)
    for (const l in a)
      n.setAttribute(l, a[l]);
  if (i)
    for (const l in i)
      n.style[l] = i[l];
  return o && (n.innerHTML = o), n;
})(document.createElement(s), e, t, r), T = (s) => +s % 4 == 0 && +s % 100 != 0 || +s % 400 == 0, E = { _s: /* @__PURE__ */ new WeakMap(), put(s, ...e) {
  this._s.has(s) || this._s.set(s, /* @__PURE__ */ new Map());
  let t = this._s.get(s);
  if (e.length > 1)
    return t.set(e[0], e[1]), this;
  if (typeof e[0] == "object")
    for (const r in e[0])
      t.set(r, e[0][r]);
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
} }, M = (s, e, t) => {
  if (s = parseFloat(s, 10), isNaN(s))
    return NaN;
  if (e = parseFloat(e, 10), (t = parseFloat(t, 10)) < e) {
    let r = t;
    t = e, e = r;
  }
  return !isNaN(e) && s < e ? e : !isNaN(t) && s > t ? t : s;
};
let u = [];
const C = "birthdaypicker", x = "data-" + C, j = ["short", "long", "numeric"], Z = ["ymd", "ydm", "myd", "mdy", "dmy", "dym"], g = ["init", "datechange", "daychange", "monthchange", "yearchange", "kill"], L = "option", w = { y: "year", m: "month", d: "day" }, y = /* @__PURE__ */ new Date(), p = { y: y.getFullYear(), m: y.getMonth() + 1, d: y.getDate(), t: y.getTime() };
let F = !1;
const f = (s) => s === !0 || s === "true" || s === 1 || s === "1";
class h {
  constructor(e, t) {
    Y(this, "_onSelect", (e) => {
      e.target === this._year.el ? this._yearWasChanged(+e.target.value) : e.target === this._month.el ? this._monthWasChanged(+e.target.value) : e.target === this._day.el && this._dayWasChanged(+e.target.value), this._dateChanged();
    });
    if (!e)
      return { error: !0 };
    if ((e = typeof e == "string" ? document.querySelector(e) : e) === null || e.length === 0)
      return { error: !0 };
    if (e.dataset.bdpInit)
      return h.getInstance(e);
    e.dataset.bdpInit = !0, u.push(this), E.put(e, "instance", this);
    const r = ((n, a, i = null) => {
      if (!n)
        return !1;
      if (a === void 0 || n.dataset[a] === void 0)
        return n.dataset;
      let o;
      try {
        o = JSON.parse(n.dataset[a].replace(/'/g, '"'));
      } catch (d) {
      }
      if (typeof o != "object") {
        o = n.dataset[a];
        const d = {};
        o = o.replace(/ /g, "");
        const c = o.split(",");
        c.length > 1 ? c.forEach((S) => {
          const [A, k] = S.split(":");
          d[A.replace(/'/g, "")] = k.replace(/'/g, "");
        }) : d[a] = o, o = d;
      }
      let l = {}, m = a.length;
      return Object.entries(n.dataset).forEach((d) => {
        if (d[0].toLowerCase().indexOf(a) >= 0 && d[0].length > m) {
          let c = d[0][m].toLowerCase() + d[0].substring(m + 1);
          (i === null || i && i[c] !== void 0) && (l[c] = d[1]);
        }
      }), Object.assign(o, l);
    })(e, C, h.defaults);
    this.options = t, this.settings = Object.assign({}, h.defaults, r, t), this.element = e, this.settings.autoInit && this.init();
  }
  _parseDate(e) {
    typeof e != "object" && (e = e.replaceAll("-", "/"));
    const t = Date.parse(e);
    return isNaN(t) ? !1 : { year: (e = new Date(t)).getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
  }
  _getIdx(e, t) {
    if (e && !isNaN(t || t === void 0)) {
      for (let r, n = 0; n < e.length; n++)
        if (r = e[n], +r.value == +t)
          return n;
    }
  }
  _updateSelectBox(e, t) {
    const r = this[e].el;
    r.selectedIndex = this._getIdx(r.childNodes, t);
  }
  _dateChanged() {
    this.settings.selectFuture || this._noFutureDate(p.y, p.m, p.d), this._triggerEvent(g[1]), this.element.value = this.getDateString();
  }
  _setYear(e, t = !0) {
    return e = M(e, this._yearFrom, this._yearTo), this.currentYear !== e && (this._updateSelectBox("_year", e), this._yearWasChanged(e), t && this._dateChanged(), !0);
  }
  _setMonth(e, t = !0) {
    return e = M(e, 1, 12), this.currentMonth !== e && (this._updateSelectBox("_month", e), this._monthWasChanged(e), t && this._dateChanged(), !0);
  }
  _setDay(e, t = !0) {
    return e = M(e, 1, this._getDaysPerMonth()), this.currentDay !== e && (this._updateSelectBox("_day", e), this._dayWasChanged(e), t && this._dateChanged(), !0);
  }
  _setDate({ year: e, month: t, day: r }) {
    this._monthChangeTriggeredLater = t !== this.currentMonth;
    let n = this._setYear(e, !1), a = this._setMonth(t, !1), i = this._setDay(r, !1);
    (n || a || i) && this._dateChanged(), this._monthChangeTriggeredLater = !1;
  }
  _getMonthText(e) {
    return this.settings.monthFormat !== "numeric" ? e : this.settings.leadingZero && +e < 10 ? "0" + e : "" + e;
  }
  _checkArrangement(e) {
    return Z.indexOf(e) < 0 ? "ymd" : e;
  }
  _create() {
    const e = this.settings;
    e.arrange = this._checkArrangement(e.arrange), e.arrange.split("").forEach((n) => {
      const a = w[n];
      let i, o = !1, l = e[a + "El"];
      l && l.nodeName !== void 0 ? i = l : (l = l || "[" + x + "-" + a + "]", i = this.element.querySelector(l)), i && !i.dataset.init || (i = _("select"), o = !0, this.element.append(i)), i.setAttribute("aria-label", `select ${a}`), e.className && (i.classList.add(e.className), i.classList.add(`${e.className}-${a}`)), i.dataset.init = !0;
      const m = "change", d = this._onSelect, c = !1;
      i.addEventListener(m, d, c), this._registeredEventListeners.push({ element: i, eventName: m, listener: d, option: c }), this["_" + a] = { el: i, name: a, created: o, df: document.createDocumentFragment() }, this._date.push(this["_" + a]);
    });
    const t = _(L);
    e.placeholder && this._date.forEach((n) => {
      const a = h.i18n[e.locale][n.name], i = t.cloneNode();
      i.innerHTML = a, n.df.appendChild(i);
    });
    for (let n = this._yearTo; n >= this._yearFrom; n--) {
      const a = t.cloneNode();
      a.value = n, a.innerHTML = n, this._year.df.append(a);
    }
    let r;
    this.monthFormat[e.monthFormat].forEach((n, a) => {
      const i = t.cloneNode();
      i.value = a + 1, i.innerHTML = this._getMonthText(n), this._month.df.append(i);
    });
    for (let n = 1; n <= 31; n++) {
      r = e.leadingZero && n < 10 ? "0" + n : n;
      const a = _(L, { value: n }, "", r);
      this._day.df.append(a);
    }
    this._date.forEach((n) => n.el.append(n.df));
  }
  _updateDays(e = this.currentMonth) {
    let t = this._getDaysPerMonth(e);
    const r = this.settings.placeholder ? 1 : 0, n = this._day.el.children.length - r;
    if (t !== n)
      if (t === void 0 && (t = 31), t - n > 0)
        for (let a = n; a < t; a++) {
          let i = _(L, { value: a + 1 }, "", "" + (a + 1));
          this._day.el.append(i);
        }
      else {
        for (let a = n; a > t; a--)
          this._day.el.children[a + r - 1].remove();
        this.currentDay > t && (this.settings.roundDownDay ? this._setDay(t, !1) : this._dayWasChanged(void 0));
      }
  }
  _triggerEvent(e, t) {
    const r = N({ instance: this, year: +this._year.el.value, month: +this._month.el.value, day: +this._day.el.value, date: this.getDate() }, t), n = new CustomEvent(e, { detail: r });
    this.element.dispatchEvent(n), this.eventFired[e] = n, ((a, i, o) => {
      let l = a.getAttribute("on" + i);
      new Function("e", "{" + l + "}").call(a, o);
    })(this.element, e, n);
  }
  _noFutureDate(e, t, r) {
    if (this._disabled.length && (this._disabled.forEach((a) => {
      a.disabled = !1;
    }), this._disabled = []), this.currentYear < e || !this.currentYear || !this.currentYear && !this.currentMonth && !this.currentDay)
      return !1;
    this.currentYear > e && this._setYear(e, !1), this._month.el.childNodes.forEach((a) => {
      a.value > t && (a.disabled = !0, this._disabled.push(a));
    });
    const n = this.currentMonth > t;
    return n && this._setMonth(t, !1), t === this.currentMonth && (this._day.el.childNodes.forEach((a) => {
      a.value > r && (a.disabled = !0, this._disabled.push(a));
    }), (n || this.currentDay > r) && this._setDay(r, !1)), !0;
  }
  _dayWasChanged(e) {
    this.currentDay = e, this._triggerEvent(g[2]);
  }
  _monthWasChanged(e) {
    this.currentMonth = e, this._triggerEvent(g[3]), this._updateDays();
  }
  _yearWasChanged(e) {
    this.currentYear = e, this._daysPerMonth[1] = T(e) ? 29 : 28, this._triggerEvent(g[4]), this._monthChangeTriggeredLater || this.currentMonth !== 2 || this._updateDays();
  }
  _updateDayList() {
    const e = this.settings.placeholder ? 1 : 0, t = this.settings.leadingZero ? "0" : "";
    for (let r = e; r < 9 + e; r++)
      this._day.el.childNodes[r].innerHTML = t + r;
  }
  _updateMonthList() {
    const e = this.settings.monthFormat, t = this.settings.placeholder ? 1 : 0;
    this.monthFormat[e].forEach((r, n) => {
      this._month.el.childNodes[n + t].innerHTML = this._getMonthText(r);
    });
  }
  useLeadingZero(e) {
    (e = f(e)) !== this.settings.leadingZero && (this.settings.leadingZero = e, this.settings.monthFormat === "numeric" && this._updateMonthList(), this._updateDayList());
  }
  _getDaysPerMonth(e = this.currentMonth) {
    return this._daysPerMonth[+e - 1];
  }
  setMonthFormat(e) {
    return !(!this.monthFormat[e] || e === this.settings.monthFormat) && (this.settings.monthFormat = e, this._updateMonthList(), !0);
  }
  setLanguage(e) {
    if (e === this.settings.locale || ("" + e).length < 2 || ("" + e).length > 2)
      return !1;
    h.createLocale(e);
    const t = h.i18n[e];
    if (this.settings.placeholder && this._date.forEach((n) => {
      n.el.childNodes[0].innerHTML = t[n.name];
    }), this.monthFormat = t.monthFormat, this.settings.locale = e, this.settings.monthFormat === "numeric")
      return !1;
    let r = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((n, a) => {
      this._month.el.childNodes[r + a].innerHTML = n;
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
  addEventListener(e, t, r) {
    if (g.indexOf(e) < 0 || typeof t != "function")
      return !1;
    this.element.addEventListener(e, t, r), this._registeredEventListeners.push({ element: this.element, eventName: e, listener: t, option: r }), this.eventFired[e] && t.call(this.element, this.eventFired[e]);
  }
  removeEventListener(e, t, r) {
    this.element.removeEventListener(e, t, r);
  }
  kill() {
    this.eventFired = {}, this._registeredEventListeners && this._registeredEventListeners.forEach((e) => e.element.removeEventListener(e.eventName, e.listener, e.option)), this._date.forEach((e) => {
      if (e.created)
        e.el.remove();
      else {
        const t = this.settings.className;
        t && (e.el.classList.remove(t), Object.values(w).forEach((r) => {
          e.el.classList.remove(`${t}-${r}`);
        }));
      }
    }), this._triggerEvent(g[5]);
  }
  isLeapYear(e = this.currentYear) {
    return e === void 0 ? void 0 : T(e);
  }
  getAge() {
    const e = this.currentYear, t = this.currentMonth, r = this.currentDay, n = /* @__PURE__ */ new Date(), a = n.getMonth() + 1;
    let i = n.getFullYear() - e;
    return a < t || a === t && n.getDate() < r ? --i : i;
  }
  getDateString(e) {
    if (!e) {
      const r = this.getDate();
      return r && r.toLocaleDateString(this.settings.locale);
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
    e.placeholder = f(e.placeholder), e.leadingZero = f(e.leadingZero), e.selectFuture = f(e.selectFuture), e.maxYear === "now" ? this._yearTo = p.y : this._yearTo = e.maxYear, e.minYear ? this._yearFrom = +e.minYear : this._yearFrom = this._yearTo - +e.maxAge, this._yearTo -= +e.minAge;
    const [t] = h.createLocale(e.locale);
    if (e.locale = t, this.monthFormat = h.i18n[e.locale].monthFormat, this._create(), this._triggerEvent(g[0]), e.defaultDate) {
      const r = this.setDate(e.defaultDate === "now" ? (/* @__PURE__ */ new Date()).toString() : e.defaultDate);
      this.currentYear = r.year, this.currentMonth = r.month, this.currentDay = r.day, this.startDate = r;
    }
  }
}
h.i18n = {}, h.currentLocale = "en", h.getInstance = (s) => E.get(s, "instance"), h.createLocale = (s) => {
  if (s && s.length === 2 || (s = "en"), h.i18n[s])
    return [s, h.i18n[s]];
  let e = /* @__PURE__ */ new Date("2000-01-15"), t = { monthFormat: {} };
  for (let a = 0; a < 12; a++)
    e.setMonth(a), j.forEach((i) => {
      t.monthFormat[i] = t.monthFormat[i] || [], t.monthFormat[i].push(e.toLocaleDateString(s, { month: i }));
    });
  const r = "BirthdayPickerLocale";
  let n = v[s] ? v[s] : v.en;
  return window[r] && window[r][s] && (n = Object.assign({}, n, window[r][s])), h.i18n[s] = Object.assign(t, n), [s, t];
}, h.setMonthFormat = (s) => {
  u.forEach((e) => {
    e.setMonthFormat(s);
  });
}, h.setLanguage = (s) => {
  h.currentLocale = s, u.forEach((e) => {
    e.setLanguage(s);
  });
}, h.killAll = () => !!u.length && (u.forEach((s) => {
  h.kill(s);
}), u = [], !0), h.kill = (s) => {
  if (!s || (s.element || (s = h.getInstance(s)), !s))
    return !1;
  s.kill();
  const e = s.element;
  return e.dataset.bdpInit = !1, delete e.dataset.bdpInit, E.remove(e, "instance"), F = !1, !0;
}, h.defaults = { minYear: null, maxYear: "now", minAge: 0, maxAge: 100, monthFormat: "short", placeholder: !0, className: null, defaultDate: null, autoInit: !0, leadingZero: !0, locale: "en", selectFuture: !1, arrange: "ymd", yearEl: null, monthEl: null, dayEl: null, roundDownDay: !0 }, h.init = () => {
  if (F)
    return !1;
  F = !0, h.createLocale(h.currentLocale);
  let s = document.querySelectorAll("[" + x + "]");
  return s.length !== 0 && (s.forEach((e) => {
    new h(e);
  }), u);
};
if (globalThis.getDomData)
  for (const s of Object.keys(globalThis.getDomData))
    globalThis[s] = globalThis.getDomData[s];
export {
  h as default
};
