/**
 * @jest-environment jsdom
 */

/* global afterEach, jest, describe, test, expect */

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
  <div id="helper-data5"
    data-birthdaypicker="{'locale':'fr'}"
  ></div>
  <div id="helper-data6"
    data-birthdaypicker="'locale':'fr',defaultDate:now,arrange:dmy"
  ></div>
  <div id="dataStorageEl"></div>
`;

afterEach(() => {
  jest.clearAllMocks();
  // only for spyOn mocked Equivalent to .mockRestore()
  jest.restoreAllMocks();
});

describe('test addProps function', () => {
  // props should be added to DOM element
  test('with properties, style, innerHTML', () => {
    let a = document.createElement('div');
    addProps(a, { height: 1, width: 1 }, { display: 'none' }, 'super');
    expect(a.innerHTML).toBe('super');
    expect(a.style.display).toBe('none');
    expect(a.getAttribute('height')).toBe('1');
  });
  test('with style', () => {
    let a = document.createElement('div');
    addProps(a, null, { display: 'flex', zIndex: 10 });
    expect(a.style.display).toBe('flex');
    expect(a.style.zIndex).toBe('10');
  });
  test('with properties', () => {
    let a = document.createElement('div');
    addProps(a, { display: 'flex', test: null });
    expect(a.style.display).not.toBe('flex');
    expect(a.getAttribute('test')).toBe('null');
    expect(a.getAttribute('display')).toBe('flex');
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
    expect(data).toEqual({
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

  let helperData5 = document.getElementById('helper-data5');
  test('element JSON-string', () => {
    let data = getJSONData(helperData5, 'birthdaypicker');
    expect(data).toEqual({
      locale: 'fr',
    });
  });

  let helperData6 = document.getElementById('helper-data6');
  test('element settings-string', () => {
    let data = getJSONData(helperData6, 'birthdaypicker');
    expect(data).toEqual({
      locale: 'fr',
      defaultDate: 'now',
      arrange: 'dmy',
    });
  });

  test('JSON-string data', () => {
    const div = document.createElement('div');
    // eslint-disable-next-line quotes
    div.dataset.test = "{'foo':'bar'}";
    let result = getJSONData(div, 'test');
    let exp = { foo: 'bar' };
    expect(result).toEqual(exp);
  });

  test('with undefined string value', () => {
    const div = document.createElement('div');
    div.dataset.test = 'undefined';
    let result = getJSONData(div, 'test');
    expect(result).toEqual({ test: 'undefined' });
  });

  test('with default values', () => {
    const div = document.createElement('div');
    div.dataset.test = 'name123';
    div.dataset.testNew = 'new123';
    div.dataset.testOld = 'old123';
    const defaults = {
      old: 'old123',
    };
    let result = getJSONData(div, 'test', defaults);
    expect(result).toEqual({ test: 'name123', old: 'old123' });
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
    const dataStorageSpy = jest.spyOn(dataStorage._s, 'has');
    dataStorage.put(dataStorageEl, 'instance', 'bla');
    expect(dataStorage.get(dataStorageEl, 'instance')).toBe('bla');
    expect(dataStorageSpy).toHaveBeenCalled();
  });
  test('get from undefined element', () => {
    expect(dataStorage.get()).toBe(false);
    expect(dataStorage.get(null)).toBe(false);
    expect(dataStorage.get(undefined)).toBe(false);
    expect(dataStorage.get('')).toBe(false);
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

    const dataStorageSpy = jest.spyOn(dataStorage._s, 'delete');
    dataStorage.remove(dataStorageEl, 'foo');
    dataStorage.remove(dataStorageEl, 'a');
    dataStorage.remove(dataStorageEl, 'b');

    expect(dataStorageSpy).toHaveBeenCalled();
  });
  test('test put with an object', () => {
    // empty remove
    const id = 123456789;
    const obj = { name: 'eva', id, age: 35 };
    dataStorage.put(dataStorageEl, obj);
    expect(dataStorage.get(dataStorageEl, 'id')).toBe(id);

    const tmp = dataStorage.get(dataStorageEl);
    expect(tmp.get('id')).toBe(id);
  });

  test('test put with key-only, no value given', () => {
    // empty remove
    const key = 'myKey';
    dataStorage.put(dataStorageEl, key);
    expect(dataStorage.get(dataStorageEl, 'key')).toBe(undefined);
  });

  test('test method calls with object-put', () => {
    const div = document.createElement('div');
    const toStore = { bat: 'girl', super: 'man' };

    // construct map
    const m = new Map();
    for (const key in toStore) {
      if (Object.hasOwnProperty.call(toStore, key)) {
        m.set(key, toStore[key]);
      }
    }

    const dataStorageMock = jest.mocked(dataStorage);
    const putSpy = jest.spyOn(dataStorageMock, 'put');

    const wmSetSyp = jest.spyOn(dataStorageMock._s, 'set');
    const wmGetSyp = jest.spyOn(dataStorageMock._s, 'get');
    const wmHasSyp = jest.spyOn(dataStorageMock._s, 'has');
    const wmDeleteSyp = jest.spyOn(dataStorageMock._s, 'delete');

    dataStorageMock.put(div, toStore);

    // spy the calls to add
    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(putSpy).toHaveBeenCalledWith(div, toStore);
    expect(putSpy).toHaveReturnedTimes(1);
    expect(putSpy).toHaveReturnedWith(dataStorageMock); // for chaining

    // weakMap
    expect(wmHasSyp).toHaveBeenCalledTimes(1);
    expect(wmSetSyp).toHaveBeenCalledTimes(1);
    expect(wmGetSyp).toHaveBeenCalledTimes(1);
    expect(wmGetSyp).toHaveBeenCalledWith(div);

    expect(wmDeleteSyp).toHaveBeenCalledTimes(0);

    expect(dataStorageMock.get(div)).toEqual(m); // returns a map
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

describe('test docReady function', () => {
  test('function should be fired', () => {
    const hmm = jest.fn();
    docReady(hmm);
    expect(hmm).toHaveBeenCalled();
  });

  test('callback should change global var value', async () => {
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

  test('docReady callback called via addEventListener', () => {
    const cb = jest.fn();
    // fake states
    Object.defineProperty(document, 'readyState', {
      get() {
        return 'loading';
      },
    });

    document.addEventListener = jest
      .fn()
      .mockImplementationOnce((event, callback) => {
        callback();
      });
    const mockedDocReady = jest.mocked(docReady);
    mockedDocReady(cb);

    expect(document.addEventListener).toBeCalledWith(
      'DOMContentLoaded',
      cb, // expect.any(Function)
      expect.any(Boolean)
    );
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
