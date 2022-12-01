/*!
 * (c) wolfgang jungmayer
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
const allowedEvents = ['datechange'];

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

    // already fired
    if (this.eventFired[eventName]) {
      listener.call(this.element, this.eventFired[eventName]);
    }
  }

  removeEventListener(eventName, listener, option) {
    this.element.addEventListener(eventName, listener, option);
  }

  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodes Option List
   * @param  {String} value Value to find
   * @return {mixed}       The index value or undefined
   */
  _getNodeIndexByValue(nodelist, value) {
    for (let i = 0; i < nodelist.length; i++) {
      let el = nodelist[i];
      if (+el.value === +value) {
        return [i, el.value];
      }
    }
    return [undefined, undefined];
  }

  _setYear(year) {
    year = restrict(year, this._yearEnd, this._yearBegin, this._yearEnd);

    const [newYearIndex, newYearValue] = this._getNodeIndexByValue(
      this._year.el.childNodes,
      year
    );
    if (this.currentYear !== newYearValue) {
      this._year.el.selectedIndex = newYearIndex;
      this._yearChanged(newYearValue);
      // this._year.el.dispatchEvent(new Event('change'));
    }
  }

  _setDay(day) {
    day = restrict(day, 1, 31);

    const [newDayIndex, newDayValue] = this._getNodeIndexByValue(
      this._day.el.childNodes,
      day
    );
    if (this.currentDay !== newDayValue) {
      this._day.el.selectedIndex = newDayIndex;
      this._dayChanged(newDayValue);
    }
  }

  _setMonth(month) {
    month = restrict(month, 1, 12);

    const [newMonthIndex, newMonthValue] = this._getNodeIndexByValue(
      this._month.el.childNodes,
      month
    );
    if (this.currentMonth !== newMonthValue) {
      this._month.el.selectedIndex = newMonthIndex;
      this._monthChanged(newMonthValue);
    }
  }

  /**
   * Set the date
   * @param {String | Int} year  The year.
   * @param {String | Int} month The month.
   * @param {String | Int} day   The day.
   */
  setDate(year, month, day) {
    this._prevent = true; // prevent _dateChanged to fire

    this._setYear(year);
    this._setMonth(month);
    this._setDay(day);

    this._prevent = false; // stop prevent _dateChanged to fire
    this._dateChanged();
  }

  setLanguage(lang) {
    if (lang === this.settings.locale) {
      // console.log('nothing to change');
      return false;
    }

    BirthdayPicker.createLocale(lang);
    this.monthFormat = BirthdayPicker.i18n[lang].month;

    // todo: is this correct for all languages?
    if ('numeric' === this.settings.monthFormat) {
      return false;
    }

    let filter = this.settings.placeholder ? 1 : 0;
    this.monthFormat[this.settings.monthFormat].forEach((el, ind) => {
      this._month.el.childNodes[filter + ind].innerHTML = el;
    });

    this.settings.locale = lang;
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
  isLeapYear(year = null) {
    return isLeapYear(year || this.currentYear);
  }

  // todo: return the correct date format,
  // or if set the value as given in the string
  getDate(format) {
    // use the language default
    if (!format) {
      let tmp = new Date(
        Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay)
      );
      // tmp.setUTCFullYear(+this.currentYear);
      // tmp.setUTCMonth(+this.currentMonth - 1);
      // tmp.setUTCDate(+this.currentDay);
      return tmp.toLocaleDateString(this.settings.locale);
    }

    // eg. 'YYYY-MM-DD'
    let result = format.toLowerCase();
    result.replace('yyyy', this.currentYear);
    result.replace('mm', this.currentMonth);
    result.replace('dd', this.currentDay);
  }

  // function for opdate or create
  _getMonthText(text) {
    if ('numeric' !== this.settings.monthFormat) {
      return text;
    }
    return this.settings.useLeadingZero
      ? +text < 10
        ? '0' + text
        : text
      : text;
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
    for (let i = this._yearBegin; i >= this._yearEnd; i--) {
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
      number = this.settings.useLeadingZero ? (i < 10 ? '0' + i : i) : i;
      const el = createEl('option', { value: i }, '', number);
      this._day.df.append(el);
    }

    // append fragments to elements
    this._date.forEach((item) => item.el.append(item.df));

    // set default start value
    if (this.settings.defaultDate) {
      this.setDate(
        this.settings.defaultDate.year,
        this.settings.defaultDate.month,
        this.settings.defaultDate.day
      );
    }
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

  _nofuturDate() {
    // set all to false (again)
    if (this.disabledReference.length) {
      this.disabledReference.forEach((el) => {
        el.disabled = false;
      });
      this.disabledReference = [];
    }

    if (+this.currentYear === todayYear) {
      // Disable months greater than the current month
      this._month.el.childNodes.forEach((el) => {
        if (el.value > todayMonth) {
          el.disabled = true;
          this.disabledReference.push(el);
        }
      });

      // set month back
      if (+this.currentMonth > todayMonth) {
        const [newMonthIndex, newMonthValue] = this._getNodeIndexByValue(
          this._month.el.childNodes,
          todayMonth
        );
        if (this.currentMonth !== newMonthValue) {
          this._month.el.selectedIndex = newMonthIndex;
          this._monthChanged(newMonthValue);
          // this._month.el.dispatchEvent(new Event('change'));
        }
      }

      // disable all days greater than the current day
      if (+this.currentMonth === todayMonth) {
        this._day.el.childNodes.forEach((el) => {
          if (el.value > todayDay) {
            el.disabled = true;
            this.disabledReference.push(el);
          }
        });

        // set days back
        if (+this.currentDay >= todayDay) {
          this._setDay(todayDay);
        }
      }
    }

    // && this.currentMonth >= todayMonth) {
    // if(this.currentMonth > todayMonth) {
    //   this._month.el.childNodes.forEach(el => {
    //     if (el.value > this.currentMonth) {
    //       el.disabled = true;
    //     }
    //   })
    // }
  }

  /**
   * date change event handler, called if one of the fields is updated
   * @param  {Event} e The event
   * @return {void}
   */
  _dateChanged = (evt) => {
    if (evt) {
      if (evt.target === this._year.el) {
        this._yearChanged(evt.target.value);
      } else if (evt.target === this._month.el) {
        this._monthChanged(evt.target.value);
      } else if (evt.target === this._day.el) {
        this._dayChanged(evt.target.value);
      }
    }

    if (this.settings.noFutureDate) {
      this._nofuturDate();
    }

    if (!this._prevent) {
      this._triggerEvent(allowedEvents[0]);
    }
  };

  _dayChanged(day) {
    // console.log('_dayChanged:', day);
    this.currentDay = day;
  }

  _monthChanged(month) {
    // console.log('_monthChanged:', month);
    this.currentMonth = month;
    this._updateDays(month);
  }

  _yearChanged(year) {
    // console.log('_yearChanged:', year);
    this.currentYear = year;
    this._monthDayMapping[1] = isLeapYear(year) ? 29 : 28;

    // if feb
    let month = this._month.el.value;
    if (2 === +month) {
      this._updateDays(month);
      if (this._day.el.value >= 29) {
        this._dayChanged(this._day.el.value);
      }
    }
  }

  /**
   * The init method
   * @param  { Object } s Settings Object
   * @return { void }
   */
  init() {
    this._monthDayMapping = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // todo: find or create(!)
    this._year = {
      el: this.element.querySelector('[' + dataName + '-year]'),
      df: document.createDocumentFragment(),
      name: 'year',
    };
    this._month = {
      el: this.element.querySelector('[' + dataName + '-month]'),
      df: document.createDocumentFragment(),
      name: 'month',
    };
    this._day = {
      el: this.element.querySelector('[' + dataName + '-day]'),
      df: document.createDocumentFragment(),
      name: 'day',
    };

    this._date = [this._year, this._month, this._day];

    //calculate the year to add to the select options.
    this._yearBegin = todayYear - this.settings.minAge;
    this._yearEnd = todayYear - this.settings.maxAge;
    if (
      this.settings.maxYear != todayYear &&
      this.settings.maxYear > todayYear
    ) {
      this._yearBegin = this.settings.maxYear;
      this._yearEnd = this._yearEnd + (this.settings.maxYear - todayYear);
    }

    // todo: able to get a real date string
    if (this.settings.defaultDate) {
      if ('today' === this.settings.defaultDate) {
        this.settings.defaultDate = {
          year: todayYear,
          month: todayMonth,
          day: todayDay,
        };
      } else {
        // todo: check for correctness
        let split = this.settings.defaultDate.split('-');
        this.settings.defaultDate = {
          year: split[0],
          month: split[1],
          day: split[2],
        };
      }
    }

    this._year.el.addEventListener('change', this._dateChanged);
    this._month.el.addEventListener('change', this._dateChanged);
    this._day.el.addEventListener('change', this._dateChanged);

    this.settings.locale;
    BirthdayPicker.createLocale(this.settings.locale);
    this.monthFormat = BirthdayPicker.i18n[this.settings.locale].month;

    // store all disabled elements in an array for quicker reenable
    this.disabledReference = [];

    this.eventFired = {};

    this._createBirthdayPicker();
  }
}

