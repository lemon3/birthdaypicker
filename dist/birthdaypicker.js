/*!
* BirthdayPicker v0.1.21
* https://lemon3.github.io/birthdaypicker
*/
var j = Object.defineProperty;
var Y = Object.getOwnPropertySymbols;
var k = Object.prototype.hasOwnProperty, I = Object.prototype.propertyIsEnumerable;
var v = (s, e, t) => e in s ? j(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, T = (s, e) => {
  for (var t in e || (e = {}))
    k.call(e, t) && v(s, t, e[t]);
  if (Y)
    for (var t of Y(e))
      I.call(e, t) && v(s, t, e[t]);
  return s;
};
var w = (s, e, t) => (v(s, typeof e != "symbol" ? e + "" : e, t), t);
const M = { en: { year: "Year", month: "Month", day: "Day" }, de: { year: "Jahr", month: "Monat", day: "Tag" }, fr: { year: "Année", month: "Mois", day: "Jour" } }, _ = (s, e, t, r) => ((a, n, i, h) => {
  if (n)
    for (const o in n)
      a.setAttribute(o, n[o]);
  if (i)
    for (const o in i)
      a.style[o] = i[o];
  return h && (a.innerHTML = h), a;
})(document.createElement(s), e, t, r), C = (s) => +s % 4 == 0 && +s % 100 != 0 || +s % 400 == 0, b = { _s: /* @__PURE__ */ new WeakMap(), put(s, ...e) {
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
} }, L = (s, e, t) => {
  if (s = parseFloat(s, 10), isNaN(s))
    return NaN;
  if (e = parseFloat(e, 10), (t = parseFloat(t, 10)) < e) {
    let r = t;
    t = e, e = r;
  }
  return !isNaN(e) && s < e ? e : !isNaN(t) && s > t ? t : s;
};
let m = [];
const x = "birthdaypicker", N = "data-" + x, W = ["short", "long", "numeric"], Z = ["ymd", "ydm", "myd", "mdy", "dmy", "dym"], u = ["init", "datechange", "daychange", "monthchange", "yearchange", "kill"], E = "option", y = { y: "year", m: "month", d: "day" }, f = /* @__PURE__ */ new Date(), p = { y: f.getFullYear(), m: f.getMonth() + 1, d: f.getDate(), t: f.getTime() };
let F = !1;
const D = (s) => s === !0 || s === "true" || s === 1 || s === "1";
class l {
  constructor(e, t) {
    w(this, "_onSelect", (e) => {
      e.target === this._year.el ? this._yearWasChanged(+e.target.value) : e.target === this._month.el ? this._monthWasChanged(+e.target.value) : e.target === this._day.el && this._dayWasChanged(+e.target.value), this._dateChanged();
    });
    if (!e)
      return { error: !0 };
    if ((e = typeof e == "string" ? document.querySelector(e) : e) === null || e.length === 0)
      return { error: !0 };
    if (e.dataset.bdpInit)
      return l.getInstance(e);
    e.dataset.bdpInit = !0, m.push(this), b.put(e, "instance", this);
    const r = ((a, n, i = null) => {
      if (!a)
        return !1;
      if (n === void 0 || a.dataset[n] === void 0)
        return a.dataset;
      let h;
      try {
        h = JSON.parse(a.dataset[n].replace(/'/g, '"'));
      } catch (c) {
      }
      if (typeof h != "object") {
        h = a.dataset[n];
        const c = {};
        h = h.replace(/ /g, "");
        const g = h.split(",");
        g.length > 1 ? g.forEach((S) => {
          const [A, O] = S.split(":");
          c[A.replace(/'/g, "")] = O.replace(/'/g, "");
        }) : c[n] = h, h = c;
      }
      let o = {}, d = n.length;
      return Object.entries(a.dataset).forEach((c) => {
        if (c[0].toLowerCase().indexOf(n) >= 0 && c[0].length > d) {
          let g = c[0][d].toLowerCase() + c[0].substring(d + 1);
          (i === null || i && i[g] !== void 0) && (o[g] = c[1]);
        }
      }), Object.assign(h, o);
    })(e, x, l.defaults);
    this.options = t, this.settings = Object.assign({}, l.defaults, r, t), this.element = e, this.settings.autoInit && this.init();
  }
  _parseDate(e) {
    typeof e != "object" && (e = e.replaceAll("-", "/"));
    const t = Date.parse(e);
    return isNaN(t) ? !1 : { year: (e = new Date(t)).getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
  }
  _getIdx(e, t) {
    if (e && !isNaN(t || t === void 0)) {
      for (let r, a = 0; a < e.length; a++)
        if (r = e[a], +r.value == +t)
          return a;
    }
  }
  _updateSelectBox(e, t) {
    const r = this[e].el;
    r.selectedIndex = this._getIdx(r.childNodes, t);
  }
  _dateChanged() {
    this.settings.selectFuture || this._noFutureDate(p.y, p.m, p.d), this._triggerEvent(u[1]), this.element.value = this.getDateString();
  }
  _setYear(e, t = !0) {
    return e = L(e, this._yearFrom, this._yearTo), this.currentYear !== e && (this._updateSelectBox("_year", e), this._yearWasChanged(e), t && this._dateChanged(), !0);
  }
  _setMonth(e, t = !0) {
    return e = L(e, 1, 12), this.currentMonth !== e && (this._updateSelectBox("_month", e), this._monthWasChanged(e), t && this._dateChanged(), !0);
  }
  _setDay(e, t = !0) {
    return e = L(e, 1, this._getDaysPerMonth()), this.currentDay !== e && (this._updateSelectBox("_day", e), this._dayWasChanged(e), t && this._dateChanged(), !0);
  }
  _setDate({ year: e, month: t, day: r }) {
    this._monthChangeTriggeredLater = t !== this.currentMonth;
    let a = this._setYear(e, !1), n = this._setMonth(t, !1), i = this._setDay(r, !1);
    (a || n || i) && this._dateChanged(), this._monthChangeTriggeredLater = !1;
  }
  _getMonthText(e) {
    return this.settings.monthFormat !== "numeric" ? e : this.settings.leadingZero && +e < 10 ? "0" + e : "" + e;
  }
  _checkArrangement(e) {
    return e = e.toLowerCase(), Z.indexOf(e) < 0 ? "ymd" : e;
  }
  _mapSelectBoxes() {
    let e = this.element.querySelectorAll("select");
    const t = {};
    if (e.length === 0)
      return t;
    let r = this.settings.arrange.split("");
    return r.forEach((a) => {
      const n = y[a];
      let i = this.settings[n + "El"] || "[" + N + "-" + n + "]";
      if (i) {
        let h;
        if (h = i.nodeName !== void 0 ? i : this.element.querySelector(i), h)
          return t[n] = h, r = r.filter((o) => o !== a), void (e = Object.values(e).filter((o) => o !== h));
      }
      e = Object.values(e).filter((h) => {
        const o = h.attributes[N + "-" + n];
        return o && (t[n] = h, r = r.filter((d) => d !== a)), !o;
      });
    }), r.forEach((a, n) => {
      t[y[a]] = e[n];
    }), t;
  }
  _create() {
    const e = this.settings;
    e.arrange = this._checkArrangement(e.arrange);
    const t = this._mapSelectBoxes();
    e.arrange.split("").forEach((n) => {
      const i = y[n];
      let h = !1, o = t[i];
      o && !o.dataset.init || (o = _("select"), h = !0, this.element.append(o)), o.setAttribute("aria-label", `select ${i}`), e.className && (o.classList.add(e.className), o.classList.add(`${e.className}-${i}`)), o.dataset.init = !0;
      const d = "change", c = this._onSelect, g = !1;
      o.addEventListener(d, c, g), this._registeredEventListeners.push({ element: o, eventName: d, listener: c, option: g }), this["_" + i] = { el: o, name: i, created: h, df: document.createDocumentFragment() }, this._date.push(this["_" + i]);
    });
    const r = _(E);
    e.placeholder && this._date.forEach((n) => {
      const i = l.i18n[e.locale][n.name], h = r.cloneNode();
      h.innerHTML = i, n.df.appendChild(h);
    });
    for (let n = this._yearTo; n >= this._yearFrom; n--) {
      const i = r.cloneNode();
      i.value = n, i.innerHTML = n, this._year.df.append(i);
    }
    let a;
    this.monthFormat[e.monthFormat].forEach((n, i) => {
      const h = r.cloneNode();
      h.value = i + 1, h.innerHTML = this._getMonthText(n), this._month.df.append(h);
    });
    for (let n = 1; n <= 31; n++) {
      a = e.leadingZero && n < 10 ? "0" + n : n;
      const i = _(E, { value: n }, "", a);
      this._day.df.append(i);
    }
    this._date.forEach((n) => n.el.append(n.df));
  }
  _updateDays(e = this.currentMonth) {
    let t = this._getDaysPerMonth(e);
    const r = this.settings.placeholder ? 1 : 0, a = this._day.el.children.length - r;
    if (t !== a)
      if (t === void 0 && (t = 31), t - a > 0)
        for (let n = a; n < t; n++) {
          let i = _(E, { value: n + 1 }, "", "" + (n + 1));
          this._day.el.append(i);
        }
      else {
        for (let n = a; n > t; n--)
          this._day.el.children[n + r - 1].remove();
        this.currentDay > t && (this.settings.roundDownDay ? this._setDay(t, !1) : this._dayWasChanged(void 0));
      }
  }
  _triggerEvent(e, t) {
    const r = T({ instance: this, year: +this._year.el.value, month: +this._month.el.value, day: +this._day.el.value, date: this.getDate() }, t), a = new CustomEvent(e, { detail: r });
    this.element.dispatchEvent(a), this.eventFired[e] = a, this.settings[e] && typeof this.settings[e] == "function" && this.settings[e].call(this, a), ((n, i, h) => {
      let o = n.getAttribute("on" + i);
      new Function("e", "{" + o + "}").call(n, h);
    })(this.element, e, a);
  }
  _noFutureDate(e, t, r) {
    if (this._disabled.length && (this._disabled.forEach((n) => {
      n.disabled = !1;
    }), this._disabled = []), this.currentYear < e || !this.currentYear || !this.currentYear && !this.currentMonth && !this.currentDay)
      return !1;
    this.currentYear > e && this._setYear(e, !1), this._month.el.childNodes.forEach((n) => {
      n.value > t && (n.disabled = !0, this._disabled.push(n));
    });
    const a = this.currentMonth > t;
    return a && this._setMonth(t, !1), t === this.currentMonth && (this._day.el.childNodes.forEach((n) => {
      n.value > r && (n.disabled = !0, this._disabled.push(n));
    }), (a || this.currentDay > r) && this._setDay(r, !1)), !0;
  }
  _dayWasChanged(e) {
    this.currentDay = e, this._triggerEvent(u[2]);
  }
  _monthWasChanged(e) {
    this.currentMonth = e, this._triggerEvent(u[3]), this._updateDays();
  }
  _yearWasChanged(e) {
    this.currentYear = e, this._daysPerMonth[1] = C(e) ? 29 : 28, this._triggerEvent(u[4]), this._monthChangeTriggeredLater || this.currentMonth !== 2 || this._updateDays();
  }
  _updateDayList() {
    const e = this.settings.placeholder ? 1 : 0, t = this.settings.leadingZero ? "0" : "";
    for (let r = e; r < 9 + e; r++)
      this._day.el.childNodes[r].innerHTML = t + r;
  }
  _updateMonthList() {
    const e = this.settings.monthFormat, t = this.settings.placeholder ? 1 : 0;
    this.monthFormat[e].forEach((r, a) => {
      this._month.el.childNodes[a + t].innerHTML = this._getMonthText(r);
    });
  }
  useLeadingZero(e) {
    (e = D(e)) !== this.settings.leadingZero && (this.settings.leadingZero = e, this.settings.monthFormat === "numeric" && this._updateMonthList(), this._updateDayList());
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
    if (this.settings.placeholder && this._date.forEach((a) => {
      a.el.childNodes[0].innerHTML = t[a.name];
    }), this.monthFormat = t.monthFormat, this.settings.locale = e, this.settings.monthFormat === "numeric")
      return !1;
    let r = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((a, n) => {
      this._month.el.childNodes[r + n].innerHTML = a;
    }), this._triggerEvent(u[1]);
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
    if (u.indexOf(e) < 0 || typeof t != "function")
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
        t && (e.el.classList.remove(t), Object.values(y).forEach((r) => {
          e.el.classList.remove(`${t}-${r}`);
        }));
      }
    }), this._triggerEvent(u[5]);
  }
  isLeapYear(e = this.currentYear) {
    return e === void 0 ? void 0 : C(e);
  }
  getAge() {
    const e = this.currentYear, t = this.currentMonth, r = this.currentDay, a = /* @__PURE__ */ new Date(), n = a.getMonth() + 1;
    let i = a.getFullYear() - e;
    return n < t || n === t && a.getDate() < r ? --i : i;
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
    e.placeholder = D(e.placeholder), e.leadingZero = D(e.leadingZero), e.selectFuture = D(e.selectFuture), e.maxYear === "now" ? this._yearTo = p.y : this._yearTo = e.maxYear, e.minYear ? this._yearFrom = +e.minYear : this._yearFrom = this._yearTo - +e.maxAge, this._yearTo -= +e.minAge;
    const [t] = l.createLocale(e.locale);
    if (e.locale = t, this.monthFormat = l.i18n[e.locale].monthFormat, this._create(), this._triggerEvent(u[0]), e.defaultDate) {
      const r = this.setDate(e.defaultDate === "now" ? (/* @__PURE__ */ new Date()).toString() : e.defaultDate);
      this.currentYear = r.year, this.currentMonth = r.month, this.currentDay = r.day, this.startDate = r;
    }
  }
}
l.i18n = {}, l.currentLocale = "en", l.getInstance = (s) => b.get(s, "instance"), l.createLocale = (s) => {
  if (s && s.length === 2 || (s = "en"), l.i18n[s])
    return [s, l.i18n[s]];
  let e = /* @__PURE__ */ new Date("2000-01-15"), t = { monthFormat: {} };
  for (let n = 0; n < 12; n++)
    e.setMonth(n), W.forEach((i) => {
      t.monthFormat[i] = t.monthFormat[i] || [], t.monthFormat[i].push(e.toLocaleDateString(s, { month: i }));
    });
  const r = "BirthdayPickerLocale";
  let a = M[s] ? M[s] : M.en;
  return window[r] && window[r][s] && (a = Object.assign({}, a, window[r][s])), l.i18n[s] = Object.assign(t, a), [s, t];
}, l.setMonthFormat = (s) => {
  m.forEach((e) => {
    e.setMonthFormat(s);
  });
}, l.setLanguage = (s) => {
  l.currentLocale = s, m.forEach((e) => {
    e.setLanguage(s);
  });
}, l.killAll = () => !!m.length && (m.forEach((s) => {
  l.kill(s);
}), m = [], !0), l.kill = (s) => {
  if (!s || (s.element || (s = l.getInstance(s)), !s))
    return !1;
  s.kill();
  const e = s.element;
  return e.dataset.bdpInit = !1, delete e.dataset.bdpInit, b.remove(e, "instance"), F = !1, !0;
}, l.defaults = { minYear: null, maxYear: "now", minAge: 0, maxAge: 100, monthFormat: "short", placeholder: !0, className: null, defaultDate: null, autoInit: !0, leadingZero: !0, locale: "en", selectFuture: !1, arrange: "ymd", yearEl: null, monthEl: null, dayEl: null, roundDownDay: !0 }, l.init = () => {
  if (F)
    return !1;
  F = !0, l.createLocale(l.currentLocale);
  let s = document.querySelectorAll("[" + N + "]");
  return s.length !== 0 && (s.forEach((e) => {
    new l(e);
  }), m);
};
if (globalThis.getDomData)
  for (const s of Object.keys(globalThis.getDomData))
    globalThis[s] = globalThis.getDomData[s];
export {
  l as default
};
