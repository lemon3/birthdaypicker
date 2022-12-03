/**
 * @jest-environment jsdom
 */

/* global jest, describe, test, expect */

import {
  addProps,
  getJSONData,
  createEl,
  docReady,
  restrict,
  isLeapYear,
  monthNumbers,
  dataStorage,
} from '../src/helper.js';

// setup
document.body.innerHTML += `
  <div id="helper-data1"></div>
  <div id="helper-data2" data-super="123"></div>
  <div id="helper-data3"
    data-heels="true"
    data-heels-height="12"
    data-heels-color="red"
  ></div>
  <div id="helper-data4"
    data-birthdaypicker="{'defaultDate':'2000-10-05'}"
    data-birthdaypicker-default-date="2012-04-14"
    data-birthdaypicker-month-format="short"
  ></div>
  <div id="dataStorageEl"></div>
`;

describe('test addProps function', () => {
  let a = document.createElement('div');
  test('props should be added to DOM element', () => {
    addProps(a, { height: 1, width: 1 }, { display: 'none' }, 'super');
    expect(a.innerHTML).toBe('super');
    expect(a.style.display).toBe('none');
    expect(a.getAttribute('height')).toBe('1');
  });
});

describe('test createEl function', () => {
  test('element should be created correctly', () => {
    let a = createEl('div');
    expect(a).toBeTruthy();
    expect(typeof a).toBe('object');
    expect(a.nodeType).toBe(1);
    expect(a.nodeName.toLowerCase()).toBe('div');
  });
});

describe('test docReady function', () => {
  test('function should be fired', () => {
    const hmm = jest.fn();
    docReady(hmm);
    expect(hmm).toHaveBeenCalled();
  });
});

describe('test getJSONData function', () => {
  let nothing = document.getElementById('nothing');
  test('element not found or null', () => {
    expect(getJSONData(nothing)).toBe(false);
    expect(getJSONData()).toBe(false);
    expect(getJSONData(false)).toBe(false);
    expect(getJSONData('')).toBe(false);
    expect(getJSONData(null)).toBe(false);
    expect(getJSONData(undefined)).toBe(false);
  });

  let helperData1 = document.getElementById('helper-data1');
  test('element has no data attribute', () => {
    expect(getJSONData(helperData1)).toMatchObject({});
  });

  let helperData2 = document.getElementById('helper-data2');
  test('element with data attribute', () => {
    let data = getJSONData(helperData2);
    expect(data).toMatchObject({ super: '123' });
  });

  let helperData3 = document.getElementById('helper-data3');
  test('element with multiple data attributes', () => {
    let data = getJSONData(helperData3, 'heels');
    expect(data).toMatchObject({
      heels: 'true',
      color: 'red',
      height: '12',
    });
  });

  let helperData4 = document.getElementById('helper-data4');
  test('element with multiple data, and JSON-string', () => {
    let data = getJSONData(helperData4, 'birthdaypicker');
    expect(data).toMatchObject({
      defaultDate: '2012-04-14',
      monthFormat: 'short',
    });
  });
});

describe('test monthNumbers function', () => {
  test('with leading zero', () => {
    const m = monthNumbers(true);
    expect(m).toBeTruthy();
    expect(m).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ]);
  });

  test('without leading zero', () => {
    const m = monthNumbers();
    expect(m).toBeTruthy();
    expect(m).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ]);
  });
});

describe('test dataStorage', () => {
  var dataStorageEl = document.getElementById('dataStorageEl');
  test('test put and get', () => {
    const inst = new Date('2022-02-22');
    dataStorage.put(dataStorageEl, 'instance', inst);
    const data = {
      foo: 'bar',
      a: 1,
      b: 2,
    };
    // add something afterwards
    dataStorage.put(dataStorageEl, data);
    const instFormStorage = dataStorage.get(dataStorageEl, 'instance');

    inst.setDate(1);
    instFormStorage.setDate(2);

    expect(inst).toEqual(instFormStorage);
    expect(inst.getDate()).toEqual(instFormStorage.getDate());
    expect(inst.getDate()).not.toBe(1);
    expect(instFormStorage.getDate()).toBe(2);
    expect(dataStorage.get(dataStorageEl, 'foo')).toBe('bar');
    expect(typeof dataStorage.get(dataStorageEl)).toBe('object');
    expect(dataStorage.get(dataStorageEl) instanceof Map).toBe(true);
  });
  test('test put (update)', () => {
    // override
    const dataStorageSpy = jest.spyOn(dataStorage._storage, 'has');
    dataStorage.put(dataStorageEl, 'instance', 'bla');
    expect(dataStorage.get(dataStorageEl, 'instance')).toBe('bla');
    expect(dataStorageSpy).toHaveBeenCalled();
  });
  test('get from undefined element', () => {
    expect(dataStorage.get() instanceof Map).toBe(true);
    expect(dataStorage.get(null) instanceof Map).toBe(true);
    expect(dataStorage.get(undefined) instanceof Map).toBe(true);
    expect(dataStorage.get('') instanceof Map).toBe(true);
  });
  test('test has', () => {
    expect(dataStorage.has()).toBe(false);
    expect(dataStorage.has(dataStorageEl)).toBe(false);
    expect(dataStorage.has(dataStorageEl, 'sd')).toBe(false);
    expect(dataStorage.has(dataStorageEl, 'instance')).toBe(true);
  });
  test('test remove', () => {
    // empty remove
    expect(dataStorage.remove()).toBe(false);
    expect(dataStorage.remove(dataStorageEl)).toBe(false);
    // remove element available put key wrong
    expect(dataStorage.remove(dataStorageEl, 'sad')).toBe(false);
    // remove element available with correct key
    expect(dataStorage.remove(dataStorageEl, 'instance')).toBe(true);

    const dataStorageSpy = jest.spyOn(dataStorage._storage, 'delete');
    dataStorage.remove(dataStorageEl, 'foo');
    dataStorage.remove(dataStorageEl, 'a');
    dataStorage.remove(dataStorageEl, 'b');

    expect(dataStorageSpy).toHaveBeenCalled();
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

describe('test isLeapYear function', () => {
  test('docReady() helper function', async () => {
    let val = false;
    const test = () => {
      val = true;
    };
    try {
      await docReady(test);
      expect(val).toBe(true);
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});
