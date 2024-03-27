/*!
* BirthdayPicker v0.1.19
* https://lemon3.github.io/birthdaypicker
*/
var S = Object.defineProperty;
var w = Object.getOwnPropertySymbols;
var x = Object.prototype.hasOwnProperty, I = Object.prototype.propertyIsEnumerable;
var y = (s, t, e) => t in s ? S(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, N = (s, t) => {
  for (var e in t || (t = {}))
    x.call(t, e) && y(s, e, t[e]);
  if (w)
    for (var e of w(t))
      I.call(t, e) && y(s, e, t[e]);
  return s;
};
var v = (s, t, e) => (y(s, typeof t != "symbol" ? t + "" : t, e), e);
const A = {
  minYear: null,
  // overrides the value set by maxAge
  maxYear: "now",
  minAge: 0,
  maxAge: 100,
  monthFormat: "short",
  placeholder: true,
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
}, D = {
  en: { text: { year: "Year", month: "Month", day: "Day" } },
  de: { text: { year: "Jahr", month: "Monat", day: "Tag" } }
}, W = (s, t, e) => {
  let n = s.getAttribute("on" + t);
  new Function(
    "e",
    // 'with(document) {' +
    // 'with(this)' +
    "{" + n + "}"
    // + '}'
  ).call(s, e);
}, j = (s, t, e, n) => {
  if (t)
    for (const i in t)
      s.setAttribute(i, t[i]);
  if (e)
    for (const i in e)
      s.style[i] = e[i];
  return n && (s.innerHTML = n), s;
}, g = (s, t, e, n) => j(document.createElement(s), t, e, n), O = (s, t, e = null) => {
  if (!s)
    return !1;
  if (t === void 0 || s.dataset[t] === void 0)
    return s.dataset;
  let n;
  try {
    n = JSON.parse(s.dataset[t].replace(/'/g, '"'));
  } catch (a) {
  }
  if (typeof n != "object") {
    n = s.dataset[t];
    const a = {};
    n = n.replace(/ /g, "");
    const o = n.split(",");
    o.length > 1 ? o.forEach((l) => {
      const [u, f] = l.split(":");
      a[u.replace(/'/g, "")] = f.replace(/'/g, "");
    }) : a[t] = n, n = a;
  }
  let i = {}, r = t.length;
  return Object.entries(s.dataset).forEach((a) => {
    if (a[0].toLowerCase().indexOf(t) >= 0 && a[0].length > r) {
      let o = a[0][r].toLowerCase() + a[0].substring(r + 1);
      (e === null || e && e[o] !== void 0) && (i[o] = a[1]);
    }
  }), Object.assign(n, i);
}, C = (s) => +s % 4 === 0 && +s % 100 !== 0 || +s % 400 === 0, F = {
  // storage
  _s: /* @__PURE__ */ new WeakMap(),
  put(s, ...t) {
    this._s.has(s) || this._s.set(s, /* @__PURE__ */ new Map());
    let e = this._s.get(s);
    if (t.length > 1)
      return e.set(t[0], t[1]), this;
    if (typeof t[0] == "object")
      for (const n in t[0])
        e.set(n, t[0][n]);
    else
      e.set(t[0]);
    return this;
  },
  get(s, t) {
    return this._s.has(s) ? t ? this._s.get(s).get(t) : this._s.get(s) : !1;
  },
  has(s, t) {
    return this._s.has(s) && this._s.get(s).has(t);
  },
  // todo if no key given: remove all
  remove(s, t) {
    if (!this._s.has(s))
      return !1;
    let e = this._s.get(s).delete(t);
    return this._s.get(s).size === 0 && this._s.delete(s), e;
  }
}, E = (s, t, e) => {
  if (s = parseFloat(s, 10), isNaN(s))
    return NaN;
  if (t = parseFloat(t, 10), e = parseFloat(e, 10), e < t) {
    let n = e;
    e = t, t = n;
  }
  return !isNaN(t) && s < t ? t : !isNaN(e) && s > e ? e : s;
};
let c = [];
const Y = "birthdaypicker", T = "data-" + Y, Z = ["short", "long", "numeric"], H = ["ymd", "ydm", "myd", "mdy", "dmy", "dym"], d = [
  "init",
  "datechange",
  "daychange",
  "monthchange",
  "yearchange",
  "kill"
], M = "option", _ = /* @__PURE__ */ new Date(), p = {
  y: _.getFullYear(),
  m: _.getMonth() + 1,
  d: _.getDate(),
  t: _.getTime()
};
let L = !1;
const m = (s) => s === !0 || s === "true" || s === 1 || s === "1";
class h {
  constructor(t, e) {
    /**
     * date change event handler, called if one of the fields is updated
     * @param  {Event} e The event
     * @return {void}
     */
    v(this, "_onSelect", (t) => {
      t.target === this._year.el ? this._yearWasChanged(+t.target.value) : t.target === this._month.el ? this._monthWasChanged(+t.target.value) : t.target === this._day.el && this._dayWasChanged(+t.target.value), this._dateChanged();
    });
    if (!t)
      return { error: !0 };
    if (t = typeof t == "string" ? document.querySelector(t) : t, t === null || t.length === 0)
      return { error: !0 };
    if (t.dataset.bdpInit)
      return h.getInstance(t);
    t.dataset.bdpInit = !0, c.push(this), F.put(t, "instance", this);
    const n = O(t, Y, h.defaults);
    this.options = e, this.settings = Object.assign({}, h.defaults, n, e), this.element = t, this.settings.autoInit && this.init();
  }
  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodes Option List
   * @param  {String} value Value to find
   * @return {*}       The index value or undefined
   */
  _getIdx(t, e) {
    if (!(!t || isNaN(e || typeof e == "undefined"))) {
      for (let n = 0, i; n < t.length; n++)
        if (i = t[n], +i.value == +e)
          return n;
    }
  }
  /**
   * Updates one selectBox
   * @param {String} box name of the box ('_year', '_month', '_day')
   * @param {number} value the new value to which the box should be set
   */
  _updateSelectBox(t, e) {
    const n = this[t].el;
    n.selectedIndex = this._getIdx(n.childNodes, e);
  }
  /**
   * called if one value was changed
   */
  _dateChanged() {
    this.settings.selectFuture || this._noFutureDate(p.y, p.m, p.d), this._triggerEvent(d[1]);
  }
  /**
   * set the year to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} year the day value (eg, 1988, 2012, ...)
   * @param {Boolean} triggerDateChange true if a dateChange event should be triggered
   * @returns
   */
  _setYear(t, e = !0) {
    return t = E(t, this._yearEnd, this._yearStart), this.currentYear === t ? !1 : (this._updateSelectBox("_year", t), this._yearWasChanged(t), e && this._dateChanged(), !0);
  }
  /**
   * set the month to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} month the month value (usually between 1 - 12)
   * @param {Boolean} triggerDateChange true if a dateChange event should be triggered
   * @returns
   */
  _setMonth(t, e = !0) {
    return t = E(t, 1, 12), this.currentMonth === t ? !1 : (this._updateSelectBox("_month", t), this._monthWasChanged(t), e && this._dateChanged(), !0);
  }
  /**
   * set the day to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} day the day value (usually between 1 - 31)
   * @param {Boolean} triggerDateChange true if a dateChange event should be triggered
   * @returns
   */
  _setDay(t, e = !0) {
    return t = E(t, 1, this.getDaysPerMonth()), this.currentDay === t ? !1 : (this._updateSelectBox("_day", t), this._dayWasChanged(t), e && this._dateChanged(), !0);
  }
  // _getDateValuesInRange({ year, month, day }) {
  //   // todo: define a min & max date
  //   if (year < this._yearEnd) {
  //     year = month = day = undefined;
  //   } else if (year > this._yearStart) {
  //     year = now.y;
  //     month = now.m;
  //     day = now.d;
  //   } else if (year === this._yearStart) {
  //     if (month > now.m) {
  //       month = now.m;
  //       day = now.d;
  //     } else if (month === now.m && day > now.d) {
  //       day = now.d;
  //     }
  //   }
  //   return { year, month, day };
  // }
  /**
   * Set the date
   * @param {Object} obj with year, month, day as String or Integer
   */
  _setDate({ year: t, month: e, day: n }) {
    this._monthChangeTriggeredLater = e !== this.currentMonth;
    let i = this._setYear(t, !1), r = this._setMonth(e, !1), a = this._setDay(n, !1);
    (i || r || a) && this._dateChanged(), this._monthChangeTriggeredLater = !1;
  }
  _parseDate(t) {
    typeof t != "object" && (t = t.replaceAll("-", "/"));
    const e = Date.parse(t);
    if (isNaN(e))
      return !1;
    const n = new Date(e), i = n.getFullYear(), r = n.getMonth() + 1, a = n.getDate();
    return { year: i, month: r, day: a };
  }
  // function for update or create
  _getMonthText(t) {
    return this.settings.monthFormat !== "numeric" ? t : this.settings.leadingZero && +t < 10 ? "0" + t : "" + t;
  }
  /**
   * Create the gui and set the default (start) values if available
   * @return {void}
   */
  _create() {
    const t = this.settings;
    H.indexOf(t.arrange) < 0 && (t.arrange = "ymd");
    const e = { y: "year", m: "month", d: "day" };
    t.arrange.split("").forEach((r) => {
      const a = e[r];
      let o, l = t[a + "El"];
      l && typeof l.nodeName != "undefined" ? o = l : (l = l || "[" + T + "-" + a + "]", o = this.element.querySelector(l)), (!o || o.dataset.init) && (o = g("select"), this.element.append(o)), o.setAttribute("aria-label", `select ${a}`), t.className && (o.classList.add(t.className), o.classList.add(`${t.className}-${a}`)), o.dataset.init = !0;
      const u = "change", f = this._onSelect, b = !1;
      o.addEventListener(u, f, b), this._registeredEventListeners.push({
        element: o,
        eventName: u,
        listener: f,
        option: b
      }), this["_" + a] = {
        el: o,
        df: document.createDocumentFragment(),
        name: a
        // placeholder name
      }, this._date.push(this["_" + a]);
    });
    const n = g(M, { value: "" });
    t.placeholder && this._date.forEach((r) => {
      const a = h.i18n[t.locale].text[r.name], o = n.cloneNode();
      o.innerHTML = a, r.df.appendChild(o);
    });
    for (let r = this._yearStart; r >= this._yearEnd; r--) {
      const a = n.cloneNode();
      a.value = r, a.innerHTML = r, this._year.df.append(a);
    }
    this.monthFormat[t.monthFormat].forEach((r, a) => {
      const o = n.cloneNode();
      o.value = a + 1, o.innerHTML = this._getMonthText(r), this._month.df.append(o);
    });
    let i;
    for (let r = 1; r <= 31; r++) {
      i = t.leadingZero && r < 10 ? "0" + r : r;
      const a = g(M, { value: r }, "", i);
      this._day.df.append(a);
    }
    this._date.forEach((r) => r.el.append(r.df));
  }
  /**
   * function to update the days, according to the given month
   * @param  {String} month The month String
   * @return {[type]}       [description]
   */
  _updateDays(t) {
    let e = this.getDaysPerMonth(t);
    const n = this.settings.placeholder ? 1 : 0, i = this._day.el.children.length - n;
    if (e !== i)
      if (typeof e == "undefined" && (e = 31), e - i > 0)
        for (let r = i; r < e; r++) {
          let a = g(M, { value: r + 1 }, "", "" + (r + 1));
          this._day.el.append(a);
        }
      else {
        for (let r = i; r > e; r--)
          this._day.el.children[r + n - 1].remove();
        this.currentDay > e && (this.settings.roundDownDay ? this._setDay(e, !1) : this._dayWasChanged(void 0));
      }
  }
  _triggerEvent(t, e) {
    const i = { detail: N({
      instance: this,
      year: +this._year.el.value,
      month: +this._month.el.value,
      day: +this._day.el.value,
      date: this.getDate()
    }, e) }, r = new CustomEvent(t, i);
    this.element.dispatchEvent(r), this.eventFired[t] = r, W(this.element, t, r);
  }
  _noFutureDate(t, e, n) {
    if (this._disabled.length && (this._disabled.forEach((r) => {
      r.disabled = !1;
    }), this._disabled = []), this.currentYear < t || !this.currentYear || !this.currentYear && !this.currentMonth && !this.currentDay)
      return !1;
    this.currentYear > t && this._setYear(t, !1), this._month.el.childNodes.forEach((r) => {
      r.value > e && (r.disabled = !0, this._disabled.push(r));
    });
    const i = this.currentMonth > e;
    return i && this._setMonth(e, !1), e === this.currentMonth && (this._day.el.childNodes.forEach((r) => {
      r.value > n && (r.disabled = !0, this._disabled.push(r));
    }), (i || this.currentDay > n) && this._setDay(n, !1)), !0;
  }
  /**
   * called if the day was changed
   * sets the currentDay value and triggers the corresponding event
   * @param {number} day the new day value
   * @returns
   */
  _dayWasChanged(t) {
    this.currentDay = t, this._triggerEvent(d[2]);
  }
  /**
   * called if the month was changed
   * sets the currentMonth value and triggers the corresponding event
   * @param {number} month the new month value
   * @returns
   */
  _monthWasChanged(t) {
    this.currentMonth = t, this._triggerEvent(d[3]), this._updateDays(t);
  }
  /**
   * called if the year was changed
   * sets the currentYear value and triggers the corresponding event
   * @param {number} year the new year value
   * @returns
   */
  _yearWasChanged(t) {
    this.currentYear = t, this._daysPerMonth[1] = C(t) ? 29 : 28, this._triggerEvent(d[4]), !this._monthChangeTriggeredLater && this.currentMonth === 2 && this._updateDays(this.currentMonth);
  }
  useLeadingZero(t) {
    t = m(t), t !== this.settings.leadingZero && (this.settings.leadingZero = t, this.settings.monthFormat === "numeric" && this._updateMonthList(), this._updateDayList());
  }
  _updateDayList() {
    const t = this.settings.placeholder ? 1 : 0;
    for (let e = 0; e < 9; e++) {
      const n = this._day.el.childNodes[e + t];
      n.innerHTML = (this.settings.leadingZero ? "0" : "") + (e + 1);
    }
  }
  _updateMonthList() {
    const t = this.settings.monthFormat, e = this.settings.placeholder ? 1 : 0;
    this.monthFormat[t].forEach((n, i) => {
      this._month.el.childNodes[i + e].innerHTML = this._getMonthText(n);
    });
  }
  getDaysPerMonth(t = this.currentMonth) {
    return this._daysPerMonth[+t - 1];
  }
  /**
   * Change the current active month format
   * @param  {[type]} format [description]
   * @return {[type]}        [description]
   */
  setMonthFormat(t) {
    return this.monthFormat[t] ? (t !== this.settings.monthFormat && (this.settings.monthFormat = t, this._updateMonthList()), !0) : !1;
  }
  setLanguage(t) {
    if (t === this.settings.locale || ("" + t).length < 2 || ("" + t).length > 2)
      return !1;
    h.createLocale(t);
    const e = h.i18n[t];
    if (this.settings.placeholder && this._date.forEach((i) => {
      i.el.childNodes[0].innerHTML = e.text[i.name];
    }), this.monthFormat = e.month, this.settings.locale = t, this.settings.monthFormat === "numeric")
      return !1;
    let n = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((i, r) => {
      this._month.el.childNodes[n + r].innerHTML = i;
    }), this._triggerEvent(d[1]);
  }
  // todo: use a format option, eg.: yyyy-dd-mm
  setDate(t) {
    let e = this._parseDate(t);
    return e && this._setDate(e), e;
  }
  resetDate(t = !1) {
    let e = this.startDate && t ? this.startDate : { year: void 0, month: void 0, day: void 0 };
    this._setDate(e);
  }
  addEventListener(t, e, n) {
    if (d.indexOf(t) < 0 || typeof e != "function")
      return !1;
    this.element.addEventListener(t, e, n), this._registeredEventListeners.push({
      element: this.element,
      eventName: t,
      listener: e,
      option: n
    }), this.eventFired[t] && e.call(this.element, this.eventFired[t]);
  }
  removeEventListener(t, e, n) {
    this.element.removeEventListener(t, e, n);
  }
  // todo: undo everything
  kill() {
    if (this.eventFired = {}, this._registeredEventListeners && this._registeredEventListeners.forEach(
      (t) => t.element.removeEventListener(t.eventName, t.listener, t.option)
    ), this.settings.className) {
      const t = this.settings.className;
      ["year", "month", "day"].forEach((e) => {
        const n = t + "-" + e, i = this.element.querySelector("." + n);
        i && (i.classList.remove(t), i.classList.remove(n));
      });
    }
    this._triggerEvent(d[5]);
  }
  isLeapYear(t = this.currentYear) {
    return t === void 0 ? void 0 : C(t);
  }
  getDateString(t) {
    if (!t) {
      const n = this.getDate();
      return n && n.toLocaleDateString(this.settings.locale);
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
   * The init method
   * todo: test all(!) option values for correctness
   *
   * @return {*}
   * @memberof BirthdayPicker
   */
  init() {
    if (this.initialized)
      return !0;
    this.initialized = !0, this.eventFired = {}, this._registeredEventListeners = [], this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], this._date = [], this._disabled = [];
    const t = this.settings;
    if (t.placeholder = m(t.placeholder), t.leadingZero = m(t.leadingZero), t.selectFuture = m(t.selectFuture), t.maxYear === "now" ? this._yearStart = p.y : this._yearStart = t.maxYear, this._yearStart -= +t.minAge, t.minYear ? this._yearEnd = +t.minYear : this._yearEnd = this._yearStart - +t.maxAge, h.createLocale(t.locale), this.monthFormat = h.i18n[t.locale].month, this._create(), this._triggerEvent(d[0]), t.defaultDate) {
      const e = this.setDate(
        t.defaultDate === "now" ? (/* @__PURE__ */ new Date()).toString() : t.defaultDate
      );
      this.currentYear = e.year, this.currentMonth = e.month, this.currentDay = e.day, this.startDate = e;
    }
  }
}
h.i18n = {};
h.currentLocale = "en";
h.getInstance = (s) => F.get(s, "instance");
h.createLocale = (s) => {
  if ((!s || s.length !== 2) && (s = "en"), h.i18n[s])
    return h.i18n[s];
  let t = /* @__PURE__ */ new Date("2000-01-15"), e = { month: {} };
  for (let r = 0; r < 12; r++)
    t.setMonth(r), Z.forEach((a) => {
      e.month[a] = e.month[a] || [], e.month[a].push(t.toLocaleDateString(s, { month: a }));
    });
  const n = "BirthdayPickerLocale";
  let i = D[s] ? D[s] : D.en;
  return window[n] && window[n][s] && window[n][s].text && (i = Object.assign({}, i, window[n][s])), e.text = i.text, h.i18n[s] = e, e;
};
h.setMonthFormat = (s) => {
  c.forEach((t) => {
    t.setMonthFormat(s);
  });
};
h.setLanguage = (s) => {
  h.currentLocale = s, c.forEach((t) => {
    t.setLanguage(s);
  });
};
h.killAll = () => c.length ? (c.forEach((s) => {
  h.kill(s);
}), c = [], !0) : !1;
h.kill = (s) => {
  if (!s || (s.element || (s = h.getInstance(s)), !s))
    return !1;
  s.kill();
  const t = s.element;
  return t.dataset.bdpInit = !1, delete t.dataset.bdpInit, F.remove(t, "instance"), L = !1, !0;
};
h.defaults = A;
h.init = () => {
  if (L)
    return !1;
  L = !0, h.createLocale(h.currentLocale);
  let s = document.querySelectorAll("[" + T + "]");
  return s.length === 0 ? !1 : (s.forEach((t) => {
    new h(t);
  }), c);
};
if (globalThis.getDomData)
  for (const s of Object.keys(globalThis.getDomData))
    globalThis[s] = globalThis.getDomData[s];
export {
  h as default
};
