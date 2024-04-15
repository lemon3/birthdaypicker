/*!
* BirthdayPicker v0.2.1
* https://lemon3.github.io/birthdaypicker
*/
var W = Object.defineProperty;
var v = Object.getOwnPropertySymbols;
var j = Object.prototype.hasOwnProperty, B = Object.prototype.propertyIsEnumerable;
var y = (s, n, t) => n in s ? W(s, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[n] = t, w = (s, n) => {
  for (var t in n || (n = {}))
    j.call(n, t) && y(s, t, n[t]);
  if (v)
    for (var t of v(n))
      B.call(n, t) && y(s, t, n[t]);
  return s;
};
var T = (s, n, t) => (y(s, typeof n != "symbol" ? n + "" : n, t), t);
const Z = {
  minAge: 0,
  maxAge: 100,
  minYear: null,
  maxYear: "now",
  lowerLimit: null,
  upperLimit: null,
  monthFormat: "short",
  placeholder: !0,
  className: null,
  defaultDate: null,
  autoInit: !0,
  leadingZero: !0,
  locale: "en",
  selectFuture: !1,
  arrange: "ymd",
  yearEl: null,
  monthEl: null,
  dayEl: null,
  roundDownDay: !0
}, p = {
  en: { year: "Year", month: "Month", day: "Day" },
  de: { year: "Jahr", month: "Monat", day: "Tag" },
  fr: { year: "Année", month: "Mois", day: "Jour" }
}, q = (s, n, t, e) => {
  if (n)
    for (const i in n)
      s.setAttribute(i, n[i]);
  if (t)
    for (const i in t)
      s.style[i] = t[i];
  return e && (s.innerHTML = e), s;
}, g = (s, n, t, e) => q(document.createElement(s), n, t, e), $ = (s, n, t = null) => {
  if (!s)
    return !1;
  if (n === void 0 || s.dataset[n] === void 0)
    return s.dataset;
  let e;
  try {
    s.dataset[n] !== "undefined" && s.dataset[n].indexOf("{") >= 0 && (e = JSON.parse(s.dataset[n].replace(/'/g, '"')));
  } catch (r) {
    console.error(r);
  }
  if (typeof e != "object") {
    e = s.dataset[n];
    const r = {};
    e = e.replace(/ /g, "");
    const h = e.split(",");
    h.length > 1 ? h.forEach((l) => {
      const [c, d] = l.split(":");
      r[c.replace(/'/g, "")] = d.replace(/'/g, "");
    }) : r[n] = e, e = r;
  }
  let i = {}, a = n.length;
  return Object.entries(s.dataset).forEach((r) => {
    if (r[0].toLowerCase().indexOf(n) >= 0 && r[0].length > a) {
      let h = r[0][a].toLowerCase() + r[0].substring(a + 1);
      (t === null || t && t[h] !== void 0) && (i[h] = r[1]);
    }
  }), Object.assign(e, i);
}, A = (s) => +s % 4 === 0 && +s % 100 !== 0 || +s % 400 === 0, N = {
  // storage
  _s: /* @__PURE__ */ new WeakMap(),
  put(s, ...n) {
    this._s.has(s) || this._s.set(s, /* @__PURE__ */ new Map());
    let t = this._s.get(s);
    if (n.length > 1)
      return t.set(n[0], n[1]), this;
    if (typeof n[0] == "object")
      for (const e in n[0])
        t.set(e, n[0][e]);
    else
      t.set(n[0]);
    return this;
  },
  get(s, n) {
    return this._s.has(s) ? n ? this._s.get(s).get(n) : this._s.get(s) : !1;
  },
  has(s, n) {
    return this._s.has(s) && this._s.get(s).has(n);
  },
  // todo if no key given: remove all
  remove(s, n) {
    if (!this._s.has(s))
      return !1;
    let t = this._s.get(s).delete(n);
    return this._s.get(s).size === 0 && this._s.delete(s), t;
  }
}, D = (s, n, t) => {
  if (s = parseFloat(s, 10), isNaN(s))
    return NaN;
  if (n = parseFloat(n, 10), t = parseFloat(t, 10), t < n) {
    let e = t;
    t = n, n = e;
  }
  return !isNaN(n) && s < n ? n : !isNaN(t) && s > t ? t : s;
}, z = (s, n, t) => {
  let e = s.getAttribute("on" + n);
  new Function(
    "e",
    // 'with(document) {' +
    // 'with(this)' +
    "{" + e + "}"
    // + '}'
  ).call(s, t);
};
class G {
  constructor() {
    this._eventCallbacks = this._eventCallbacks || {};
  }
  emit(n, t) {
    let e = this._eventCallbacks[n];
    const i = { bubbles: !1, cancelable: !1, detail: t }, a = new CustomEvent(n, i);
    e && e.forEach((r) => r.call(this, a)), this.element && (this.element.dispatchEvent(a), z(this.element, n, a));
  }
  // on
  addEventListener(n, t) {
    return this.allowedEvents && this.allowedEvents.indexOf(n) < 0 || typeof t != "function" ? !1 : (this._eventCallbacks[n] || (this._eventCallbacks[n] = []), this._eventCallbacks[n].push(t), this);
  }
  // off
  removeEventListener(n, t) {
    if (!this._eventCallbacks || arguments.length === 0)
      return this._eventCallbacks = {}, this;
    let e = this._eventCallbacks[n];
    return e ? arguments.length === 1 ? (delete this._eventCallbacks[n], this) : (this._eventCallbacks[n] = e.filter(
      (i) => i !== t
    ), this) : this;
  }
}
let u = [];
const H = "birthdaypicker", b = "data-" + H, J = ["short", "long", "numeric"], P = ["ymd", "ydm", "myd", "mdy", "dmy", "dym"], S = "init", L = "datechange", x = "daychange", I = "monthchange", k = "yearchange", O = "kill", M = "option", _ = { y: "year", m: "month", d: "day" }, E = /* @__PURE__ */ new Date(), f = {
  y: E.getFullYear(),
  m: E.getMonth() + 1,
  d: E.getDate()
};
let F = !1;
const m = (s) => s === !0 || s === "true" || s === 1 || s === "1";
class o extends G {
  constructor(t, e) {
    if (!t)
      return { error: !0 };
    if (t = typeof t == "string" ? document.querySelector(t) : t, t === null || t.length === 0)
      return { error: !0 };
    super();
    /**
     * date change event handler, called if one of the fields is updated
     * @param  {Event} e The event
     * @return {void}
     */
    T(this, "_onSelect", (t) => {
      t.target === this._year.el ? this._yearWasChanged(+t.target.value) : t.target === this._month.el ? this._monthWasChanged(+t.target.value) : t.target === this._day.el && this._dayWasChanged(+t.target.value), this._dateChanged();
    });
    if (t.dataset.bdpInit)
      return o.getInstance(t);
    t.dataset.bdpInit = !0, this.allowedEvents = [
      S,
      L,
      x,
      I,
      k,
      O
    ], u.push(this), N.put(t, "instance", this);
    const i = $(t, H, o.defaults);
    this.options = e || {}, this.settings = Object.assign({}, o.defaults, i, e), this.element = t, this.state = 0, this.settings.autoInit && this.init();
  }
  _triggerEvent(t, e) {
    e = w({
      instance: this,
      year: +this.currentYear,
      month: +this.currentMonth,
      day: +this.currentDay,
      date: this.getDate()
    }, e), this.emit(t, e);
  }
  /**
   * Parses a given date string or Date object
   *
   * @param {*} date A data string or a Date object (new Date())
   * @returns object with { year, month, day } or false if it is not a correct date
   */
  _parseDate(t) {
    typeof t != "object" && (t = t.replaceAll("-", "/"));
    const e = Date.parse(t);
    if (isNaN(e))
      return !1;
    t = new Date(e);
    const i = t.getFullYear(), a = t.getMonth() + 1, r = t.getDate();
    return { year: i, month: a, day: r };
  }
  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodes Option List
   * @param  {String} value Value to find
   * @return {*}       The index value or undefined
   */
  _getIdx(t, e) {
    if (!(!t || isNaN(e || typeof e == "undefined"))) {
      for (let i = 0, a; i < t.length; i++)
        if (a = t[i], +a.value == +e)
          return i;
    }
  }
  /**
   * Updates one selectBox
   * @param {String} box name of the box ('_year', '_month', '_day')
   * @param {number} value the new value to which the box should be set
   */
  _updateSelectBox(t, e) {
    const i = this[t].el;
    i.selectedIndex = this._getIdx(i.childNodes, e);
  }
  /**
   * set the year to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} year the day value (eg, 1988, 2012, ...)
   * @returns
   */
  _setYear(t) {
    return t = D(t, this._yearFrom, this._yearTo), this.currentYear === t ? !1 : (this._updateSelectBox("_year", t), this._yearWasChanged(t, !1), !0);
  }
  /**
   * set the month to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} month the month value (usually between 1 - 12)
   * @returns
   */
  _setMonth(t) {
    return t = D(t, 1, 12), this.currentMonth === t ? !1 : (this._updateSelectBox("_month", t), this._monthWasChanged(t, !1), !0);
  }
  /**
   * set the day to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} day the day value (usually between 1 - 31)
   * @returns
   */
  _setDay(t) {
    return t = D(t, 1, this._getDaysPerMonth()), this.currentDay === t ? !1 : (this._updateSelectBox("_day", t), this._dayWasChanged(t, !1), !0);
  }
  _getDateInRange({
    year: t = this.currentYear,
    month: e = this.currentMonth,
    day: i = this.currentDay
  }) {
    const a = this._lowerLimit, r = this._upperLimit;
    return t > r.year || t >= r.year && e > r.month || t >= r.year && e >= r.month && i > r.day ? r : t < a.year || t <= a.year && e < a.month || t <= a.year && e <= a.month && i < a.day ? a : { year: t, month: e, day: i };
  }
  /**
   * Set the date
   * @param {Object} obj with year, month, day as String or Integer
   * @param {Number} obj.year the year value
   * @param {Number} obj.month the month value
   * @param {Number} obj.day the day value
   */
  _setDate(t, e = !1) {
    t = this._getDateInRange(t);
    let i = this._setYear(t.year), a = this._setMonth(t.month), r = this._setDay(t.day);
    return (i || a || r) && this._dateChanged(e), t;
  }
  // function for update or create
  _getMonthText(t) {
    return this.settings.monthFormat !== "numeric" ? t : this.settings.leadingZero && +t < 10 ? "0" + t : "" + t;
  }
  _checkArrangement(t) {
    return t = t.toLowerCase(), P.indexOf(t) < 0 ? "ymd" : t;
  }
  _mapSelectBoxes() {
    let t = this.element.querySelectorAll("select");
    const e = {};
    if (t.length === 0)
      return e;
    let i = this.settings.arrange.split("");
    return i.forEach((a) => {
      const r = _[a];
      let h = this.settings[r + "El"] || "[" + b + "-" + r + "]";
      if (h) {
        let l;
        if (typeof h.nodeName != "undefined" ? l = h : l = this.element.querySelector(h), l) {
          e[r] = l, i = i.filter((c) => c !== a), t = Object.values(t).filter(
            (c) => c !== l
          );
          return;
        }
      }
      t = Object.values(t).filter((l) => {
        const c = l.attributes[b + "-" + r];
        return c && (e[r] = l, i = i.filter((d) => d !== a)), !c;
      });
    }), i.forEach((a, r) => {
      const h = _[a];
      e[h] = t[r];
    }), e;
  }
  /**
   * Create the gui
   * @return {void}
   */
  _create() {
    const t = this.settings;
    t.arrange = this._checkArrangement(t.arrange);
    const e = this._mapSelectBoxes();
    t.arrange.split("").forEach((r) => {
      const h = _[r];
      let l = !1, c = e[h];
      (!c || c.dataset.init) && (c = g("select"), l = !0, this.element.append(c)), c.setAttribute("aria-label", `select ${h}`), t.className && (c.classList.add(t.className), c.classList.add(`${t.className}-${h}`)), c.dataset.init = !0;
      const d = "change", C = this._onSelect, Y = !1;
      c.addEventListener(d, C, Y), this._registeredEventListeners.push({
        element: c,
        eventName: d,
        listener: C,
        option: Y
      }), this["_" + h] = {
        el: c,
        name: h,
        created: l,
        df: document.createDocumentFragment()
      }, this._date.push(this["_" + h]);
    });
    const i = g(M);
    t.placeholder && this._date.forEach((r) => {
      const h = o.i18n[t.locale][r.name], l = i.cloneNode();
      l.innerHTML = h, r.df.appendChild(l);
    });
    for (let r = this._yearTo; r >= this._yearFrom; r--) {
      const h = i.cloneNode();
      h.value = r, h.innerHTML = r, this._year.df.append(h);
    }
    this.monthFormat[t.monthFormat].forEach((r, h) => {
      const l = i.cloneNode();
      l.value = h + 1, l.innerHTML = this._getMonthText(r), this._month.df.append(l);
    });
    let a;
    for (let r = 1; r <= 31; r++) {
      a = t.leadingZero && r < 10 ? "0" + r : r;
      const h = g(M, { value: r }, "", a);
      this._day.df.append(h);
    }
    this._date.forEach((r) => r.el.append(r.df));
  }
  /**
   * function to update the days, according to the given month
   * called when month changes or year changes form non-leap-year to a leap-year
   * or vice versa
   * @param  {number} month The number of the month 1 ... 12
   * @return {void}
   */
  _updateDays(t = this.currentMonth) {
    let e = this._getDaysPerMonth(t);
    const i = this.settings.placeholder ? 1 : 0, a = this._day.el.children.length - i;
    if (e !== a)
      if (typeof e == "undefined" && (e = 31), e - a > 0)
        for (let r = a; r < e; r++) {
          let h = g(M, { value: r + 1 }, "", "" + (r + 1));
          this._day.el.append(h);
        }
      else {
        for (let r = a; r > e; r--)
          this._day.el.children[r + i - 1].remove();
        this.currentDay > e && (this.settings.roundDownDay ? this._setDay(e) : this._dayWasChanged(void 0));
      }
  }
  /**
   * Disable the options in the select box
   *
   * @param {String} selectBox - Name of the select box (_year, _month, _day)
   * @param {String} condition - '>' or '<'
   * @param {Number} limit - the limit
   */
  _disable(t, e, i) {
    const a = e === "<" ? (r) => r < i : (r) => r > i;
    this[t].el.childNodes.forEach((r) => {
      a(+r.value) && (r.disabled = !0, this._disabled.push(r));
    });
  }
  // TODO: only on select change
  _noFutureDate(t = this._lowerLimit, e = this._upperLimit) {
    const i = () => {
      this.currentYear > e.year && this._setYear(e.year), this._disable("_month", ">", e.month);
      const r = this.currentMonth > e.month;
      r && this._setMonth(e.month), e.month === this.currentMonth && (this._disable("_day", ">", e.day), (r || this.currentDay > e.day) && this._setDay(e.day));
    }, a = () => {
      this.currentYear < t.year && this._setYear(t.year), this._disable("_month", "<", t.month);
      const r = this.currentMonth < t.month;
      r && this._setMonth(t.month), t.month === this.currentMonth && (this._disable("_day", "<", t.day), (r || this.currentDay < t.day) && this._setDay(t.day));
    };
    return this._disabled.length && (this._disabled.forEach((r) => {
      r.disabled = !1;
    }), this._disabled = []), this.currentYear < e.year && this.currentYear > t.year || !this.currentYear || !this.currentYear && !this.currentMonth && !this.currentDay ? !1 : (this.currentYear >= e.year ? i() : this.currentYear <= t.year && a(), !0);
  }
  /**
   * called if the year was changed
   * sets the currentYear value and triggers the corresponding event
   * @param {number} year the new year value
   * @returns
   */
  _yearWasChanged(t, e = !0) {
    this.currentYear = t, this._daysPerMonth[1] = A(t) ? 29 : 28, e && this._triggerEvent(k), this.currentMonth === 2 && this._updateDays();
  }
  /**
   * called if the month was changed
   * sets the currentMonth value and triggers the corresponding event
   * @param {number} month the new month value
   * @returns
   */
  _monthWasChanged(t, e = !0) {
    this.currentMonth = t, e && this._triggerEvent(I), this._updateDays();
  }
  /**
   * called if the day was changed
   * sets the currentDay value and triggers the corresponding event
   * @param {number} day the new day value
   * @returns
   */
  _dayWasChanged(t, e = !0) {
    this.currentDay = t, e && this._triggerEvent(x);
  }
  /**
   * called if one value was changed
   *
   * @param {boolean} [triggerEvent = true] - true if the event should be triggered, default: true
   */
  _dateChanged(t = !0) {
    this.settings.selectFuture || this._noFutureDate(this._lowerLimit, this._upperLimit), t && this._triggerEvent(L), this.element.value = this.getDateString();
  }
  /**
   * updates the innerHTML off the day option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero
   */
  _updateDayList() {
    const t = this.settings.placeholder ? 1 : 0, e = this.settings.leadingZero ? "0" : "";
    for (let i = t; i < 9 + t; i++)
      this._day.el.childNodes[i].innerHTML = e + i;
  }
  /**
   * updates the innerHTML off the month option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero or changes the month format
   */
  _updateMonthList() {
    const t = this.settings.monthFormat, e = this.settings.placeholder ? 1 : 0;
    this.monthFormat[t].forEach((i, a) => {
      this._month.el.childNodes[a + e].innerHTML = this._getMonthText(i);
    });
  }
  /**
   * Set the GUI (select boxes) to use a leading zero or not
   *
   * @param {boolean} leadingZero
   */
  useLeadingZero(t) {
    t = m(t), t !== this.settings.leadingZero && (this.settings.leadingZero = t, this.settings.monthFormat === "numeric" && this._updateMonthList(), this._updateDayList());
  }
  /**
   * Returns the number of days available for the given month
   *
   * @param {Number} month the month usually between 1-12 ;)
   * @returns number of days
   */
  _getDaysPerMonth(t = this.currentMonth) {
    return this._daysPerMonth[+t - 1];
  }
  /**
   * Change the current active month format
   *
   * @param {String} format the format string, available: 'short', 'long', 'numeric';
   * @returns {boolean} true if changed, false if not
   */
  setMonthFormat(t) {
    return !this.monthFormat[t] || t === this.settings.monthFormat ? !1 : (this.settings.monthFormat = t, this._updateMonthList(), !0);
  }
  setLanguage(t) {
    if (t === this.settings.locale || ("" + t).length < 2 || ("" + t).length > 2)
      return !1;
    o.createLocale(t);
    const e = o.i18n[t];
    if (this.settings.placeholder && this._date.forEach((a) => {
      a.el.childNodes[0].innerHTML = e[a.name];
    }), this.monthFormat = e.monthFormat, this.settings.locale = t, this.settings.monthFormat === "numeric")
      return !1;
    let i = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((a, r) => {
      this._month.el.childNodes[i + r].innerHTML = a;
    });
  }
  setDate(t, e = !1) {
    let i = this._parseDate(t);
    return i && (i = this._setDate(i, e)), i;
  }
  resetDate(t = !1) {
    let e = "";
    this.startDate && t ? (this._setDate(this.startDate), e = this.getDateString()) : this._setDate({ year: NaN, month: NaN, day: NaN }), this.element.value = e, this._triggerEvent(L);
  }
  // TODO: undo everything
  // destroy if it was created
  kill() {
    this._registeredEventListeners && this._registeredEventListeners.forEach(
      (t) => t.element.removeEventListener(t.eventName, t.listener, t.option)
    ), this._date.forEach((t) => {
      if (t.created)
        t.el.remove();
      else {
        const e = this.settings.className;
        e && (t.el.classList.remove(e), Object.values(_).forEach((i) => {
          t.el.classList.remove(`${e}-${i}`);
        }));
      }
    }), this._triggerEvent(O);
  }
  isLeapYear(t = this.currentYear) {
    return t === void 0 ? void 0 : A(t);
  }
  getAge() {
    if (isNaN(this.currentYear) || isNaN(this.currentMonth) || isNaN(this.currentDay))
      return "";
    const t = this.currentYear, e = this.currentMonth, i = this.currentDay, a = /* @__PURE__ */ new Date(), r = a.getMonth() + 1;
    let h = a.getFullYear() - t;
    return r < e || r === e && a.getDate() < i ? --h : h;
  }
  getDateString(t) {
    if (!t) {
      const i = this.getDate();
      return i && i.toLocaleDateString(this.settings.locale);
    }
    if (!this.currentYear || !this.currentMonth || !this.currentDay)
      return "";
    let e = t.toLowerCase();
    return e = e.replace(/yyyy/g, this.currentYear), e = e.replace(/yy/g, ("" + this.currentYear).slice(2)), e = e.replace(/mm/g, ("0" + this.currentMonth).slice(-2)), e = e.replace(/m/g, this.currentMonth), e = e.replace(/dd/g, ("0" + this.currentDay).slice(-2)), e = e.replace(/d/g, this.currentDay), e;
  }
  getDate() {
    return !this.currentYear || !this.currentMonth || !this.currentDay ? "" : new Date(
      Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay)
    );
  }
  /**
   *
   * @param {Object} s - the settings object
   * @returns Object containing { year, month, day }
   */
  _getUpperLimit(t) {
    if (t.upperLimit)
      return t.upperLimit;
    let e;
    return t.maxYear === "now" ? (e = f.y - +t.minAge, { year: e, month: f.m, day: f.d }) : (e = t.maxYear, { year: e, month: 12, day: 31 });
  }
  /**
   *
   * @param {Object} s - the settings object
   * @returns Object containing { year, month, day }
   */
  _getLowerLimit(t) {
    if (t.lowerLimit)
      return t.lowerLimit;
    let e;
    return t.minYear !== null ? (e = +t.minYear, { year: e, month: 1, day: 1 }) : (e = (t.maxYear === "now" ? f.y : t.maxYear) - +t.maxAge, { year: e, month: f.m, day: f.d });
  }
  /**
   * The init method
   * TODO: test all(!) option values for correctness
   *
   * @return {*}
   * @memberof BirthdayPicker
   */
  init() {
    if (this.initialized)
      return !0;
    this.initialized = !0, this._registeredEventListeners = [], this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], this._date = [], this._disabled = [];
    const t = this.settings;
    t.placeholder = m(t.placeholder), t.leadingZero = m(t.leadingZero), t.selectFuture = m(t.selectFuture), this._lowerLimit = this._getLowerLimit(t), this._upperLimit = this._getUpperLimit(t), this._yearFrom = this._lowerLimit.year, this._yearTo = this._upperLimit.year;
    const [e] = o.createLocale(t.locale);
    if (t.locale = e, this.monthFormat = o.i18n[t.locale].monthFormat, this.allowedEvents.forEach((i) => {
      t[i] && this.addEventListener(i, t[i]);
    }), this._create(), t.defaultDate) {
      const i = this.setDate(
        t.defaultDate === "now" ? (/* @__PURE__ */ new Date()).toString() : t.defaultDate,
        !0
      );
      this.startDate = i;
    }
    this.state = 1, this._triggerEvent(S);
  }
}
o.i18n = {};
o.currentLocale = "en";
o.getInstance = (s) => N.get(s, "instance");
o.createLocale = (s) => {
  if ((!s || s.length !== 2) && (s = "en"), o.i18n[s])
    return [s, o.i18n[s]];
  let n = /* @__PURE__ */ new Date("2000-01-15"), t = { monthFormat: {} };
  for (let a = 0; a < 12; a++)
    n.setMonth(a), J.forEach((r) => {
      t.monthFormat[r] = t.monthFormat[r] || [], t.monthFormat[r].push(
        n.toLocaleDateString(s, { month: r })
      );
    });
  const e = "BirthdayPickerLocale";
  let i = p[s] ? p[s] : p.en;
  return window[e] && window[e][s] && (i = Object.assign({}, i, window[e][s])), o.i18n[s] = Object.assign(t, i), [s, t];
};
o.setMonthFormat = (s) => {
  u.forEach((n) => {
    n.setMonthFormat(s);
  });
};
o.setLanguage = (s) => {
  o.currentLocale = s, u.forEach((n) => {
    n.setLanguage(s);
  });
};
o.killAll = () => u.length ? (u.forEach((s) => {
  o.kill(s);
}), u = [], !0) : !1;
o.kill = (s) => {
  if (!s || (s.element || (s = o.getInstance(s)), !s))
    return !1;
  s.kill();
  const n = s.element;
  return n.dataset.bdpInit = !1, delete n.dataset.bdpInit, N.remove(n, "instance"), F = !1, !0;
};
o.defaults = Z;
o.init = () => {
  if (F)
    return !1;
  F = !0, o.createLocale(o.currentLocale);
  let s = document.querySelectorAll("[" + b + "]");
  return s.length === 0 ? !1 : (s.forEach((n) => {
    new o(n);
  }), u);
};
export {
  o as default
};
