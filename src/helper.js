/**
 * helper to trigger inline events
 * e.g.:
 * <div ondatechange="foo()">bar</bla>
 * @param {Object} elem the html element
 * @param {String} name the event name
 * @param {Object} data event data
 */
export const trigger = (elem, name, data) => {
  let funData = elem.getAttribute('on' + name);
  let func = new Function(
    'e',
    // 'with(document) {' +
    // 'with(this)' +
    '{' + funData + '}'
    // + '}'
  );
  func.call(elem, data);
};

/**
 * add properties and style attributes to a given HTML object
 * @param  {object} el - The HTML object to add properties and styles too.
 * @param  {object} properties - An object with valid HTML properties
 * @param  {object} style - An object with valid CSS styles
 * @return {object} HTML object with the applied properties and styles
 */
const addProps = (el, properties, style, innerHTML) => {
  if (properties) {
    for (const prop in properties) {
      el.setAttribute(prop, properties[prop]);
    }
  }
  if (style) {
    for (const s in style) {
      el.style[s] = style[s];
    }
  }
  if (innerHTML) {
    el.innerHTML = innerHTML;
  }
  return el;
};

/**
 * Helper for creating an HTML object
 * @param  {string} el - The tag-name for an HTML object, eg.: 'div'
 * @param  {objet} properties - An Object with valid HTML properties
 * @param  {objet} style - An Object with valid style definitions
 * @return {object} The created element with applied properties and styles
 */
const createEl = (el, properties, style, innerHTML) =>
  addProps(document.createElement(el), properties, style, innerHTML);

/**
 * A little document DOMContentLoaded wrapper function
 *
 * @param {function} cb Function to be called if the document is ready
 * @return {void}
 */
const docReady = (cb) => {
  const evt = 'DOMContentLoaded';
  if (
    'complete' === document.readyState ||
    'interactive' === document.readyState
  ) {
    cb();
    document.removeEventListener(evt, cb);
  } else {
    document.addEventListener(evt, cb, false);
  }
};

/**
 * Helper function to get all dataset values for a given name
 *
 * @param  {Object} el The dom element, e.g. a selected div-element
 * @param  {String} name The name to look for
 * @param  {Object} defaults An Object with default (allowed) values
 * @return {mixed} Object with all collected data for the given element und name or false, if name was not found
 */
const getJSONData = (el, name, defaults = null) => {
  if (!el) {
    return false;
  }

  // get all
  if (undefined === name || undefined === el.dataset[name]) {
    return el.dataset;
  }

  let data;
  try {
    // eslint-disable-next-line quotes
    data = JSON.parse(el.dataset[name].replace(/'/g, '"'));
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if ('object' !== typeof data) {
    data = el.dataset[name];
    const newData = {};
    data = data.replace(/ /g, '');
    const split = data.split(',');
    if (split.length > 1) {
      split.forEach((item) => {
        const [key, value] = item.split(':');
        newData[key.replace(/'/g, '')] = value.replace(/'/g, '');
      });
    } else {
      newData[name] = data;
    }
    data = newData;
  }

  let obj = {};
  let len = name.length;
  Object.entries(el.dataset).forEach((item) => {
    if (item[0].toLowerCase().indexOf(name) >= 0 && item[0].length > len) {
      let key = item[0][len].toLowerCase() + item[0].substring(len + 1);
      if (null === defaults || (defaults && undefined !== defaults[key])) {
        obj[key] = item[1];
      }
    }
  });

  return Object.assign(data, obj);
};

/**
 * Check if a given year is a leap-year or not!
 *
 * @param  {mixed} year Integer or String number
 * @return {boolean} True if the year is leap or false if not
 */
const isLeapYear = (year) =>
  (0 === +year % 4 && 0 !== +year % 100) || 0 === +year % 400;

/**
 * Check if a given year is a leap-year or not! (alternative calculation)
 *
 * @param  {mixed} year Integer or String number
 * @return {boolean} True if the year is leap or false if not
 */
const isLeapYear2 = (year) => 29 === new Date(+year, 1, 29).getDate();

/**
 * Generate the Month numbers 1 to 12
 *
 * @param {Boolean} useLeadingZero If the output should contain a leading '0' for numbers less than 10 or not
 * @return {Array} The array containing the numbers as a String
 */
const monthNumbers = (useLeadingZero) =>
  Array.from(
    { length: 12 },
    (_, i) => (i < 9 ? (useLeadingZero ? '0' : '') : '') + (i + 1)
  );

const dataStorage = {
  // storage
  _s: new WeakMap(),
  put(el, ...keyVal) {
    if (!this._s.has(el)) {
      this._s.set(el, new Map());
    }
    let storeEl = this._s.get(el);
    if (keyVal.length > 1) {
      storeEl.set(keyVal[0], keyVal[1]);
      return this;
    }
    if ('object' === typeof keyVal[0]) {
      for (const k in keyVal[0]) {
        storeEl.set(k, keyVal[0][k]);
      }
    } else {
      // just a key
      storeEl.set(keyVal[0]);
    }
    return this;
  },
  get(el, key) {
    if (!this._s.has(el)) {
      return false;
      // return new Map();
    }
    if (key) {
      return this._s.get(el).get(key);
    }
    return this._s.get(el);
  },
  has(el, key) {
    return this._s.has(el) && this._s.get(el).has(key);
  },
  // todo if no key given: remove all
  remove(el, key) {
    if (!this._s.has(el)) {
      return false;
    }
    let ret = this._s.get(el).delete(key);
    if (this._s.get(el).size === 0) {
      this._s.delete(el);
    }
    return ret;
  },
};

const restrict = (value, min, max) => {
  value = parseFloat(value, 10);
  if (isNaN(value)) {
    return NaN;
  }

  min = parseFloat(min, 10);
  max = parseFloat(max, 10);

  if (max < min) {
    let tmp = max;
    max = min;
    min = tmp;
  }
  if (!isNaN(min) && value < min) {
    return min;
  }
  if (!isNaN(max) && value > max) {
    return max;
  }

  return value;
};

export {
  restrict,
  dataStorage,
  addProps,
  createEl,
  docReady,
  getJSONData,
  isLeapYear,
  isLeapYear2,
  monthNumbers,
};
