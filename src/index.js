/*!
 * (c) wolfgang jungmayer
 * www.lemon3.at
 */
import { defaults } from '@/defaults';
import {
  docReady,
  createEl,
  restrict,
  getJSONData,
  isLeapYear,
  dataStorage,
} from '@/helper';

let instances = [];
const pluginName = 'birthdaypicker';
const dataName = 'data-' + pluginName;
const monthFormats = ['short', 'long', 'numeric'];
const allowedArrangement = ['ymd', 'ydm', 'myd', 'mdy', 'dmy', 'dym'];
const allowedEvents = [
  'init',
  'datechange',
  'daychange',
  'monthchange',
  'yearchange',
  'kill',
];
const optionTagName = 'option';

// BirthdayPickerLocale
const locale = {
  en: { text: { year: 'Year', month: 'Month', day: 'Day' } },
  de: { text: { year: 'Jahr', month: 'Monat', day: 'Tag' } },
};

const currentDate = new Date();
const now = {
  y: currentDate.getFullYear(),
  m: currentDate.getMonth() + 1,
  d: currentDate.getDate(),
  t: currentDate.getTime(),
};

let initialized = false;

function trigger(elem, name, data) {
  let funData = elem.getAttribute('on' + name);
  let func = new Function(
    'e',
    // 'with(document) {' +
    // 'with(this)' +
    '{' + funData + '}'
    // + '}'
  );
  func.call(elem, data);
}

