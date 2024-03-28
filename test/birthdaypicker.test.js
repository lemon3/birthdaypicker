import { beforeEach, afterEach, vi, describe, test, expect } from 'vitest';
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
  vi.clearAllMocks();
  // only for spyOn mocked Equivalent to .mockRestore()
  // vi.restoreAllMocks();
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

describe('BirthdayPicker init stage', () => {
  const elementNotExists = document.getElementById('wrongId');
  const bp1 = new BirthdayPicker(elementNotExists);
  test('element does not exist, should return error object', () => {
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
  test('element exists, should be correctly initialized', () => {
    // is object
    expect(bp2).toBeTruthy();
    // element set to initialized
    let initValue = 'bdpInit';
    expect(Boolean(elementExists.dataset[initValue])).toBe(true);
  });

  const bp3 = new BirthdayPicker(elementExists);
  test('element already initialized, should return instance', () => {
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
    window.docReady = () => {};
    const initSpy = vi.spyOn(BirthdayPicker, 'init');
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
  const cbInit = vi.fn();
  const cbDatechange = vi.fn();

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
      const cb = vi.fn();
      bp.addEventListener('init', cb);
      bp.addEventListener('init', cb);
      expect(cb).toHaveBeenCalledTimes(2);
    });

    test('should be called with "init"', () => {
      const cb = vi.fn();
      const tmp = bp.addEventListener;
      bp.addEventListener = vi
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
  const cb = vi.fn();

  // daychange, monthchange, yearchange
  describe.each([
    { val: 'day', event: 'daychange' },
    { val: 'month', event: 'monthchange' },
    { val: 'year', event: 'yearchange' },
  ])('$event events ', ({ val, event }) => {
    describe('after initialization', () => {
      test(`default date set, ${event} should be called`, () => {
        const bp = new BirthdayPicker(document.createElement('div'), options);
        bp.addEventListener(event, cb);
        expect(cb).toHaveBeenCalledTimes(1);
      });
      test(`default date set, (eventlistener on element), ${event} should be called`, () => {
        const el = document.createElement('div');
        el.addEventListener(event, cb);
        new BirthdayPicker(el, options);
        expect(cb).toHaveBeenCalledTimes(1);
      });
      test(`default date NOT set, ${event} should NOT be called`, () => {
        const bp = new BirthdayPicker(document.createElement('div'));
        bp.addEventListener(event, cb);
        expect(cb).not.toHaveBeenCalled();
      });
    });
    describe('after using setDate()', () => {
      test(`${event} should be called 2 times`, () => {
        const bp = new BirthdayPicker(document.createElement('div'), options);
        bp.addEventListener(event, cb);
        expect(cb).toHaveBeenCalledTimes(1);
        bp.setDate(dates[val]);
        expect(cb).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('datechange events', () => {
    test('should be called with', () => {
      const cb = vi.fn();
      const tmp = bp.addEventListener;
      bp.addEventListener = vi
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
        const cb = vi.fn();
        BirthdayPicker.kill(testEl2);

        testEl2.addEventListener('datechange', cb);
        new BirthdayPicker(testEl2, {
          defaultDate: '2012-12-12',
        });
        expect(cb).toHaveBeenCalledTimes(1);
      });

      test('should not fire after init, no default date set', () => {
        const cb = vi.fn();
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
        const cb = vi.fn();
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
      const listener = vi.spyOn(testEl, 'addEventListener');
      const cb = vi.fn();
      bp.addEventListener('datechange', cb);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    test('datechange should not fired on init, as no default date is set)', () => {
      const cb = vi.fn();
      bp.addEventListener('datechange', cb);
      expect(cb).toHaveBeenCalledTimes(0);
    });

    test('addEventListener should not register to element, if wrong event name given', () => {
      const cb = vi.fn();
      const wrong = bp.addEventListener('wrong', cb);
      expect(wrong).toBe(false);
      expect(cb).toHaveBeenCalledTimes(0);
    });
  });

  describe('removeEventListener (from instance)', () => {
    test('datechange should not be called after removing the event listener', () => {
      BirthdayPicker.kill(testEl);
      const bp2 = new BirthdayPicker(testEl, {
        defaultDate: '2000-10-10',
      });
      const cb = vi.fn();
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

  describe('removeEventListener (from element)', () => {
    test('datechange should not be called after removing the event listener', () => {
      const testEl = document.createElement('div');
      const cb = vi.fn();

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
    test('add to DOM element, remove from instance', () => {
      const cb = vi.fn();
      const testEl = document.createElement('div');
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
    test('add to instance, remove form DOM element', () => {
      const cb = vi.fn();
      const testEl = document.createElement('div');
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

describe('date setting tests', () => {
  const bpEl = document.createElement('div');
  BirthdayPicker.kill(bpEl);
  const defaultDate = '1980-06-06';
  const newDate = '1990-12-30';
  let bp = new BirthdayPicker(bpEl, { defaultDate });
  let date1;

  describe('set date via setDate()', () => {
    test('should work correctly', () => {
      bp.setDate(newDate);
      date1 = bp.getDateString('yyyy-mm-dd');
      expect(date1).toEqual(newDate);
    });

    test('new date out of date range should return ""', () => {
      const newDate = '1823-10-12';
      bp.setDate(newDate);
      const result = bp.getDateString('yyyy-mm-dd');
      const start = bp._yearFrom;
      expect(result).toBe(start + '-10-12');
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

      // set to new Date
      newDate.split('-').forEach((val, ind) => {
        const el = bp[mapping[ind]].el;
        const idx = bp._getIdx(el.childNodes, val);
        el.selectedIndex = idx;
        el.dispatchEvent(new Event('change'));
      });

      const date2 = bp.getDateString('yyyy-mm-dd');
      expect(newDate).toEqual(date2);
    });
  });

});

// test for _dayChanged
describe('setDate tests', () => {
  const bpEl = document.createElement('div');
  let bp = new BirthdayPicker(bpEl, {
    defaultDate: '2000-12-31',
  });
  let yearChangedSpy;
  let monthChangedSpy;
  let dayChangedSpy;
  let dateChangedSpy;

  beforeEach(() => {
    //int date
    bp.setDate('2000-12-31');
    yearChangedSpy = vi.spyOn(bp, '_yearWasChanged');
    monthChangedSpy = vi.spyOn(bp, '_monthWasChanged');
    dayChangedSpy = vi.spyOn(bp, '_dayWasChanged');
    dateChangedSpy = vi.spyOn(bp, '_dateChanged');
  });

  afterEach(() => {
    yearChangedSpy.mockRestore();
    monthChangedSpy.mockRestore();
    dayChangedSpy.mockRestore();
    dateChangedSpy.mockRestore();
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
      vi.clearAllMocks();
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

  describe('_parseDate (YYYY-MM-DD) format', () => {
    test.each([
      { val: '2000-12-31', expected: { year: 2000, month: 12, day: 31 } },
      { val: '1970-1-1', expected: { year: 1970, month: 1, day: 1 } },
      { val: '2022-11-21', expected: { year: 2022, month: 11, day: 21 } },
      { val: '2011-11-11', expected: { year: 2011, month: 11, day: 11 } },
    ])('with $val', ({ val, expected }) => {
      expect(bp._parseDate(val)).toStrictEqual(expected);
    });
  });

  describe('_parseDate (YYYY/MM/DD) format', () => {
    test.each([
      { val: '2000/12/31', expected: { year: 2000, month: 12, day: 31 } },
      { val: '1970/1/1', expected: { year: 1970, month: 1, day: 1 } },
      { val: '2022/11/21', expected: { year: 2022, month: 11, day: 21 } },
      { val: '2011/11/11', expected: { year: 2011, month: 11, day: 11 } },
    ])('with $val', ({ val, expected }) => {
      expect(bp._parseDate(val)).toStrictEqual(expected);
    });
  });

  describe('_parseDate (MM/DD/YYYY) format', () => {
    test.each([
      { val: '11/20/2020', expected: { year: 2020, month: 11, day: 20 } },
      { val: '11/2/2020', expected: { year: 2020, month: 11, day: 2 } },
      { val: '11/2/2000', expected: { year: 2000, month: 11, day: 2 } },
      { val: '1/1/1988', expected: { year: 1988, month: 1, day: 1 } },
      { val: '1/1/1988', expected: { year: 1988, month: 1, day: 1 } },
      { val: '12/25/3420', expected: { year: 3420, month: 12, day: 25 } },
      { val: '0/0/2022', expected: false },
      { val: '11/0/2022', expected: false },
      { val: '0/10/2022', expected: false },
    ])('with $val', ({ val, expected }) => {
      expect(bp._parseDate(val)).toStrictEqual(expected);
    });
  });
});

describe('test the settings', () => {
  test('minYear, should be 2004', () => {
    const options = {
      minYear: 2004,
    };
    const el = document.createElement('div');
    const bp = new BirthdayPicker(el, options);
    expect(bp._yearFrom).toBe(options.minYear);
  });

  test('maxYear, should be 2018', () => {
    const options = {
      maxYear: 2018,
    };
    const el = document.createElement('div');
    const bp = new BirthdayPicker(el, options);
    expect(bp._yearTo).toBe(options.maxYear);
  });

  test('maxYear, should be 2008', () => {
    const options = {
      maxYear: 2018,
      minAge: 10,
    };
    const el = document.createElement('div');
    const bp = new BirthdayPicker(el, options);
    expect(bp._yearTo).toBe(2008);
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
    expect(bp._yearTo).toBe(2010);
    expect(bp._yearFrom).toBe(1960);
  });
});

describe('test all options', () => {
  test('locale should use standard (\'en\') if wrong string is given', () => {
    const div = document.createElement('div');
    const options = {
      locale: 'wrong'
    };
    const bp = new BirthdayPicker(div, options);
    expect(bp.settings.locale).toBe('en');
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
    const langChangeSpy = vi.spyOn(BirthdayPicker, 'createLocale');
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
    const _triggerEventSpy = vi.spyOn(bp, '_triggerEvent');
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
    defaultDate: '2019-04-17',
  });

  describe('getDateString(), date is set!', () => {
    test.each([
      { val: 'd. m. yyyy', expected: '17. 4. 2019' },
      { val: 'mm / dd / yyyy', expected: '04 / 17 / 2019' },
      { val: 'd.m.yy', expected: '17.4.19' },
      { val: 'd.m. yy', expected: '17.4. 19' },
    ])('value: $val', ({ val, expected }) => {
      expect(bp.getDateString(val)).toBe(expected);
    });
  });

  describe('getDateString() test formatting string', () => {
    test.each([
      { val: undefined, expected: '4/17/2019' },
      { val: null, expected: '4/17/2019' },
      { val: '', expected: '4/17/2019' },
      { val: 'yyyy', expected: '2019' },
      { val: 'yy', expected: '19' },
      { val: 'mm', expected: '04' },
      { val: 'm', expected: '4' },
      { val: 'dd', expected: '17' },
      { val: 'd', expected: '17' },
    ])('value: $val', ({ val, expected }) => {
      expect(bp.getDateString(val)).toBe(expected);
    });
  });
});

describe('public methods tests', () => {
  const bpEl = document.createElement('div');
  const bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    locale: 'en',
    leadingZero: false,
  });

  test('getDate() without value, current-date not set yet!', () => {
    const b = new BirthdayPicker(document.createElement('div'));
    let date = b.getDate();
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

  test('useLeadingZero() set to true and false', () => {
    expect(bp.settings.leadingZero).toBe(false);
    bp.useLeadingZero(true);
    expect(bp.settings.leadingZero).toBe(true);
    bp.useLeadingZero(false);
    expect(bp.settings.leadingZero).toBe(false);
  });

  describe('isLeapYear() with different values', () => {
    bp.setDate('2000-10-10');
    test.each([
      { val: undefined, expected: true }, // use the default value
      { val: null, expected: true }, // use the default value
      { val: 2004, expected: true },
      { val: 2005, expected: false },
    ])('value: $val', ({ val, expected }) => {
      expect(bp.isLeapYear(val)).toBe(expected);
    });
  });

  describe('test setMonthFormat() with ...', () => {
    test.each([
      { val: 'short', expected: true },
      { val: 'long', expected: true },
      { val: 'numeric', expected: true },
      { val: 'numeric', expected: false }, // not changed
      { val: 'sdf', expected: false },
      { val: null, expected: false },
      { val: 0, expected: false },
      { val: undefined, expected: false },
    ])('value: $val, should be $expected', ({ val, expected }) => {
      expect(bp.setMonthFormat(val)).toEqual(expected);
    });
  });

  describe('test resetDate() if no default start date was given', () => {
    const testDate = '2012-12-23';

    test.each([
      { val: true, expected: '' },
      { val: false, expected: '' },
    ])('resetDate($val)', ({ val, expected }) => {
      bp.setDate(testDate);
      expect(bp.getDateString('yyyy-mm-dd')).toBe(testDate);
      bp.resetDate(val);
      expect(bp.getDateString('yyyy-mm-dd')).toBe(expected);
    });
  });

  describe('test resetDate() if no default start date was given', () => {
    const bp = new BirthdayPicker(document.createElement('div'), {
      locale: 'en',
      defaultDate: '2022-02-02',
    });
    const testDate = '2012-12-23';

    test.each([
      { val: true, expected: '2022-02-02' },
      { val: false, expected: '' },
    ])('resetDate($val)', ({ val, expected }) => {
      bp.setDate(testDate);
      expect(bp.getDateString('yyyy-mm-dd')).toBe(testDate);
      bp.resetDate(val);
      expect(bp.getDateString('yyyy-mm-dd')).toBe(expected);
    });
  });

  describe('test resetDate() if no default start date was given', () => {
    const bp = new BirthdayPicker(document.createElement('div'), {
      defaultDate: '2022-02-02',
    });
    const _setDateSpy = vi.spyOn(bp, '_setDate');
    const _setYearSpy = vi.spyOn(bp, '_setYear');
    const _setMonthSpy = vi.spyOn(bp, '_setMonth');
    const _setDaySpy = vi.spyOn(bp, '_setDay');
    const _dateChangedSpy = vi.spyOn(bp, '_dateChanged');

    const _yearWasChangedSpy = vi.spyOn(bp, '_yearWasChanged');
    const _monthWasChangedSpy = vi.spyOn(bp, '_monthWasChanged');
    const _dayWasChangedSpy = vi.spyOn(bp, '_dayWasChanged');
    const resetDateSpy = vi.spyOn(bp, 'resetDate');

    const _updateSelectBoxSpy = vi.spyOn(bp, '_updateSelectBox');

    test('_setDate should be called', () => {
      bp.resetDate();
      const resetCall = { year: undefined, month: undefined, day: undefined };
      expect(_setDateSpy).toHaveBeenCalledTimes(1);
      expect(_setDateSpy).toHaveBeenCalledWith(resetCall);
      expect(resetDateSpy).toHaveBeenCalledWith();

      expect(_setYearSpy).toHaveBeenCalledWith(undefined, false);
      expect(_setMonthSpy).toHaveBeenCalledWith(undefined, false);
      expect(_setDaySpy).toHaveBeenCalledWith(undefined, false);

      expect(_yearWasChangedSpy).toHaveBeenCalledWith(NaN);
      expect(_monthWasChangedSpy).toHaveBeenCalledWith(NaN);
      expect(_dayWasChangedSpy).toHaveBeenCalledWith(NaN);

      expect(_dateChangedSpy).toHaveBeenCalledTimes(1);
      expect(_updateSelectBoxSpy).toHaveBeenCalledTimes(3);
    });

  });


});

describe('private methods tests', () => {
  const bpEl = document.createElement('div');
  let bp = new BirthdayPicker(bpEl, {
    monthFormat: 'numeric',
    defaultDate: '2012-03-20',
    leadingZero: false,
  });

  test('_getIdx - nodeList not set', () => {
    // value not found
    expect(bp._getIdx()).toEqual(undefined);
    expect(bp._getIdx('fakeNodeList')).toEqual(undefined);
    expect(bp._getIdx(null)).toEqual(undefined);
    expect(bp._getIdx(undefined)).toEqual(undefined);
  });

  test('_getIdx - nodeList set, no value', () => {
    // value not found
    const monthNodeList = bp._month.el.childNodes;
    expect(bp._getIdx(monthNodeList)).toEqual(undefined);
  });

  test('_getIdx - nodeList set, value not found', () => {
    // value not found
    const monthNodeList = bp._month.el.childNodes;
    expect(bp._getIdx(monthNodeList, 12)).toEqual(12);
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

describe.each([
  {
    fun: '_setYear',
    spyOn: '_yearWasChanged',
    name: 'year',
    sameVal: 2012,
    diffVal: 2002,
  },
  {
    fun: '_setMonth',
    spyOn: '_monthWasChanged',
    name: 'month',
    sameVal: 3,
    diffVal: 12,
  },
  {
    fun: '_setDay',
    spyOn: '_dayWasChanged',
    name: 'day',
    sameVal: 20,
    diffVal: 12,
  },
])('$fun methods tests', ({ fun, spyOn, name, sameVal, diffVal }) => {
  const bpEl = document.createElement('div');
  const bp = new BirthdayPicker(bpEl, {
    defaultDate: '2012-03-20',
  });
  const _spy = vi.spyOn(bp, spyOn);
  const _triggerEventSpy = vi.spyOn(bp, '_triggerEvent');

  test(`same ${name} should return false`, () => {
    expect(bp[fun](sameVal)).toBe(false);
    expect(_spy).toHaveBeenCalledTimes(0);
    expect(_triggerEventSpy).toHaveBeenCalledTimes(0);
  });

  test(`new ${name} should return true`, () => {
    expect(bp[fun](diffVal)).toBe(true);
    expect(_spy).toHaveBeenCalledTimes(1);
    expect(_spy).toHaveBeenCalledWith(diffVal);
    // 2 -> one for year and one for datechange event
    expect(_triggerEventSpy).toHaveBeenCalledTimes(2);
  });
});

describe('_create methods tests', () => {
  const bpEl = document.createElement('div');
  const yearEl = document.createElement('select');
  const monthEl = document.createElement('select');
  const dayEl = document.createElement('select');

  const bp = new BirthdayPicker(bpEl, {
    arrange: 'ass',
    yearEl,
    monthEl,
    dayEl,
  });

  describe('test allowedArrangement', () => {
    test('wrong arrange value given, expect arrange to be ymd', () => {
      expect(bp.settings.arrange).toBe('ymd');
    });
  });
});

describe('_noFutureDate methods tests', () => {
  const bpEl = document.createElement('div');
  let bp = new BirthdayPicker(bpEl, {
    defaultDate: '2010-02-20',
    maxYear: 2030,
  });

  // const orig = bp._noFutureDate;
  describe('try to set to a future day', () => {
    test('should result in the current date', () => {
      const _noFutureDateSpy = vi.spyOn(bp, '_noFutureDate');
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

      vi.clearAllMocks();
      _noFutureDateSpy = vi.spyOn(bp, '_noFutureDate');
      _setYearSpy = vi.spyOn(bp, '_setYear');
      _setMonthSpy = vi.spyOn(bp, '_setMonth');
      _setDaySpy = vi.spyOn(bp, '_setDay');
    });

    test('max day changed down, call: _setDay', () => {
      day = 12;
      bp._noFutureDate(year, month, day);
      expect(_noFutureDateSpy).lastCalledWith(year, month, day);
      expect(_setYearSpy).toHaveBeenCalledTimes(0);
      expect(_setMonthSpy).toHaveBeenCalledTimes(0);
      expect(_setDaySpy).toHaveBeenCalledTimes(1);
    });

    test('max month changed down, call: _setMonth & _setDay', () => {
      month = 8;
      bp._noFutureDate(year, month, day);
      expect(_noFutureDateSpy).lastCalledWith(year, month, day);
      expect(_setYearSpy).toHaveBeenCalledTimes(0);
      expect(_setMonthSpy).toHaveBeenCalledTimes(1);
      expect(_setDaySpy).toHaveBeenCalledTimes(1);
    });

    test('max year changed down (month and day are the same), call: _setYear', () => {
      year = 2019;
      bp._noFutureDate(year, month, day);
      expect(_noFutureDateSpy).lastCalledWith(year, month, day);
      expect(_setYearSpy).toHaveBeenCalledTimes(1);
      expect(_setMonthSpy).toHaveBeenCalledTimes(0);
      expect(_setDaySpy).toHaveBeenCalledTimes(0);
    });

    test('all values changed down, call: _setYear, _setMonth & _setDay', () => {
      const _year = year - 1;
      const _month = month - 1;
      const _day = day - 1;
      bp._noFutureDate(_year, _month, _day);
      expect(_noFutureDateSpy).lastCalledWith(_year, _month, _day);
      expect(_setYearSpy).toHaveBeenCalledTimes(1);
      expect(_setMonthSpy).toHaveBeenCalledTimes(1);
      expect(_setDaySpy).toHaveBeenCalledTimes(1);
    });

    // change month and day
    test('max month and day changed, call: _setMonth & _setDay', () => {
      const _year = year;
      const _month = month - 1;
      const _day = day - 1;
      bp._noFutureDate(_year, _month, _day);
      expect(_noFutureDateSpy).lastCalledWith(_year, _month, _day);
      expect(_setYearSpy).toHaveBeenCalledTimes(0);
      expect(_setMonthSpy).toHaveBeenCalledTimes(1);
      expect(_setDaySpy).toHaveBeenCalledTimes(1);
    });

    // change month and day
    test('max year and day changed, call: _setMonth & _setDay', () => {
      const _year = year - 1;
      const _month = month;
      const _day = day - 1;
      bp._noFutureDate(_year, _month, _day);
      expect(_noFutureDateSpy).lastCalledWith(_year, _month, _day);
      expect(_setYearSpy).toHaveBeenCalledTimes(1);
      expect(_setMonthSpy).toHaveBeenCalledTimes(0);
      expect(_setDaySpy).toHaveBeenCalledTimes(1);
    });

    test('all values changed up, call: nothing', () => {
      const _year = year + 1;
      const _month = month + 1;
      const _day = day + 1;
      bp._noFutureDate(_year, _month, _day);
      expect(_noFutureDateSpy).lastCalledWith(_year, _month, _day);
      expect(_setYearSpy).toHaveBeenCalledTimes(0);
      expect(_setMonthSpy).toHaveBeenCalledTimes(0);
      expect(_setDaySpy).toHaveBeenCalledTimes(0);
    });
  });
});

describe('_dateChanged methods tests', () => {
  const bpEl = document.createElement('div');
  let bp = new BirthdayPicker(bpEl, {
    defaultDate: '2010-02-20',
  });

  test('_dateChanged should be triggering by call setDate', () => {
    const _dateChangedSpy = vi.spyOn(bp, '_dateChanged');
    bp.setDate('1912-10-26');
    expect(_dateChangedSpy).toHaveBeenCalledTimes(1);

    _dateChangedSpy.mockRestore();
  });

  test('test for _dateChanged triggering by select change', () => {
    const _dateChangedSpy = vi.spyOn(bp, '_dateChanged');

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
    const _dateChangedSpy = vi.spyOn(bp, '_dateChanged');
    bp._year.el.selectedIndex = 21;
    bp._year.el.dispatchEvent(new Event('change'));
    expect(_dateChangedSpy).toHaveBeenCalled();
    _dateChangedSpy.mockRestore();
  });

  test('test the _dateChanged should be called if changed via setDate and new date is different', () => {
    const _dateChangedSpy = vi.spyOn(bp, '_dateChanged');
    const curDate = bp.getDateString('yyyy-mm-dd');
    const newDate = '1980-12-22';
    expect(curDate).not.toBe(newDate);
    bp.setDate(newDate);
    expect(_dateChangedSpy).toHaveBeenCalledTimes(1);
    _dateChangedSpy.mockRestore();
  });

  test('_dateChanged should NOT be called if date is the same', () => {
    const _dateChangedSpy = vi.spyOn(bp, '_dateChanged');
    bp.setDate('1980-12-22');
    expect(_dateChangedSpy).not.toHaveBeenCalled();
    _dateChangedSpy.mockRestore();
  });
});

// describe('_getDateValuesInRange methods tests', () => {
//   const bpEl = document.createElement('div');
//   const bp = new BirthdayPicker(bpEl, {
//     defaultDate: '2002-03-04',
//     minYear: 2000,
//     maxYear: 2010,
//   });
//   let inRange;

//   test('all in range, expect no change', () => {
//     inRange = bp._getDateValuesInRange({ year: 2010, month: 3, day: 4 });
//     expect(inRange).toMatchObject({ year: 2010, month: 3, day: 4 });
//   });
// });

describe('_updateDays methods tests', () => {
  const bpEl = document.createElement('div');
  const placeholder = true;
  let bp = new BirthdayPicker(bpEl, {
    defaultDate: '2010-02-20',
    placeholder,
  });

  let _setDateSpy;
  let _setDaySpy;
  let _updateDaysSpy;
  let _dayWasChangedSpy;
  let _monthWasChangedSpy;
  let _yearWasChangedSpy;

  beforeEach(() => {
    //int date
    bp.setDate('2000-12-31');

    _setDateSpy = vi.spyOn(bp, '_setDate');
    _setDaySpy = vi.spyOn(bp, '_setDay');
    _updateDaysSpy = vi.spyOn(bp, '_updateDays');
    _dayWasChangedSpy = vi.spyOn(bp, '_dayWasChanged');
    _monthWasChangedSpy = vi.spyOn(bp, '_monthWasChanged');
    _yearWasChangedSpy = vi.spyOn(bp, '_yearWasChanged');
  });

  afterEach(() => {
    _setDateSpy.mockRestore();
    _setDaySpy.mockRestore();
    _updateDaysSpy.mockRestore();
    _dayWasChangedSpy.mockRestore();
    _monthWasChangedSpy.mockRestore();
    _yearWasChangedSpy.mockRestore();
    vi.clearAllMocks();
  });

  describe('test the _updateDays should called if value ist set via setDate', () => {
    test('change days, expect _updateDay to be called', () => {
      bp.setDate('2010-2-10');
      expect(_setDateSpy).toHaveBeenCalledWith({
        year: 2010,
        month: 2,
        day: 10,
      });
      expect(_setDaySpy).toHaveBeenCalledWith(10, false);
      expect(_updateDaysSpy).toHaveBeenCalledTimes(1);
      expect(bp.getDateString('yyyy-m-d')).toEqual('2010-2-10');
    });

    test('change month, expect _updateDay to NOT be called', () => {
      bp.setDate('2010-11-31'); // as day is already set to 30
      expect(bp.getDateString('yyyy-mm-dd')).toEqual('2010-12-01');
      expect(_dayWasChangedSpy).toHaveBeenCalledWith(1);
      expect(_updateDaysSpy).toHaveBeenCalledTimes(0);
    });

    test('change only year (month the same), expect _updateDay to NOT be called', () => {
      // change year but month is the same (no change)
      bp.setDate('2012-12-31');
      expect(_updateDaysSpy).toHaveBeenCalledTimes(0);
    });

    test('change month and year, expect _updateDay to be called', () => {
      // change month and year
      bp.setDate('2011-02-10');
      expect(_updateDaysSpy).toHaveBeenCalledTimes(1);
    });

    test('change all (year, month, day), _updateDay to be called', () => {
      bp.setDate('2021-01-15');
      expect(_updateDaysSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('testing via select boxes', () => {
    test('_updateDays should NOT be called if day changes', () => {
      // init value '2000-12-31'
      bp._day.el.selectedIndex = 1;
      bp._day.el.dispatchEvent(new Event('change'));
      // no days update needed (same year and month)
      expect(_updateDaysSpy).not.toHaveBeenCalled();
      // but the _dayChangedSpy should bee called -> trigger event
      expect(_dayWasChangedSpy).toHaveBeenCalled();
    });

    test('_updateDays should be called if month changes', () => {
      // init value '2000-12-31'
      bp._month.el.selectedIndex = 1;
      bp._month.el.dispatchEvent(new Event('change'));
      expect(_updateDaysSpy).toHaveBeenCalledTimes(1);
    });

    test('_updateDays should be called if year changes to a leap-year and current month is Feb.', () => {
      // init value
      bp.setDate('1999-02-12'); // 1. call
      expect(_updateDaysSpy).toHaveBeenCalledTimes(1);
      const leapYear = 2000;
      // change year
      const idx = bp._getIdx(bp._year.el.childNodes, leapYear);
      bp._year.el.selectedIndex = idx;
      bp._year.el.dispatchEvent(new Event('change'));
      expect(_updateDaysSpy).toHaveBeenCalledTimes(2);
    });

    test('_updateDays should be called if year changes to a non-leap-year', () => {
      // init value
      bp.setDate('1999-02-12'); // 1. call
      const noLeapYear = 2001;
      // change year
      const idx = bp._getIdx(bp._year.el.childNodes, noLeapYear);
      bp._year.el.selectedIndex = idx;
      bp._year.el.dispatchEvent(new Event('change'));
      expect(_updateDaysSpy).toHaveBeenCalledTimes(2);
    });
  });

  test('_updateDays should NOT be called if only day changes via setDate', () => {
    // init value '2000-12-31'
    // only day changed
    bp.setDate('2000-12-22');
    expect(bp.getDateString('yyyy-mm')).toBe('2000-12');
    expect(_dayWasChangedSpy).toHaveBeenCalledTimes(1);
    // no need to update days
    expect(_updateDaysSpy).toHaveBeenCalledTimes(0);
  });

  describe('add and remove elements form the day box', () => {
    test('_updateDays should add days if new month has more days', () => {
      bp.setDate('1999-02-28'); // init
      const numberOfDays = bp._daysPerMonth[1];
      bp.setDate('1999-06-28'); // set to a month with more days

      const numberOfDaysNew = bp._daysPerMonth[6 - 1];
      const numberChildNodesInDaysNew =
        bp._day.el.childNodes.length - (placeholder ? 1 : 0);

      const diff = Math.abs(numberOfDays - numberOfDaysNew);
      expect(numberChildNodesInDaysNew).toBe(30); // june

      // update method was called
      expect(numberOfDays).toBe(28);
      expect(numberOfDaysNew).toBe(30);
      expect(diff).toBe(2); // -> 2 items to add

      expect(_monthWasChangedSpy).toHaveBeenCalledTimes(2);
      expect(_dayWasChangedSpy).toHaveBeenCalledTimes(1);
      expect(_updateDaysSpy).toHaveBeenCalledTimes(2);
    });
  });

  test('_updateDays with roundDownDay false', () => {
    bp.settings.roundDownDay = false;

    const initDate = '2000-02-29';
    const newDate = '2001-02-29';

    bp.setDate(initDate); // 2.call
    bp.setDate(newDate); // 3.call

    expect(_setDaySpy).toHaveBeenCalledTimes(2);
    expect(_updateDaysSpy).toHaveBeenCalledTimes(2);
    expect(_dayWasChangedSpy).toHaveBeenCalledTimes(3);
    expect(_monthWasChangedSpy).toHaveBeenCalledTimes(2);
    expect(_yearWasChangedSpy).toHaveBeenCalledTimes(1);
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

  test('test the createLocale function with BirthdayPickerLocale', () => {
    window.BirthdayPickerLocale = {
      fi: { year: 'vuosi', month: 'kuukausi', day: 'päivä' },
    };

    const [lang, obj] = BirthdayPicker.createLocale('fi');
    expect(lang).toBe('fi');
    expect(obj.year).toBe('vuosi');
  });

  test('test the killAll function', () => {
    let result = BirthdayPicker.killAll();
    expect(result).toBe(true);

    // second call
    result = BirthdayPicker.killAll();
    expect(result).toBe(false);
  });

  test('test the kill function with no instance should return false', () => {
    const result = BirthdayPicker.kill();
    expect(result).toBe(false);
  });

  test('test the kill function with fake-value instance should return false', () => {
    const result = BirthdayPicker.kill('fake');
    expect(result).toBe(false);
  });

  test('test the init function', () => {
    BirthdayPicker.kill();
    let init = BirthdayPicker.init();
    expect(typeof init).toBe('object');

    let secondInit = BirthdayPicker.init();
    expect(secondInit).toBe(false);
  });

  test('test init function with autoInit=false, should not init', () => {
    const bpEl = document.createElement('div');
    const bp = new BirthdayPicker(bpEl, {
      autoInit: false,
    });

    expect(bp.initialized).not.toBe(true);
  });
});
