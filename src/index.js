import { defaults } from './defaults';
import { locale } from './locale';
import {
  createEl,
  restrict,
  getJSONData,
  isLeapYear,
  dataStorage,
  isTrue,
} from './utils';
import { Emitter } from './emitter';

let instances = [];
const pluginName = 'birthdaypicker';
const dataName = 'data-' + pluginName;
const monthFormats = ['short', 'long', 'numeric'];
const allowedArrangement = ['ymd', 'ydm', 'myd', 'mdy', 'dmy', 'dym'];

const INIT = 'init';
const DATECHANGE = 'datechange';
const DAYCHANGE = 'daychange';
const MONTHCHANGE = 'monthchange';
const YEARCHANGE = 'yearchange';
const KILL = 'kill';

const optionTagName = 'option';
const lookup = { y: 'year', m: 'month', d: 'day' };

const currentDate = new Date();
const now = {
  y: currentDate.getFullYear(),
  m: currentDate.getMonth() + 1,
  d: currentDate.getDate(),
};

let initialized = false;

/**
 * The Main Class
 *
 * @class BirthdayPicker
 */
class BirthdayPicker extends Emitter {
  constructor(element, options) {
    if (!element) {
      return { error: true };
    }

    element =
      'string' === typeof element ? document.querySelector(element) : element;

    if (null === element || 0 === element.length) {
      return { error: true };
    }

    super();

    if (element.dataset.bdpInit) {
      return BirthdayPicker.getInstance(element);
    }
    element.dataset.bdpInit = true;

    this.allowedEvents = [
      INIT,
      DATECHANGE,
      DAYCHANGE,
      MONTHCHANGE,
      YEARCHANGE,
      KILL,
    ];

    instances.push(this);
    dataStorage.put(element, 'instance', this);

    // from data api
    const data = getJSONData(element, pluginName, BirthdayPicker.defaults);

    this.options = options || {}; // user options
    this.settings = Object.assign({}, BirthdayPicker.defaults, data, options);
    this.element = element;

    this.state = 0; // ready state

    if (this.settings.autoInit) {
      this.init();
    }
  }

  _triggerEvent(eventName, detail) {
    // default detail data
    detail = {
      instance: this,
      year: +this.currentYear,
      month: +this.currentMonth,
      day: +this.currentDay,
      date: this.getDate(),
      ...detail,
    };
    this.emit(eventName, detail);
  }

  /**
   * Parses a given date string or Date object
   *
   * @param {*} date A data string or a Date object (new Date())
   * @returns object with { year, month, day } or false if it is not a correct date
   */
  _parseDate(date) {
    // If the date is already a Date object and valid, return its parts
    if (date instanceof Date && !isNaN(date)) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }

    // Check if date is a valid string
    if (typeof date !== 'string' || !date.trim()) {
      return false; // Invalid input
    }

    // Replace "-" with "/" for better parsing compatibility
    const parsedDate = new Date(date.replace(/-/g, '/'));

    // Check if the parsed date is valid
    if (isNaN(parsedDate)) {
      return false; // Invalid date
    }

