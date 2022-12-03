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
      defaultDate: '2000-10-10'
    });
    const cb = jest.fn();
    bp2.addEventListener('datechange', cb);
    expect(cb).toHaveBeenCalledTimes(1);
    bp2.setDate(2000,10,11);
    expect(cb).toHaveBeenCalledTimes(2);
    bp2.removeEventListener('datechange', cb);
    bp2.setDate(2000,10,11);
    // no change here
    expect(cb).toHaveBeenCalledTimes(2);
  });

});

// test for _dayChanged
describe('update stage, test', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl);
  let dayChangedSpy = jest.spyOn(bp, '_dayChanged');
  let monthChangedSpy = jest.spyOn(bp, '_monthChanged');
  let yearChangedSpy = jest.spyOn(bp, '_yearChanged');

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('month change tiggered a day change', () => {
    bp.setDate(2000, 12, 31); // frist trigger
    // a month change should trigge a day change too,
    // if the current selected day is bigger than
    // the days of the month
    bp.setDate(2000, 2, 31); // second trigger
    expect(dayChangedSpy).toHaveBeenCalledTimes(2);
  });

  test('test day, month, year trigger', () => {
    bp.setDate(1999, 12, 15);
    expect(dayChangedSpy).toHaveBeenCalledTimes(1);
    expect(monthChangedSpy).toHaveBeenCalledTimes(1);
    expect(yearChangedSpy).toHaveBeenCalledTimes(1);
  });

  test('change from leap year, should trigger day change', () => {
    // leap year
    bp.setDate(2004, 2, 29);
    expect(dayChangedSpy).toHaveBeenCalledTimes(1);
    expect(monthChangedSpy).toHaveBeenCalledTimes(1);
    expect(yearChangedSpy).toHaveBeenCalledTimes(1);

    // only change year
    bp.setDate(2005, 2, 29);
    expect(yearChangedSpy).toHaveBeenCalledTimes(2);
    expect(monthChangedSpy).toHaveBeenCalledTimes(1);
    expect(dayChangedSpy).toHaveBeenCalledTimes(2);
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

  test('test setLanguage', () => {
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

  test('test isLeapYear', () => {
    expect(bp.isLeapYear()).toEqual(undefined);
    bp.setDate(2000,10,10);
    // test with no value given
    expect(bp.isLeapYear()).toEqual(true);
    // test with value given
    expect(bp.isLeapYear(2004)).toEqual(true);
    expect(bp.isLeapYear(2005)).toEqual(false);
  });

});

describe('private methods tests', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    useLeadingZero: false,
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
