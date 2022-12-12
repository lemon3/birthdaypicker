/*!
 * (c) wolfgang jungmayer
 * www.lemon3.at
 */
import {
  docReady,
  createEl,
  restrict,
  getJSONData,
  isLeapYear,
  dataStorage,
} from '@/helper';

const instances = [];
const dataName = 'data-birthdaypicker';
const monthFormats = ['short', 'long', 'numeric'];
const allowedEvents = ['init', 'datechange'];

let today = new Date();
let todayYear = today.getFullYear();
let todayMonth = today.getMonth() + 1;
let todayDay = today.getDate();

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
    if (element.dataset.bdpinit) {
      return BirthdayPicker.getInstance(element);
    }
    element.dataset.bdpinit = true;

    instances.push(this);
    dataStorage.put(element, 'instance', this);

    // from data api
    const data = getJSONData(
      element,
      'birthdaypicker',
      BirthdayPicker.defaults
    );

    this.options = options; // user options
    this.settings = Object.assign({}, BirthdayPicker.defaults, data, options);
    this.element = element;

    // store all disabled elements in an array for quicker reenable
    this.disabledReference = [];

    if (this.settings.autoinit) {
      this.init();
    }
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

    // remove all registerd EventListeners
    if (this._registeredEventListeners) {
      this._registeredEventListeners.forEach((r) =>
        this.removeEventListener(r.eventName, r.listener, r.option)
      );
    }
  }

  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodes Option List
   * @param  {String} value Value to find
   * @return {mixed}       The index value or undefined
   */
  _getNodeIndexByValue(nodelist, value) {
    if (!nodelist) {
      return [undefined, undefined];
    }
    for (let i = 0; i < nodelist.length; i++) {
      let el = nodelist[i];
      if (+el.value === +value) {
        return [i, +el.value];
      }
    }
    return [undefined, undefined];
  }

  _setYear(year) {
    year = restrict(year, this._yearEnd, this._yearStart);
    const [newYearIndex, newYearValue] = this._getNodeIndexByValue(
      this._year.el.childNodes,
      year
    );
    const valueChanged = this.currentYear !== newYearValue;
    if (valueChanged) {
      this._year.el.selectedIndex = newYearIndex;
      this._yearChanged(newYearValue);
    }
    return valueChanged;
  }

  _setMonth(month) {
    month = restrict(month, 1, 12);
    const [newMonthIndex, newMonthValue] = this._getNodeIndexByValue(
      this._month.el.childNodes,
      month
    );
    const valueChanged = this.currentMonth !== newMonthValue;
    if (valueChanged) {
      this._month.el.selectedIndex = newMonthIndex;
      this._monthChanged(newMonthValue);
    }
    return valueChanged;
  }

  _setDay(day) {
    day = restrict(day, 1, 31);
    const [newDayIndex, newDayValue] = this._getNodeIndexByValue(
      this._day.el.childNodes,
      day
    );
    const valueChanged = this.currentDay !== newDayValue;
    if (valueChanged) {
      this._day.el.selectedIndex = newDayIndex;
      this._dayChanged(newDayValue);
    }
    return valueChanged;
  }

  setDate(dateString) {
    let parsed = this._parseDate(dateString);
    if (parsed) {
      this._setDate(parsed.year, parsed.month, parsed.day);
    }
  }

  // Setter
  set useLeadingZero(value) {
    if ('boolean' === typeof value || !isNaN(value)) {
      this.settings.leadingZero = value;
    }
  }

  /**
   * Set the date
   * @param {String | Int} year  The year.
   * @param {String | Int} month The month.
   * @param {String | Int} day   The day.
   */
  _setDate(year, month, day) {
    // this._prevent = true; // prevent events on direct input

    this._yChanged = year !== this.currentYear;
    this._mChanged = month !== this.currentMonth;
    this._dChanged = day !== this.currentDay;

    this._setYear(year);
    this._setMonth(month);
    this._setDay(day);

    // this._prevent = false;

    if (this._yChanged || this._mChanged || this._dChanged) {
      this._dateChanged();
    }

    this._yChanged = false;
    this._mChanged = false;
    this._dChanged = false;
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
    this.monthFormat = BirthdayPicker.i18n[lang].month;
    this.settings.locale = lang;

    // todo: is this correct for all languages?
    if ('numeric' === this.settings.monthFormat) {
      return false;
    }

    let filter = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((el, ind) => {
      this._month.el.childNodes[filter + ind].innerHTML = el;
    });

    // trigger a datechange event
    this._dateChanged();
  }

  /**
   * Change the current active month format
   * @param  {[type]} format [description]
   * @return {[type]}        [description]
   */
  setMonthFormat(format) {
    if (!this.monthFormat[format] || format === this.settings.monthFormat) {
      return false;
    }

    this.settings.monthFormat = format;
    let filter = this.settings.placeholder ? 1 : 0;
    this.monthFormat[format].forEach((text, ind) => {
      this._month.el.childNodes[filter + ind].innerHTML =
        this._getMonthText(text);
    });
  }

  // getter
  isLeapYear(year = this.currentYear) {
    return undefined === year ? undefined : isLeapYear(year);
  }

  _parseDate(dateString) {
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

  getDate(format) {
    if (!this.currentYear || !this.currentMonth || !this.currentDay) {
      return '';
    }
    // use the language default
    if (!format) {
      let tmp = new Date(
        Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay)
      );
      return tmp.toLocaleDateString(this.settings.locale);
    }

    // eg. 'YYYY-MM-DD'
    let result = format.toLowerCase();

    result = result.replaceAll('yyyy', this.currentYear);
    result = result.replaceAll('yy', ('' + this.currentYear).slice(2));

    result = result.replaceAll('mm', ('0' + this.currentMonth).slice(-2));
    result = result.replaceAll('m', this.currentMonth);

    result = result.replaceAll('dd', ('0' + this.currentDay).slice(-2));
    result = result.replaceAll('d', this.currentDay);

    return result;
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
  _createBirthdayPicker() {
    // placeholder
    if (this.settings.placeholder) {
      this._date.forEach((item) => {
        const option = createEl('option', { value: '' }, '', item.name);
        item.df.appendChild(option);
      });
    }

    // add option data to year field
    for (let i = this._yearStart; i >= this._yearEnd; i--) {
      const el = createEl('option', { value: i }, '', i);
      this._year.df.append(el);
    }

    // add to month
    this.monthFormat[this.settings.monthFormat].forEach((text, ind) => {
      const el = createEl(
        'option',
        { value: ind + 1 },
        '',
        this._getMonthText(text)
      );
      this._month.df.append(el);
    });

    // add day
    let number;
    for (let i = 1; i <= 31; i++) {
      number = this.settings.leadingZero ? (i < 10 ? '0' + i : i) : i;
      const el = createEl('option', { value: i }, '', number);
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
    const newDays = this._monthDayMapping[+month - 1];
    const currentDays =
      this._day.el.children.length - (this.settings.placeholder ? 1 : 0);

    if (newDays === currentDays) {
      return;
    }

    if (newDays - currentDays > 0) {
      // add days
      for (let i = currentDays; i < newDays; i++) {
        let el = createEl('option', { value: i + 1 }, '', '' + (i + 1));
        this._day.el.append(el);
      }
    } else {
      // remove days
      for (let i = currentDays; i > newDays; i--) {
        this._day.el.children[i].remove();
      }
    }

    // day changed after changing month
    // todo: set currentDay to the next or the prev. correct date
    // eg. 2010-12-31 -> change month to 11 -> 2010-11-31
    // either: 2010-11-30, or 2010-12-01
    if (this.currentDay && +this._day.el.value !== this.currentDay) {
      this._dayChanged(); // to undefined
    }
  }

  _triggerEvent(eventName) {
    let eventData = {
      detail: {
        instance: this,
        year: this._year.el.value,
        month: this._month.el.value,
        day: this._day.el.value,
      },
    };
    let ce = new CustomEvent(eventName, eventData);
    this.element.dispatchEvent(ce);
    this.eventFired[eventName] = ce;

    // for inline events
    trigger(this.element, eventName, ce);
  }

  _nofutureDate(year, month, day) {
    // set all to false (again)
    if (this.disabledReference.length) {
      this.disabledReference.forEach((el) => {
        el.disabled = false;
      });
      this.disabledReference = [];
    }

    if (+this.currentYear > year) {
      this._setYear(year);
      if (+this.currentMonth !== month) {
        this._setMonth(month);
      }
      if (+this.currentDay !== day) {
        this._setDay(day);
      }
    } else if (+this.currentYear === year) {
      // Disable months greater than the current month
      this._month.el.childNodes.forEach((el) => {
        if (el.value > month) {
          el.disabled = true;
          this.disabledReference.push(el);
        }
      });

      // set month back
      if (+this.currentMonth !== month) {
        this._setMonth(month);
      }

      // disable all days greater than the current day
      if (+this.currentMonth === month) {
        this._day.el.childNodes.forEach((el) => {
          if (el.value > day) {
            el.disabled = true;
            this.disabledReference.push(el);
          }
        });

        // set days back
        if (+this.currentDay !== day) {
          this._setDay(day);
        }
      }
    }
  }

  /**
   * date change event handler, called if one of the fields is updated
   * @param  {Event} e The event
   * @return {void}
   */
  _dateChanged(evt) {
    if (evt) {
      if (evt.target === this._year.el) {
        this._yearChanged(+evt.target.value);
      } else if (evt.target === this._month.el) {
        this._monthChanged(+evt.target.value);
      } else if (evt.target === this._day.el) {
        this._dayChanged(+evt.target.value);
      }
    }

    if (!this.settings.selectFuture) {
      this._nofutureDate(todayYear, todayMonth, todayDay);
    }

    this._triggerEvent(allowedEvents[1]);
  }

  _dayChanged(day) {
    // console.log('_dayChanged:', day);
    this.currentDay = day;
  }

  _monthChanged(month) {
    // console.log('_monthChanged:', month);
    this.currentMonth = month;
    // if (this._prevent) {
    //   return false;
    // }
    this._updateDays(month);
  }

  _yearChanged(year) {
    // console.log('_yearChanged:', year);
    this.currentYear = year;
    this._monthDayMapping[1] = isLeapYear(year) ? 29 : 28;

    // if (this._prevent) {
    //   return false;
    // }

    // if month changed to early exit
    if (this._mChanged) {
      return true;
    }

    // if feb and leap year
    let month = this._month.el.value;
    if (2 === +month) {
      this._updateDays(month);
      // if (this._day.el.value >= 29) {
      //   this._dayChanged(this._day.el.value);
      // }
    }
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
    this._monthDayMapping = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.settings.placeholder = isTrue(this.settings.placeholder);
    this._date = [];

    ['year', 'month', 'day'].forEach((item) => {
      let itemEl = this.element.querySelector(
        '[' + dataName + '-' + item + ']'
      );
      if (!itemEl) {
        // todo: add default dataset value data-birthdaypicker-year???
        itemEl = createEl('select');
        this.element.append(itemEl);
      }
      this['_' + item] = {
        el: itemEl,
        df: document.createDocumentFragment(),
        name: item, // placeholder name
      };

      this._date.push(this['_' + item]);

      itemEl.addEventListener(
        'change',
        (evt) => {
          this._dateChanged(evt);
        },
        false
      );
    });

    //calculate the year to add to the select options.
    if (this.settings.maxYear && +this.settings.maxYear !== todayYear) {
      this._yearStart = this.settings.maxYear;
    } else {
      this._yearStart = todayYear;
    }

    this._yearStart -= +this.settings.minAge;

    if (this.settings.minYear) {
      this._yearEnd = +this.settings.minYear;
    } else {
      this._yearEnd = this._yearStart - +this.settings.maxAge;
    }

    this.settings.locale;
    BirthdayPicker.createLocale(this.settings.locale);
    this.monthFormat = BirthdayPicker.i18n[this.settings.locale].month;

    this._createBirthdayPicker();

    // set default start value
    if (this.settings.defaultDate) {
      this.setDate(
        this.settings.defaultDate === 'now'
          ? new Date().toString()
          : this.settings.defaultDate
      );
    }

    this._triggerEvent(allowedEvents[0]);
  }
}

BirthdayPicker.i18n = {};
BirthdayPicker.currentLocale = 'en';

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

BirthdayPicker.getInstance = (el) => dataStorage.get(el, 'instance');
BirthdayPicker.kill = (el) => {
  let instance = BirthdayPicker.getInstance(el);
  if (!instance) {
    return;
  }
  instance.kill();
  // todo: reset all to default!
  // e.g.: instance.kill();

  el.dataset.bdpinit = false;
  delete el.dataset.bdpinit;
  dataStorage.remove(el, 'instance');
};

BirthdayPicker.defaults = {
  minYear: null, // overriddes the value set by maxAge
  maxYear: todayYear,
  minAge: 0,
  maxAge: 100,
  monthFormat: 'short',
  placeholder: true,
  defaultDate: null,
  autoinit: true,
  leadingZero: true,
  locale: 'en',
  selectFuture: false,
};

BirthdayPicker.init = () => {
  if (initialized) {
    return false;
  }
  initialized = true;
  BirthdayPicker.createLocale(BirthdayPicker.currentLocale);
  const elementName = '[' + dataName + ']';

  let element =
    'string' === typeof elementName
      ? document.querySelectorAll(elementName)
      : elementName;

  if (0 === element.length) {
    return !1;
  }

  if (undefined === element.length) {
    element = [element];
  }

  element.forEach((el) => {
    if (el.dataset.bdpinit) {
      return BirthdayPicker.getInstance(el);
    }
    const data = getJSONData(el, 'birthdaypicker');
    new BirthdayPicker(el, data);
  });

  return instances;
  // return 1 === len ? instances[0] : instances[1];
  // return 1 === instances.length ? instances[0] : instances;
};

docReady(BirthdayPicker.init);

export default BirthdayPicker;
