/**
 * @jest-environment jsdom
 */

/* global describe, test, expect */

import BirthdayPicker from '../src/index.js';

// describe('sd', () => {
//   test('It should pass', () => {
//     let app = {
//       init: function () {
//         document.addEventListener('DOMContentLoaded', () => {
//           this.instance();
//         });
//       },
//       instance: function () {
//         console.log('Instance method called');
//       },
//     };
//     const instanceMock = jest.spyOn(app, 'instance');
//     document.addEventListener = jest
//       .fn()
//       .mockImplementationOnce((event, callback) => {
//         callback();
//       });
//     app.init();
//     expect(document.addEventListener).toBeCalledWith(
//       'DOMContentLoaded',
//       expect.any(Function)
//     );
//     expect(instanceMock).toBeCalledTimes(1);
//   });
// });

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

describe('BirthdayPicker', () => {
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
  // Set up our document body
  document.body.innerHTML += `
    <div id="test">
      <select data-birthdaypicker-year></select>
      <select data-birthdaypicker-month></select>
      <select data-birthdaypicker-day></select>
    </div>

    <div id="test2">
    </div>
  `;

  const elementNotExists = document.getElementById('wrongId');
  const bp1 = new BirthdayPicker(elementNotExists);
  test('element does not exist', () => {
    expect(bp1).toBeTruthy();
    expect(bp1).toEqual({ error: true });
    expect(bp1.error).toBe(true);
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
    expect(bp2).toEqual(bp3);
    expect(bp3.currentYear).toBe('2012');
  });

  const noChildElements = document.getElementById('test2');
  const bp4 = new BirthdayPicker(noChildElements);
  test('element allready initialized', () => {
    expect(bp4).toBeTruthy();
  });
});
