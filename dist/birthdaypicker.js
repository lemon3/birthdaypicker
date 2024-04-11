/*!
* BirthdayPicker v0.1.23
* https://lemon3.github.io/birthdaypicker
*/
var H = Object.defineProperty;
var w = Object.getOwnPropertySymbols;
var B = Object.prototype.hasOwnProperty, P = Object.prototype.propertyIsEnumerable;
var D = (r, e, t) => e in r ? H(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, Y = (r, e) => {
  for (var t in e || (e = {}))
    B.call(e, t) && D(r, t, e[t]);
  if (w)
    for (var t of w(e))
      P.call(e, t) && D(r, t, e[t]);
  return r;
};
var x = (r, e, t) => (D(r, typeof e != "symbol" ? e + "" : e, t), t);
const L = { en: { year: "Year", month: "Month", day: "Day" }, de: { year: "Jahr", month: "Monat", day: "Tag" }, fr: { year: "Année", month: "Mois", day: "Jour" } }, y = (r, e, t, n) => ((i, s, a, h) => {
  if (s)
    for (const o in s)
      i.setAttribute(o, s[o]);
  if (a)
    for (const o in a)
      i.style[o] = a[o];
  return h && (i.innerHTML = h), i;
})(document.createElement(r), e, t, n), T = (r) => +r % 4 == 0 && +r % 100 != 0 || +r % 400 == 0, N = { _s: /* @__PURE__ */ new WeakMap(), put(r, ...e) {
  this._s.has(r) || this._s.set(r, /* @__PURE__ */ new Map());
  let t = this._s.get(r);
  if (e.length > 1)
    return t.set(e[0], e[1]), this;
  if (typeof e[0] == "object")
    for (const n in e[0])
      t.set(n, e[0][n]);
  else
    t.set(e[0]);
  return this;
}, get(r, e) {
  return !!this._s.has(r) && (e ? this._s.get(r).get(e) : this._s.get(r));
}, has(r, e) {
  return this._s.has(r) && this._s.get(r).has(e);
}, remove(r, e) {
  if (!this._s.has(r))
    return !1;
  let t = this._s.get(r).delete(e);
  return this._s.get(r).size === 0 && this._s.delete(r), t;
} }, v = (r, e, t) => {
  if (r = parseFloat(r, 10), isNaN(r))
    return NaN;
  if (e = parseFloat(e, 10), (t = parseFloat(t, 10)) < e) {
    let n = t;
    t = e, e = n;
  }
  return !isNaN(e) && r < e ? e : !isNaN(t) && r > t ? t : r;
};
let g = [];
const C = "birthdaypicker", E = "data-" + C, $ = ["short", "long", "numeric"], q = ["ymd", "ydm", "myd", "mdy", "dmy", "dym"], S = "init", b = "datechange", A = "daychange", I = "monthchange", O = "yearchange", j = "kill", z = [S, b, A, I, O, j], M = "option", _ = { y: "year", m: "month", d: "day" }, p = /* @__PURE__ */ new Date(), m = { y: p.getFullYear(), m: p.getMonth() + 1, d: p.getDate(), t: p.getTime() };
let F = !1;
const f = (r) => r === !0 || r === "true" || r === 1 || r === "1";
class l {
  constructor(e, t) {
    x(this, "_onSelect", (e) => {
      e.target === this._year.el ? this._yearWasChanged(+e.target.value) : e.target === this._month.el ? this._monthWasChanged(+e.target.value) : e.target === this._day.el && this._dayWasChanged(+e.target.value), this._dateChanged();
    });
    if (!e)
      return { error: !0 };
    if ((e = typeof e == "string" ? document.querySelector(e) : e) === null || e.length === 0)
      return { error: !0 };
    if (e.dataset.bdpInit)
      return l.getInstance(e);
    e.dataset.bdpInit = !0, g.push(this), N.put(e, "instance", this);
    const n = ((i, s, a = null) => {
      if (!i)
        return !1;
      if (s === void 0 || i.dataset[s] === void 0)
        return i.dataset;
      let h;
      try {
        h = JSON.parse(i.dataset[s].replace(/'/g, '"'));
      } catch (c) {
      }
      if (typeof h != "object") {
        h = i.dataset[s];
        const c = {};
        h = h.replace(/ /g, "");
        const u = h.split(",");
        u.length > 1 ? u.forEach((k) => {
          const [W, Z] = k.split(":");
          c[W.replace(/'/g, "")] = Z.replace(/'/g, "");
        }) : c[s] = h, h = c;
      }
      let o = {}, d = s.length;
      return Object.entries(i.dataset).forEach((c) => {
        if (c[0].toLowerCase().indexOf(s) >= 0 && c[0].length > d) {
          let u = c[0][d].toLowerCase() + c[0].substring(d + 1);
          (a === null || a && a[u] !== void 0) && (o[u] = c[1]);
        }
      }), Object.assign(h, o);
    })(e, C, l.defaults);
    this.options = t || {}, this.settings = Object.assign({}, l.defaults, n, t), this.element = e, this.settings.autoInit && this.init();
  }
  _parseDate(e) {
    typeof e != "object" && (e = e.replaceAll("-", "/"));
    const t = Date.parse(e);
    return isNaN(t) ? !1 : { year: (e = new Date(t)).getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
  }
  _getIdx(e, t) {
    if (e && !isNaN(t || t === void 0)) {
      for (let n, i = 0; i < e.length; i++)
        if (n = e[i], +n.value == +t)
          return i;
    }
  }
  _updateSelectBox(e, t) {
    const n = this[e].el;
    n.selectedIndex = this._getIdx(n.childNodes, t);
  }
  _setYear(e) {
    return e = v(e, this._yearFrom, this._yearTo), this.currentYear !== e && (this._updateSelectBox("_year", e), this._yearWasChanged(e, !1), !0);
  }
  _setMonth(e) {
    return e = v(e, 1, 12), this.currentMonth !== e && (this._updateSelectBox("_month", e), this._monthWasChanged(e, !1), !0);
  }
  _setDay(e) {
    return e = v(e, 1, this._getDaysPerMonth()), this.currentDay !== e && (this._updateSelectBox("_day", e), this._dayWasChanged(e, !1), !0);
  }
  _getDateInRange({ year: e = this.currentYear, month: t = this.currentMonth, day: n = this.currentDay }) {
    const i = this._lowerLimit, s = this._upperLimit;
    return e > s.year || e >= s.year && t > s.month || e >= s.year && t >= s.month && n > s.day ? s : e < i.year || e <= i.year && t < i.month || e <= i.year && t <= i.month && n < i.day ? i : { year: e, month: t, day: n };
  }
  _setDate(e, t = !1) {
    e = this._getDateInRange(e);
    let n = this._setYear(e.year), i = this._setMonth(e.month), s = this._setDay(e.day);
    return (n || i || s) && this._dateChanged(t), e;
  }
  _getMonthText(e) {
    return this.settings.monthFormat !== "numeric" ? e : this.settings.leadingZero && +e < 10 ? "0" + e : "" + e;
  }
  _checkArrangement(e) {
    return e = e.toLowerCase(), q.indexOf(e) < 0 ? "ymd" : e;
  }
  _mapSelectBoxes() {
    let e = this.element.querySelectorAll("select");
    const t = {};
    if (e.length === 0)
      return t;
    let n = this.settings.arrange.split("");
    return n.forEach((i) => {
      const s = _[i];
      let a = this.settings[s + "El"] || "[" + E + "-" + s + "]";
      if (a) {
        let h;
        if (h = a.nodeName !== void 0 ? a : this.element.querySelector(a), h)
          return t[s] = h, n = n.filter((o) => o !== i), void (e = Object.values(e).filter((o) => o !== h));
      }
      e = Object.values(e).filter((h) => {
        const o = h.attributes[E + "-" + s];
        return o && (t[s] = h, n = n.filter((d) => d !== i)), !o;
      });
    }), n.forEach((i, s) => {
      t[_[i]] = e[s];
    }), t;
  }
  _create() {
    const e = this.settings;
    e.arrange = this._checkArrangement(e.arrange);
    const t = this._mapSelectBoxes();
    e.arrange.split("").forEach((s) => {
      const a = _[s];
      let h = !1, o = t[a];
      o && !o.dataset.init || (o = y("select"), h = !0, this.element.append(o)), o.setAttribute("aria-label", `select ${a}`), e.className && (o.classList.add(e.className), o.classList.add(`${e.className}-${a}`)), o.dataset.init = !0;
      const d = "change", c = this._onSelect, u = !1;
      o.addEventListener(d, c, u), this._registeredEventListeners.push({ element: o, eventName: d, listener: c, option: u }), this["_" + a] = { el: o, name: a, created: h, df: document.createDocumentFragment() }, this._date.push(this["_" + a]);
    });
    const n = y(M);
    e.placeholder && this._date.forEach((s) => {
      const a = l.i18n[e.locale][s.name], h = n.cloneNode();
      h.innerHTML = a, s.df.appendChild(h);
    });
    for (let s = this._yearTo; s >= this._yearFrom; s--) {
      const a = n.cloneNode();
      a.value = s, a.innerHTML = s, this._year.df.append(a);
    }
    let i;
    this.monthFormat[e.monthFormat].forEach((s, a) => {
      const h = n.cloneNode();
      h.value = a + 1, h.innerHTML = this._getMonthText(s), this._month.df.append(h);
    });
    for (let s = 1; s <= 31; s++) {
      i = e.leadingZero && s < 10 ? "0" + s : s;
      const a = y(M, { value: s }, "", i);
      this._day.df.append(a);
    }
    this._date.forEach((s) => s.el.append(s.df));
  }
  _updateDays(e = this.currentMonth) {
    let t = this._getDaysPerMonth(e);
    const n = this.settings.placeholder ? 1 : 0, i = this._day.el.children.length - n;
    if (t !== i)
      if (t === void 0 && (t = 31), t - i > 0)
        for (let s = i; s < t; s++) {
          let a = y(M, { value: s + 1 }, "", "" + (s + 1));
          this._day.el.append(a);
        }
      else {
        for (let s = i; s > t; s--)
          this._day.el.children[s + n - 1].remove();
        this.currentDay > t && (this.settings.roundDownDay ? this._setDay(t) : this._dayWasChanged(void 0));
      }
  }
  _triggerEvent(e, t) {
    const n = Y({ instance: this, year: +this._year.el.value, month: +this._month.el.value, day: +this._day.el.value, date: this.getDate() }, t), i = new CustomEvent(e, { detail: n });
    this.element.dispatchEvent(i), this.eventFired[e] = i, this.settings[e] && typeof this.settings[e] == "function" && this.settings[e].call(this, i), ((s, a, h) => {
      let o = s.getAttribute("on" + a);
      new Function("e", "{" + o + "}").call(s, h);
    })(this.element, e, i);
  }
  _disable(e, t, n) {
    const i = t === "<" ? (s) => s < n : (s) => s > n;
    this[e].el.childNodes.forEach((s) => {
      i(+s.value) && (s.disabled = !0, this._disabled.push(s));
    });
  }
  _noFutureDate(e = this._lowerLimit, t = this._upperLimit) {
    const n = () => {
      this.currentYear > t.year && this._setYear(t.year), this._disable("_month", ">", t.month);
      const s = this.currentMonth > t.month;
      s && this._setMonth(t.month), t.month === this.currentMonth && (this._disable("_day", ">", t.day), (s || this.currentDay > t.day) && this._setDay(t.day));
    }, i = () => {
      this.currentYear < e.year && this._setYear(e.year), this._disable("_month", "<", e.month);
      const s = this.currentMonth < e.month;
      s && this._setMonth(e.month), e.month === this.currentMonth && (this._disable("_day", "<", e.day), (s || this.currentDay < e.day) && this._setDay(e.day));
    };
    return this._disabled.length && (this._disabled.forEach((s) => {
      s.disabled = !1;
    }), this._disabled = []), !(this.currentYear < t.year && this.currentYear > e.year || !this.currentYear || !(this.currentYear || this.currentMonth || this.currentDay)) && (this.currentYear >= t.year ? n() : this.currentYear <= e.year && i(), !0);
  }
  _yearWasChanged(e, t = !0) {
    this.currentYear = e, this._daysPerMonth[1] = T(e) ? 29 : 28, t && this._triggerEvent(O), this.currentMonth === 2 && this._updateDays();
  }
  _monthWasChanged(e, t = !0) {
    this.currentMonth = e, t && this._triggerEvent(I), this._updateDays();
  }
  _dayWasChanged(e, t = !0) {
    this.currentDay = e, t && this._triggerEvent(A);
  }
  _dateChanged(e = !0) {
    this.settings.selectFuture || this._noFutureDate(this._lowerLimit, this._upperLimit), e && this._triggerEvent(b), this.element.value = this.getDateString();
  }
  _updateDayList() {
    const e = this.settings.placeholder ? 1 : 0, t = this.settings.leadingZero ? "0" : "";
    for (let n = e; n < 9 + e; n++)
      this._day.el.childNodes[n].innerHTML = t + n;
  }
  _updateMonthList() {
    const e = this.settings.monthFormat, t = this.settings.placeholder ? 1 : 0;
    this.monthFormat[e].forEach((n, i) => {
      this._month.el.childNodes[i + t].innerHTML = this._getMonthText(n);
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
    l.createLocale(e);
    const t = l.i18n[e];
    if (this.settings.placeholder && this._date.forEach((i) => {
      i.el.childNodes[0].innerHTML = t[i.name];
    }), this.monthFormat = t.monthFormat, this.settings.locale = e, this.settings.monthFormat === "numeric")
      return !1;
    let n = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((i, s) => {
      this._month.el.childNodes[n + s].innerHTML = i;
    });
  }
  setDate(e, t = !1) {
    let n = this._parseDate(e);
    return n && (n = this._setDate(n, t)), n;
  }
  resetDate(e = !1) {
    let t = "";
    this.startDate && e ? (this._setDate(this.startDate), t = this.getDateString()) : this._setDate({ year: NaN, month: NaN, day: NaN }), this.element.value = t, this._triggerEvent(b);
  }
  addEventListener(e, t, n) {
    if (z.indexOf(e) < 0 || typeof t != "function")
      return !1;
    this.element.addEventListener(e, t, n), this._registeredEventListeners.push({ element: this.element, eventName: e, listener: t, option: n }), this.eventFired[e] && t.call(this.element, this.eventFired[e]);
  }
  removeEventListener(e, t, n) {
    this.element.removeEventListener(e, t, n);
  }
  kill() {
    this.eventFired = {}, this._registeredEventListeners && this._registeredEventListeners.forEach((e) => e.element.removeEventListener(e.eventName, e.listener, e.option)), this._date.forEach((e) => {
      if (e.created)
        e.el.remove();
      else {
        const t = this.settings.className;
        t && (e.el.classList.remove(t), Object.values(_).forEach((n) => {
          e.el.classList.remove(`${t}-${n}`);
        }));
      }
    }), this._triggerEvent(j);
  }
  isLeapYear(e = this.currentYear) {
    return e === void 0 ? void 0 : T(e);
  }
  getAge() {
    if (isNaN(this.currentYear) || isNaN(this.currentMonth) || isNaN(this.currentDay))
      return "";
    const e = this.currentYear, t = this.currentMonth, n = this.currentDay, i = /* @__PURE__ */ new Date(), s = i.getMonth() + 1;
    let a = i.getFullYear() - e;
    return s < t || s === t && i.getDate() < n ? --a : a;
  }
  getDateString(e) {
    if (!e) {
      const n = this.getDate();
      return n && n.toLocaleDateString(this.settings.locale);
    }
    if (!this.currentYear || !this.currentMonth || !this.currentDay)
      return "";
    let t = e.toLowerCase();
    return t = t.replace(/yyyy/g, this.currentYear), t = t.replace(/yy/g, ("" + this.currentYear).slice(2)), t = t.replace(/mm/g, ("0" + this.currentMonth).slice(-2)), t = t.replace(/m/g, this.currentMonth), t = t.replace(/dd/g, ("0" + this.currentDay).slice(-2)), t = t.replace(/d/g, this.currentDay), t;
  }
  getDate() {
    return this.currentYear && this.currentMonth && this.currentDay ? new Date(Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay)) : "";
  }
  _getUpperLimit(e) {
    if (e.upperLimit)
      return e.upperLimit;
    let t;
    return e.maxYear === "now" ? (t = m.y - +e.minAge, { year: t, month: m.m, day: m.d }) : (t = e.maxYear, { year: t, month: 12, day: 31 });
  }
  _getLowerLimit(e) {
    if (e.lowerLimit)
      return e.lowerLimit;
    let t;
    return e.minYear !== null ? (t = +e.minYear, { year: t, month: 1, day: 1 }) : (t = (e.maxYear === "now" ? m.y : e.maxYear) - +e.maxAge, { year: t, month: m.m, day: m.d });
  }
  init() {
    if (this.initialized)
      return !0;
    this.initialized = !0, this.eventFired = {}, this._registeredEventListeners = [], this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], this._date = [], this._disabled = [];
    const e = this.settings;
    e.placeholder = f(e.placeholder), e.leadingZero = f(e.leadingZero), e.selectFuture = f(e.selectFuture), this._lowerLimit = this._getLowerLimit(e), this._upperLimit = this._getUpperLimit(e), this._yearFrom = this._lowerLimit.year, this._yearTo = this._upperLimit.year;
    const [t] = l.createLocale(e.locale);
    if (e.locale = t, this.monthFormat = l.i18n[e.locale].monthFormat, this._create(), this._triggerEvent(S), e.defaultDate) {
      const n = this.setDate(e.defaultDate === "now" ? (/* @__PURE__ */ new Date()).toString() : e.defaultDate, !0);
      this.startDate = n;
    }
  }
}
l.i18n = {}, l.currentLocale = "en", l.getInstance = (r) => N.get(r, "instance"), l.createLocale = (r) => {
  if (r && r.length === 2 || (r = "en"), l.i18n[r])
    return [r, l.i18n[r]];
  let e = /* @__PURE__ */ new Date("2000-01-15"), t = { monthFormat: {} };
  for (let s = 0; s < 12; s++)
    e.setMonth(s), $.forEach((a) => {
      t.monthFormat[a] = t.monthFormat[a] || [], t.monthFormat[a].push(e.toLocaleDateString(r, { month: a }));
    });
  const n = "BirthdayPickerLocale";
  let i = L[r] ? L[r] : L.en;
  return window[n] && window[n][r] && (i = Object.assign({}, i, window[n][r])), l.i18n[r] = Object.assign(t, i), [r, t];
}, l.setMonthFormat = (r) => {
  g.forEach((e) => {
    e.setMonthFormat(r);
  });
}, l.setLanguage = (r) => {
  l.currentLocale = r, g.forEach((e) => {
    e.setLanguage(r);
  });
}, l.killAll = () => !!g.length && (g.forEach((r) => {
  l.kill(r);
}), g = [], !0), l.kill = (r) => {
  if (!r || (r.element || (r = l.getInstance(r)), !r))
    return !1;
  r.kill();
  const e = r.element;
  return e.dataset.bdpInit = !1, delete e.dataset.bdpInit, N.remove(e, "instance"), F = !1, !0;
}, l.defaults = { minAge: 0, maxAge: 100, minYear: null, maxYear: "now", lowerLimit: null, upperLimit: null, monthFormat: "short", placeholder: !0, className: null, defaultDate: null, autoInit: !0, leadingZero: !0, locale: "en", selectFuture: !1, arrange: "ymd", yearEl: null, monthEl: null, dayEl: null, roundDownDay: !0 }, l.init = () => {
  if (F)
    return !1;
  F = !0, l.createLocale(l.currentLocale);
  let r = document.querySelectorAll("[" + E + "]");
  return r.length !== 0 && (r.forEach((e) => {
    new l(e);
  }), g);
};
if (globalThis.getDomData)
  for (const r of Object.keys(globalThis.getDomData))
    globalThis[r] = globalThis.getDomData[r];
export {
  l as default
};
