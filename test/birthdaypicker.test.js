/**
 * @jest-environment jsdom
 */

/* global describe, test, expect */

import BirthdayPicker from '../src/index.js';
import { restrict, isLeapYear } from '../src/helper.js';

describe('test isLeapYear function', () => {
  test('is a leap-year', () => {
    expect(isLeapYear(1996)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2008)).toBe(true);
    expect(isLeapYear(2012)).toBe(true);
    expect(isLeapYear(2016)).toBe(true);
  });
  test('is not a leap-year', () => {
    expect(isLeapYear(597)).toBe(false);
    expect(isLeapYear(1783)).toBe(false);
    expect(isLeapYear(2005)).toBe(false);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2006)).toBe(false);
  });
});

describe('test restrict function', () => {
  test('restrict value in between', () => {
    expect(restrict(10, 0, 20)).toBe(10);
    expect(restrict('10', '0', '20')).toBe(10);
    expect(restrict(-8, -10, -2)).toBe(-8);
    expect(restrict(0, -1, 2)).toBe(0);
    expect(restrict(-9, -3, -10)).toBe(-9);
    expect(restrict(-5, -10, 0)).toBe(-5);
    expect(restrict(0.01, 0, 1)).toBe(0.01);
    expect(restrict(-0.01, -0, -1)).toBe(-0.01);
  });
  test('restrict value less or equal than min', () => {
    expect(restrict(10, 10, 20)).toBe(10);
    expect(restrict(10, 10)).toBe(10);
    expect(restrict(-9, 10)).toBe(10);
    expect(restrict(-9, 10, 20)).toBe(10);
  });
  test('restrict value greater or equal than max', () => {
    expect(restrict(10, 0, 10)).toBe(10);
    expect(restrict(10, '', 10)).toBe(10);
    expect(restrict(10, null, 10)).toBe(10);
    expect(restrict(13, null, 10)).toBe(10);
    expect(restrict(-5, null, -6)).toBe(-6);
    expect(restrict(-5, -10, -6)).toBe(-6);
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
  test('generate \'ru\' locales', () => {
    BirthdayPicker.createLocale('ru');
    expect(typeof BirthdayPicker.i18n.ru).toBe('object');
    expect(BirthdayPicker.i18n.ru.month.short[0]).toBe('янв.');
    expect(BirthdayPicker.i18n.ru.month.numeric.length).toBe(12);
  });
});

describe('BirthdayPicker init stage', () => {
  // Set up our document body
  document.body.innerHTML = `
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
  test('element doesn\'t exist', () => {
    expect(bp1).toBeTruthy();
    expect(bp1).toEqual({error:true});
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