const isTrue = (value) =>
  value === true || value === 'true' || value === 1 || value === '1';

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

    // todo: use dataStorage.has(element) ?
    if (element.dataset.bdpInit) {
      return BirthdayPicker.getInstance(element);
    }
    element.dataset.bdpInit = true;

    instances.push(this);
    dataStorage.put(element, 'instance', this);

    // from data api
    const data = getJSONData(element, pluginName, BirthdayPicker.defaults);

    this.options = options; // user options
    this.settings = Object.assign({}, BirthdayPicker.defaults, data, options);
    this.element = element;

    if (this.settings.autoInit) {
      this.init();
    }
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
   * called if one value was changed
   */
  _dateChanged() {
    if (!this.settings.selectFuture) {
      this._noFutureDate(now.y, now.m, now.d);
    }
    this._triggerEvent(allowedEvents[1]);
  }

  /**
   * set the year to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} year the day value (eg, 1988, 2012, ...)
   * @param {Boolean} triggerDateChange true if a dateChange event should be triggered
   * @returns
   */
  _setYear(year, triggerDateChange = true) {
    year = restrict(year, this._yearEnd, this._yearStart);
    if (this.currentYear === year) {
      return false;
    }
    this._updateSelectBox('_year', year);
    this._yearWasChanged(year);
    if (triggerDateChange) {
      this._dateChanged();
    }
    return true;
  }

  /**
   * set the month to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} month the month value (usually between 1 - 12)
   * @param {Boolean} triggerDateChange true if a dateChange event should be triggered
   * @returns
   */
  _setMonth(month, triggerDateChange = true) {
    month = restrict(month, 1, 12);
    if (this.currentMonth === month) {
      return false;
    }
    this._updateSelectBox('_month', month);
    this._monthWasChanged(month);
    if (triggerDateChange) {
      this._dateChanged();
    }
    return true;
  }

  /**
   * set the day to a given value
   * and change the corresponding select-box too.
   * @param {String|Int} day the day value (usually between 1 - 31)
   * @param {Boolean} triggerDateChange true if a dateChange event should be triggered
   * @returns
   */
  _setDay(day, triggerDateChange = true) {
    const currentMaxDays = this._daysPerMonth[this.currentMonth - 1];
    day = restrict(day, 1, currentMaxDays);
    if (this.currentDay === day) {
      return false;
    }
    this._updateSelectBox('_day', day);
    this._dayWasChanged(day);
    if (triggerDateChange) {
      this._dateChanged();
    }
    return true;
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
  _setDate({ year, month, day }) {
    // small helper for the event triggering system
    this._monthChangeTriggeredLater = month !== this.currentMonth;
    let _yChanged = this._setYear(year, false);
    let _mChanged = this._setMonth(month, false);
    let _dChanged = this._setDay(day, false);

    if (_yChanged || _mChanged || _dChanged) {
      this._dateChanged();
    }

    this._monthChangeTriggeredLater = false;
  }

  _parseDate(dateString) {
    if ('object' !== typeof dateString) {
      // safari fix '2004-2-29' -> '2004/2/29'
      dateString = dateString.replaceAll('-', '/');
    }
    // unix timestamp
    const parse = Date.parse(dateString);
    if (isNaN(parse)) {
      return false; // wrong date
    }
    const date = new Date(parse);
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

  /**
   * Create the gui and set the default (start) values if available
   * @return {void}
   */
  _create() {
    const s = this.settings;
    // bigEndian:    ymd
    // littleEndian: dmy
    // else:         mdy
    if (allowedArrangement.indexOf(s.arrange) < 0) {
      s.arrange = 'ymd'; // bigEndian
    }

    const lookup = { y: 'year', m: 'month', d: 'day' };
    s.arrange.split('').forEach((i) => {
      const item = lookup[i];
      let itemEl;
      let query = s[item + 'El'];
      if (query && 'undefined' !== typeof query.nodeName) {
        itemEl = query;
      } else {
        query = query ? query : '[' + dataName + '-' + item + ']';
        itemEl = this.element.querySelector(query);
      }
      if (!itemEl || itemEl.dataset.init) {
        itemEl = createEl('select');
        this.element.append(itemEl);
      }
      this['_' + item] = {
        el: itemEl,
        df: document.createDocumentFragment(),
        name: item, // placeholder name
      };
      this._date.push(this['_' + item]);

      itemEl.dataset.init = true;
      // todo: event delegation
      itemEl.addEventListener(
        'change',
        (evt) => {
          this._onSelect(evt);
        },
        false
      );
    });

    const optionEl = createEl(optionTagName, { value: '' });

    // placeholder
    if (s.placeholder) {
      this._date.forEach((item) => {
        const name = BirthdayPicker.i18n[s.locale].text[item.name];
        const option = optionEl.cloneNode();
        option.innerHTML = name;
        item.df.appendChild(option);
      });
    }

    // add option data to year field
    for (let i = this._yearStart; i >= this._yearEnd; i--) {
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
   * @param  {String} month The month String
   * @return {[type]}       [description]
   */
  _updateDays(month) {
    // console.log('_updateDays');
    let newDaysPerMonth = this._daysPerMonth[+month - 1];
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
      // todo: set currentDay to the next or the prev. correct date
      // eg. 2010-12-31 -> change month to 11 -> 2010-11-31
      // either: 2010-11-30, or 2010-12-01
      if (this.currentDay > newDaysPerMonth) {
        if (this.settings.roundDownDay) {
          this._setDay(newDaysPerMonth, false);
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

    // for inline events
    trigger(this.element, eventName, ce);
  }

  _noFutureDate(year, month, day) {
    // console.log('_noFutureDate');

    // set all previously disabled option elements to false (reenable them)
    if (this._disabled.length) {
      this._disabled.forEach((el) => {
        el.disabled = false;
      });
      this._disabled = [];
    }

    // early exit
    if (
      this.currentYear < year ||
      !this.currentYear ||
      (!this.currentYear && !this.currentMonth && !this.currentDay)
    ) {
      return false;
    }

    if (this.currentYear > year) {
      this._setYear(year, false);
    }

    // console.log(this.currentYear, this.currentMonth, this.currentDay);
    // console.log(year, month, day);
    // console.log('--->', this.currentYear, this.currentMonth, this.currentDay);

    // Disable months greater than the current month
    this._month.el.childNodes.forEach((el) => {
      if (el.value > month) {
        el.disabled = true;
        this._disabled.push(el);
      }
    });

    const setMonthBack = this.currentMonth > month;
    if (setMonthBack) {
      this._setMonth(month, false);
    }

    if (month === this.currentMonth) {
      // disable all days greater than the current day
      this._day.el.childNodes.forEach((el) => {
        if (el.value > day) {
          el.disabled = true;
          this._disabled.push(el);
        }
      });

      if (setMonthBack || this.currentDay > day) {
        this._setDay(day, false);
      }
    }
    return true;
  }

  /**
   * date change event handler, called if one of the fields is updated
   * @param  {Event} e The event
   * @return {void}
   */
  _onSelect(evt) {
    if (evt.target === this._year.el) {
      this._yearWasChanged(+evt.target.value);
    } else if (evt.target === this._month.el) {
      this._monthWasChanged(+evt.target.value);
    } else if (evt.target === this._day.el) {
      this._dayWasChanged(+evt.target.value);
    }
    this._dateChanged();
  }

  /**
   * called if the day was changed
   * sets the currentDay value and triggers the corresponding event
   * @param {number} day the new day value
   * @returns
   */
  _dayWasChanged(day) {
    // console.log('_dayWasChanged:', day);
    // const from = this.currentDay;
    this.currentDay = day;
    this._triggerEvent(allowedEvents[2]);
  }

  /**
   * called if the month was changed
   * sets the currentMonth value and triggers the corresponding event
   * @param {number} month the new month value
   * @returns
   */
  _monthWasChanged(month) {
    // console.log('_monthWasChanged:', month);
    // const from = this.currentMonth;
    this.currentMonth = month;
    this._triggerEvent(allowedEvents[3]);
    this._updateDays(month);
  }

  /**
   * called if the year was changed
   * sets the currentYear value and triggers the corresponding event
   * @param {number} year the new year value
   * @returns
   */
  _yearWasChanged(year) {
    // console.log('_yearWasChanged:', year);
    // const from = this.currentYear;
    this.currentYear = year;
    this._daysPerMonth[1] = isLeapYear(year) ? 29 : 28;
    this._triggerEvent(allowedEvents[4]);

    if (!this._monthChangeTriggeredLater && this.currentMonth === 2) {
      this._updateDays(this._month.el.value);
    }
  }

  useLeadingZero(value) {
    value = isTrue(value);
    if (value !== this.settings.leadingZero) {
      this.settings.leadingZero = value;

      if ('numeric' === this.settings.monthFormat) {
        this._updateMonthList();
      }
      this._updateDayList();
    }
  }

  _updateDayList() {
    const offset = this.settings.placeholder ? 1 : 0;
    for (let i = 0; i < 9; i++) {
      const el = this._day.el.childNodes[i + offset];
      el.innerHTML = (this.settings.leadingZero ? '0' : '') + (i + 1);
    }
  }

  _updateMonthList() {
    const format = this.settings.monthFormat;
    const offset = this.settings.placeholder ? 1 : 0;
    this.monthFormat[format].forEach((text, i) => {
      this._month.el.childNodes[i + offset].innerHTML =
        this._getMonthText(text);
    });
  }

  /**
   * Change the current active month format
   * @param  {[type]} format [description]
   * @return {[type]}        [description]
   */
  setMonthFormat(format) {
    if (!this.monthFormat[format]) {
      return false;
    }
    if (format !== this.settings.monthFormat) {
      this.settings.monthFormat = format;
      this._updateMonthList();
    }
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
        item.el.childNodes[0].innerHTML = langTexts.text[item.name];
      });
    }

    this.monthFormat = langTexts.month;
    // const from = this.settings.locale;
    this.settings.locale = lang;

    // todo: is this correct for all languages?
    if ('numeric' === this.settings.monthFormat) {
      return false;
    }

    let filter = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((el, ind) => {
      this._month.el.childNodes[filter + ind].innerHTML = el;
    });

    // trigger a datechange event, as the output format might change
    this._triggerEvent(allowedEvents[1]);
  }

  // todo: use a format option, eg.: yyyy-dd-mm
  setDate(dateString) {
    let parsed = this._parseDate(dateString);
    if (parsed) {
      // parsed = this._getDateValuesInRange(parsed);
      this._setDate(parsed);
    }
    return parsed;
  }

  resetDate(preserveStartDate = false) {
    let resetTo =
      this.startDate && preserveStartDate
        ? this.startDate
        : { year: undefined, month: undefined, day: undefined };
    this._setDate(resetTo);
  }

  addEventListener(eventName, listener, option) {
    if (
      allowedEvents.indexOf(eventName) < 0 ||
      'function' !== typeof listener
    ) {
      return false;
    }

    this.element.addEventListener(eventName, listener, option);
    this._registeredEventListeners.push({ eventName, listener, option });

    // already fired
    if (this.eventFired[eventName]) {
      listener.call(this.element, this.eventFired[eventName]);
    }
  }

  removeEventListener(eventName, listener, option) {
    this.element.removeEventListener(eventName, listener, option);
  }

  // todo: undo everything
  kill() {
    this.eventFired = {};

    // remove all registered EventListeners
    if (this._registeredEventListeners) {
      this._registeredEventListeners.forEach((r) =>
        this.removeEventListener(r.eventName, r.listener, r.option)
      );
    }

    this._triggerEvent(allowedEvents[5]);
  }

  isLeapYear(year = this.currentYear) {
    return undefined === year ? undefined : isLeapYear(year);
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
    var tmp = new Date(
      Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay)
    );
    return tmp;
  }

  /**
   * The init method
   * todo: test all(!) option values for correctness
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

    // store all disabled elements in an array for quicker reenable
    this._disabled = [];

    const s = this.settings;
    s.placeholder = isTrue(s.placeholder);
    s.leadingZero = isTrue(s.leadingZero);
    s.selectFuture = isTrue(s.selectFuture);

    if ('now' === s.maxYear) {
      this._yearStart = now.y;
    } else {
      this._yearStart = s.maxYear;
    }

    this._yearStart -= +s.minAge;
    if (s.minYear) {
      this._yearEnd = +s.minYear;
    } else {
      this._yearEnd = this._yearStart - +s.maxAge;
    }

    BirthdayPicker.createLocale(s.locale);
    this.monthFormat = BirthdayPicker.i18n[s.locale].month;

    this._create();

    this._triggerEvent(allowedEvents[0]);

    // set default start value
    if (s.defaultDate) {
      const parsed = this.setDate(
        s.defaultDate === 'now' ? new Date().toString() : s.defaultDate
      );

      this.currentYear = parsed.year;
      this.currentMonth = parsed.month;
      this.currentDay = parsed.day;

      this.startDate = parsed;
    }
  }
}

BirthdayPicker.i18n = {};
BirthdayPicker.currentLocale = 'en';

BirthdayPicker.getInstance = (el) => dataStorage.get(el, 'instance');

BirthdayPicker.createLocale = (lang) => {
  if (BirthdayPicker.i18n[lang]) {
    return;
  }
  let dd = new Date('2000-01-15');
  let obj = { month: {} };

  for (let i = 0; i < 12; i++) {
    dd.setMonth(i);
    monthFormats.forEach((format) => {
      obj.month[format] = obj.month[format] || [];
      obj.month[format].push(dd.toLocaleDateString(lang, { month: format }));
    });
  }

  const i18n = 'BirthdayPickerLocale';
  let tmp = locale[lang] ? locale[lang] : locale.en;
  if (window[i18n] && window[i18n][lang] && window[i18n][lang].text) {
    tmp = Object.assign({}, tmp, window[i18n][lang]);
  }

  obj['text'] = tmp.text;
  BirthdayPicker.i18n[lang] = obj;

  return obj;
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

  // todo: reset all to default!
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

docReady(BirthdayPicker.init);

export default BirthdayPicker;
