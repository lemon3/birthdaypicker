import { defaults } from '@/defaults';
import { locale } from '@/locale';
import {
  // docReady,
  createEl,
  restrict,
  getJSONData,
  isLeapYear,
  dataStorage,
  trigger,
} from '@/helper';

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

const allowedEvents = [
  INIT,
  DATECHANGE,
  DAYCHANGE,
  MONTHCHANGE,
  YEARCHANGE,
  KILL,
];

const optionTagName = 'option';
const lookup = { y: 'year', m: 'month', d: 'day' };

const currentDate = new Date();
const now = {
  y: currentDate.getFullYear(),
  m: currentDate.getMonth() + 1,
  d: currentDate.getDate(),
  t: currentDate.getTime(),
};

let initialized = false;

const isTrue = (value) =>
  value === true || value === 'true' || value === 1 || value === '1';

// const getDaysPerMonth = (month, year) => {
//   month = month < 1 ? 1 : month > 12 ? 12 : month;
//   const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//   if (isLeapYear(year)) daysPerMonth[1] = 29;
//   return daysPerMonth[+month - 1];
// };

/**
 * The Main Class
 *
 * @class BirthdayPicker
 */
class BirthdayPicker {
  constructor(element, options) {
    if (!element) {
      return { error: true };
    }

    element =
      'string' === typeof element ? document.querySelector(element) : element;

    if (null === element || 0 === element.length) {
      return { error: true };
    }

    // TODO: use dataStorage.has(element) ?
    if (element.dataset.bdpInit) {
      return BirthdayPicker.getInstance(element);
    }
    element.dataset.bdpInit = true;

    instances.push(this);
    dataStorage.put(element, 'instance', this);

    // from data api
    const data = getJSONData(element, pluginName, BirthdayPicker.defaults);

    this.options = options || {}; // user options
    this.settings = Object.assign({}, BirthdayPicker.defaults, data, options);
    this.element = element;

    if (this.settings.autoInit) {
      this.init();
    }
  }

