/**
 * @jest-environment jsdom
 */

/* global afterEach, jest, describe, test, expect */

import BirthdayPicker from '../src/index.js';

// Set up our document body
document.body.innerHTML += `
  <div id="test">
    <select data-birthdaypicker-year></select>
    <select data-birthdaypicker-month></select>
    <select data-birthdaypicker-day></select>
  </div>

  <div id="test2"></div>
  <div id="test3"></div>
`;

describe('dom tests', () => {
  test('DOMContentLoaded test', async () => {
    let val = false;
    const test = () => {
      val = true;
    };
    try {
      await document.addEventListener('DOMContentLoaded', test, false);
      const inintialized =
        'complete' === document.readyState ||
        'interactive' === document.readyState;
      expect(val || inintialized).toBe(true);
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});

describe('BirthdayPicker Class tests', () => {
  test('BirthdayPicker is Object', () => {
    expect(BirthdayPicker).toBeTruthy();
    expect(typeof BirthdayPicker).toBe('function');
  });

  test('new BirthdayPicker() is Object', () => {
    const bp = new BirthdayPicker();
    expect(bp).toBeTruthy();
    expect(typeof bp).toBe('object');
  });

  test('BirthdayPicker.defaults -> is Object', () => {
    expect(BirthdayPicker.defaults).toBeTruthy();
    expect(typeof BirthdayPicker.defaults).toBe('object');
  });
});

describe('BirthdayPicker.createLocale()', () => {
  test('generate "ru" locales', () => {
    BirthdayPicker.createLocale('ru');
    expect(typeof BirthdayPicker.i18n.ru).toBe('object');
    expect(BirthdayPicker.i18n.ru.month.short[0]).toBe('янв.');
    expect(BirthdayPicker.i18n.ru.month.numeric.length).toBe(12);
  });
});

describe('BirthdayPicker init stage', () => {
  const elementNotExists = document.getElementById('wrongId');
  const bp1 = new BirthdayPicker(elementNotExists);
  test('element does not exist', () => {
    expect(bp1).toBeTruthy();
    expect(bp1).toEqual({ error: true });
    expect(bp1.error).toBe(true);
    // test with string
    expect(new BirthdayPicker('#wrongId')).toEqual({ error: true });
  });

  const elementExists = document.getElementById('test');
  const bp2 = new BirthdayPicker(elementExists, {
    defaultDate: '2012-10-13',
  });

  test('element exists', () => {
    // is object
    expect(bp2).toBeTruthy();
    // element set to inintialized
    let initValue = 'bdpinit';
    expect(Boolean(elementExists.dataset[initValue])).toBe(true);
  });

  const bp3 = new BirthdayPicker(elementExists);
  test('element allready initialized', () => {
    expect(bp3).toBeTruthy();
    expect(bp3).toEqual(bp2);
    expect(bp3.currentYear).toBe('2012');
  });

  const noChildElements = document.getElementById('test2');
  const bp4 = new BirthdayPicker(noChildElements);
  test('element has no select-child elements', () => {
    expect(bp4).toBeTruthy();
  });
});

describe('BirthdayPicker events', () => {
  const testEl = document.getElementById('test');
  const testEl2 = document.getElementById('test2');
  const bp = new BirthdayPicker(testEl);

  const eventCallback = {
    datechange() {},
    monthchange() {},
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('callback has been called with "datechange"', () => {
    const cb = jest.spyOn(eventCallback, 'datechange');
    let tmp = bp.addEventListener;
    bp.addEventListener = jest
      .fn()
      .mockImplementationOnce((event, callback) => {
        callback();
      });
    bp.addEventListener('datechange', eventCallback.datechange);
    expect(bp.addEventListener).toBeCalledWith(
      'datechange',
      // eventCallback.datechange
      expect.any(Function)
    );
    expect(cb).toHaveBeenCalledTimes(1);
    bp.addEventListener = tmp;
  });

  test('addEventListener defined on instance is registerd to DOM element', () => {
    const listener = jest.spyOn(testEl, 'addEventListener');
    bp.addEventListener('datechange', eventCallback.datechange);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('datechange eventlistener fired on init, listener set after instance is created', () => {
    const cb = jest.spyOn(eventCallback, 'datechange');
    const bp = new BirthdayPicker(testEl);
    bp.addEventListener('datechange', eventCallback.datechange);
    expect(cb).toHaveBeenCalledTimes(0);
  });

  test('datechange eventlistener fired on init, listener is set to DOM element befor instance is created', () => {
    const cb = jest.spyOn(eventCallback, 'datechange');
    BirthdayPicker.kill(testEl2);

    testEl2.addEventListener('datechange', eventCallback.datechange);
    new BirthdayPicker(testEl2, {
      defaultDate: '2012-12-12',
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test('no default date set, so listener should not bee called', () => {
    const cb = jest.spyOn(eventCallback, 'datechange');
    BirthdayPicker.kill(testEl2);

    // listener on element
    testEl2.addEventListener('datechange', eventCallback.datechange);
    const bp = new BirthdayPicker(testEl2);
    // listener on instance
    bp.addEventListener('datechange', eventCallback.datechange);

    expect(cb).toHaveBeenCalledTimes(0);
  });

  test('addEventListener not registerd to element, if wrong event name given', () => {
    const spy = jest.spyOn(testEl, 'addEventListener');
    const wrong = bp.addEventListener('wrong', () => {});
    expect(wrong).toBe(false);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('removeEventListener test', () => {
    BirthdayPicker.kill(testEl);
    const bp2 = new BirthdayPicker(testEl, {
      defaultDate: '2000-10-10',
    });
    const cb = jest.fn();
    bp2.addEventListener('datechange', cb);
    expect(cb).toHaveBeenCalledTimes(1);
    bp2.setDate('2000-10-11');
    expect(cb).toHaveBeenCalledTimes(2);
    bp2.removeEventListener('datechange', cb);
    bp2.setDate('2000-10-11');
    // no change here
    expect(cb).toHaveBeenCalledTimes(2);
  });
});

// test for _dayChanged
describe('update stage, test', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl);
  let yearChangedSpy = jest.spyOn(bp, '_yearChanged');
  let monthChangedSpy = jest.spyOn(bp, '_monthChanged');
  let dayChangedSpy = jest.spyOn(bp, '_dayChanged');
  let dateChangedSpy = jest.spyOn(bp, '_dateChanged');

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('month change tiggered a day change', () => {
    bp.setDate('2000-12-31'); // frist trigger
    // a month change should trigge a day change too,
    // if the current selected day is bigger than
    // the days of the month
    bp.setDate('2000-2-31'); // second trigger
    expect(dayChangedSpy).toHaveBeenCalledTimes(2);
  });

  test('test day, month, year trigger', () => {
    bp.setDate('1999-4-15');
    expect(yearChangedSpy).toHaveBeenCalledTimes(1);
    expect(monthChangedSpy).toHaveBeenCalledTimes(1);
    expect(dayChangedSpy).toHaveBeenCalledTimes(1);
  });

  test('change from leap year, should trigger day change', () => {
    // leap year
    bp.setDate('2004-2-29');
    expect(yearChangedSpy).toHaveBeenCalledTimes(1);
    expect(monthChangedSpy).toHaveBeenCalledTimes(1);
    expect(dayChangedSpy).toHaveBeenCalledTimes(1);
    expect(dateChangedSpy).toHaveBeenCalledTimes(1);

    bp.setDate('2004-2-20'); // day changed
    expect(yearChangedSpy).toHaveBeenCalledTimes(1);
    expect(monthChangedSpy).toHaveBeenCalledTimes(1);
    expect(dayChangedSpy).toHaveBeenCalledTimes(2);
    expect(dateChangedSpy).toHaveBeenCalledTimes(2);

    bp.setDate('2004-3-20'); // month changed
    expect(yearChangedSpy).toHaveBeenCalledTimes(1);
    expect(monthChangedSpy).toHaveBeenCalledTimes(2);
    expect(dayChangedSpy).toHaveBeenCalledTimes(2);
    expect(dateChangedSpy).toHaveBeenCalledTimes(3);

    bp.setDate('2012-3-20'); // year changed
    expect(yearChangedSpy).toHaveBeenCalledTimes(2);
    expect(monthChangedSpy).toHaveBeenCalledTimes(2);
    expect(dayChangedSpy).toHaveBeenCalledTimes(2);
    expect(dateChangedSpy).toHaveBeenCalledTimes(4);

    bp.setDate('2000-2-29'); // year, month and day changed
    expect(yearChangedSpy).toHaveBeenCalledTimes(3);
    expect(monthChangedSpy).toHaveBeenCalledTimes(3);
    expect(dayChangedSpy).toHaveBeenCalledTimes(3);
    expect(dateChangedSpy).toHaveBeenCalledTimes(5);

    // only change year
    bp.setDate('2005-2-29'); // --> 2005-3-1
    expect(yearChangedSpy).toHaveBeenCalledTimes(4);
    expect(monthChangedSpy).toHaveBeenCalledTimes(4);
    expect(dayChangedSpy).toHaveBeenCalledTimes(4);
    expect(bp.currentYear).toBe('2005');
    expect(bp.currentMonth).toBe('3');
    expect(bp.currentDay).toBe('1');
    expect(dateChangedSpy).toHaveBeenCalledTimes(6);

    bp.setDate('2005-3-1'); // no change!!
    expect(yearChangedSpy).toHaveBeenCalledTimes(4);
    expect(monthChangedSpy).toHaveBeenCalledTimes(4);
    expect(dayChangedSpy).toHaveBeenCalledTimes(4);
    expect(dateChangedSpy).toHaveBeenCalledTimes(7);
  });
});

describe('test the _parseDate function', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl);

  test('_parseDate (YYYY-MM-DD format)', () => {
    let a;
    a = bp._parseDate('2000-12-31');
    expect(a).toStrictEqual({ year: 2000, month: 12, day: 31 });
    a = bp._parseDate('1970-1-1');
    expect(a).toStrictEqual({ year: 1970, month: 1, day: 1 });
    a = bp._parseDate('2022-11-21');
    expect(a).toStrictEqual({ year: 2022, month: 11, day: 21 });
    a = bp._parseDate('2011-11-11');
    expect(a).toStrictEqual({ year: 2011, month: 11, day: 11 });
  });

  test('_parseDate (MM/DD/YYYY format)', () => {
    expect(bp._parseDate('11/20/2020')).toStrictEqual({
      year: 2020,
      month: 11,
      day: 20,
    });
    expect(bp._parseDate('11/2/2020')).toStrictEqual({
      year: 2020,
      month: 11,
      day: 2,
    });
    expect(bp._parseDate('11/2/2000')).toStrictEqual({
      year: 2000,
      month: 11,
      day: 2,
    });
    expect(bp._parseDate('1/1/1988')).toStrictEqual({
      year: 1988,
      month: 1,
      day: 1,
    });
    expect(bp._parseDate('1/1/1988')).toStrictEqual({
      year: 1988,
      month: 1,
      day: 1,
    });
    expect(bp._parseDate('12/25/3420')).toStrictEqual({
      year: 3420,
      month: 12,
      day: 25,
    });
    expect(bp._parseDate('0/0/2022')).toStrictEqual(false);
    expect(bp._parseDate('11/0/2022')).toStrictEqual(false);
    expect(bp._parseDate('0/10/2022')).toStrictEqual(false);
  });
});

describe('test the setLanguage function', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    locale: 'en',
    useLeadingZero: false,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('setting lang should work', () => {
    const langChangeSpy = jest.spyOn(BirthdayPicker, 'createLocale');
    bp.setLanguage('de');
    expect(langChangeSpy).toHaveBeenCalled();
    expect(bp.settings.locale).toBe('de');

    bp.setLanguage('ru');
    bp.setMonthFormat('short');
    bp.useLeadingZero = true;

    expect(langChangeSpy).toHaveBeenCalledTimes(2);
    expect(bp.settings.locale).toBe('ru');
  });

  test('set lang to current active lang should return false', () => {
    // init
    bp.setLanguage('de');
    expect(bp.setLanguage('de')).toBe(false);
  });

  test('lang code should contain 2 chars', () => {
    expect(bp.setLanguage('d')).toBe(false);
    expect(bp.setLanguage('eng')).toBe(false);
  });

  test('lang code should not be null, undefinde', () => {
    expect(bp.setLanguage(null)).toBe(false);
    expect(bp.setLanguage(undefined)).toBe(false);
    expect(bp.setLanguage()).toBe(false);
    expect(bp.setLanguage('')).toBe(false);
  });

  test('test setLanguage trigger a dateChange event', () => {
    // init setup
    bp.setLanguage('fr');
    bp.setMonthFormat('short');
    const _dateChangedSpy = jest.spyOn(bp, '_dateChanged');
    bp.setLanguage('ru');
    expect(_dateChangedSpy).toHaveBeenCalledTimes(1);
  });
});

describe('test the getDate function', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    locale: 'en',
    // defaultDate: '2020-02-02',
    useLeadingZero: false,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getDate() without value, current-date not set yet!', () => {
    let date = bp.getDate();
    expect(date).toBe('');
  });

  test('getDate() with value, current-date not set yet!', () => {
    let date = bp.getDate('YYYY.MM.DD');
    expect(date).toBe('');
  });

  test('getDate() without value, date is set!', () => {
    bp.setDate('2020-2-2');
    let date = bp.getDate();
    bp.setLanguage('en');
    // 2/2/2020 is the default english formating (en)
    expect(date).toBeTruthy();
    expect(date).toBe('2/2/2020');
  });

  test('getDate() with value, date is set!', () => {
    bp.setDate('2019-04-17');
    expect(bp.getDate('d. m. yyyy')).toBe('17. 4. 2019');
    expect(bp.getDate('mm / dd / yyyy')).toBe('04 / 17 / 2019');
    expect(bp.getDate('dmyy')).toBe('17419');
    expect(bp.getDate('d.m.\'yy')).toBe('17.4.\'19');
  });

});

describe('public methods tests', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    locale: 'en',
    useLeadingZero: false,
  });

  test('test isLeapYear', () => {
    expect(bp.isLeapYear()).toEqual(undefined);
    bp.setDate('2000-10-10');
    // test with no value given
    expect(bp.isLeapYear()).toEqual(true);
    // test with value given
    expect(bp.isLeapYear(2004)).toEqual(true);
    expect(bp.isLeapYear(2005)).toEqual(false);
  });

  test('test setMonthFormat with wrong (not allowed) value', () => {
    // ['short', 'long', 'numeric'];
    expect(bp.setMonthFormat('sdf')).toEqual(false);
    expect(bp.setMonthFormat(null)).toEqual(false);
    expect(bp.setMonthFormat()).toEqual(false);
    expect(bp.setMonthFormat(0)).toEqual(false);
    expect(bp.setMonthFormat(undefined)).toEqual(false);
  });

  test('test setMonthFormat', () => {
    // set start value first
    bp.setMonthFormat('numeric');
    ['short', 'long', 'numeric'].forEach((m) => {
      bp.setMonthFormat(m);
      expect(m).toEqual(bp.settings.monthFormat);
    });
  });
});

describe('private methods tests', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    useLeadingZero: false,
  });
  let dateChangedSpy = jest.spyOn(bp, '_dateChanged');

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('_getNodeIndexByValue - nodelist not set', () => {
    // value not found
    expect(bp._getNodeIndexByValue()).toEqual([undefined,undefined]);
    expect(bp._getNodeIndexByValue('fakenodelist')).toEqual([undefined,undefined]);
    expect(bp._getNodeIndexByValue(null)).toEqual([undefined,undefined]);
    expect(bp._getNodeIndexByValue(undefined)).toEqual([undefined,undefined]);
  });

  test('_getNodeIndexByValue - nodelist set, no value', () => {
    // value not found
    const monthNodeList = bp._month.el.childNodes;
    expect(bp._getNodeIndexByValue(monthNodeList)).toEqual([undefined,undefined]);
  });

  test('_getNodeIndexByValue - nodelist set, value not found', () => {
    // value not found
    const monthNodeList = bp._month.el.childNodes;
    expect(bp._getNodeIndexByValue(monthNodeList, 12)).toEqual([12, '12']);
  });

  test('test _getMonthText', () => {
    expect(bp._getMonthText(1)).toBe('1');
    bp.useLeadingZero = true;
    expect(bp._getMonthText(4)).toBe('04');
    expect(bp._getMonthText(12)).toBe('12');
    bp.useLeadingZero = false;
    expect(bp._getMonthText(12)).toBe('12');
    bp.useLeadingZero = true;
    expect(bp._getMonthText(12)).toBe('12');
  });

  test('test for _dateChanged triggering by setting date', () => {
    bp.setDate('1234-5-6');
    expect(dateChangedSpy).toHaveBeenCalled();
    expect(dateChangedSpy).toHaveBeenCalledTimes(1);
  });

  test('test for _dateChanged triggering by select change', () => {
    bp._year.el.selectedIndex = 2;
    bp._year.el.dispatchEvent(new Event('change'));

    const y1 = bp.currentYear;
    bp._year.el.selectedIndex = 3;
    bp._year.el.dispatchEvent(new Event('change'));

    const y2 = bp.currentYear;
    expect(y1).not.toBe(y2);
  });
});