const dataapi = (element) => {
  if (!element) {
    return !1;
  }

  element =
    'string' === typeof element ? document.querySelectorAll(element) : element;

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

  // return 1 === len ? instances[0] : instances[1];
  // return 1 === instances.length ? instances[0] : instances;
};

BirthdayPicker.i18n = {};
BirthdayPicker.defaultLocale = 'en';

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

  return lang;
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
  BirthdayPicker.createLocale(lang);
  BirthdayPicker.defaultLocale = lang;
  instances.forEach((bp) => {
    bp.setLanguage(lang);
  });
};

BirthdayPicker.getInstance = (el) => dataStorage.get(el, 'instance');

BirthdayPicker.defaults = {
  maxAge: 100, // maximal age for a person
  minAge: 0, // minimal age for a person
  maxYear: todayYear,
  monthFormat: 'short',
  placeholder: true,
  defaultDate: null, // null || 'today'
  autoinit: true,
  useLeadingZero: true,
  locale: 'de',
  noFutureDate: true, // max date is current date
};

let init = () => {
  if (initialized) {
    return false;
  }
  initialized = true;
  BirthdayPicker.createLocale(BirthdayPicker.defaultLocale);
  dataapi('[' + dataName + ']');
};

docReady(init);

export default BirthdayPicker;
