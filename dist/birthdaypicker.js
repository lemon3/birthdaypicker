/*!
* BirthdayPicker v0.2.2
* https://lemon3.github.io/birthdaypicker
*/
var k = Object.defineProperty;
var F = Object.getOwnPropertySymbols;
var W = Object.prototype.hasOwnProperty, $ = Object.prototype.propertyIsEnumerable;
var y = (a, n, t) => n in a ? k(a, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[n] = t, f = (a, n) => {
  for (var t in n || (n = {}))
    W.call(n, t) && y(a, t, n[t]);
  if (F)
    for (var t of F(n))
      $.call(n, t) && y(a, t, n[t]);
  return a;
};
var l = (a, n, t) => y(a, typeof n != "symbol" ? n + "" : n, t);
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
}, b = {
  en: { year: "Year", month: "Month", day: "Day" },
  de: { year: "Jahr", month: "Monat", day: "Tag" },
  fr: { year: "Année", month: "Mois", day: "Jour" }
}, q = (a, n, t, e) => {
  if (n)
    for (const s in n)
      a.setAttribute(s, n[s]);
  if (t)
    for (const s in t)
      a.style[s] = t[s];
  return e && (a.innerHTML = e), a;
}, m = (a, n, t, e) => q(document.createElement(a), n, t, e), j = (a, n, t = null) => {
  if (!a)
    return !1;
  if (a.dataset[n] === void 0)
    return a.dataset;
  let e;
  try {
    a.dataset[n] !== "undefined" && a.dataset[n].indexOf("{") >= 0 && (e = JSON.parse(a.dataset[n].replace(/'/g, '"')));
  } catch (i) {
    console.error(i);
  }
  if (typeof e != "object") {
    e = a.dataset[n];
    const i = {};
    e = e.replace(/ /g, "");
    const o = e.split(",");
    o.length > 1 ? o.forEach((c) => {
      const [u, H] = c.split(":");
      i[u.replace(/'/g, "")] = H.replace(/'/g, "");
    }) : i[n] = e, e = i;
  }
  let s = {}, r = n.length;
  return Object.entries(a.dataset).forEach((i) => {
    if (i[0].toLowerCase().indexOf(n) >= 0 && i[0].length > r) {
      let o = i[0][r].toLowerCase() + i[0].substring(r + 1);
      (t === null || t && t[o] !== void 0) && (s[o] = i[1]);
    }
  }), Object.assign(e, s);
}, C = (a) => +a % 4 === 0 && +a % 100 !== 0 || +a % 400 === 0, D = {
  // storage
  _s: /* @__PURE__ */ new WeakMap(),
  put(a, ...n) {
    this._s.has(a) || this._s.set(a, /* @__PURE__ */ new Map());
    let t = this._s.get(a);
    if (n.length > 1)
      return t.set(n[0], n[1]), this;
    if (typeof n[0] == "object")
      for (const e in n[0])
        t.set(e, n[0][e]);
    else
      t.set(n[0]);
    return this;
  },
  get(a, n) {
    return this._s.has(a) ? n ? this._s.get(a).get(n) : this._s.get(a) : !1;
  },
  has(a, n) {
    return this._s.has(a) && this._s.get(a).has(n);
  },
  // todo if no key given: remove all
  remove(a, n) {
    if (!this._s.has(a))
      return !1;
    let t = this._s.get(a).delete(n);
    return this._s.get(a).size === 0 && this._s.delete(a), t;
  }
}, L = (a, n, t) => {
  if (a = parseFloat(a, 10), isNaN(a))
    return NaN;
  if (n = parseFloat(n, 10), t = parseFloat(t, 10), t < n) {
    let e = t;
    t = n, n = e;
  }
  return !isNaN(n) && a < n ? n : !isNaN(t) && a > t ? t : a;
}, p = (a) => a === !0 || a === "true" || a === 1 || a === "1", z = (a, n, t) => {
  let e = a.getAttribute("on" + n);
  new Function(
    "e",
    // 'with(document) {' +
    // 'with(this)' +
    "{" + e + "}"
    // + '}'
  ).call(a, t);
};
class G {
  constructor() {
    this._eventCallbacks = this._eventCallbacks || {};
  }
  emit(n, t) {
    let e = this._eventCallbacks[n];
    const s = { bubbles: !1, cancelable: !1, detail: t }, r = new CustomEvent(n, s);
    e && e.forEach((i) => i.call(this, r)), this.element && (this.element.dispatchEvent(r), z(this.element, n, r));
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
      (s) => s !== t
    ), this) : this;
  }
}
let d = [];
const O = "birthdaypicker", Y = "data-" + O, J = ["short", "long", "numeric"], U = ["ymd", "ydm", "myd", "mdy", "dmy", "dym"], v = "init", E = "datechange", S = "daychange", T = "monthchange", x = "yearchange", A = "kill", M = "option", _ = { y: "year", m: "month", d: "day" }, w = /* @__PURE__ */ new Date(), g = {
  y: w.getFullYear(),
  m: w.getMonth() + 1,
  d: w.getDate()
};
let N = !1;
const h = class h extends G {
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
    l(this, "_onSelect", (t) => {
      t.target === this._year.el ? this._yearWasChanged(+t.target.value) : t.target === this._month.el ? this._monthWasChanged(+t.target.value) : t.target === this._day.el && this._dayWasChanged(+t.target.value), this._dateChanged();
    });
    if (t.dataset.bdpInit)
      return h.getInstance(t);
    t.dataset.bdpInit = !0, this.allowedEvents = [
      v,
      E,
      S,
      T,
      x,
      A
    ], d.push(this), D.put(t, "instance", this);
    const s = j(t, O, h.defaults);
    this.options = e || {}, this.settings = Object.assign({}, h.defaults, s, e), this.element = t, this.state = 0, this.settings.autoInit && this.init();
  }
  _triggerEvent(t, e) {
    e = f({
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
    if (t instanceof Date && !isNaN(t))
      return {
        year: t.getFullYear(),
        month: t.getMonth() + 1,
        day: t.getDate()
      };
    if (typeof t != "string" || !t.trim())
      return !1;
    const e = new Date(t.replace(/-/g, "/"));
    return isNaN(e) ? !1 : {
      year: e.getFullYear(),
      month: e.getMonth() + 1,
      day: e.getDate()
    };
  }
  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodeList Option List
   * @param  {String|Number} value Value to find
   * @return {Number|undefined} The index value or undefined
   */
  _getIdx(t, e) {
    if (!(t instanceof NodeList) || e === void 0 || e === null)
      return;
    const s = isNaN(e) ? e : +e, r = Array.from(t).findIndex(
      (i) => +i.value === s
    );
    return r !== -1 ? r : void 0;
  }
  /**
   * Updates one selectBox
   * @param {String} box name of the box ('_year', '_month', '_day')
   * @param {number} value the new value to which the box should be set
   */
  _updateSelectBox(t, e) {
    const s = this[t].el;
    s.selectedIndex = this._getIdx(s.childNodes, e);
  }
  /**
   * set the year to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} year the day value (eg, 1988, 2012, ...)
   * @returns
   */
  _setYear(t) {
    return t = L(t, this._yearFrom, this._yearTo), this.currentYear === t ? !1 : (this._updateSelectBox("_year", t), this._yearWasChanged(t, !1), !0);
  }
  /**
   * set the month to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} month the month value (usually between 1 - 12)
   * @returns
   */
  _setMonth(t) {
    return t = L(t, 1, 12), this.currentMonth === t ? !1 : (this._updateSelectBox("_month", t), this._monthWasChanged(t, !1), !0);
  }
  /**
   * set the day to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} day the day value (usually between 1 - 31)
   * @returns
   */
  _setDay(t) {
    return t = L(t, 1, this._getDaysPerMonth()), this.currentDay === t ? !1 : (this._updateSelectBox("_day", t), this._dayWasChanged(t, !1), !0);
  }
  _getDateInRange({
    year: t = this.currentYear,
    month: e = this.currentMonth,
    day: s = this.currentDay
  } = {}) {
    const r = this._lowerLimit, i = this._upperLimit;
    if (!r || !i)
      throw new Error("Lower and upper date limits must be defined.");
    const o = new Date(t, e - 1, s), c = new Date(r.year, r.month - 1, r.day), u = new Date(i.year, i.month - 1, i.day);
    return o > u ? i : o < c ? r : { year: t, month: e, day: s };
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
    let s = this._setYear(t.year), r = this._setMonth(t.month), i = this._setDay(t.day);
    return (s || r || i) && this._dateChanged(e), t;
  }
  // function for update or create
  _getMonthText(t) {
    return this.settings.monthFormat !== "numeric" ? t : this.settings.leadingZero ? String(t).padStart(2, "0") : String(t);
  }
  _checkArrangement(t) {
    return t = t.toLowerCase(), U.includes(t) ? t : "ymd";
  }
  _mapSelectBoxes() {
    const t = this.element.querySelectorAll("select");
    if (!t.length) return {};
    const e = {}, s = this.settings.arrange.split(""), r = s.map((o) => _[o]);
    r.forEach((o) => {
      const c = this.settings[`${o}El`] || `[${Y}-${o}]`, u = c.nodeName ? c : this.element.querySelector(c);
      u && u.tagName === "SELECT" && (e[o] = u, s.splice(
        s.indexOf(r.indexOf(o).toString()),
        1
      ));
    });
    const i = Array.from(t).filter(
      (o) => !Object.values(e).includes(o)
    );
    return s.forEach((o, c) => {
      const u = _[o];
      e[u] = i[c];
    }), e;
  }
  /**
   * Create the GUI
   * @return {void}
   */
  _create() {
    const t = this.settings;
    t.arrange = this._checkArrangement(t.arrange);
    const e = this._mapSelectBoxes();
    t.arrange.split("").forEach((r) => {
      const i = _[r];
      let o = e[i];
      (!o || o.dataset.init) && (o = m("select"), this.element.append(o)), o.setAttribute("aria-label", `select ${i}`), t.className && o.classList.add(t.className, `${t.className}-${i}`), o.dataset.init = !0;
      const c = this._onSelect;
      o.addEventListener("change", c, !1), this._registeredEventListeners.push({
        element: o,
        eventName: "change",
        listener: c,
        option: !1
      }), this[`_${i}`] = {
        el: o,
        name: i,
        created: !e[i],
        df: document.createDocumentFragment()
      }, this._date.push(this[`_${i}`]);
    });
    const s = m(M);
    t.placeholder && this._date.forEach((r) => {
      const i = h.i18n[t.locale][r.name], o = s.cloneNode();
      o.innerHTML = i, r.df.appendChild(o);
    });
    for (let r = this._yearTo; r >= this._yearFrom; r--) {
      const i = s.cloneNode();
      i.value = r, i.innerHTML = r, this._year.df.append(i);
    }
    this.monthFormat[t.monthFormat].forEach((r, i) => {
      const o = s.cloneNode();
      o.value = i + 1, o.innerHTML = this._getMonthText(r), this._month.df.append(o);
    });
    for (let r = 1; r <= 31; r++) {
      const i = t.leadingZero && r < 10 ? `0${r}` : r, o = m(M, { value: r }, "", i);
      this._day.df.append(o);
    }
    this._date.forEach((r) => r.el.append(r.df));
  }
  /**
   * Update the days according to the given month
   * called when month changes or year changes form non-leap-year to a leap-year
   * or vice versa
   * @param {number} [month=this.currentMonth] The number of the month (1-12)
   * @return {void}
   */
  _updateDays(t = this.currentMonth) {
    const e = this._getDaysPerMonth(t) || 31, s = this.settings.placeholder ? 1 : 0, r = this._day.el.children.length - s;
    if (e === r) return;
    const i = e - r;
    if (i > 0)
      for (let o = r + 1; o <= e; o++) {
        const c = m(M, { value: o }, "", o);
        this._day.el.append(c);
      }
    else {
      for (let o = 0; o < -i; o++)
        this._day.el.children[r + s - o - 1].remove();
      this.currentDay > e && (this.settings.roundDownDay ? this._setDay(e) : this._dayWasChanged());
    }
  }
  /**
   * Disable the options in the select box
   *
   * @param {String} selectBox - Name of the select box (_year, _month, _day)
   * @param {String} condition - '>' or '<'
   * @param {Number} limit - the limit
   */
  _disable(t, e, s) {
    const r = e === "<";
    this[t].el.childNodes.forEach((i) => {
      (r && +i.value < s || !r && +i.value > s) && (i.disabled = !0, this._disabled.push(i));
    });
  }
  // TODO: only on select change
  _noFutureDate(t = this._lowerLimit, e = this._upperLimit) {
    if (this._disabled.forEach((c) => {
      c.disabled = !1;
    }), this._disabled = [], this.currentYear > t.year && this.currentYear < e.year || !this.currentYear || !this.currentYear && !this.currentMonth && !this.currentDay)
      return !1;
    const s = this.currentYear >= e.year, r = s ? e.year : t.year, i = s ? e.month : t.month, o = s ? e.day : t.day;
    return this.currentYear !== r && this._setYear(r), this._disable("_month", s ? ">" : "<", i), this.currentMonth !== i && this._setMonth(i), this.currentMonth === i && (this._disable("_day", s ? ">" : "<", o), this.currentDay !== o && this._setDay(o)), !0;
  }
  /**
   * called if the year was changed
   * sets the currentYear value and triggers the corresponding event
   * @param {number} year the new year value
   * @returns
   */
  _yearWasChanged(t, e = !0) {
    this.currentYear = t, this._daysPerMonth[1] = C(t) ? 29 : 28, e && this._triggerEvent(x), this.currentMonth === 2 && this._updateDays();
  }
  /**
   * called if the month was changed
   * sets the currentMonth value and triggers the corresponding event
   * @param {number} month the new month value
   * @returns
   */
  _monthWasChanged(t, e = !0) {
    this.currentMonth = t, e && this._triggerEvent(T), this._updateDays();
  }
  /**
   * called if the day was changed
   * sets the currentDay value and triggers the corresponding event
   * @param {number} day the new day value
   * @returns
   */
  _dayWasChanged(t, e = !0) {
    this.currentDay = t, e && this._triggerEvent(S);
  }
  /**
   * called if one value was changed
   *
   * @param {boolean} [triggerEvent = true] - true if the event should be triggered, default: true
   */
  _dateChanged(t = !0) {
    this.settings.selectFuture || this._noFutureDate(this._lowerLimit, this._upperLimit), t && this._triggerEvent(E), this.element.value = this.getDateString();
  }
  /**
   * updates the innerHTML off the day option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero
   */
  _updateDayList() {
    const t = this.settings.placeholder ? 1 : 0, e = this.settings.leadingZero ? "0" : "";
    for (let s = t; s < 9 + t; s++)
      this._day.el.childNodes[s].innerHTML = e + s;
  }
  /**
   * updates the innerHTML off the month option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero or changes the month format
   */
  _updateMonthList() {
    const t = this.settings.placeholder ? 1 : 0, e = this.settings.monthFormat;
    this.monthFormat[e].forEach((s, r) => {
      this._month.el.childNodes[r + t].innerHTML = this._getMonthText(s);
    });
  }
  /**
   * Set the GUI (select boxes) to use a leading zero or not
   *
   * @param {boolean} leadingZero
   */
  useLeadingZero(t) {
    t = p(t), t !== this.settings.leadingZero && (this.settings.leadingZero = t, this.settings.monthFormat === "numeric" && this._updateMonthList(), this._updateDayList());
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
    h.createLocale(t);
    const e = h.i18n[t];
    if (this.settings.placeholder && this._date.forEach((r) => {
      r.el.childNodes[0].innerHTML = e[r.name];
    }), this.monthFormat = e.monthFormat, this.settings.locale = t, this.settings.monthFormat === "numeric")
      return !1;
    let s = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((r, i) => {
      this._month.el.childNodes[s + i].innerHTML = r;
    });
  }
  setDate(t, e = !1) {
    let s = this._parseDate(t);
    return s && (s = this._setDate(s, e)), s;
  }
  resetDate(t = !1) {
    const e = t && this.startDate ? this.startDate : { year: NaN, month: NaN, day: NaN };
    this._setDate(e), this.element.value = this.getDateString(), this._triggerEvent(E);
  }
  // TODO: undo everything
  // destroy (cleanup) if it was created
  kill() {
    var t;
    (t = this._registeredEventListeners) == null || t.forEach(
      (e) => e.element.removeEventListener(e.eventName, e.listener, e.option)
    ), this._date.forEach((e) => {
      if (e.created)
        e.el.remove();
      else {
        const s = this.settings.className;
        s && e.el.classList.remove(
          s,
          ...Object.values(_).map((r) => `${s}-${r}`)
        );
      }
    }), this._triggerEvent(A);
  }
  isLeapYear(t = this.currentYear) {
    return t === void 0 ? void 0 : C(t);
  }
  getAge() {
    if (isNaN(this.currentYear) || isNaN(this.currentMonth) || isNaN(this.currentDay))
      return "";
    const t = this.currentYear, e = this.currentMonth, s = this.currentDay, r = /* @__PURE__ */ new Date(), i = r.getMonth() + 1;
    return r.getFullYear() - t - (i < e || i === e && r.getDate() < s ? 1 : 0);
  }
  getDateString(t) {
    if (!t) {
      const i = this.getDate();
      return i && i.toLocaleDateString(this.settings.locale);
    }
    if (!this.currentYear || !this.currentMonth || !this.currentDay) return "";
    const e = this.currentYear, s = String(this.currentMonth).padStart(2, "0"), r = String(this.currentDay).padStart(2, "0");
    return t.toLowerCase().replace(/yyyy/g, e).replace(/yy/g, e.toString().slice(2)).replace(/mm/g, s).replace(/m/g, this.currentMonth).replace(/dd/g, r).replace(/d/g, this.currentDay);
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
    return t.maxYear === "now" ? (e = g.y - +t.minAge, { year: e, month: g.m, day: g.d }) : (e = t.maxYear, { year: e, month: 12, day: 31 });
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
    return t.minYear !== null ? (e = +t.minYear, { year: e, month: 1, day: 1 }) : (e = (t.maxYear === "now" ? g.y : t.maxYear) - +t.maxAge, { year: e, month: g.m, day: g.d });
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
    t.placeholder = p(t.placeholder), t.leadingZero = p(t.leadingZero), t.selectFuture = p(t.selectFuture), this._lowerLimit = this._getLowerLimit(t), this._upperLimit = this._getUpperLimit(t), this._yearFrom = this._lowerLimit.year, this._yearTo = this._upperLimit.year;
    const [e] = h.createLocale(t.locale);
    if (t.locale = e, this.monthFormat = h.i18n[t.locale].monthFormat, this.allowedEvents.forEach((s) => {
      t[s] && this.addEventListener(s, t[s]);
    }), this._create(), t.defaultDate) {
      const s = this.setDate(
        t.defaultDate === "now" ? (/* @__PURE__ */ new Date()).toString() : t.defaultDate,
        !0
      );
      this.startDate = s;
    }
    this.state = 1, this._triggerEvent(v);
  }
};
l(h, "currentLocale", "en"), l(h, "i18n", {}), l(h, "createLocale", (t = "en") => {
  if (t.length !== 2 && (t = "en"), h.i18n[t])
    return [t, h.i18n[t]];
  const e = /* @__PURE__ */ new Date("2000-01-15"), s = { monthFormat: {} };
  J.forEach((o) => {
    s.monthFormat[o] = [];
    for (let c = 0; c < 12; c++)
      e.setMonth(c), s.monthFormat[o].push(
        e.toLocaleDateString(t, { month: o })
      );
  });
  const r = "BirthdayPickerLocale", i = f(f({}, b[t] || b.en), window[r] && window[r][t]);
  return h.i18n[t] = f(f({}, s), i), [t, h.i18n[t]];
}), l(h, "getInstance", (t) => D.get(t, "instance")), /**
 * Set the month format for all registered instances
 * @param  {String} format The available formats are: 'short', 'long', 'numeric'
 */
l(h, "setMonthFormat", (t) => {
  d.forEach((e) => {
    e.setMonthFormat(t);
  });
}), /**
 * Set the language of all registered instances
 * @param  {String} lang The language string, eg.: 'en', 'de'
 */
l(h, "setLanguage", (t) => {
  h.currentLocale = t, d.forEach((e) => {
    e.setLanguage(t);
  });
}), /**
 * Kill all events on all registered instances
 * @returns {Boolean} false if no instance was found, or true if events where removed
 */
l(h, "killAll", () => d.length ? (d.forEach((t) => {
  h.kill(t);
}), d = [], !0) : !1), /**
 *
 * @param {*} instance either an registered html object or an instance of the BirthdayPicker class
 * @returns {Boolean} false or true
 */
l(h, "kill", (t) => {
  if (!t || (t.element || (t = h.getInstance(t)), !t))
    return !1;
  t.kill();
  const e = t.element;
  return e.dataset.bdpInit = !1, delete e.dataset.bdpInit, D.remove(e, "instance"), N = !1, !0;
}), l(h, "defaults", Z), l(h, "init", () => {
  if (N)
    return !1;
  N = !0, h.createLocale(h.currentLocale);
  let t = document.querySelectorAll("[" + Y + "]");
  return t.length === 0 ? !1 : (t.forEach((e) => {
    new h(e);
  }), d);
});
let I = h;
export {
  I as default
};
