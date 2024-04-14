/*!
* BirthdayPicker v0.2.0
* https://lemon3.github.io/birthdaypicker
*/
var B = Object.defineProperty;
var Y = Object.getOwnPropertySymbols;
var P = Object.prototype.hasOwnProperty, $ = Object.prototype.propertyIsEnumerable;
var D = (r, n, e) => n in r ? B(r, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[n] = e, C = (r, n) => {
  for (var e in n || (n = {}))
    P.call(n, e) && D(r, e, n[e]);
  if (Y)
    for (var e of Y(n))
      $.call(n, e) && D(r, e, n[e]);
  return r;
};
var x = (r, n, e) => (D(r, typeof n != "symbol" ? n + "" : n, e), e);
const v = { en: { year: "Year", month: "Month", day: "Day" }, de: { year: "Jahr", month: "Monat", day: "Tag" }, fr: { year: "Année", month: "Mois", day: "Jour" } }, y = (r, n, e, t) => ((a, i, s, h) => {
  if (i)
    for (const o in i)
      a.setAttribute(o, i[o]);
  if (s)
    for (const o in s)
      a.style[o] = s[o];
  return h && (a.innerHTML = h), a;
})(document.createElement(r), n, e, t), k = (r) => +r % 4 == 0 && +r % 100 != 0 || +r % 400 == 0, w = { _s: /* @__PURE__ */ new WeakMap(), put(r, ...n) {
  this._s.has(r) || this._s.set(r, /* @__PURE__ */ new Map());
  let e = this._s.get(r);
  if (n.length > 1)
    return e.set(n[0], n[1]), this;
  if (typeof n[0] == "object")
    for (const t in n[0])
      e.set(t, n[0][t]);
  else
    e.set(n[0]);
  return this;
}, get(r, n) {
  return !!this._s.has(r) && (n ? this._s.get(r).get(n) : this._s.get(r));
}, has(r, n) {
  return this._s.has(r) && this._s.get(r).has(n);
}, remove(r, n) {
  if (!this._s.has(r))
    return !1;
  let e = this._s.get(r).delete(n);
  return this._s.get(r).size === 0 && this._s.delete(r), e;
} }, L = (r, n, e) => {
  if (r = parseFloat(r, 10), isNaN(r))
    return NaN;
  if (n = parseFloat(n, 10), (e = parseFloat(e, 10)) < n) {
    let t = e;
    e = n, n = t;
  }
  return !isNaN(n) && r < n ? n : !isNaN(e) && r > e ? e : r;
};
class q {
  constructor() {
    this._eventCallbacks = this._eventCallbacks || {};
  }
  emit(n, e) {
    let t = this._eventCallbacks[n];
    const a = new CustomEvent(n, { bubbles: !1, cancelable: !1, detail: e });
    t && t.forEach((i) => i.call(this, a)), this.element && (this.element.dispatchEvent(a), ((i, s, h) => {
      let o = i.getAttribute("on" + s);
      new Function("e", "{" + o + "}").call(i, h);
    })(this.element, n, a));
  }
  addEventListener(n, e) {
    return !(this.allowedEvents && this.allowedEvents.indexOf(n) < 0 || typeof e != "function") && (this._eventCallbacks[n] || (this._eventCallbacks[n] = []), this._eventCallbacks[n].push(e), this);
  }
  removeEventListener(n, e) {
    if (!this._eventCallbacks || arguments.length === 0)
      return this._eventCallbacks = {}, this;
    let t = this._eventCallbacks[n];
    return t ? arguments.length === 1 ? (delete this._eventCallbacks[n], this) : (this._eventCallbacks[n] = t.filter((a) => a !== e), this) : this;
  }
}
let m = [];
const j = "birthdaypicker", F = "data-" + j, z = ["short", "long", "numeric"], J = ["ymd", "ydm", "myd", "mdy", "dmy", "dym"], T = "init", M = "datechange", S = "daychange", A = "monthchange", I = "yearchange", O = "kill", E = "option", p = { y: "year", m: "month", d: "day" }, b = /* @__PURE__ */ new Date(), _ = { y: b.getFullYear(), m: b.getMonth() + 1, d: b.getDate() };
let N = !1;
const f = (r) => r === !0 || r === "true" || r === 1 || r === "1";
class l extends q {
  constructor(e, t) {
    if (!e)
      return { error: !0 };
    if ((e = typeof e == "string" ? document.querySelector(e) : e) === null || e.length === 0)
      return { error: !0 };
    super();
    x(this, "_onSelect", (e) => {
      e.target === this._year.el ? this._yearWasChanged(+e.target.value) : e.target === this._month.el ? this._monthWasChanged(+e.target.value) : e.target === this._day.el && this._dayWasChanged(+e.target.value), this._dateChanged();
    });
    if (e.dataset.bdpInit)
      return l.getInstance(e);
    e.dataset.bdpInit = !0, this.allowedEvents = [T, M, S, A, I, O], m.push(this), w.put(e, "instance", this);
    const a = ((i, s, h = null) => {
      if (!i)
        return !1;
      if (s === void 0 || i.dataset[s] === void 0)
        return i.dataset;
      let o;
      try {
        o = JSON.parse(i.dataset[s].replace(/'/g, '"'));
      } catch (d) {
      }
      if (typeof o != "object") {
        o = i.dataset[s];
        const d = {};
        o = o.replace(/ /g, "");
        const g = o.split(",");
        g.length > 1 ? g.forEach((W) => {
          const [Z, H] = W.split(":");
          d[Z.replace(/'/g, "")] = H.replace(/'/g, "");
        }) : d[s] = o, o = d;
      }
      let c = {}, u = s.length;
      return Object.entries(i.dataset).forEach((d) => {
        if (d[0].toLowerCase().indexOf(s) >= 0 && d[0].length > u) {
          let g = d[0][u].toLowerCase() + d[0].substring(u + 1);
          (h === null || h && h[g] !== void 0) && (c[g] = d[1]);
        }
      }), Object.assign(o, c);
    })(e, j, l.defaults);
    this.options = t || {}, this.settings = Object.assign({}, l.defaults, a, t), this.element = e, this.state = 0, this.settings.autoInit && this.init();
  }
  _triggerEvent(e, t) {
    t = C({ instance: this, year: +this.currentYear, month: +this.currentMonth, day: +this.currentDay, date: this.getDate() }, t), this.emit(e, t);
  }
  _parseDate(e) {
    typeof e != "object" && (e = e.replaceAll("-", "/"));
    const t = Date.parse(e);
    return isNaN(t) ? !1 : { year: (e = new Date(t)).getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
  }
  _getIdx(e, t) {
    if (e && !isNaN(t || t === void 0)) {
      for (let a, i = 0; i < e.length; i++)
        if (a = e[i], +a.value == +t)
          return i;
    }
  }
  _updateSelectBox(e, t) {
    const a = this[e].el;
    a.selectedIndex = this._getIdx(a.childNodes, t);
  }
  _setYear(e) {
    return e = L(e, this._yearFrom, this._yearTo), this.currentYear !== e && (this._updateSelectBox("_year", e), this._yearWasChanged(e, !1), !0);
  }
  _setMonth(e) {
    return e = L(e, 1, 12), this.currentMonth !== e && (this._updateSelectBox("_month", e), this._monthWasChanged(e, !1), !0);
  }
  _setDay(e) {
    return e = L(e, 1, this._getDaysPerMonth()), this.currentDay !== e && (this._updateSelectBox("_day", e), this._dayWasChanged(e, !1), !0);
  }
  _getDateInRange({ year: e = this.currentYear, month: t = this.currentMonth, day: a = this.currentDay }) {
    const i = this._lowerLimit, s = this._upperLimit;
    return e > s.year || e >= s.year && t > s.month || e >= s.year && t >= s.month && a > s.day ? s : e < i.year || e <= i.year && t < i.month || e <= i.year && t <= i.month && a < i.day ? i : { year: e, month: t, day: a };
  }
  _setDate(e, t = !1) {
    e = this._getDateInRange(e);
    let a = this._setYear(e.year), i = this._setMonth(e.month), s = this._setDay(e.day);
    return (a || i || s) && this._dateChanged(t), e;
  }
  _getMonthText(e) {
    return this.settings.monthFormat !== "numeric" ? e : this.settings.leadingZero && +e < 10 ? "0" + e : "" + e;
  }
  _checkArrangement(e) {
    return e = e.toLowerCase(), J.indexOf(e) < 0 ? "ymd" : e;
  }
  _mapSelectBoxes() {
    let e = this.element.querySelectorAll("select");
    const t = {};
    if (e.length === 0)
      return t;
    let a = this.settings.arrange.split("");
    return a.forEach((i) => {
      const s = p[i];
      let h = this.settings[s + "El"] || "[" + F + "-" + s + "]";
      if (h) {
        let o;
        if (o = h.nodeName !== void 0 ? h : this.element.querySelector(h), o)
          return t[s] = o, a = a.filter((c) => c !== i), void (e = Object.values(e).filter((c) => c !== o));
      }
      e = Object.values(e).filter((o) => {
        const c = o.attributes[F + "-" + s];
        return c && (t[s] = o, a = a.filter((u) => u !== i)), !c;
      });
    }), a.forEach((i, s) => {
      t[p[i]] = e[s];
    }), t;
  }
  _create() {
    const e = this.settings;
    e.arrange = this._checkArrangement(e.arrange);
    const t = this._mapSelectBoxes();
    e.arrange.split("").forEach((s) => {
      const h = p[s];
      let o = !1, c = t[h];
      c && !c.dataset.init || (c = y("select"), o = !0, this.element.append(c)), c.setAttribute("aria-label", `select ${h}`), e.className && (c.classList.add(e.className), c.classList.add(`${e.className}-${h}`)), c.dataset.init = !0;
      const u = "change", d = this._onSelect, g = !1;
      c.addEventListener(u, d, g), this._registeredEventListeners.push({ element: c, eventName: u, listener: d, option: g }), this["_" + h] = { el: c, name: h, created: o, df: document.createDocumentFragment() }, this._date.push(this["_" + h]);
    });
    const a = y(E);
    e.placeholder && this._date.forEach((s) => {
      const h = l.i18n[e.locale][s.name], o = a.cloneNode();
      o.innerHTML = h, s.df.appendChild(o);
    });
    for (let s = this._yearTo; s >= this._yearFrom; s--) {
      const h = a.cloneNode();
      h.value = s, h.innerHTML = s, this._year.df.append(h);
    }
    let i;
    this.monthFormat[e.monthFormat].forEach((s, h) => {
      const o = a.cloneNode();
      o.value = h + 1, o.innerHTML = this._getMonthText(s), this._month.df.append(o);
    });
    for (let s = 1; s <= 31; s++) {
      i = e.leadingZero && s < 10 ? "0" + s : s;
      const h = y(E, { value: s }, "", i);
      this._day.df.append(h);
    }
    this._date.forEach((s) => s.el.append(s.df));
  }
  _updateDays(e = this.currentMonth) {
    let t = this._getDaysPerMonth(e);
    const a = this.settings.placeholder ? 1 : 0, i = this._day.el.children.length - a;
    if (t !== i)
      if (t === void 0 && (t = 31), t - i > 0)
        for (let s = i; s < t; s++) {
          let h = y(E, { value: s + 1 }, "", "" + (s + 1));
          this._day.el.append(h);
        }
      else {
        for (let s = i; s > t; s--)
          this._day.el.children[s + a - 1].remove();
        this.currentDay > t && (this.settings.roundDownDay ? this._setDay(t) : this._dayWasChanged(void 0));
      }
  }
  _disable(e, t, a) {
    const i = t === "<" ? (s) => s < a : (s) => s > a;
    this[e].el.childNodes.forEach((s) => {
      i(+s.value) && (s.disabled = !0, this._disabled.push(s));
    });
  }
  _noFutureDate(e = this._lowerLimit, t = this._upperLimit) {
    const a = () => {
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
    }), this._disabled = []), !(this.currentYear < t.year && this.currentYear > e.year || !this.currentYear || !(this.currentYear || this.currentMonth || this.currentDay)) && (this.currentYear >= t.year ? a() : this.currentYear <= e.year && i(), !0);
  }
  _yearWasChanged(e, t = !0) {
    this.currentYear = e, this._daysPerMonth[1] = k(e) ? 29 : 28, t && this._triggerEvent(I), this.currentMonth === 2 && this._updateDays();
  }
  _monthWasChanged(e, t = !0) {
    this.currentMonth = e, t && this._triggerEvent(A), this._updateDays();
  }
  _dayWasChanged(e, t = !0) {
    this.currentDay = e, t && this._triggerEvent(S);
  }
  _dateChanged(e = !0) {
    this.settings.selectFuture || this._noFutureDate(this._lowerLimit, this._upperLimit), e && this._triggerEvent(M), this.element.value = this.getDateString();
  }
  _updateDayList() {
    const e = this.settings.placeholder ? 1 : 0, t = this.settings.leadingZero ? "0" : "";
    for (let a = e; a < 9 + e; a++)
      this._day.el.childNodes[a].innerHTML = t + a;
  }
  _updateMonthList() {
    const e = this.settings.monthFormat, t = this.settings.placeholder ? 1 : 0;
    this.monthFormat[e].forEach((a, i) => {
      this._month.el.childNodes[i + t].innerHTML = this._getMonthText(a);
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
    let a = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((i, s) => {
      this._month.el.childNodes[a + s].innerHTML = i;
    });
  }
  setDate(e, t = !1) {
    let a = this._parseDate(e);
    return a && (a = this._setDate(a, t)), a;
  }
  resetDate(e = !1) {
    let t = "";
    this.startDate && e ? (this._setDate(this.startDate), t = this.getDateString()) : this._setDate({ year: NaN, month: NaN, day: NaN }), this.element.value = t, this._triggerEvent(M);
  }
  kill() {
    this._registeredEventListeners && this._registeredEventListeners.forEach((e) => e.element.removeEventListener(e.eventName, e.listener, e.option)), this._date.forEach((e) => {
      if (e.created)
        e.el.remove();
      else {
        const t = this.settings.className;
        t && (e.el.classList.remove(t), Object.values(p).forEach((a) => {
          e.el.classList.remove(`${t}-${a}`);
        }));
      }
    }), this._triggerEvent(O);
  }
  isLeapYear(e = this.currentYear) {
    return e === void 0 ? void 0 : k(e);
  }
  getAge() {
    if (isNaN(this.currentYear) || isNaN(this.currentMonth) || isNaN(this.currentDay))
      return "";
    const e = this.currentYear, t = this.currentMonth, a = this.currentDay, i = /* @__PURE__ */ new Date(), s = i.getMonth() + 1;
    let h = i.getFullYear() - e;
    return s < t || s === t && i.getDate() < a ? --h : h;
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
  _getUpperLimit(e) {
    if (e.upperLimit)
      return e.upperLimit;
    let t;
    return e.maxYear === "now" ? (t = _.y - +e.minAge, { year: t, month: _.m, day: _.d }) : (t = e.maxYear, { year: t, month: 12, day: 31 });
  }
  _getLowerLimit(e) {
    if (e.lowerLimit)
      return e.lowerLimit;
    let t;
    return e.minYear !== null ? (t = +e.minYear, { year: t, month: 1, day: 1 }) : (t = (e.maxYear === "now" ? _.y : e.maxYear) - +e.maxAge, { year: t, month: _.m, day: _.d });
  }
  init() {
    if (this.initialized)
      return !0;
    this.initialized = !0, this._registeredEventListeners = [], this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], this._date = [], this._disabled = [];
    const e = this.settings;
    e.placeholder = f(e.placeholder), e.leadingZero = f(e.leadingZero), e.selectFuture = f(e.selectFuture), this._lowerLimit = this._getLowerLimit(e), this._upperLimit = this._getUpperLimit(e), this._yearFrom = this._lowerLimit.year, this._yearTo = this._upperLimit.year;
    const [t] = l.createLocale(e.locale);
    if (e.locale = t, this.monthFormat = l.i18n[e.locale].monthFormat, this.allowedEvents.forEach((a) => {
      e[a] && this.addEventListener(a, e[a]);
    }), this._create(), e.defaultDate) {
      const a = this.setDate(e.defaultDate === "now" ? (/* @__PURE__ */ new Date()).toString() : e.defaultDate, !0);
      this.startDate = a;
    }
    this.state = 1, this._triggerEvent(T);
  }
}
l.i18n = {}, l.currentLocale = "en", l.getInstance = (r) => w.get(r, "instance"), l.createLocale = (r) => {
  if (r && r.length === 2 || (r = "en"), l.i18n[r])
    return [r, l.i18n[r]];
  let n = /* @__PURE__ */ new Date("2000-01-15"), e = { monthFormat: {} };
  for (let i = 0; i < 12; i++)
    n.setMonth(i), z.forEach((s) => {
      e.monthFormat[s] = e.monthFormat[s] || [], e.monthFormat[s].push(n.toLocaleDateString(r, { month: s }));
    });
  const t = "BirthdayPickerLocale";
  let a = v[r] ? v[r] : v.en;
  return window[t] && window[t][r] && (a = Object.assign({}, a, window[t][r])), l.i18n[r] = Object.assign(e, a), [r, e];
}, l.setMonthFormat = (r) => {
  m.forEach((n) => {
    n.setMonthFormat(r);
  });
}, l.setLanguage = (r) => {
  l.currentLocale = r, m.forEach((n) => {
    n.setLanguage(r);
  });
}, l.killAll = () => !!m.length && (m.forEach((r) => {
  l.kill(r);
}), m = [], !0), l.kill = (r) => {
  if (!r || (r.element || (r = l.getInstance(r)), !r))
    return !1;
  r.kill();
  const n = r.element;
  return n.dataset.bdpInit = !1, delete n.dataset.bdpInit, w.remove(n, "instance"), N = !1, !0;
}, l.defaults = { minAge: 0, maxAge: 100, minYear: null, maxYear: "now", lowerLimit: null, upperLimit: null, monthFormat: "short", placeholder: !0, className: null, defaultDate: null, autoInit: !0, leadingZero: !0, locale: "en", selectFuture: !1, arrange: "ymd", yearEl: null, monthEl: null, dayEl: null, roundDownDay: !0 }, l.init = () => {
  if (N)
    return !1;
  N = !0, l.createLocale(l.currentLocale);
  let r = document.querySelectorAll("[" + F + "]");
  return r.length !== 0 && (r.forEach((n) => {
    new l(n);
  }), m);
};
if (globalThis.getDomData)
  for (const r of Object.keys(globalThis.getDomData))
    globalThis[r] = globalThis.getDomData[r];
export {
  l as default
};
