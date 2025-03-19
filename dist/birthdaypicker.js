/*!
 * BirthdayPicker v0.2.2
 * https://lemon3.github.io/birthdaypicker
 */
var H = Object.defineProperty;
var b = Object.getOwnPropertySymbols;
var W = Object.prototype.hasOwnProperty,
  $ = Object.prototype.propertyIsEnumerable;
var p = (a, i, t) =>
    i in a
      ? H(a, i, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (a[i] = t),
  f = (a, i) => {
    for (var t in i || (i = {})) W.call(i, t) && p(a, t, i[t]);
    if (b) for (var t of b(i)) $.call(i, t) && p(a, t, i[t]);
    return a;
  };
var l = (a, i, t) => p(a, typeof i != 'symbol' ? i + '' : i, t);
const Z = {
    minAge: 0,
    maxAge: 100,
    minYear: null,
    maxYear: 'now',
    lowerLimit: null,
    upperLimit: null,
    monthFormat: 'short',
    placeholder: !0,
    className: null,
    defaultDate: null,
    autoInit: !0,
    leadingZero: !0,
    locale: 'en',
    selectFuture: !1,
    arrange: 'ymd',
    yearEl: null,
    monthEl: null,
    dayEl: null,
    roundDownDay: !0,
  },
  C = {
    en: { year: 'Year', month: 'Month', day: 'Day' },
    de: { year: 'Jahr', month: 'Monat', day: 'Tag' },
    fr: { year: 'Année', month: 'Mois', day: 'Jour' },
  },
  q = (a, i, t, e) => {
    if (i) for (const s in i) a.setAttribute(s, i[s]);
    if (t) for (const s in t) a.style[s] = t[s];
    return e && (a.innerHTML = e), a;
  },
  m = (a, i, t, e) => q(document.createElement(a), i, t, e),
  j = (a, i, t = null) => {
    if (!a) return !1;
    if (a.dataset[i] === void 0) return a.dataset;
    let e;
    try {
      a.dataset[i] !== 'undefined' &&
        a.dataset[i].indexOf('{') >= 0 &&
        (e = JSON.parse(a.dataset[i].replace(/'/g, '"')));
    } catch (r) {
      console.error(r);
    }
    if (typeof e != 'object') {
      e = a.dataset[i];
      const r = {};
      e = e.replace(/ /g, '');
      const h = e.split(',');
      h.length > 1
        ? h.forEach((c) => {
            const [u, k] = c.split(':');
            r[u.replace(/'/g, '')] = k.replace(/'/g, '');
          })
        : (r[i] = e),
        (e = r);
    }
    let s = {},
      n = i.length;
    return (
      Object.entries(a.dataset).forEach((r) => {
        if (r[0].toLowerCase().indexOf(i) >= 0 && r[0].length > n) {
          let h = r[0][n].toLowerCase() + r[0].substring(n + 1);
          (t === null || (t && t[h] !== void 0)) && (s[h] = r[1]);
        }
      }),
      Object.assign(e, s)
    );
  },
  w = (a) => (+a % 4 === 0 && +a % 100 !== 0) || +a % 400 === 0,
  D = {
    // storage
    _s: /* @__PURE__ */ new WeakMap(),
    put(a, ...i) {
      this._s.has(a) || this._s.set(a, /* @__PURE__ */ new Map());
      let t = this._s.get(a);
      if (i.length > 1) return t.set(i[0], i[1]), this;
      if (typeof i[0] == 'object') for (const e in i[0]) t.set(e, i[0][e]);
      else t.set(i[0]);
      return this;
    },
    get(a, i) {
      return this._s.has(a) ? (i ? this._s.get(a).get(i) : this._s.get(a)) : !1;
    },
    has(a, i) {
      return this._s.has(a) && this._s.get(a).has(i);
    },
    // todo if no key given: remove all
    remove(a, i) {
      if (!this._s.has(a)) return !1;
      let t = this._s.get(a).delete(i);
      return this._s.get(a).size === 0 && this._s.delete(a), t;
    },
  },
  L = (a, i, t) => {
    if (((a = parseFloat(a, 10)), isNaN(a))) return NaN;
    if (((i = parseFloat(i, 10)), (t = parseFloat(t, 10)), t < i)) {
      let e = t;
      (t = i), (i = e);
    }
    return !isNaN(i) && a < i ? i : !isNaN(t) && a > t ? t : a;
  },
  _ = (a) => a === !0 || a === 'true' || a === 1 || a === '1',
  z = (a, i, t) => {
    let e = a.getAttribute('on' + i);
    new Function(
      'e',
      // 'with(document) {' +
      // 'with(this)' +
      '{' + e + '}'
      // + '}'
    ).call(a, t);
  };
class G {
  constructor() {
    this._eventCallbacks = this._eventCallbacks || {};
  }
  emit(i, t) {
    let e = this._eventCallbacks[i];
    const s = { bubbles: !1, cancelable: !1, detail: t },
      n = new CustomEvent(i, s);
    e && e.forEach((r) => r.call(this, n)),
      this.element && (this.element.dispatchEvent(n), z(this.element, i, n));
  }
  // on
  addEventListener(i, t) {
    return (this.allowedEvents && this.allowedEvents.indexOf(i) < 0) ||
      typeof t != 'function'
      ? !1
      : (this._eventCallbacks[i] || (this._eventCallbacks[i] = []),
        this._eventCallbacks[i].push(t),
        this);
  }
  // off
  removeEventListener(i, t) {
    if (!this._eventCallbacks || arguments.length === 0)
      return (this._eventCallbacks = {}), this;
    let e = this._eventCallbacks[i];
    return e
      ? arguments.length === 1
        ? (delete this._eventCallbacks[i], this)
        : ((this._eventCallbacks[i] = e.filter((s) => s !== t)), this)
      : this;
  }
}
let d = [];
const O = 'birthdaypicker',
  Y = 'data-' + O,
  J = ['short', 'long', 'numeric'],
  R = ['ymd', 'ydm', 'myd', 'mdy', 'dmy', 'dym'],
  v = 'init',
  E = 'datechange',
  S = 'daychange',
  T = 'monthchange',
  x = 'yearchange',
  A = 'kill',
  M = 'option',
  y = { y: 'year', m: 'month', d: 'day' },
  N = /* @__PURE__ */ new Date(),
  g = {
    y: N.getFullYear(),
    m: N.getMonth() + 1,
    d: N.getDate(),
  };
let F = !1;
const o = class o extends G {
  constructor(t, e) {
    if (!t) return { error: !0 };
    if (
      ((t = typeof t == 'string' ? document.querySelector(t) : t),
      t === null || t.length === 0)
    )
      return { error: !0 };
    super();
    /**
     * date change event handler, called if one of the fields is updated
     * @param  {Event} e The event
     * @return {void}
     */
    l(this, '_onSelect', (t) => {
      t.target === this._year.el
        ? this._yearWasChanged(+t.target.value)
        : t.target === this._month.el
          ? this._monthWasChanged(+t.target.value)
          : t.target === this._day.el && this._dayWasChanged(+t.target.value),
        this._dateChanged();
    });
    if (t.dataset.bdpInit) return o.getInstance(t);
    (t.dataset.bdpInit = !0),
      (this.allowedEvents = [v, E, S, T, x, A]),
      d.push(this),
      D.put(t, 'instance', this);
    const s = j(t, O, o.defaults);
    (this.options = e || {}),
      (this.settings = Object.assign({}, o.defaults, s, e)),
      (this.element = t),
      (this.state = 0),
      this.settings.autoInit && this.init();
  }
  _triggerEvent(t, e) {
    (e = f(
      {
        instance: this,
        year: +this.currentYear,
        month: +this.currentMonth,
        day: +this.currentDay,
        date: this.getDate(),
      },
      e
    )),
      this.emit(t, e);
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
        day: t.getDate(),
      };
    if (typeof t != 'string' || !t.trim()) return !1;
    const e = new Date(t.replace(/-/g, '/'));
    return isNaN(e)
      ? !1
      : {
          year: e.getFullYear(),
          month: e.getMonth() + 1,
          day: e.getDate(),
        };
  }
  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodeList Option List
   * @param  {String|Number} value Value to find
   * @return {Number|undefined} The index value or undefined
   */
  _getIdx(t, e) {
    if (!(t instanceof NodeList) || e === void 0 || e === null) return;
    const s = isNaN(e) ? e : +e,
      n = Array.from(t).findIndex((r) => +r.value === s);
    return n !== -1 ? n : void 0;
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
    return (
      (t = L(t, this._yearFrom, this._yearTo)),
      this.currentYear === t
        ? !1
        : (this._updateSelectBox('_year', t), this._yearWasChanged(t, !1), !0)
    );
  }
  /**
   * set the month to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} month the month value (usually between 1 - 12)
   * @returns
   */
  _setMonth(t) {
    return (
      (t = L(t, 1, 12)),
      this.currentMonth === t
        ? !1
        : (this._updateSelectBox('_month', t), this._monthWasChanged(t, !1), !0)
    );
  }
  /**
   * set the day to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} day the day value (usually between 1 - 31)
   * @returns
   */
  _setDay(t) {
    return (
      (t = L(t, 1, this._getDaysPerMonth())),
      this.currentDay === t
        ? !1
        : (this._updateSelectBox('_day', t), this._dayWasChanged(t, !1), !0)
    );
  }
  _getDateInRange({
    year: t = this.currentYear,
    month: e = this.currentMonth,
    day: s = this.currentDay,
  } = {}) {
    const n = this._lowerLimit,
      r = this._upperLimit;
    if (!n || !r)
      throw new Error('Lower and upper date limits must be defined.');
    const h = new Date(t, e - 1, s),
      c = new Date(n.year, n.month - 1, n.day),
      u = new Date(r.year, r.month - 1, r.day);
    return h > u ? r : h < c ? n : { year: t, month: e, day: s };
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
    let s = this._setYear(t.year),
      n = this._setMonth(t.month),
      r = this._setDay(t.day);
    return (s || n || r) && this._dateChanged(e), t;
  }
  // function for update or create
  _getMonthText(t) {
    return this.settings.monthFormat !== 'numeric'
      ? t
      : this.settings.leadingZero
        ? String(t).padStart(2, '0')
        : String(t);
  }
  _checkArrangement(t) {
    return (t = t.toLowerCase()), R.includes(t) ? t : 'ymd';
  }
  _mapSelectBoxes() {
    const t = this.element.querySelectorAll('select');
    if (!t.length) return {};
    const e = {},
      s = this.settings.arrange.split(''),
      n = s.map((h) => y[h]);
    n.forEach((h) => {
      const c = this.settings[`${h}El`] || `[${Y}-${h}]`,
        u = c.nodeName ? c : this.element.querySelector(c);
      u &&
        u.tagName === 'SELECT' &&
        ((e[h] = u), s.splice(s.indexOf(n.indexOf(h).toString()), 1));
    });
    const r = Array.from(t).filter((h) => !Object.values(e).includes(h));
    return (
      s.forEach((h, c) => {
        const u = y[h];
        e[u] = r[c];
      }),
      e
    );
  }
  /**
   * Create the GUI
   * @return {void}
   */
  _create() {
    const t = this.settings;
    t.arrange = this._checkArrangement(t.arrange);
    const e = this._mapSelectBoxes();
    t.arrange.split('').forEach((n) => {
      const r = y[n];
      let h = e[r];
      (!h || h.dataset.init) && ((h = m('select')), this.element.append(h)),
        h.setAttribute('aria-label', `select ${r}`),
        t.className && h.classList.add(t.className, `${t.className}-${r}`),
        (h.dataset.init = !0);
      const c = this._onSelect;
      h.addEventListener('change', c, !1),
        this._registeredEventListeners.push({
          element: h,
          eventName: 'change',
          listener: c,
          option: !1,
        }),
        (this[`_${r}`] = {
          el: h,
          name: r,
          created: !e[r],
          df: document.createDocumentFragment(),
        }),
        this._date.push(this[`_${r}`]);
    });
    const s = m(M);
    t.placeholder &&
      this._date.forEach((n) => {
        const r = o.i18n[t.locale][n.name],
          h = s.cloneNode();
        (h.innerHTML = r), n.df.appendChild(h);
      });
    for (let n = this._yearTo; n >= this._yearFrom; n--) {
      const r = s.cloneNode();
      (r.value = n), (r.innerHTML = n), this._year.df.append(r);
    }
    this.monthFormat[t.monthFormat].forEach((n, r) => {
      const h = s.cloneNode();
      (h.value = r + 1),
        (h.innerHTML = this._getMonthText(n)),
        this._month.df.append(h);
    });
    for (let n = 1; n <= 31; n++) {
      const r = t.leadingZero && n < 10 ? `0${n}` : n,
        h = m(M, { value: n }, '', r);
      this._day.df.append(h);
    }
    this._date.forEach((n) => n.el.append(n.df));
  }
  /**
   * Update the days according to the given month
   * called when month changes or year changes form non-leap-year to a leap-year
   * or vice versa
   * @param {number} [month=this.currentMonth] The number of the month (1-12)
   * @return {void}
   */
  _updateDays(t = this.currentMonth) {
    const e = this._getDaysPerMonth(t) || 31,
      s = this.settings.placeholder ? 1 : 0,
      n = this._day.el.children.length - s;
    if (e === n) return;
    const r = e - n;
    if (r > 0)
      for (let h = n + 1; h <= e; h++) {
        const c = m(M, { value: h }, '', h);
        this._day.el.append(c);
      }
    else {
      for (let h = 0; h < -r; h++)
        this._day.el.children[n + s - h - 1].remove();
      this.currentDay > e &&
        (this.settings.roundDownDay ? this._setDay(e) : this._dayWasChanged());
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
    const n = e === '<';
    this[t].el.childNodes.forEach((r) => {
      ((n && +r.value < s) || (!n && +r.value > s)) &&
        ((r.disabled = !0), this._disabled.push(r));
    });
  }
  // TODO: only on select change
  // TODO: only on select change
  _noFutureDate(t = this._lowerLimit, e = this._upperLimit) {
    const s = () => {
        this.currentYear !== e.year && this._setYear(e.year),
          this._disable('_month', '>', e.month);
        let r = this.currentMonth > e.month;
        r && this._setMonth(e.month),
          e.month === this.currentMonth &&
            (this._disable('_day', '>', e.day),
            (this.currentDay > e.day || (r && this.currentDay < e.day)) &&
              this._setDay(e.day));
      },
      n = () => {
        this.currentYear !== t.year && this._setYear(t.year),
          this._disable('_month', '<', t.month);
        let r = this.currentMonth < t.month;
        r && this._setMonth(t.month),
          t.month === this.currentMonth &&
            (this._disable('_day', '<', t.day),
            (this.currentDay < t.day || (r && this.currentDay > t.day)) &&
              this._setDay(t.day));
      };
    return (
      this._disabled.forEach((r) => {
        r.disabled = !1;
      }),
      (this._disabled = []),
      (this.currentYear < e.year && this.currentYear > t.year) ||
      !this.currentYear ||
      (!this.currentYear && !this.currentMonth && !this.currentDay)
        ? !1
        : (this.currentYear >= e.year ? s() : this.currentYear <= t.year && n(),
          !0)
    );
  }
  /**
   * called if the year was changed
   * sets the currentYear value and triggers the corresponding event
   * @param {number} year the new year value
   * @returns
   */
  _yearWasChanged(t, e = !0) {
    (this.currentYear = t),
      (this._daysPerMonth[1] = w(t) ? 29 : 28),
      e && this._triggerEvent(x),
      this.currentMonth === 2 && this._updateDays();
  }
  /**
   * called if the month was changed
   * sets the currentMonth value and triggers the corresponding event
   * @param {number} month the new month value
   * @returns
   */
  _monthWasChanged(t, e = !0) {
    (this.currentMonth = t), e && this._triggerEvent(T), this._updateDays();
  }
  /**
   * called if the day was changed
   * sets the currentDay value and triggers the corresponding event
   * @param {number} day the new day value
   * @returns
   */
  _dayWasChanged(t, e = !0) {
    (this.currentDay = t), e && this._triggerEvent(S);
  }
  /**
   * called if one value was changed
   *
   * @param {boolean} [triggerEvent = true] - true if the event should be triggered, default: true
   */
  _dateChanged(t = !0) {
    this.settings.selectFuture ||
      this._noFutureDate(this._lowerLimit, this._upperLimit),
      t && this._triggerEvent(E),
      (this.element.value = this.getDateString());
  }
  /**
   * updates the innerHTML off the day option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero
   */
  _updateDayList() {
    const t = this.settings.placeholder ? 1 : 0,
      e = this.settings.leadingZero ? '0' : '';
    for (let s = t; s < 9 + t; s++)
      this._day.el.childNodes[s].innerHTML = e + s;
  }
  /**
   * updates the innerHTML off the month option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero or changes the month format
   */
  _updateMonthList() {
    const t = this.settings.placeholder ? 1 : 0,
      e = this.settings.monthFormat;
    this.monthFormat[e].forEach((s, n) => {
      this._month.el.childNodes[n + t].innerHTML = this._getMonthText(s);
    });
  }
  /**
   * Set the GUI (select boxes) to use a leading zero or not
   *
   * @param {boolean} leadingZero
   */
  useLeadingZero(t) {
    (t = _(t)),
      t !== this.settings.leadingZero &&
        ((this.settings.leadingZero = t),
        this.settings.monthFormat === 'numeric' && this._updateMonthList(),
        this._updateDayList());
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
    return !this.monthFormat[t] || t === this.settings.monthFormat
      ? !1
      : ((this.settings.monthFormat = t), this._updateMonthList(), !0);
  }
  setLanguage(t) {
    if (
      t === this.settings.locale ||
      ('' + t).length < 2 ||
      ('' + t).length > 2
    )
      return !1;
    o.createLocale(t);
    const e = o.i18n[t];
    if (
      (this.settings.placeholder &&
        this._date.forEach((n) => {
          n.el.childNodes[0].innerHTML = e[n.name];
        }),
      (this.monthFormat = e.monthFormat),
      (this.settings.locale = t),
      this.settings.monthFormat === 'numeric')
    )
      return !1;
    let s = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((n, r) => {
      this._month.el.childNodes[s + r].innerHTML = n;
    });
  }
  setDate(t, e = !1) {
    let s = this._parseDate(t);
    return s && (s = this._setDate(s, e)), s;
  }
  resetDate(t = !1) {
    const e =
      t && this.startDate
        ? this.startDate
        : { year: NaN, month: NaN, day: NaN };
    this._setDate(e),
      (this.element.value = this.getDateString()),
      this._triggerEvent(E);
  }
  // TODO: undo everything
  // destroy (cleanup) if it was created
  kill() {
    var t;
    (t = this._registeredEventListeners) == null ||
      t.forEach((e) =>
        e.element.removeEventListener(e.eventName, e.listener, e.option)
      ),
      this._date.forEach((e) => {
        if (e.created) e.el.remove();
        else {
          const s = this.settings.className;
          s &&
            e.el.classList.remove(
              s,
              ...Object.values(y).map((n) => `${s}-${n}`)
            );
        }
      }),
      this._triggerEvent(A);
  }
  isLeapYear(t = this.currentYear) {
    return t === void 0 ? void 0 : w(t);
  }
  getAge() {
    if (
      isNaN(this.currentYear) ||
      isNaN(this.currentMonth) ||
      isNaN(this.currentDay)
    )
      return '';
    const t = this.currentYear,
      e = this.currentMonth,
      s = this.currentDay,
      n = /* @__PURE__ */ new Date(),
      r = n.getMonth() + 1;
    return (
      n.getFullYear() - t - (r < e || (r === e && n.getDate() < s) ? 1 : 0)
    );
  }
  getDateString(t) {
    if (!t) {
      const r = this.getDate();
      return r && r.toLocaleDateString(this.settings.locale);
    }
    if (!this.currentYear || !this.currentMonth || !this.currentDay) return '';
    const e = this.currentYear,
      s = String(this.currentMonth).padStart(2, '0'),
      n = String(this.currentDay).padStart(2, '0');
    return t
      .toLowerCase()
      .replace(/yyyy/g, e)
      .replace(/yy/g, e.toString().slice(2))
      .replace(/mm/g, s)
      .replace(/m/g, this.currentMonth)
      .replace(/dd/g, n)
      .replace(/d/g, this.currentDay);
  }
  getDate() {
    return !this.currentYear || !this.currentMonth || !this.currentDay
      ? ''
      : new Date(
          Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay)
        );
  }
  /**
   *
   * @param {Object} s - the settings object
   * @returns Object containing { year, month, day }
   */
  _getUpperLimit(t) {
    if (t.upperLimit) return t.upperLimit;
    let e;
    return t.maxYear === 'now'
      ? ((e = g.y - +t.minAge), { year: e, month: g.m, day: g.d })
      : ((e = t.maxYear), { year: e, month: 12, day: 31 });
  }
  /**
   *
   * @param {Object} s - the settings object
   * @returns Object containing { year, month, day }
   */
  _getLowerLimit(t) {
    if (t.lowerLimit) return t.lowerLimit;
    let e;
    return t.minYear !== null
      ? ((e = +t.minYear), { year: e, month: 1, day: 1 })
      : ((e = (t.maxYear === 'now' ? g.y : t.maxYear) - +t.maxAge),
        { year: e, month: g.m, day: g.d });
  }
  /**
   * The init method
   * TODO: test all(!) option values for correctness
   *
   * @return {*}
   * @memberof BirthdayPicker
   */
  init() {
    if (this.initialized) return !0;
    (this.initialized = !0),
      (this._registeredEventListeners = []),
      (this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]),
      (this._date = []),
      (this._disabled = []);
    const t = this.settings;
    (t.placeholder = _(t.placeholder)),
      (t.leadingZero = _(t.leadingZero)),
      (t.selectFuture = _(t.selectFuture)),
      (this._lowerLimit = this._getLowerLimit(t)),
      (this._upperLimit = this._getUpperLimit(t)),
      (this._yearFrom = this._lowerLimit.year),
      (this._yearTo = this._upperLimit.year);
    const [e] = o.createLocale(t.locale);
    if (
      ((t.locale = e),
      (this.monthFormat = o.i18n[t.locale].monthFormat),
      this.allowedEvents.forEach((s) => {
        t[s] && this.addEventListener(s, t[s]);
      }),
      this._create(),
      t.defaultDate)
    ) {
      const s = this.setDate(
        t.defaultDate === 'now'
          ? /* @__PURE__ */ new Date().toString()
          : t.defaultDate,
        !0
      );
      this.startDate = s;
    }
    (this.state = 1), this._triggerEvent(v);
  }
};
l(o, 'currentLocale', 'en'),
  l(o, 'i18n', {}),
  l(o, 'createLocale', (t = 'en') => {
    if ((t.length !== 2 && (t = 'en'), o.i18n[t])) return [t, o.i18n[t]];
    const e = /* @__PURE__ */ new Date('2000-01-15'),
      s = { monthFormat: {} };
    J.forEach((h) => {
      s.monthFormat[h] = [];
      for (let c = 0; c < 12; c++)
        e.setMonth(c),
          s.monthFormat[h].push(e.toLocaleDateString(t, { month: h }));
    });
    const n = 'BirthdayPickerLocale',
      r = f(f({}, C[t] || C.en), window[n] && window[n][t]);
    return (o.i18n[t] = f(f({}, s), r)), [t, o.i18n[t]];
  }),
  l(o, 'getInstance', (t) => D.get(t, 'instance')) /**
   * Set the month format for all registered instances
   * @param  {String} format The available formats are: 'short', 'long', 'numeric'
   */,
  l(o, 'setMonthFormat', (t) => {
    d.forEach((e) => {
      e.setMonthFormat(t);
    });
  }) /**
   * Set the language of all registered instances
   * @param  {String} lang The language string, eg.: 'en', 'de'
   */,
  l(o, 'setLanguage', (t) => {
    (o.currentLocale = t),
      d.forEach((e) => {
        e.setLanguage(t);
      });
  }) /**
   * Kill all events on all registered instances
   * @returns {Boolean} false if no instance was found, or true if events where removed
   */,
  l(o, 'killAll', () =>
    d.length
      ? (d.forEach((t) => {
          o.kill(t);
        }),
        (d = []),
        !0)
      : !1
  ) /**
   *
   * @param {*} instance either an registered html object or an instance of the BirthdayPicker class
   * @returns {Boolean} false or true
   */,
  l(o, 'kill', (t) => {
    if (!t || (t.element || (t = o.getInstance(t)), !t)) return !1;
    t.kill();
    const e = t.element;
    return (
      (e.dataset.bdpInit = !1),
      delete e.dataset.bdpInit,
      D.remove(e, 'instance'),
      (F = !1),
      !0
    );
  }),
  l(o, 'defaults', Z),
  l(o, 'init', () => {
    if (F) return !1;
    (F = !0), o.createLocale(o.currentLocale);
    let t = document.querySelectorAll('[' + Y + ']');
    return t.length === 0
      ? !1
      : (t.forEach((e) => {
          new o(e);
        }),
        d);
  });
let I = o;
export { I as default };