    return {
      year: parsedDate.getFullYear(),
      month: parsedDate.getMonth() + 1,
      day: parsedDate.getDate(),
    };
  }

  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodeList Option List
   * @param  {String|Number} value Value to find
   * @return {Number|undefined} The index value or undefined
   */
  _getIdx(nodeList, value) {
    // Validate inputs
    if (
      !(nodeList instanceof NodeList) ||
      value === undefined ||
      value === null
    ) {
      return undefined;
    }

    // Convert value to number for comparison, if applicable
    const numericValue = isNaN(value) ? value : +value;

    // Use findIndex for cleaner iteration
    const index = Array.from(nodeList).findIndex(
      (el) => +el.value === numericValue
    );

    return index !== -1 ? index : undefined;
  }

  /**
   * Updates one selectBox
   * @param {String} box name of the box ('_year', '_month', '_day')
   * @param {number} value the new value to which the box should be set
   */
  _updateSelectBox(box, value) {
    const selectBox = this[box].el;
    selectBox.selectedIndex = this._getIdx(selectBox.childNodes, value);
  }

  /**
   * set the year to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} year the day value (eg, 1988, 2012, ...)
   * @returns
   */
  _setYear(year) {
    year = restrict(year, this._yearFrom, this._yearTo);
    if (this.currentYear === year) {
      return false;
    }
    this._updateSelectBox('_year', year);
    this._yearWasChanged(year, false);
    return true;
  }

  /**
   * set the month to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} month the month value (usually between 1 - 12)
   * @returns
   */
  _setMonth(month) {
    month = restrict(month, 1, 12);
    if (this.currentMonth === month) {
      return false;
    }
    this._updateSelectBox('_month', month);
    this._monthWasChanged(month, false);
    return true;
  }

  /**
   * set the day to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} day the day value (usually between 1 - 31)
   * @returns
   */
  _setDay(day) {
    day = restrict(day, 1, this._getDaysPerMonth());
    if (this.currentDay === day) {
      return false;
    }
    this._updateSelectBox('_day', day);
    this._dayWasChanged(day, false);
    return true;
  }

  _getDateInRange({
    year = this.currentYear,
    month = this.currentMonth,
    day = this.currentDay,
  } = {}) {
    const lower = this._lowerLimit;
    const upper = this._upperLimit;

    // Ensure limits exist
    if (!lower || !upper) {
      throw new Error('Lower and upper date limits must be defined.');
    }

    // Convert to Date objects for easy comparison
    const inputDate = new Date(year, month - 1, day);
    const lowerDate = new Date(lower.year, lower.month - 1, lower.day);
    const upperDate = new Date(upper.year, upper.month - 1, upper.day);

    if (inputDate > upperDate) return upper;
    if (inputDate < lowerDate) return lower;

    return { year, month, day };
  }

  /**
   * Set the date
   * @param {Object} obj with year, month, day as String or Integer
   * @param {Number} obj.year the year value
   * @param {Number} obj.month the month value
   * @param {Number} obj.day the day value
   */
  _setDate(obj, triggerEvent = false) {
    obj = this._getDateInRange(obj);
    let _yChanged = this._setYear(obj.year);
    let _mChanged = this._setMonth(obj.month);
    let _dChanged = this._setDay(obj.day);

    if (_yChanged || _mChanged || _dChanged) {
      this._dateChanged(triggerEvent);
    }
    return obj;
  }

  // function for update or create
  _getMonthText(text) {
    if ('numeric' !== this.settings.monthFormat) {
      return text;
    }

    // Ensure text is a string and add leading zero if required
    return this.settings.leadingZero
      ? String(text).padStart(2, '0')
      : String(text);
  }

  _checkArrangement(string) {
    // bigEndian:    ymd
    // littleEndian: dmy
    // else:         mdy
    string = string.toLowerCase();
    return allowedArrangement.includes(string) ? string : 'ymd';
  }

  _mapSelectBoxes() {
    const selectBoxes = this.element.querySelectorAll('select');
    if (!selectBoxes.length) return {};

    const selectBoxMapping = {};
    const notFound = this.settings.arrange.split('');
    const lookupKeys = notFound.map((i) => lookup[i]);

    lookupKeys.forEach((name) => {
      const query = this.settings[`${name}El`] || `[${dataName}-${name}]`;
      const el = query.nodeName ? query : this.element.querySelector(query);
      if (el && el.tagName === 'SELECT') {
        selectBoxMapping[name] = el;
        notFound.splice(
          notFound.indexOf(lookupKeys.indexOf(name).toString()),
          1
        );
      }
    });

    const remainingSelectBoxes = Array.from(selectBoxes).filter(
      (selectBox) => !Object.values(selectBoxMapping).includes(selectBox)
    );

    notFound.forEach((i, index) => {
      const name = lookup[i];
      selectBoxMapping[name] = remainingSelectBoxes[index];
    });

    return selectBoxMapping;
  }

  /**
   * Create the GUI
   * @return {void}
   */
  _create() {
    const s = this.settings;
    s.arrange = this._checkArrangement(s.arrange);
    const selectBoxMapping = this._mapSelectBoxes();

    s.arrange.split('').forEach((i) => {
      const name = lookup[i];
      let el = selectBoxMapping[name];

      if (!el || el.dataset.init) {
        el = createEl('select');
        this.element.append(el);
      }

      // set aria values and class names
      el.setAttribute('aria-label', `select ${name}`);
      if (s.className) {
        el.classList.add(s.className, `${s.className}-${name}`);
      }

      el.dataset.init = true;

      // add event listener
      const listener = this._onSelect;
      el.addEventListener('change', listener, false);
      this._registeredEventListeners.push({
        element: el,
        eventName: 'change',
        listener,
        option: false,
      });

      // store select box data
      this[`_${name}`] = {
        el,
        name,
        created: !selectBoxMapping[name],
        df: document.createDocumentFragment(),
      };
      this._date.push(this[`_${name}`]);
    });

    const optionEl = createEl(optionTagName);

    // add placeholder options
    if (s.placeholder) {
      this._date.forEach((item) => {
        const name = BirthdayPicker.i18n[s.locale][item.name];
        const option = optionEl.cloneNode();
        option.innerHTML = name;
        item.df.appendChild(option);
      });
    }

    // add year options
    for (let i = this._yearTo; i >= this._yearFrom; i--) {
      const option = optionEl.cloneNode();
      option.value = i;
      option.innerHTML = i;
      this._year.df.append(option);
    }

    // add month options
    this.monthFormat[s.monthFormat].forEach((text, ind) => {
      const option = optionEl.cloneNode();
      option.value = ind + 1;
      option.innerHTML = this._getMonthText(text);
      this._month.df.append(option);
    });

    // add day options
    for (let i = 1; i <= 31; i++) {
      const number = s.leadingZero && i < 10 ? `0${i}` : i;
      const option = createEl(optionTagName, { value: i }, '', number);
      this._day.df.append(option);
    }

    // append fragments to elements
    this._date.forEach((item) => item.el.append(item.df));
  }

  /**
   * Update the days according to the given month
   * called when month changes or year changes form non-leap-year to a leap-year
   * or vice versa
   * @param {number} [month=this.currentMonth] The number of the month (1-12)
   * @return {void}
   */
  _updateDays(month = this.currentMonth) {
    const newDaysPerMonth = this._getDaysPerMonth(month) || 31;
    const offset = this.settings.placeholder ? 1 : 0;
    const currentDaysPerMonth = this._day.el.children.length - offset;

    if (newDaysPerMonth === currentDaysPerMonth) return;

    const diff = newDaysPerMonth - currentDaysPerMonth;

    if (diff > 0) {
      // add days
      for (let i = currentDaysPerMonth + 1; i <= newDaysPerMonth; i++) {
        const el = createEl(optionTagName, { value: i }, '', i);
        this._day.el.append(el);
      }
    } else {
      // remove days
      for (let i = 0; i < -diff; i++) {
        this._day.el.children[currentDaysPerMonth + offset - i - 1].remove();
      }

      if (this.currentDay > newDaysPerMonth) {
        this.settings.roundDownDay
          ? this._setDay(newDaysPerMonth)
          : this._dayWasChanged();
      }
    }
  }

  /**
   * Disable the options in the select box
   *
   * @param {String} selectBox - Name of the select box (_year, _month, _day)
   * @param {String} condition - '>' or '<'
   * @param {Number} limit - the limit
   */
  _disable(selectBox, condition, limit) {
    const isLessThan = condition === '<';
    this[selectBox].el.childNodes.forEach((option) => {
      if (
        (isLessThan && +option.value < limit) ||
        (!isLessThan && +option.value > limit)
      ) {
        option.disabled = true;
        this._disabled.push(option);
      }
    });
  }

  // TODO: only on select change
  // TODO: only on select change
  _noFutureDate(lower = this._lowerLimit, upper = this._upperLimit) {
    const setBack = () => {
      if (this.currentYear !== upper.year) {
        this._setYear(upper.year);
      }
      this._disable('_month', '>', upper.month);

      let monthChanged = this.currentMonth > upper.month;
      if (monthChanged) {
        this._setMonth(upper.month);
      }

      if (upper.month === this.currentMonth) {
        this._disable('_day', '>', upper.day);

        if (
          this.currentDay > upper.day ||
          (monthChanged && this.currentDay < upper.day)
        ) {
          this._setDay(upper.day);
        }
      }
    };

    const setFwd = () => {
      if (this.currentYear !== lower.year) {
        this._setYear(lower.year);
      }
      this._disable('_month', '<', lower.month);

      let monthChanged = this.currentMonth < lower.month;
      if (monthChanged) {
        this._setMonth(lower.month);
      }

      if (lower.month === this.currentMonth) {
        this._disable('_day', '<', lower.day);

        if (
          this.currentDay < lower.day ||
          (monthChanged && this.currentDay > lower.day)
        ) {
          this._setDay(lower.day);
        }
      }
    };

    // set all previously disabled option elements to false (reenable them)
    this._disabled.forEach((el) => {
      el.disabled = false;
    });
    this._disabled = [];

    // early exit
    if (
      (this.currentYear < upper.year && this.currentYear > lower.year) ||
      !this.currentYear ||
      (!this.currentYear && !this.currentMonth && !this.currentDay)
    ) {
      return false;
    }

    if (this.currentYear >= upper.year) {
      setBack();
    } else if (this.currentYear <= lower.year) {
      setFwd();
    }

    return true;
  }

  /**
   * date change event handler, called if one of the fields is updated
   * @param  {Event} e The event
   * @return {void}
   */
  _onSelect = (evt) => {
    if (evt.target === this._year.el) {
      this._yearWasChanged(+evt.target.value);
    } else if (evt.target === this._month.el) {
      this._monthWasChanged(+evt.target.value);
    } else if (evt.target === this._day.el) {
      this._dayWasChanged(+evt.target.value);
    }
    this._dateChanged();
  };

  /**
   * called if the year was changed
   * sets the currentYear value and triggers the corresponding event
   * @param {number} year the new year value
   * @returns
   */
  _yearWasChanged(year, triggerEvent = true) {
    // console.log('_yearWasChanged:', year);
    // const from = this.currentYear;
    this.currentYear = year;
    this._daysPerMonth[1] = isLeapYear(year) ? 29 : 28;
    if (triggerEvent) this._triggerEvent(YEARCHANGE);
    if (this.currentMonth === 2) {
      this._updateDays();
    }
  }

  /**
   * called if the month was changed
   * sets the currentMonth value and triggers the corresponding event
   * @param {number} month the new month value
   * @returns
   */
  _monthWasChanged(month, triggerEvent = true) {
    // console.log('_monthWasChanged:', month);
    // const from = this.currentMonth;
    this.currentMonth = month;
    if (triggerEvent) this._triggerEvent(MONTHCHANGE);
    this._updateDays();
  }

  /**
   * called if the day was changed
   * sets the currentDay value and triggers the corresponding event
   * @param {number} day the new day value
   * @returns
   */
  _dayWasChanged(day, triggerEvent = true) {
    // console.log('_dayWasChanged:', day);
    // const from = this.currentDay;
    this.currentDay = day;
    if (triggerEvent) this._triggerEvent(DAYCHANGE);
  }

  /**
   * called if one value was changed
   *
   * @param {boolean} [triggerEvent = true] - true if the event should be triggered, default: true
   */
  _dateChanged(triggerEvent = true) {
    if (!this.settings.selectFuture) {
      this._noFutureDate(this._lowerLimit, this._upperLimit);
    }
    if (triggerEvent) this._triggerEvent(DATECHANGE);
    // set value to element
    this.element.value = this.getDateString();
  }

  /**
   * updates the innerHTML off the day option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero
   */
  _updateDayList() {
    const offset = this.settings.placeholder ? 1 : 0;
    const leadingZero = this.settings.leadingZero ? '0' : '';
    for (let i = offset; i < 9 + offset; i++) {
      this._day.el.childNodes[i].innerHTML = leadingZero + i;
    }
  }

  /**
   * updates the innerHTML off the month option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero or changes the month format
   */
  _updateMonthList() {
    const offset = this.settings.placeholder ? 1 : 0;
    const format = this.settings.monthFormat;
    this.monthFormat[format].forEach((text, i) => {
      this._month.el.childNodes[i + offset].innerHTML =
        this._getMonthText(text);
    });
  }

  /**
   * Set the GUI (select boxes) to use a leading zero or not
   *
   * @param {boolean} leadingZero
   */
  useLeadingZero(leadingZero) {
    leadingZero = isTrue(leadingZero);
    if (leadingZero === this.settings.leadingZero) return;
    this.settings.leadingZero = leadingZero;
    if ('numeric' === this.settings.monthFormat) {
      this._updateMonthList();
    }
    this._updateDayList();
  }

  /**
   * Returns the number of days available for the given month
   *
   * @param {Number} month the month usually between 1-12 ;)
   * @returns number of days
   */
  _getDaysPerMonth(month = this.currentMonth) {
    return this._daysPerMonth[+month - 1];
  }

  /**
   * Change the current active month format
   *
   * @param {String} format the format string, available: 'short', 'long', 'numeric';
   * @returns {boolean} true if changed, false if not
   */
  setMonthFormat(format) {
    if (!this.monthFormat[format] || format === this.settings.monthFormat) {
      return false;
    }
    this.settings.monthFormat = format;
    this._updateMonthList();
    return true;
  }

  setLanguage(lang) {
    if (
      lang === this.settings.locale ||
      ('' + lang).length < 2 ||
      ('' + lang).length > 2
    ) {
      // console.log('nothing to change');
      return false;
    }

    BirthdayPicker.createLocale(lang);
    const langTexts = BirthdayPicker.i18n[lang];

    // set the placeholder texts
    if (this.settings.placeholder) {
      this._date.forEach((item) => {
        item.el.childNodes[0].innerHTML = langTexts[item.name];
      });
    }

    this.monthFormat = langTexts.monthFormat;
    // const from = this.settings.locale;
    this.settings.locale = lang;

    if ('numeric' === this.settings.monthFormat) {
      return false;
    }

    let filter = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((el, ind) => {
      this._month.el.childNodes[filter + ind].innerHTML = el;
    });
  }

  setDate(dateString, triggerEvent = false) {
    let parsed = this._parseDate(dateString);
    if (parsed) {
      // parsed = this._getDateValuesInRange(parsed);
      parsed = this._setDate(parsed, triggerEvent);
    }
    return parsed;
  }

  resetDate(preserveStartDate = false) {
    const date =
      preserveStartDate && this.startDate
        ? this.startDate
        : { year: NaN, month: NaN, day: NaN };
    this._setDate(date);
    this.element.value = this.getDateString();
    this._triggerEvent(DATECHANGE);
  }

  // TODO: undo everything
  // destroy (cleanup) if it was created
  kill() {
    // remove all registered EventListeners
    this._registeredEventListeners?.forEach((r) =>
      r.element.removeEventListener(r.eventName, r.listener, r.option)
    );

    this._date.forEach((item) => {
      if (item.created) {
        item.el.remove();
      } else {
        const cn = this.settings.className;
        if (cn) {
          item.el.classList.remove(
            cn,
            ...Object.values(lookup).map((name) => `${cn}-${name}`)
          );
        }
      }
    });

    this._triggerEvent(KILL);
  }

  isLeapYear(year = this.currentYear) {
    return undefined === year ? undefined : isLeapYear(year);
  }

  getAge() {
    if (
      isNaN(this.currentYear) ||
      isNaN(this.currentMonth) ||
      isNaN(this.currentDay)
    ) {
      return '';
    }

    const y = this.currentYear;
    const m = this.currentMonth;
    const d = this.currentDay;
    const today = new Date();
    const curMonth = today.getMonth() + 1;
    return (
      today.getFullYear() -
      y -
      (curMonth < m || (curMonth === m && today.getDate() < d) ? 1 : 0)
    );
  }

  getDateString(format) {
    if (!format) {
      const string = this.getDate();
      return string ? string.toLocaleDateString(this.settings.locale) : string;
    }

    if (!this.currentYear || !this.currentMonth || !this.currentDay) return '';

    const year = this.currentYear;
    const month = String(this.currentMonth).padStart(2, '0');
    const day = String(this.currentDay).padStart(2, '0');

    return format
      .toLowerCase()
      .replace(/yyyy/g, year)
      .replace(/yy/g, year.toString().slice(2))
      .replace(/mm/g, month)
      .replace(/m/g, this.currentMonth)
      .replace(/dd/g, day)
      .replace(/d/g, this.currentDay);
  }

  getDate() {
    if (!this.currentYear || !this.currentMonth || !this.currentDay) {
      return '';
    }
    return new Date(
      Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay)
    );
  }

  /**
   *
   * @param {Object} s - the settings object
   * @returns Object containing { year, month, day }
   */
  _getUpperLimit() {
    const s = this.settings;
    if (s.upperLimit) {
      return s.upperLimit;
    }

    let yearTo;
    if ('now' === s.maxYear) {
      yearTo = now.y - +s.minAge;
      return { year: yearTo, month: now.m, day: now.d };
    }

    yearTo = s.maxYear;
    return { year: yearTo, month: 12, day: 31 };
  }

  /**
   *
   * @param {Object} s - the settings object
   * @returns Object containing { year, month, day }
   */
  _getLowerLimit() {
    const s = this.settings;
    if (s.lowerLimit) {
      return s.lowerLimit;
    }

    let yearFrom;
    if (null !== s.minYear) {
      yearFrom = +s.minYear;
      return { year: yearFrom, month: 1, day: 1 };
    }

    let yearTo = 'now' === s.maxYear ? now.y : s.maxYear;
    yearFrom = yearTo - +s.maxAge;
    return { year: yearFrom, month: now.m, day: now.d };
  }

  /**
   * The init method
   * TODO: test all(!) option values for correctness
   *
   * @return {*}
   * @memberof BirthdayPicker
   */
  init() {
    if (this.initialized) {
      return true;
    }

    this.initialized = true;

    this._registeredEventListeners = []; // for killing
    this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this._date = [];
    this._disabled = [];

    const s = this.settings;
    // check settings
    s.placeholder = isTrue(s.placeholder);
    s.leadingZero = isTrue(s.leadingZero);
    s.selectFuture = isTrue(s.selectFuture);

    this._lowerLimit = this._getLowerLimit();
    this._upperLimit = this._getUpperLimit();
    this._yearFrom = this._lowerLimit.year;
    this._yearTo = this._upperLimit.year;

    const [currentLocale] = BirthdayPicker.createLocale(s.locale);
    s.locale = currentLocale;
    this.monthFormat = BirthdayPicker.i18n[s.locale].monthFormat;

    // look for defined callbacks in settings
    this.allowedEvents.forEach((eventName) => {
      if (s[eventName]) {
        this.addEventListener(eventName, s[eventName]);
      }
    });

    this._create();

    // set default start value
    if (s.defaultDate) {
      const parsed = this.setDate(
        s.defaultDate === 'now' ? new Date().toString() : s.defaultDate,
        true
      );

      // store value for resetting
      this.startDate = parsed;
    }

    this.state = 1; // initialized
    this._triggerEvent(INIT);
  }

  static currentLocale = 'en';
  static i18n = {};
  static createLocale = (lang = 'en') => {
    if (lang.length !== 2) {
      lang = 'en';
    }
    if (BirthdayPicker.i18n[lang]) {
      return [lang, BirthdayPicker.i18n[lang]];
    }
    const dd = new Date('2000-01-15');
    const obj = { monthFormat: {} };

    monthFormats.forEach((format) => {
      obj.monthFormat[format] = [];
      for (let i = 0; i < 12; i++) {
        dd.setMonth(i);
        obj.monthFormat[format].push(
          dd.toLocaleDateString(lang, { month: format })
        );
      }
    });

    const i18n = 'BirthdayPickerLocale';
    const tmp = {
      ...(locale[lang] || locale.en),
      ...(window[i18n] && window[i18n][lang]),
    };
    BirthdayPicker.i18n[lang] = { ...obj, ...tmp };
    return [lang, BirthdayPicker.i18n[lang]];
  };

  static getInstance = (el) => dataStorage.get(el, 'instance');

  /**
   * Set the month format for all registered instances
   * @param  {String} format The available formats are: 'short', 'long', 'numeric'
   */
  static setMonthFormat = (format) => {
    instances.forEach((bp) => {
      bp.setMonthFormat(format);
    });
  };

  /**
   * Set the language of all registered instances
   * @param  {String} lang The language string, eg.: 'en', 'de'
   */
  static setLanguage = (lang) => {
    BirthdayPicker.currentLocale = lang;
    instances.forEach((bp) => {
      bp.setLanguage(lang);
    });
  };

  /**
   * Kill all events on all registered instances
   * @returns {Boolean} false if no instance was found, or true if events where removed
   */
  static killAll = () => {
    if (!instances.length) {
      return false;
    }

    instances.forEach((instance) => {
      BirthdayPicker.kill(instance);
    });

    instances = [];
    return true;
  };

  /**
   *
   * @param {*} instance either an registered html object or an instance of the BirthdayPicker class
   * @returns {Boolean} false or true
   */
  static kill = (instance) => {
    if (!instance) {
      return false;
    }

    if (!instance.element) {
      // if an html element
      instance = BirthdayPicker.getInstance(instance);
    }

    if (!instance) {
      return false;
    }

    // TODO: reset all to default!
    instance.kill();

    const el = instance.element;
    el.dataset.bdpInit = false;
    delete el.dataset.bdpInit;

    dataStorage.remove(el, 'instance');
    initialized = false;
    return true;
  };

  static defaults = defaults;

  static init = () => {
    if (initialized) {
      return false;
    }
    initialized = true;
    BirthdayPicker.createLocale(BirthdayPicker.currentLocale);
    let element = document.querySelectorAll('[' + dataName + ']');
    if (0 === element.length) {
      return !1;
    }

    element.forEach((el) => {
      new BirthdayPicker(el);
    });

    return instances;
  };
}

export default BirthdayPicker;