  /**
   * Parses a given date string or Date object
   *
   * @param {*} date A data string or a Date object (new Date())
   * @returns object with { year, month, day } or false if it is not a correct date
   */
  _parseDate(date) {
    if ('object' !== typeof date) {
      // safari fix '2004-2-29' -> '2004/2/29'
      date = date.replaceAll('-', '/');
    }
    // unix timestamp
    const parse = Date.parse(date);
    if (isNaN(parse)) {
      return false; // wrong date
    }
    date = new Date(parse);
    // add a local timezone offset ??
    // date.setSeconds(date.getSeconds() + date.getTimezoneOffset() * 60);
    // const year = date.getUTCFullYear();
    // const month = date.getUTCMonth() + 1;
    // const day = date.getUTCDate();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return { year, month, day };
  }

  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodes Option List
   * @param  {String} value Value to find
   * @return {*}       The index value or undefined
   */
  _getIdx(nodeList, value) {
    if (!nodeList || isNaN(value || 'undefined' === typeof value)) {
      return undefined;
    }
    for (let index = 0, el; index < nodeList.length; index++) {
      el = nodeList[index];
      if (+el.value === +value) {
        return index;
      }
    }
    return undefined;
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
  }) {
    const lower = this._lowerLimit;
    const upper = this._upperLimit;

    if (
      year > upper.year ||
      (year >= upper.year && month > upper.month) ||
      (year >= upper.year && month >= upper.month && day > upper.day)
    ) {
      return upper;
    } else if (
      year < lower.year ||
      (year <= lower.year && month < lower.month) ||
      (year <= lower.year && month <= lower.month && day < lower.day)
    ) {
      return lower;
    }

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
    return this.settings.leadingZero
      ? +text < 10
        ? '0' + text
        : '' + text
      : '' + text; // return string
  }

  _checkArrangement(string) {
    // bigEndian:    ymd
    // littleEndian: dmy
    // else:         mdy
    string = string.toLowerCase();
    if (allowedArrangement.indexOf(string) < 0) {
      return 'ymd';
    }
    return string;
  }

  _mapSelectBoxes() {
    let selectBoxes = this.element.querySelectorAll('select');
    const selectBoxMapping = {};
    if (0 === selectBoxes.length) {
      return selectBoxMapping;
    }

    let notFound = this.settings.arrange.split('');
    notFound.forEach((i) => {
      const name = lookup[i];
      let query =
        this.settings[name + 'El'] || '[' + dataName + '-' + name + ']';
      if (query) {
        let el;
        if ('undefined' !== typeof query.nodeName) {
          el = query;
        } else {
          el = this.element.querySelector(query);
        }
        if (el) {
          selectBoxMapping[name] = el;
          notFound = notFound.filter((n) => n !== i);
          selectBoxes = Object.values(selectBoxes).filter(
            (item) => item !== el
          );
          return;
        }
      }
      selectBoxes = Object.values(selectBoxes).filter((item) => {
        const cond = item.attributes[dataName + '-' + name];
        if (cond) {
          selectBoxMapping[name] = item;
          notFound = notFound.filter((n) => n !== i);
        }
        return !cond;
      });
    });

    // set the remaining not found
    notFound.forEach((i, index) => {
      const name = lookup[i];
      selectBoxMapping[name] = selectBoxes[index];
    });

    return selectBoxMapping;
  }

  /**
   * Create the gui
   * @return {void}
   */
  _create() {
    const s = this.settings;
    s.arrange = this._checkArrangement(s.arrange);
    const selectBoxMapping = this._mapSelectBoxes();

    s.arrange.split('').forEach((i) => {
      const name = lookup[i];
      let created = false;
      let el = selectBoxMapping[name];

      if (!el || el.dataset.init) {
        el = createEl('select');
        created = true;
        this.element.append(el);
      }

      // set aria values
      el.setAttribute('aria-label', `select ${name}`);
      if (s.className) {
        el.classList.add(s.className);
        el.classList.add(`${s.className}-${name}`);
      }

      el.dataset.init = true;

      const eventName = 'change';
      const listener = this._onSelect;
      const option = false;
      el.addEventListener(eventName, listener, option);
      this._registeredEventListeners.push({
        element: el,
        eventName,
        listener,
        option,
      });

      this['_' + name] = {
        el,
        name,
        created,
        df: document.createDocumentFragment(),
      };
      this._date.push(this['_' + name]);
    });

    const optionEl = createEl(optionTagName);

    // placeholder
    if (s.placeholder) {
      this._date.forEach((item) => {
        const name = BirthdayPicker.i18n[s.locale][item.name];
        const option = optionEl.cloneNode();
        option.innerHTML = name;
        item.df.appendChild(option);
      });
    }

    // add option data to year field
    for (let i = this._yearTo; i >= this._yearFrom; i--) {
      const option = optionEl.cloneNode();
      option.value = i;
      option.innerHTML = i;
      this._year.df.append(option);
    }

    // add to month
    this.monthFormat[s.monthFormat].forEach((text, ind) => {
      const option = optionEl.cloneNode();
      option.value = ind + 1;
      option.innerHTML = this._getMonthText(text);
      this._month.df.append(option);
    });

    // add day
    let number;
    for (let i = 1; i <= 31; i++) {
      number = s.leadingZero ? (i < 10 ? '0' + i : i) : i;
      const el = createEl(optionTagName, { value: i }, '', number);
      this._day.df.append(el);
    }

    // append fragments to elements
    this._date.forEach((item) => item.el.append(item.df));
  }

  /**
   * function to update the days, according to the given month
   * called when month changes or year changes form non-leap-year to a leap-year
   * or vice versa
   * @param  {number} month The number of the month 1 ... 12
   * @return {void}
   */
  _updateDays(month = this.currentMonth) {
    // console.log('_updateDays');
    let newDaysPerMonth = this._getDaysPerMonth(month);
    const offset = this.settings.placeholder ? 1 : 0;
    const currentDaysPerMonth = this._day.el.children.length - offset;

    if (newDaysPerMonth === currentDaysPerMonth) {
      return;
    }

    if ('undefined' === typeof newDaysPerMonth) {
      newDaysPerMonth = 31; // reset it;
    }

    if (newDaysPerMonth - currentDaysPerMonth > 0) {
      // add days
      for (let i = currentDaysPerMonth; i < newDaysPerMonth; i++) {
        let el = createEl(optionTagName, { value: i + 1 }, '', '' + (i + 1));
        this._day.el.append(el);
      }
    } else {
      // remove days
      for (let i = currentDaysPerMonth; i > newDaysPerMonth; i--) {
        this._day.el.children[i + offset - 1].remove();
      }

      // day changed after changing month
      // TODO: set currentDay to the next or the prev. correct date
      // eg. 2010-12-31 -> change month to 11 -> 2010-11-31
      // either: 2010-11-30, or 2010-12-01
      if (this.currentDay > newDaysPerMonth) {
        if (this.settings.roundDownDay) {
          this._setDay(newDaysPerMonth);
        } else {
          this._dayWasChanged(undefined);
        }
      }
    }

    // if (this.currentDay && +this._day.el.value !== this.currentDay) {
    //   this._dayWasChanged(); // to undefined
    // }
  }

  _triggerEvent(eventName, data) {
    const detail = {
      instance: this,
      year: +this._year.el.value,
      month: +this._month.el.value,
      day: +this._day.el.value,
      date: this.getDate(),
      ...data,
    };
    const eventData = { detail };
    const ce = new CustomEvent(eventName, eventData);
    this.element.dispatchEvent(ce);
    this.eventFired[eventName] = ce;

    // const optionEventName = `on${eventName[0].toUpperCase()}${eventName.slice(1)}`;
    if (
      this.settings[eventName] &&
      'function' === typeof this.settings[eventName]
    ) {
      this.settings[eventName].call(this, ce);
    }

    // for inline events
    trigger(this.element, eventName, ce);
  }

  /**
   * Disable the options in the select box
   *
   * @param {String} selectBox - Name of the select box (_year, _month, _day)
   * @param {String} condition - '>' or '<'
   * @param {Number} limit - the limit
   */
  _disable(selectBox, condition, limit) {
    const fun = condition === '<' ? (val) => val < limit : (val) => val > limit;
    this[selectBox].el.childNodes.forEach((el) => {
      if (fun(+el.value)) {
        el.disabled = true;
        this._disabled.push(el);
      }
    });
  }

  // TODO: only on select change
  _noFutureDate(lower = this._lowerLimit, upper = this._upperLimit) {
    const setBack = () => {
      // TODO: not really needed
      if (this.currentYear > upper.year) {
        this._setYear(upper.year);
      }

      this._disable('_month', '>', upper.month);

      const setMonthBack = this.currentMonth > upper.month;
      if (setMonthBack) {
        this._setMonth(upper.month);
      }

      if (upper.month === this.currentMonth) {
        this._disable('_day', '>', upper.day);

        if (setMonthBack || this.currentDay > upper.day) {
          this._setDay(upper.day);
        }
      }
    };

    const setFwd = () => {
      // TODO: not really needed
      if (this.currentYear < lower.year) {
        this._setYear(lower.year);
      }

      this._disable('_month', '<', lower.month);

      const setMonthFwd = this.currentMonth < lower.month;
      if (setMonthFwd) {
        this._setMonth(lower.month);
      }

      if (lower.month === this.currentMonth) {
        this._disable('_day', '<', lower.day);

        if (setMonthFwd || this.currentDay < lower.day) {
          this._setDay(lower.day);
        }
      }
    };

    // set all previously disabled option elements to false (reenable them)
    if (this._disabled.length) {
      this._disabled.forEach((el) => {
        el.disabled = false;
      });
      this._disabled = [];
    }

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
    const string = this.settings.leadingZero ? '0' : '';
    for (let i = offset; i < 9 + offset; i++) {
      this._day.el.childNodes[i].innerHTML = string + i;
    }
  }

  /**
   * updates the innerHTML off the month option list
   * adds or removes a leading zero depending on the value of
   * this.settings.leadingZero or changes the month format
   */
  _updateMonthList() {
    const format = this.settings.monthFormat;
    const offset = this.settings.placeholder ? 1 : 0;
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
    if (leadingZero !== this.settings.leadingZero) {
      this.settings.leadingZero = leadingZero;
      if ('numeric' === this.settings.monthFormat) {
        this._updateMonthList();
      }
      this._updateDayList();
    }
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

    // TODO: test: is this correct for all languages?
    if ('numeric' === this.settings.monthFormat) {
      return false;
    }

    let filter = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((el, ind) => {
      this._month.el.childNodes[filter + ind].innerHTML = el;
    });

    // trigger a datechange event, as the output format might change
    this._triggerEvent(DATECHANGE);
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
    let value = '';
    if (this.startDate && preserveStartDate) {
      this._setDate(this.startDate);
      value = this.getDateString();
    } else {
      this._setDate({ year: NaN, month: NaN, day: NaN });
    }
    this.element.value = value;
    this._triggerEvent(DATECHANGE);
  }

  addEventListener(eventName, listener, option) {
    if (
      allowedEvents.indexOf(eventName) < 0 ||
      'function' !== typeof listener
    ) {
      return false;
    }

    this.element.addEventListener(eventName, listener, option);
    this._registeredEventListeners.push({
      element: this.element,
      eventName,
      listener,
      option,
    });

    // already fired
    if (this.eventFired[eventName]) {
      listener.call(this.element, this.eventFired[eventName]);
    }
  }

  removeEventListener(eventName, listener, option) {
    this.element.removeEventListener(eventName, listener, option);
  }

  // TODO: undo everything
  // destroy if it was created
  kill() {
    this.eventFired = {};
    // remove all registered EventListeners
    if (this._registeredEventListeners) {
      this._registeredEventListeners.forEach((r) =>
        r.element.removeEventListener(r.eventName, r.listener, r.option)
      );
    }

    this._date.forEach((item) => {
      if (item.created) {
        item.el.remove();
      } else {
        const cn = this.settings.className;
        if (cn) {
          item.el.classList.remove(cn);
          Object.values(lookup).forEach((name) => {
            item.el.classList.remove(`${cn}-${name}`);
          });
        }
      }
    });

    // remove classes
    // if (this.settings.className) {
    //   const cn = this.settings.className;
    //   Object.values(lookup).forEach((item) => {
    //     const queryName = cn + '-' + item;
    //     const el = this.element.querySelector('.' + queryName);
    //     if (el) {
    //       el.classList.remove(cn);
    //       el.classList.remove(queryName);
    //     }
    //   });
    // }

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
    const date = new Date();
    const curMonth = date.getMonth() + 1;
    let age = date.getFullYear() - y;
    return curMonth < m || (curMonth === m && date.getDate() < d) ? --age : age;
  }

  getDateString(format) {
    if (!format) {
      const string = this.getDate();
      return !string ? string : string.toLocaleDateString(this.settings.locale);
    }

    if (!this.currentYear || !this.currentMonth || !this.currentDay) {
      return '';
    }

    // eg. 'YYYY-MM-DD'
    let result = format.toLowerCase();
    result = result.replace(/yyyy/g, this.currentYear);
    result = result.replace(/yy/g, ('' + this.currentYear).slice(2));

    result = result.replace(/mm/g, ('0' + this.currentMonth).slice(-2));
    result = result.replace(/m/g, this.currentMonth);

    result = result.replace(/dd/g, ('0' + this.currentDay).slice(-2));
    result = result.replace(/d/g, this.currentDay);

    return result;
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
  _getUpperLimit(s) {
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
  _getLowerLimit(s) {
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

    this.eventFired = {};
    this._registeredEventListeners = [];
    this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this._date = [];
    this._disabled = [];

    const s = this.settings;
    // check settings
    s.placeholder = isTrue(s.placeholder);
    s.leadingZero = isTrue(s.leadingZero);
    s.selectFuture = isTrue(s.selectFuture);

    this._lowerLimit = this._getLowerLimit(s);
    this._upperLimit = this._getUpperLimit(s);
    this._yearFrom = this._lowerLimit.year;
    this._yearTo = this._upperLimit.year;

    const [currentLocale] = BirthdayPicker.createLocale(s.locale);
    s.locale = currentLocale;
    this.monthFormat = BirthdayPicker.i18n[s.locale].monthFormat;

    this._create();

    this._triggerEvent(INIT);

    // set default start value
    if (s.defaultDate) {
      const parsed = this.setDate(
        s.defaultDate === 'now' ? new Date().toString() : s.defaultDate,
        true
      );

      // store value for resetting
      this.startDate = parsed;
    }
  }
}

BirthdayPicker.i18n = {};
BirthdayPicker.currentLocale = 'en';

BirthdayPicker.getInstance = (el) => dataStorage.get(el, 'instance');

BirthdayPicker.createLocale = (lang) => {
  if (!lang || lang.length !== 2) {
    lang = 'en';
  }
  if (BirthdayPicker.i18n[lang]) {
    return [lang, BirthdayPicker.i18n[lang]];
  }
  let dd = new Date('2000-01-15');

  let obj = { monthFormat: {} };

  for (let i = 0; i < 12; i++) {
    dd.setMonth(i);
    monthFormats.forEach((format) => {
      obj.monthFormat[format] = obj.monthFormat[format] || [];
      obj.monthFormat[format].push(
        dd.toLocaleDateString(lang, { month: format })
      );
    });
  }

  const i18n = 'BirthdayPickerLocale';
  let tmp = locale[lang] ? locale[lang] : locale.en;
  if (window[i18n] && window[i18n][lang]) {
    tmp = Object.assign({}, tmp, window[i18n][lang]);
  }

  BirthdayPicker.i18n[lang] = Object.assign(obj, tmp);
  return [lang, obj];
};

/**
 * Set the month format for all registered instances
 * @param  {String} format The available formats are: 'short', 'long', 'numeric'
 */
BirthdayPicker.setMonthFormat = (format) => {
  instances.forEach((bp) => {
    bp.setMonthFormat(format);
  });
};

/**
 * Set the language of all registered instances
 * @param  {String} lang The language string, eg.: 'en', 'de'
 */
BirthdayPicker.setLanguage = (lang) => {
  BirthdayPicker.currentLocale = lang;
  instances.forEach((bp) => {
    bp.setLanguage(lang);
  });
};

/**
 * Kill all events on all registered instances
 * @returns {Boolean} false if no instance was found, or true if events where removed
 */
BirthdayPicker.killAll = () => {
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
 * Kill all events on all registered instances
 * @returns {Boolean} false if no instance was found, or true if events where removed
 */

/**
 *
 * @param {*} instance either an registered html object or an instance of the BirthdayPicker class
 * @returns {Boolean} false or true
 */
BirthdayPicker.kill = (instance) => {
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

BirthdayPicker.defaults = defaults;

BirthdayPicker.init = () => {
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
    // if (el.dataset.bdpInit) {
    // return BirthdayPicker.getInstance(el);
    // }
    // const data = getJSONData(el, pluginName);
    new BirthdayPicker(el);
  });

  return instances;
};

// docReady(BirthdayPicker.init);

export default BirthdayPicker;
