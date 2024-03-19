/**
 * @jest-environment jsdom
 */

/* global beforeEach, afterEach, jest, describe, test, expect */

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

  <div id="test4" data-birthdaypicker></div>
  <div id="test5" data-birthdaypicker></div>
  <div id="obj-test" data-birthdaypicker="{'locale':'fr'}"></div>
`;

afterEach(() => {
  jest.clearAllMocks();
  // only for spyOn mocked Equivalent to .mockRestore()
  // jest.restoreAllMocks();
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
  test('generate "ru" locales should create an', () => {
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
    // element set to initialized
    let initValue = 'bdpInit';
    expect(Boolean(elementExists.dataset[initValue])).toBe(true);
  });

  const bp3 = new BirthdayPicker(elementExists);
  test('element already initialized', () => {
    expect(bp3).toBeTruthy();
    expect(bp3).toEqual(bp2);
    expect(bp3.currentYear).toBe(2012);
  });

  const noChildElements = document.getElementById('test2');
  const bp4 = new BirthdayPicker(noChildElements);
  test('element has no select-child elements', () => {
    expect(bp4).toBeTruthy();
  });

  test('it should return true if init is called again, ', () => {
    const div = document.createElement('div');
    const bp = new BirthdayPicker(div);

    expect(bp.init()).toBe(true);
  });
});

describe('data api test', () => {
  test('should be called', () => {
    // todo
    window.docReady = () => {};
    jest.mock('../src/index.js');
    const initSpy = jest.spyOn(BirthdayPicker, 'init');
    expect(initSpy).toHaveBeenCalledTimes(0);

    BirthdayPicker.init();
    expect(initSpy).toHaveBeenCalledTimes(1);
  });

  describe('dom element with object data', () => {
    test('should be correctly initialized', () => {
      const el = '#obj-test';
      const bp = new BirthdayPicker(el);
      expect(bp.settings.locale).toBe('fr');
    });
  });

});

describe('BirthdayPicker kill', () => {
  const testEl = document.createElement('div');
  const bp = new BirthdayPicker(testEl);

  const cbInit = jest.fn();
  const cbDatechange = jest.fn();

  bp.addEventListener('datechange', cbDatechange);

  describe('first test if event listeners are working', () => {
    test('init callbacks should be called', () => {
      bp.addEventListener('init', cbInit);
      expect(cbInit).toHaveBeenCalled();
      expect(cbInit).toHaveBeenCalledTimes(1);
    });
    test('datechange callbacks should be called after setting date', () => {
      expect(cbDatechange).not.toHaveBeenCalled();
      bp.setDate('2000-10-10');
      bp.setDate(new Date());
      expect(cbDatechange).toHaveBeenCalledTimes(2);
    });
  });

  describe('now call kill method', () => {
    test('evt callbacks should not work', () => {
      // now kill (removes the eventlistener too)
      bp.kill();
      bp.setDate(new Date());
      expect(cbDatechange).not.toHaveBeenCalled();
    });
  });
});

describe('BirthdayPicker events', () => {
  const testEl = document.getElementById('test');
  const testEl2 = document.getElementById('test2');
  BirthdayPicker.kill(testEl);
  const bp = new BirthdayPicker(testEl);

  describe('init events', () => {
    test('should be called times', () => {
      const bp = new BirthdayPicker(document.createElement('div'));
      const cb = jest.fn();
      bp.addEventListener('init', cb);
      bp.addEventListener('init', cb);
      expect(cb).toHaveBeenCalledTimes(2);
    });

    test('should be called with "init"', () => {
      const cb = jest.fn();
      const tmp = bp.addEventListener;
      bp.addEventListener = jest
        .fn()
        .mockImplementationOnce((event, callback) => {
          callback();
        });
      bp.addEventListener('init', cb);
      expect(bp.addEventListener).toBeCalledWith('init', expect.any(Function));
      expect(cb).toHaveBeenCalledTimes(1);
      // restore
      bp.addEventListener = tmp;
    });
  });

  const options = { defaultDate: '2020-06-10' };
  const dates = {
    day: '2020-06-12',
    month: '2020-08-10',
    year: '2019-06-10',
  };
  const cb = jest.fn();
  ['day', 'month', 'year'].forEach((name) => {
    describe(name + 'change events after init', () => {
      describe('default date set', () => {
        test('should be called times', () => {
          const bp = new BirthdayPicker(document.createElement('div'), options);
          bp.addEventListener(name + 'change', cb);
          expect(cb).toHaveBeenCalledTimes(1);
        });
      });
      describe('default date set (event set to element)', () => {
        test('should be called times', () => {
          const el = document.createElement('div');
          el.addEventListener(name + 'change', cb);
          new BirthdayPicker(el, options);
          expect(cb).toHaveBeenCalledTimes(1);
        });
      });
      describe('default date NOT set', () => {
        test('should not be called', () => {
          const bp = new BirthdayPicker(document.createElement('div'));
          bp.addEventListener(name + 'change', cb);
          expect(cb).not.toHaveBeenCalled();
        });
      });
    });
    describe(name + 'change events after using setDate()', () => {
      describe('defaultDate set, update via setDate()', () => {
        test('should be called times', () => {
          const bp = new BirthdayPicker(document.createElement('div'), options);
          bp.addEventListener(name + 'change', cb);
          bp.setDate(dates[name]);
          expect(cb).toHaveBeenCalledTimes(2);
        });
      });
    });
  });

  describe('datechange events', () => {
    test('should be called with', () => {
      const cb = jest.fn();
      const tmp = bp.addEventListener;
      bp.addEventListener = jest
        .fn()
        .mockImplementationOnce((event, callback) => {
          callback();
        });
      bp.addEventListener('datechange', cb);
      expect(bp.addEventListener).toBeCalledWith(
        'datechange',
        expect.any(Function)
      );
      expect(cb).toHaveBeenCalledTimes(1);

      // restore
      bp.addEventListener = tmp;
    });
  });

  describe('addEventListener (to element)', () => {
    describe('before instance is created', () => {
      test('should fired after init, default date is set', () => {
        const cb = jest.fn();
        BirthdayPicker.kill(testEl2);

        testEl2.addEventListener('datechange', cb);
        new BirthdayPicker(testEl2, {
          defaultDate: '2012-12-12',
        });
        expect(cb).toHaveBeenCalledTimes(1);
      });

      test('should not fire after init, no default date set', () => {
        const cb = jest.fn();
        BirthdayPicker.kill(testEl2);

        // listener on element
        testEl2.addEventListener('datechange', cb);
        const bp = new BirthdayPicker(testEl2);
        // listener on instance
        bp.addEventListener('datechange', cb);
        expect(cb).toHaveBeenCalledTimes(0);
      });
    });

    describe('after instance is created', () => {
      test('should not fire after init, as event listener was set after', () => {
        const cb = jest.fn();
        BirthdayPicker.kill(testEl2);
        new BirthdayPicker(testEl2, {
          defaultDate: '2012-12-12',
        });
        testEl2.addEventListener('datechange', cb);
        expect(cb).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('addEventListener (to instance)', () => {
    test('should register event on defined element', () => {
      const listener = jest.spyOn(testEl, 'addEventListener');
      const cb = jest.fn();
      bp.addEventListener('datechange', cb);
      expect(listener).toHaveBeenCalledTimes(1);
      listener.mockRestore();
    });

    test('datechange should not fired on init, as no default date is set)', () => {
      const cb = jest.fn();
      bp.addEventListener('datechange', cb);
      expect(cb).toHaveBeenCalledTimes(0);
    });

    test('addEventListener should not register to element, if wrong event name given', () => {
      const cb = jest.fn();
      const wrong = bp.addEventListener('wrong', cb);
      expect(wrong).toBe(false);
      expect(cb).toHaveBeenCalledTimes(0);
    });
  });

  describe('removeEventListener (to instance)', () => {
    test('datechange should not be called after removing the event listener', () => {
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
      // no changes here!
      expect(cb).toHaveBeenCalledTimes(2);
    });
  });

  describe('removeEventListener (to element)', () => {
    test('datechange should not be called after removing the event listener', () => {
      const testEl = document.createElement('div');
      const cb = jest.fn();

      testEl.addEventListener('datechange', cb);
      const bp2 = new BirthdayPicker(testEl, {
        defaultDate: '2000-10-10',
      });

      expect(cb).toHaveBeenCalledTimes(1);
      bp2.setDate('2000-10-11');
      expect(cb).toHaveBeenCalledTimes(2);

      testEl.removeEventListener('datechange', cb);
      bp2.setDate('2000-10-11');
      // no changes here!
      expect(cb).toHaveBeenCalledTimes(2);
    });
  });

  describe('addEventListener && removeEventListener', () => {
    describe('add set to element, remove set to instance', () => {
      test('should work', () => {
        const testEl = document.createElement('div');
        const cb = jest.fn();
        testEl.addEventListener('datechange', cb);

        const bp2 = new BirthdayPicker(testEl, {
          defaultDate: '2000-10-10',
        });

        expect(cb).toHaveBeenCalledTimes(1);
        bp2.setDate('2000-10-11');
        expect(cb).toHaveBeenCalledTimes(2);

        bp2.removeEventListener('datechange', cb);
        bp2.setDate('2000-10-11');
        // no changes here!
        expect(cb).toHaveBeenCalledTimes(2);
      });
    });
    describe('add set to instance, remove set to element', () => {
      test('should work', () => {
        const testEl = document.createElement('div');
        const cb = jest.fn();
        const bp2 = new BirthdayPicker(testEl, {
          defaultDate: '2000-10-10',
        });

        bp2.addEventListener('datechange', cb);
        expect(cb).toHaveBeenCalledTimes(1);
        bp2.setDate('2000-10-11');
        expect(cb).toHaveBeenCalledTimes(2);

        testEl.removeEventListener('datechange', cb);
        bp2.setDate('2000-10-11');
        // no changes here!
        expect(cb).toHaveBeenCalledTimes(2);
      });
    });
  });
});

describe('date setting tests', () => {
  const bpEl = document.createElement('div');
  BirthdayPicker.kill(bpEl);
  const defaultDate = '1980-06-06';
  const newDate = '1990-12-30';
  let bp = new BirthdayPicker(bpEl, { defaultDate });
  let date1, date2;

  describe('set date via setDate()', () => {
    test('should work correctly', () => {
      bp.setDate(newDate);
      date1 = bp.getDateString('yyyy-mm-dd');
      expect(date1).toEqual(newDate);
    });

    test('new date out of date range should return ""', () => {
      bp.setDate('1823-10-12');
      const result = bp.getDateString('yyyy-mm-dd');
      expect(result).toEqual('');
    });

    test('new date out of date range should return ""', () => {
      bp.setDate('2075-05-06');
      const result = bp.getDateString('yyyy-mm-dd');
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = ('0' + (today.getMonth() + 1)).slice(-2);
      const todayDay = ('0' + today.getDate()).slice(-2);
      const todayString = `${todayYear}-${todayMonth}-${todayDay}`;
      expect(result).toEqual(todayString);
    });
  });

  describe('set date via select boxes', () => {
    test('should work correctly', () => {
      // reset
      bp.setDate(defaultDate);
      const mapping = ['_year', '_month', '_day'];

      newDate.split('-').forEach((val, ind) => {
        let el = bp[mapping[ind]].el;
        const [idx] = bp._getIdx(el.childNodes, val);
        el.selectedIndex = idx;
        el.dispatchEvent(new Event('change'));
      });
      date2 = bp.getDateString('yyyy-mm-dd');

      expect(date1).toEqual(date2);
    });
  });
});

// test for _dayChanged
describe('setDate tests', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl);
  let yearChangedSpy;
  let monthChangedSpy;
  let dayChangedSpy;
  let dateChangedSpy;

  beforeEach(() => {
    //int date
    bp.setDate('2000-12-31');

    yearChangedSpy = jest.spyOn(bp, '_yearWasChanged');
    monthChangedSpy = jest.spyOn(bp, '_monthWasChanged');
    dayChangedSpy = jest.spyOn(bp, '_dayWasChanged');
    dateChangedSpy = jest.spyOn(bp, '_dateChanged');
  });

  afterEach(() => {
    yearChangedSpy.mockRestore();
    monthChangedSpy.mockRestore();
    dayChangedSpy.mockRestore();
    dateChangedSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('change month via setDate()', () => {
    test('should triggered a day change', () => {
      bp.setDate('2000-2-31');

      // if set to an undefined day, eg. 2000-2-31
      // it should update to the next correct day -> feb 2000 has only 29 day
      // so there is no 31 -> 2 days forward results in -> 2. Mar. 2000
      expect(bp.getDateString('yyyy-m-d')).toEqual('2000-3-2');
      expect(bp.currentYear).toBe(2000);
      expect(bp.currentMonth).toBe(3);
      expect(bp.currentDay).toBe(2);

      // should only fire 1 time, as dec and mar have 31 days!
      expect(dayChangedSpy).toHaveBeenCalledTimes(1);

      dayChangedSpy.mockRestore();
    });
  });

  describe('change all values (year month day) via setDate()', () => {
    test('should call the associated changed methods', () => {
      bp.setDate('1999-1-15');
      expect(yearChangedSpy).toHaveBeenCalledTimes(1);
      expect(monthChangedSpy).toHaveBeenCalledTimes(1);
      expect(dayChangedSpy).toHaveBeenCalledTimes(1);
    });

    test('should call dayChangedSpy twice, as month has les days', () => {
      bp.setDate('1999-2-15');
      expect(yearChangedSpy).toHaveBeenCalledTimes(1);
      expect(monthChangedSpy).toHaveBeenCalledTimes(1);
      expect(dayChangedSpy).toHaveBeenCalledTimes(2); // <--- twice
    });
  });

  describe('change from leap year to a normal year', () => {
    test('should not trigger day change', () => {
      // leap year
      bp.setDate('1996-2-14');
      // none leap year
      bp.setDate('1997-2-14');
      expect(yearChangedSpy).toHaveBeenCalledTimes(2);
      expect(monthChangedSpy).toHaveBeenCalledTimes(1);
      expect(dayChangedSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('change form a leap year day', () => {
    beforeEach(() => {
      bp.setDate('2004-2-29');
      jest.clearAllMocks();
    });
    test('should trigger year, month, day changes, by only changing the year', () => {
      // only change year(!)
      bp.setDate('2005-2-29'); // should be 2005-3-1
      expect(yearChangedSpy).toHaveBeenCalledTimes(1);
      expect(monthChangedSpy).toHaveBeenCalledTimes(1);
      expect(dayChangedSpy).toHaveBeenCalledTimes(1);
      expect(bp.getDateString('yyyy-mm-dd')).toBe('2005-03-01');
    });
  });

  describe('only day changed', () => {
    test('should only call day and date changed', () => {
      bp.setDate('2000-12-20'); // day changed
      expect(yearChangedSpy).toHaveBeenCalledTimes(0);
      expect(monthChangedSpy).toHaveBeenCalledTimes(0);
      expect(dayChangedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('only month changed', () => {
    test('should call only month and date changed', () => {
      bp.setDate('2000-10-31'); // month changed
      expect(yearChangedSpy).toHaveBeenCalledTimes(0);
      expect(monthChangedSpy).toHaveBeenCalledTimes(1);
      expect(dayChangedSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('only year changed', () => {
    test('should call only year and date changed', () => {
      bp.setDate('2020-12-31'); // year changed
      expect(yearChangedSpy).toHaveBeenCalledTimes(1);
      expect(monthChangedSpy).toHaveBeenCalledTimes(0);
      expect(dayChangedSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('all values change', () => {
    test('should trigger all changes', () => {
      bp.setDate('1999-1-15'); // year, month and day changed
      expect(yearChangedSpy).toHaveBeenCalledTimes(1);
      expect(monthChangedSpy).toHaveBeenCalledTimes(1);
      expect(dayChangedSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('no values change', () => {
    test('nothing should be triggered', () => {
      bp.setDate('2000-12-31'); // no change!!
      expect(yearChangedSpy).not.toHaveBeenCalled();
      expect(monthChangedSpy).not.toHaveBeenCalled();
      expect(dayChangedSpy).not.toHaveBeenCalled();
    });
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

  test('_parseDate (YYYY/MM/DD format)', () => {
    let a;
    a = bp._parseDate('2000/12/31');
    expect(a).toStrictEqual({ year: 2000, month: 12, day: 31 });
    a = bp._parseDate('1970/1/1');
    expect(a).toStrictEqual({ year: 1970, month: 1, day: 1 });
    a = bp._parseDate('2022/11/21');
    expect(a).toStrictEqual({ year: 2022, month: 11, day: 21 });
    a = bp._parseDate('2011/11/11');
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

describe('test the settings', () => {
  test('minYear, should be 2004', () => {
    const options = {
      minYear: 2004,
    };
    const el = document.createElement('div');
    const bp = new BirthdayPicker(el, options);
    expect(bp._yearEnd).toBe(options.minYear);
  });

  test('maxYear, should be 2018', () => {
    const options = {
      maxYear: 2018,
    };
    const el = document.createElement('div');
    const bp = new BirthdayPicker(el, options);
    expect(bp._yearStart).toBe(options.maxYear);
  });

  test('maxYear, should be 2008', () => {
    const options = {
      maxYear: 2018,
      minAge: 10,
    };
    const el = document.createElement('div');
    const bp = new BirthdayPicker(el, options);
    expect(bp._yearStart).toBe(2008);
  });

  test('maxYear, should be 2008', () => {
    const options = {
      minYear: 1960,
      maxYear: 2020,
      minAge: 10,
      maxAge: 20,
    };
    const el = document.createElement('div');
    const bp = new BirthdayPicker(el, options);
    expect(bp._yearStart).toBe(2010);
    expect(bp._yearEnd).toBe(1960);
  });
});

describe('test the setLanguage function', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    locale: 'en',
    leadingZero: false,
  });

  test('setting lang should work', () => {
    const langChangeSpy = jest.spyOn(BirthdayPicker, 'createLocale');
    bp.setLanguage('de');
    expect(langChangeSpy).toHaveBeenCalled();
    expect(bp.settings.locale).toBe('de');

    bp.setLanguage('ru');
    bp.setMonthFormat('short');
    bp.useLeadingZero(true);

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

  test('lang code should not be null / undefined', () => {
    expect(bp.setLanguage(null)).toBe(false);
    expect(bp.setLanguage(undefined)).toBe(false);
    expect(bp.setLanguage()).toBe(false);
    expect(bp.setLanguage('')).toBe(false);
  });

  test('test setLanguage trigger a dateChange event', () => {
    // init setup
    bp.setLanguage('fr');
    bp.setMonthFormat('short');
    const _triggerEventSpy = jest.spyOn(bp, '_triggerEvent');
    bp.setLanguage('ru');
    expect(_triggerEventSpy).toHaveBeenCalledTimes(1);
  });
});


describe('test the getDateString function', () => {
  const bpEl = document.createElement('div');
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    locale: 'en',
    leadingZero: false,
  });

  test('getDateString() with value, current-date not set yet!', () => {
    let date = bp.getDateString('YYYY.MM.DD');
    expect(date).toBe('');
  });

  test('getDateString() with value, date is set!', () => {
    bp.setDate('2019-04-17');
    expect(bp.getDateString('d. m. yyyy')).toBe('17. 4. 2019');
    expect(bp.getDateString('mm / dd / yyyy')).toBe('04 / 17 / 2019');
    expect(bp.getDateString('d.m.yy')).toBe('17.4.19');
    expect(bp.getDateString('d.m. yy')).toBe('17.4. 19');
  });

  test('getDateString() test formatting string', () => {
    bp.setDate('1994-11-02');
    expect(bp.getDateString()).toBe('11/2/1994');
    expect(bp.getDateString('')).toBe('11/2/1994');
    expect(bp.getDateString('yyyy')).toBe('1994');
    expect(bp.getDateString('yy')).toBe('94');
    expect(bp.getDateString('mm')).toBe('11');
    expect(bp.getDateString('m')).toBe('11');
    expect(bp.getDateString('dd')).toBe('02');
    expect(bp.getDateString('d')).toBe('2');
  });
});

describe('test the getDate function', () => {
  const bpEl = document.createElement('div');
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    locale: 'en',
    leadingZero: false,
  });

  test('getDate() without value, current-date not set yet!', () => {
    let date = bp.getDate();
    expect(date).toBe('');
  });

  test('getDate() without value, date is set!', () => {
    bp.setDate('2020-2-2');
    const date = bp.getDate();
    const locale = 'en';
    const dateString1 = date.toLocaleDateString(locale);
    const dateString2 = bp.getDateString();
    // 2/2/2020 is the default english formatting (en)
    expect(dateString1).toBe('2/2/2020');
    expect(dateString2).toBe('2/2/2020');
  });
});

describe('public methods tests', () => {
  const bpEl = document.createElement('div');
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    locale: 'en',
    leadingZero: false,
  });

  test('useLeadingZero set to true and false', () => {
    expect(bp.settings.leadingZero).toBe(false);
    bp.useLeadingZero(true);
    expect(bp.settings.leadingZero).toBe(true);
    bp.useLeadingZero(false);
    expect(bp.settings.leadingZero).toBe(false);
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
    leadingZero: false,
  });

  test('_getIdx - nodeList not set', () => {
    // value not found
    expect(bp._getIdx()).toEqual([undefined, undefined]);
    expect(bp._getIdx('fakeNodeList')).toEqual([
      undefined,
      undefined,
    ]);
    expect(bp._getIdx(null)).toEqual([undefined, undefined]);
    expect(bp._getIdx(undefined)).toEqual([undefined, undefined]);
  });

  test('_getIdx - nodeList set, no value', () => {
    // value not found
    const monthNodeList = bp._month.el.childNodes;
    expect(bp._getIdx(monthNodeList)).toEqual([
      undefined,
      undefined,
    ]);
  });

  test('_getIdx - nodeList set, value not found', () => {
    // value not found
    const monthNodeList = bp._month.el.childNodes;
    expect(bp._getIdx(monthNodeList, 12)).toEqual([12, 12]);
  });

  test('test _getMonthText', () => {
    expect(bp._getMonthText(1)).toBe('1');
    bp.useLeadingZero(true);
    expect(bp._getMonthText(4)).toBe('04');
    expect(bp._getMonthText(12)).toBe('12');
    bp.useLeadingZero(false);
    expect(bp._getMonthText(12)).toBe('12');
    bp.useLeadingZero(true);
    expect(bp._getMonthText(12)).toBe('12');
  });
});

describe('_noFutureDate methods tests', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl, {
    defaultDate: '2010-02-20',
    maxYear: 2030,
  });

  // const orig = bp._noFutureDate;
  describe('try to set to a future day', () => {
    test('should result in the current date', () => {
      const _noFutureDateSpy = jest.spyOn(bp, '_noFutureDate');
      bp.setDate('2044-11-15');
      expect(_noFutureDateSpy).toHaveBeenCalled();
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth() + 1;
      const todayDay = today.getDate();
      const todayString = `${todayYear}-${todayMonth}-${todayDay}`;
      expect(bp.getDateString('yyyy-m-d')).toEqual(todayString);

      _noFutureDateSpy.mockRestore();
    });
  });

  describe('try to set to a future day', () => {
    let year;
    let month;
    let day;

    let _noFutureDateSpy;
    let _setYearSpy;
    let _setMonthSpy;
    let _setDaySpy;

    beforeEach(() => {
      year = 2020;
      month = 10;
      day = 13;

      bp.setDate(year + '-' + month + '-' + day);

      _noFutureDateSpy = jest.spyOn(bp, '_noFutureDate');
      _setYearSpy = jest.spyOn(bp, '_setYear');
      _setMonthSpy = jest.spyOn(bp, '_setMonth');
      _setDaySpy = jest.spyOn(bp, '_setDay');
    });

    afterEach(() => {
      _noFutureDateSpy.mockRestore();
      _setYearSpy.mockRestore();
      _setMonthSpy.mockRestore();
      _setDaySpy.mockRestore();
    });

    describe('change only the max day value down', () => {
      test('only _setDay should be called', () => {
        expect(bp.getDateString('yyyy-mm-dd')).toBe('2020-10-13');
        day = 12;
        bp._noFutureDate(year, month, day);
        expect(_noFutureDateSpy).lastCalledWith(year, month, day);
        expect(_setYearSpy).toHaveBeenCalledTimes(0);
        expect(_setMonthSpy).toHaveBeenCalledTimes(0);
        expect(_setDaySpy).toHaveBeenCalledTimes(1);
        expect(bp.getDateString('yyyy-m-d')).toEqual(year + '-' + month + '-' + day);
      });
    });

    describe('change only the max month value down', () => {
      test('only _setMonth should be called', () => {
        month = 9;
        bp._noFutureDate(year, month, day);
        expect(_noFutureDateSpy).lastCalledWith(year, month, day);
        expect(_setYearSpy).toHaveBeenCalledTimes(0);
        expect(_setMonthSpy).toHaveBeenCalledTimes(1);
        expect(_setDaySpy).toHaveBeenCalledTimes(0);
        expect(bp.getDateString('yyyy-m-d')).toEqual(year + '-' + month + '-' + day);
      });
    });

    describe('change only the year value', () => {
      test('only _setYear should be called', () => {
        year = 2019;
        bp._noFutureDate(year, month, day);
        expect(_noFutureDateSpy).lastCalledWith(year, month, day);
        expect(_setYearSpy).toHaveBeenCalledTimes(1);
        expect(_setMonthSpy).toHaveBeenCalledTimes(0);
        expect(_setDaySpy).toHaveBeenCalledTimes(0);
        expect(bp.getDateString('yyyy-m-d')).toEqual(year + '-' + month + '-' + day);
      });
    });

    describe('change all values', () => {
      // change all
      test('all setter should be called', () => {
        year = 2016;
        month = 8;
        day = 11;
        bp._noFutureDate(year, month, day);
        expect(_noFutureDateSpy).lastCalledWith(year, month, day);
        expect(_setYearSpy).toHaveBeenCalledTimes(1);
        expect(_setMonthSpy).toHaveBeenCalledTimes(1);
        expect(_setDaySpy).toHaveBeenCalledTimes(1);
        expect(bp.getDateString('yyyy-m-d')).toEqual(year + '-' + month + '-' + day);
      });
    });

    // change month and day
    describe('change max month and day values down', () => {
      test('_setMonth and _setDay should be called', () => {
        month = 7;
        day = 10;
        bp._noFutureDate(year, month, day);
        expect(_noFutureDateSpy).lastCalledWith(year, month, day);
        expect(_setYearSpy).toHaveBeenCalledTimes(0);
        expect(_setMonthSpy).toHaveBeenCalledTimes(1);
        expect(_setDaySpy).toHaveBeenCalledTimes(1);
        expect(bp.getDateString('yyyy-m-d')).toEqual(year + '-' + month + '-' + day);
      });
    });
  });
});

describe('_dateChanged methods tests', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  let bp = new BirthdayPicker(bpEl, {
    defaultDate: '2010-02-20',
  });

  test('_dateChanged should not be triggering by setDate', () => {
    const _dateChangedSpy = jest.spyOn(bp, '_dateChanged');

    bp.setDate('1234-5-6');
    bp.setDate('1982-2-6');
    bp.setDate('1912-10-26');

    expect(_dateChangedSpy).toHaveBeenCalledTimes(0);

    _dateChangedSpy.mockRestore();
  });

  test('test for _dateChanged triggering by select change', () => {
    const _dateChangedSpy = jest.spyOn(bp, '_dateChanged');

    bp._year.el.selectedIndex = 2;
    bp._year.el.dispatchEvent(new Event('change'));
    const y1 = bp.currentYear;

    bp._year.el.selectedIndex = 3;
    bp._year.el.dispatchEvent(new Event('change'));
    const y2 = bp.currentYear;

    expect(y1).not.toBe(y2);
    expect(_dateChangedSpy).toHaveBeenCalledTimes(2);

    _dateChangedSpy.mockRestore();
  });

  test('test the _dateChanged should be called if changed via select', () => {
    const _dateChangedSpy = jest.spyOn(bp, '_dateChanged');
    bp._year.el.selectedIndex = 21;
    bp._year.el.dispatchEvent(new Event('change'));
    expect(_dateChangedSpy).toHaveBeenCalled();
    _dateChangedSpy.mockRestore();
  });

  test('test the _dateChanged should NOT be called if changed via setDate', () => {
    const _dateChangedSpy = jest.spyOn(bp, '_dateChanged');
    bp.setDate('1980-12-22');
    expect(_dateChangedSpy).toHaveBeenCalledTimes(0);
    _dateChangedSpy.mockRestore();
  });

  test('_dateChanged should NOT be called if date is the same', () => {
    const _dateChangedSpy = jest.spyOn(bp, '_dateChanged');
    bp.setDate('1980-12-22');
    expect(_dateChangedSpy).not.toHaveBeenCalled();
    _dateChangedSpy.mockRestore();
  });
});

describe('_updateDays methods tests', () => {
  const bpEl = document.querySelector('#test');
  BirthdayPicker.kill(bpEl);
  const placeholder = true;
  let bp = new BirthdayPicker(bpEl, {
    defaultDate: '2010-02-20',
    placeholder,
  });

  test('test the _updateDays should called if value ist set via setDate', () => {
    const _setDateSpy = jest.spyOn(bp, '_setDate');
    const _setDaySpy = jest.spyOn(bp, '_setDay');
    const _updateDaysSpy = jest.spyOn(bp, '_updateDays');

    // change days
    bp.setDate('2010-2-10');
    expect(_setDateSpy).toHaveBeenCalledWith({ year: 2010, month: 2, day: 10 });
    expect(_setDaySpy).toHaveBeenCalledWith(10, false);
    expect(_updateDaysSpy).toHaveBeenCalledTimes(0);
    expect(bp.getDateString('yyyy-m-d')).toEqual('2010-2-10');

    // change month
    bp.setDate('2010-12-10');
    expect(_updateDaysSpy).toHaveBeenCalledTimes(1);

    // change year but month is the same (no change)
    bp.setDate('2012-12-10');
    expect(bp.isLeapYear(2012)).toBe(true);
    expect(_updateDaysSpy).toHaveBeenCalledTimes(1);

    // change month and year
    bp.setDate('2011-02-10');
    expect(bp.isLeapYear(2012)).toBe(true);
    expect(_updateDaysSpy).toHaveBeenCalledTimes(2);

    // just a year change ... check, we are on FEB
    // todo: only check if coming from a leap-year to a non leap-year or vice-versa
    bp.setDate('2013-02-10');
    expect(_updateDaysSpy).toHaveBeenCalledTimes(3);

    // change all
    bp.setDate('2021-01-15');
    expect(_updateDaysSpy).toHaveBeenCalledTimes(4);

    _setDateSpy.mockRestore();
    _setDaySpy.mockRestore();
    _updateDaysSpy.mockRestore();
  });

  test('_updateDays should NOT be called if day changes via select', () => {
    // init value
    bp.setDate('1999-05-12');

    const _updateDaysSpy = jest.spyOn(bp, '_updateDays');
    const _dayChangedSpy = jest.spyOn(bp, '_dayWasChanged');

    // change only the days
    bp._day.el.selectedIndex = 1;
    bp._day.el.dispatchEvent(new Event('change'));

    // no days update needed (same year and month)
    expect(_updateDaysSpy).not.toHaveBeenCalled();

    // but the _dayChangedSpy should bee called -> trigger event
    expect(_dayChangedSpy).toHaveBeenCalled();

    _updateDaysSpy.mockRestore();
    _dayChangedSpy.mockRestore();
  });

  test('_updateDays should be called if month changes via select', () => {
    // init value
    bp.setDate('1999-05-12');
    const _updateDaysSpy = jest.spyOn(bp, '_updateDays');

    // change month
    bp._month.el.selectedIndex = 1;
    bp._month.el.dispatchEvent(new Event('change'));

    expect(_updateDaysSpy).toHaveBeenCalledTimes(1);

    _updateDaysSpy.mockRestore();
  });

  test('_updateDays should be called if year changes to a leap-year and current month is Feb. via select', () => {
    // init value
    bp.setDate('1999-02-12');
    const leapYear = 2000;

    const _updateDaysSpy = jest.spyOn(bp, '_updateDays');

    expect(bp.isLeapYear(leapYear)).toBe(true);

    // change year
    const [idx] = bp._getIdx(bp._year.el.childNodes, leapYear);
    bp._year.el.selectedIndex = idx;
    bp._year.el.dispatchEvent(new Event('change'));

    expect(_updateDaysSpy).toHaveBeenCalledTimes(1);
    _updateDaysSpy.mockRestore();
  });

  test('_updateDays should be called if year changes to a non-leap-year via select', () => {
    // init value
    bp.setDate('1999-02-12');

    const _updateDaysSpy = jest.spyOn(bp, '_updateDays');
    const noLeapYear = 2001;

    expect(bp.isLeapYear(noLeapYear)).toBe(false);

    // change year
    const [idx] = bp._getIdx(bp._year.el.childNodes, noLeapYear);
    bp._year.el.selectedIndex = idx;
    bp._year.el.dispatchEvent(new Event('change'));

    expect(_updateDaysSpy).toHaveBeenCalledTimes(1);
    _updateDaysSpy.mockRestore();
  });

  test('_updateDays should not be called if only day changes via setDate', () => {
    // init
    const initDate = '1999-02-14';
    bp.setDate(initDate);

    const _updateDaysSpy = jest.spyOn(bp, '_updateDays');
    const _dayChangedSpy = jest.spyOn(bp, '_dayWasChanged');

    // only day changed
    bp.setDate('1999-02-16');
    expect(bp.getDateString('yyyy-mm')).toBe('1999-02');
    expect(_dayChangedSpy).toHaveBeenCalledTimes(1);

    // no need to update days
    expect(_updateDaysSpy).toHaveBeenCalledTimes(0);

    _updateDaysSpy.mockRestore();
    _dayChangedSpy.mockRestore();
  });

  test('_updateDays should add days if new month has more days', () => {
    const initDate = '1999-02-14';
    const _updateDaysSpy = jest.spyOn(bp, '_updateDays');
    const _setDaySpy = jest.spyOn(bp, '_setDay');

    bp.setDate(initDate);

    expect(_updateDaysSpy).toHaveBeenCalledTimes(0);
    expect(_setDaySpy).toHaveBeenCalledWith(14, false);

    // const numberChildNodesInDays = bp._day.el.childNodes.length - (placeholder ? 1 : 0);
    const numberOfDays = bp._daysPerMonth[1];

    const _dayChangedSpy = jest.spyOn(bp, '_dayWasChanged');
    const _monthChangedSpy = jest.spyOn(bp, '_monthWasChanged');

    // set to a month with more days
    bp.setDate('1999-06-14');

    const numberOfDaysNew = bp._daysPerMonth[11];
    // check length of option nodeList
    const numberChildNodesInDaysNew =
      bp._day.el.childNodes.length - (placeholder ? 1 : 0);

    const diff = Math.abs(numberOfDays - numberOfDaysNew);

    expect(numberChildNodesInDaysNew).toBe(30);

    // update method was called
    expect(numberOfDays).toBe(28);
    expect(numberOfDaysNew).toBe(31);
    expect(diff).toBe(3); // -> 3 items to add

    expect(_monthChangedSpy).toHaveBeenCalledTimes(1);
    expect(_dayChangedSpy).toHaveBeenCalledTimes(0);
    expect(_updateDaysSpy).toHaveBeenCalledTimes(1);

    _updateDaysSpy.mockRestore();
    _dayChangedSpy.mockRestore();
  });
});

describe('static function tests', () => {
  test('test the setMonthFormat function', () => {
    const options = {
      monthFormat: 'short',
    };
    const bp1 = new BirthdayPicker(document.createElement('div'), options);
    const bp2 = new BirthdayPicker(document.createElement('div'), options);

    expect(bp1.settings.monthFormat).toBe(options.monthFormat);
    expect(bp1.settings.monthFormat).toBe(bp2.settings.monthFormat);

    // change all to wrong value, nothing should chang
    BirthdayPicker.setMonthFormat('wrong');
    expect(bp1.settings.monthFormat).toBe(options.monthFormat);

    // change all formats to 'long'
    BirthdayPicker.setMonthFormat('long');
    expect(bp1.settings.monthFormat).toBe('long');
    expect(bp2.settings.monthFormat).toBe('long');
  });

  test('test the setLanguage function', () => {
    const options = {
      locale: 'en',
    };
    const bp1 = new BirthdayPicker(document.createElement('div'), options);
    const bp2 = new BirthdayPicker(document.createElement('div'), options);

    expect(bp1.settings.locale).toBe(options.locale);
    expect(bp1.settings.locale).toBe(bp2.settings.locale);

    // change all to wrong value, nothing should chang
    BirthdayPicker.setLanguage('wrong');
    expect(bp1.settings.locale).toBe(options.locale);

    // change all formate to 'long'
    BirthdayPicker.setLanguage('en');
    expect(bp1.settings.locale).toBe('en');
    expect(bp2.settings.locale).toBe('en');
  });
});
