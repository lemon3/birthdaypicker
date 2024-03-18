(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("BirthdayPicker", [], factory);
	else if(typeof exports === 'object')
		exports["BirthdayPicker"] = factory();
	else
		root["BirthdayPicker"] = factory();
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ src; }
});

;// CONCATENATED MODULE: ./src/helper.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * add properties and style attributes to a given HTML object
 * @param  {object} el - The HTML object to add properties and styles too.
 * @param  {object} properties - An object with vaild HTML properties
 * @param  {object} style - An object with valid CSS styles
 * @return {object} HTML object with the applied properties and styles
 */
var addProps = function addProps(el, properties, style, innerHTML) {
  if (properties) {
    for (var prop in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, prop)) {
        el.setAttribute(prop, properties[prop]);
      }
    }
  }
  if (style) {
    for (var s in style) {
      if (Object.prototype.hasOwnProperty.call(style, s)) {
        el.style[s] = style[s];
      }
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
var createEl = function createEl(el, properties, style, innerHTML) {
  return addProps(document.createElement(el), properties, style, innerHTML);
};

/**
 * A little document DOMContentLoaded wrapper function
 *
 * @param {function} cb Function to be called if the document is ready
 * @return {void}
 */
var docReady = function docReady(cb) {
  var evt = 'DOMContentLoaded';
  if ('complete' === document.readyState || 'interactive' === document.readyState) {
    cb();
    document.removeEventListener(evt, cb);
  } else {
    document.addEventListener(evt, cb, false);
  }
};

/**
 * Helper funtion to get all dataset values for a given name
 *
 * @param  {Object} el The dom element, e.g. a selected div-element
 * @param  {String} name The name to look for
 * @param  {Object} defaults An Object with default (allowed) values
 * @return {mixed} Object with all collected data for the given element und name or false, if name was not found
 */
var getJSONData = function getJSONData(el, name) {
  var defaults = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (!el) {
    return false;
  }

  // get all
  if (undefined === name || undefined === el.dataset[name]) {
    return el.dataset;
  }
  var data;
  try {
    // eslint-disable-next-line quotes
    data = JSON.parse(el.dataset[name].replace(/'/g, '"'));
    // eslint-disable-next-line no-empty
  } catch (e) {}
  if ('object' !== _typeof(data)) {
    data = el.dataset[name];
    var newData = {};
    data = data.replace(/ /g, '');
    var split = data.split(',');
    if (split.length > 1) {
      split.forEach(function (item) {
        var _item$split = item.split(':'),
          _item$split2 = _slicedToArray(_item$split, 2),
          key = _item$split2[0],
          value = _item$split2[1];
        newData[key.replace(/'/g, '')] = value.replace(/'/g, '');
      });
    } else {
      newData[name] = data;
    }
    data = newData;
  }
  var obj = {};
  var len = name.length;
  Object.entries(el.dataset).forEach(function (item) {
    if (item[0].toLowerCase().indexOf(name) >= 0 && item[0].length > len) {
      var key = item[0][len].toLowerCase() + item[0].substring(len + 1);
      if (null === defaults || defaults && undefined !== defaults[key]) {
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
var helper_isLeapYear = function isLeapYear(year) {
  return 0 === +year % 4 && 0 !== +year % 100 || 0 === +year % 400;
};

/**
 * Check if a given year is a leap-year or not! (alternative calculation)
 *
 * @param  {mixed} year Integer or String number
 * @return {boolean} True if the year is leap or false if not
 */
var isLeapYear2 = function isLeapYear2(year) {
  return 29 === new Date(+year, 1, 29).getDate();
};

/**
 * Genereate the Month numbers 1 to 12
 *
 * @param {Boolean} useLeadingZero If the output should contain a leading '0' for numbers less than 10 or not
 * @return {Array} The array containing the numbers as a String
 */
var monthNumbers = function monthNumbers(useLeadingZero) {
  return Array.from({
    length: 12
  }, function (_, i) {
    return (i < 9 ? useLeadingZero ? '0' : '' : '') + (i + 1);
  });
};
var dataStorage = {
  // storage
  _s: new WeakMap(),
  put: function put(el) {
    if (!this._s.has(el)) {
      this._s.set(el, new Map());
    }
    var storeEl = this._s.get(el);
    for (var _len = arguments.length, keyVal = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keyVal[_key - 1] = arguments[_key];
    }
    if (keyVal.length > 1) {
      storeEl.set(keyVal[0], keyVal[1]);
      return this;
    }
    if ('object' === _typeof(keyVal[0])) {
      for (var k in keyVal[0]) {
        if ({}.hasOwnProperty.call(keyVal[0], k)) {
          storeEl.set(k, keyVal[0][k]);
        }
      }
    }
    return this;
  },
  get: function get(el, key) {
    if (!this._s.has(el)) {
      return false;
      // return new Map();
    }
    if (key) {
      return this._s.get(el).get(key);
    }
    return this._s.get(el);
  },
  has: function has(el, key) {
    return this._s.has(el) && this._s.get(el).has(key);
  },
  // todo if no key given: remove all
  remove: function remove(el, key) {
    if (!this._s.has(el)) {
      return false;
    }
    var ret = this._s.get(el).delete(key);
    if (this._s.get(el).size === 0) {
      this._s.delete(el);
    }
    return ret;
  }
};
var restrict = function restrict(value, min, max) {
  value = parseFloat(value, 10);
  min = parseFloat(min, 10);
  max = parseFloat(max, 10);
  if (max < min) {
    var tmp = max;
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

;// CONCATENATED MODULE: ./src/index.js
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function src_typeof(o) { "@babel/helpers - typeof"; return src_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, src_typeof(o); }
function src_slicedToArray(arr, i) { return src_arrayWithHoles(arr) || src_iterableToArrayLimit(arr, i) || src_unsupportedIterableToArray(arr, i) || src_nonIterableRest(); }
function src_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function src_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return src_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return src_arrayLikeToArray(o, minLen); }
function src_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function src_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function src_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == src_typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != src_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != src_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*!
 * (c) wolfgang jungmayer
 * www.lemon3.at
 */

var instances = [];
var pluginName = 'birthdaypicker';
var dataName = 'data-' + pluginName;
var monthFormats = ['short', 'long', 'numeric'];
var allowedArrangement = ['ymd', 'ydm', 'myd', 'mdy', 'dmy', 'dym'];
var allowedEvents = ['init', 'datechange', 'daychange', 'monthchange', 'yearchange', 'kill'];
var optionTagName = 'option';
var today = new Date();
var todayYear = today.getFullYear();
var todayMonth = today.getMonth() + 1;
var todayDay = today.getDate();
var initialized = false;
function trigger(elem, name, data) {
  var funData = elem.getAttribute('on' + name);
  var func = new Function('e',
  // 'with(document) {' +
  // 'with(this)' +
  '{' + funData + '}'
  // + '}'
  );
  func.call(elem, data);
}
var isTrue = function isTrue(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
};

/**
 * The Main Class
 *
 * @class BirthdayPicker
 */
var BirthdayPicker = /*#__PURE__*/function () {
  function BirthdayPicker(element, options) {
    _classCallCheck(this, BirthdayPicker);
    if (!element) {
      return {
        error: true
      };
    }
    element = 'string' === typeof element ? document.querySelector(element) : element;
    if (null === element || 0 === element.length) {
      return {
        error: true
      };
    }

    // todo: use dataStorage.has(element) ?
    if (element.dataset.bdpInit) {
      return BirthdayPicker.getInstance(element);
    }
    element.dataset.bdpInit = true;
    instances.push(this);
    dataStorage.put(element, 'instance', this);

    // from data api
    var data = getJSONData(element, pluginName, BirthdayPicker.defaults);
    this.options = options; // user options
    this.settings = Object.assign({}, BirthdayPicker.defaults, data, options);
    this.element = element;
    if (this.settings.autoInit) {
      this.init();
    }
  }

  /**
   * Function to return the index of a chosen value for a given NodeList
   * @param  {NodeList} nodes Option List
   * @param  {String} value Value to find
   * @return {mixed}       The index value or undefined
   */
  _createClass(BirthdayPicker, [{
    key: "_getIdx",
    value: function _getIdx(nodeList, value) {
      if (!nodeList) {
        return [undefined, undefined];
      }
      for (var i = 0; i < nodeList.length; i++) {
        var el = nodeList[i];
        if (+el.value === +value) {
          return [i, +el.value];
        }
      }
      return [undefined, undefined];
    }

    /**
     * set the year to a given value
     * and change the corresponding select-box too.
     * @param {String|Int} year the day value (eg, 1988, 2012, ...)
     * @returns
     */
  }, {
    key: "_setYear",
    value: function _setYear(year) {
      var triggerDateChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      year = restrict(year, this._yearEnd, this._yearStart);
      var _this$_getIdx = this._getIdx(this._year.el.childNodes, year),
        _this$_getIdx2 = src_slicedToArray(_this$_getIdx, 2),
        newYearIndex = _this$_getIdx2[0],
        newYearValue = _this$_getIdx2[1];
      if (this.currentYear === newYearValue) {
        return false;
      }
      this._year.el.selectedIndex = newYearIndex;
      this._yearWasChanged(newYearValue);
      if (triggerDateChange) {
        this._triggerEvent(allowedEvents[1]);
      }
      return true;
    }

    /**
     * set the month to a given value
     * and change the corresponding select-box too.
     * @param {String|Int} month the month value (usually between 1 - 12)
     * @returns
     */
  }, {
    key: "_setMonth",
    value: function _setMonth(month) {
      var triggerDateChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      month = restrict(month, 1, 12);
      var _this$_getIdx3 = this._getIdx(this._month.el.childNodes, month),
        _this$_getIdx4 = src_slicedToArray(_this$_getIdx3, 2),
        newMonthIndex = _this$_getIdx4[0],
        newMonthValue = _this$_getIdx4[1];
      if (this.currentMonth === newMonthValue) {
        return false;
      }
      this._month.el.selectedIndex = newMonthIndex;
      this._monthWasChanged(newMonthValue);
      if (triggerDateChange) {
        this._triggerEvent(allowedEvents[1]);
      }
      return true;
    }

    /**
     * set the day to a given value
     * and change the corresponding select-box too.
     * @param {String|Int} day the day value (usually between 1 - 31)
     * @returns
     */
  }, {
    key: "_setDay",
    value: function _setDay(day) {
      var triggerDateChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      day = restrict(day, 1, 31);
      var _this$_getIdx5 = this._getIdx(this._day.el.childNodes, day),
        _this$_getIdx6 = src_slicedToArray(_this$_getIdx5, 2),
        newDayIndex = _this$_getIdx6[0],
        newDayValue = _this$_getIdx6[1];
      if (this.currentDay === newDayValue) {
        return false;
      }
      this._day.el.selectedIndex = newDayIndex;
      this._dayWasChanged(newDayValue);
      if (triggerDateChange) {
        this._triggerEvent(allowedEvents[1]);
      }
      return true;
    }
  }, {
    key: "_getDateValuesInRange",
    value: function _getDateValuesInRange(_ref) {
      var year = _ref.year,
        month = _ref.month,
        day = _ref.day;
      // todo: define a min & max date
      if (year < this._yearEnd) {
        year = month = day = undefined;
      } else if (year > this._yearStart) {
        year = todayYear;
        month = todayMonth;
        day = todayDay;
      } else if (year === this._yearStart) {
        if (month > todayMonth) {
          month = todayMonth;
          day = todayDay;
        } else if (month === todayMonth && day > todayDay) {
          day = todayDay;
        }
      }
      return {
        year: year,
        month: month,
        day: day
      };
    }

    /**
     * Set the date
     * @param {Object} obj with year, month, day as String or Integer
     */
  }, {
    key: "_setDate",
    value: function _setDate(_ref2) {
      var year = _ref2.year,
        month = _ref2.month,
        day = _ref2.day;
      // small helper for the event triggering system
      this._monthChangeTriggeredLater = month !== this.currentMonth;
      var _yChanged = this._setYear(year, false);
      var _mChanged = this._setMonth(month, false);
      var _dChanged = this._setDay(day, false);
      if (_yChanged || _mChanged || _dChanged) {
        if (!this.settings.selectFuture) {
          this._noFutureDate(todayYear, todayMonth, todayDay);
        }
        this._triggerEvent(allowedEvents[1]);
      }
      this._monthChangeTriggeredLater = false;
    }
  }, {
    key: "_parseDate",
    value: function _parseDate(dateString) {
      if ('object' !== src_typeof(dateString)) {
        // safari fix '2004-2-29' -> '2004/2/29'
        dateString = dateString.replaceAll('-', '/');
      }
      // unix timestamp
      var parse = Date.parse(dateString);
      if (isNaN(parse)) {
        return false; // wrong date
      }
      var date = new Date(parse);
      // add a local timezone offset ??
      // date.setSeconds(date.getSeconds() + date.getTimezoneOffset() * 60);
      // const year = date.getUTCFullYear();
      // const month = date.getUTCMonth() + 1;
      // const day = date.getUTCDate();

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      return {
        year: year,
        month: month,
        day: day
      };
    }

    // function for update or create
  }, {
    key: "_getMonthText",
    value: function _getMonthText(text) {
      if ('numeric' !== this.settings.monthFormat) {
        return text;
      }
      return this.settings.leadingZero ? +text < 10 ? '0' + text : '' + text : '' + text; // return string
    }

    /**
     * Create the gui and set the default (start) values if available
     * @return {void}
     */
  }, {
    key: "_create",
    value: function _create() {
      var _this = this;
      var s = this.settings;

      // bigEndian:    ymd
      // littleEndian: dmy
      // else:         mdy
      if (allowedArrangement.indexOf(s.arrange) < 0) {
        s.arrange = 'ymd';
      }
      var lookup = {
        y: 'year',
        m: 'month',
        d: 'day'
      };
      s.arrange.split('').forEach(function (i) {
        var item = lookup[i];
        var itemEl;
        var query = s[item + 'El'];
        if (query && 'undefined' !== typeof query.nodeName) {
          itemEl = query;
        } else {
          query = query ? query : '[' + dataName + '-' + item + ']';
          itemEl = _this.element.querySelector(query);
        }
        if (!itemEl || itemEl.dataset.init) {
          itemEl = createEl('select');
          _this.element.append(itemEl);
        }
        _this['_' + item] = {
          el: itemEl,
          df: document.createDocumentFragment(),
          name: item // placeholder name
        };
        _this._date.push(_this['_' + item]);
        itemEl.dataset.init = true;
        itemEl.addEventListener('change', function (evt) {
          _this._dateChanged(evt);
        }, false);
      });
      var optionEl = createEl(optionTagName, {
        value: ''
      });

      // placeholder
      if (s.placeholder) {
        this._date.forEach(function (item) {
          var name = BirthdayPicker.i18n[s.locale].text[item.name];
          var option = optionEl.cloneNode();
          option.innerHTML = name;
          item.df.appendChild(option);
        });
      }

      // add option data to year field
      for (var i = this._yearStart; i >= this._yearEnd; i--) {
        var option = optionEl.cloneNode();
        option.value = i;
        option.innerHTML = i;
        this._year.df.append(option);
      }

      // add to month
      this.monthFormat[s.monthFormat].forEach(function (text, ind) {
        var option = optionEl.cloneNode();
        option.value = ind + 1;
        option.innerHTML = _this._getMonthText(text);
        _this._month.df.append(option);
      });

      // add day
      var number;
      for (var _i = 1; _i <= 31; _i++) {
        number = s.leadingZero ? _i < 10 ? '0' + _i : _i : _i;
        var el = createEl(optionTagName, {
          value: _i
        }, '', number);
        this._day.df.append(el);
      }

      // append fragments to elements
      this._date.forEach(function (item) {
        return item.el.append(item.df);
      });
    }

    /**
     * function to update the days, according to the given month
     * @param  {String} month The month String
     * @return {[type]}       [description]
     */
  }, {
    key: "_updateDays",
    value: function _updateDays(month) {
      // console.log('_updateDays');
      var newDaysPerMonth = this._daysPerMonth[+month - 1];
      var offset = this.settings.placeholder ? 1 : 0;
      var currentDaysPerMonth = this._day.el.children.length - offset;
      if (newDaysPerMonth === currentDaysPerMonth) {
        return;
      }
      if (newDaysPerMonth - currentDaysPerMonth > 0) {
        // add days
        for (var i = currentDaysPerMonth; i < newDaysPerMonth; i++) {
          var el = createEl(optionTagName, {
            value: i + 1
          }, '', '' + (i + 1));
          this._day.el.append(el);
        }
      } else {
        // remove days
        for (var _i2 = currentDaysPerMonth; _i2 > newDaysPerMonth; _i2--) {
          this._day.el.children[_i2 + offset - 1].remove();
        }

        // day changed after changing month
        // todo: set currentDay to the next or the prev. correct date
        // eg. 2010-12-31 -> change month to 11 -> 2010-11-31
        // either: 2010-11-30, or 2010-12-01
        if (this.currentDay > newDaysPerMonth) {
          if (this.settings.roundDownDay) {
            this._setDay(newDaysPerMonth, false);
          } else {
            this._dayWasChanged(undefined);
          }
        }
      }

      // if (this.currentDay && +this._day.el.value !== this.currentDay) {
      //   this._dayWasChanged(); // to undefined
      // }
    }
  }, {
    key: "_triggerEvent",
    value: function _triggerEvent(eventName, data) {
      var detail = _objectSpread({
        instance: this,
        year: +this._year.el.value,
        month: +this._month.el.value,
        day: +this._day.el.value,
        date: this.getDate()
      }, data);
      var eventData = {
        detail: detail
      };
      var ce = new CustomEvent(eventName, eventData);
      this.element.dispatchEvent(ce);
      this.eventFired[eventName] = ce;

      // for inline events
      trigger(this.element, eventName, ce);
    }
  }, {
    key: "_noFutureDate",
    value: function _noFutureDate(year, month, day) {
      var _this2 = this;
      // console.log('_noFutureDate');
      // set all to false (again)
      if (this._disabled.length) {
        this._disabled.forEach(function (el) {
          el.disabled = false;
        });
        this._disabled = [];
      }
      if (+this.currentYear > year) {
        this._setYear(year, false);
        if (+this.currentMonth !== month) {
          this._setMonth(month, false);
        }
        if (+this.currentDay !== day) {
          this._setDay(day, false);
        }
      } else if (+this.currentYear === year) {
        // Disable months greater than the current month
        this._month.el.childNodes.forEach(function (el) {
          if (el.value > month) {
            el.disabled = true;
            _this2._disabled.push(el);
          }
        });

        // set month back
        if (+this.currentMonth > month) {
          this._setMonth(month, false);
        }

        // disable all days greater than the current day
        if (+this.currentMonth === month) {
          this._day.el.childNodes.forEach(function (el) {
            if (el.value > day) {
              el.disabled = true;
              _this2._disabled.push(el);
            }
          });

          // set days back
          if (+this.currentDay > day) {
            this._setDay(day, false);
          }
        }
      }
    }

    /**
     * date change event handler, called if one of the fields is updated
     * @param  {Event} e The event
     * @return {void}
     */
  }, {
    key: "_dateChanged",
    value: function _dateChanged(evt) {
      // if (evt) {
      if (evt.target === this._year.el) {
        this._yearWasChanged(+evt.target.value);
      } else if (evt.target === this._month.el) {
        this._monthWasChanged(+evt.target.value);
      } else if (evt.target === this._day.el) {
        this._dayWasChanged(+evt.target.value);
      }
      // }

      if (!this.settings.selectFuture) {
        this._noFutureDate(todayYear, todayMonth, todayDay);
      }
      this._triggerEvent(allowedEvents[1]);
    }

    /**
     * called if the day was changed
     * sets the currentDay value
     * @param {number} day
     * @returns
     */
  }, {
    key: "_dayWasChanged",
    value: function _dayWasChanged(day) {
      // console.log('_dayWasChanged:', day);
      // const from = this.currentDay;
      this.currentDay = day;
      this._triggerEvent(allowedEvents[2]);
    }

    /**
     * called if the month was changed
     * sets the currentMonth value
     * @param {number} month
     * @returns
     */
  }, {
    key: "_monthWasChanged",
    value: function _monthWasChanged(month) {
      // console.log('_monthWasChanged:', month);
      // const from = this.currentMonth;
      this.currentMonth = month;
      this._triggerEvent(allowedEvents[3]);
      this._updateDays(month);
    }

    /**
     * called if the year was changed
     * sets the currentYear value
     * @param {number} year
     * @returns
     */
  }, {
    key: "_yearWasChanged",
    value: function _yearWasChanged(year) {
      // console.log('_yearWasChanged:', year);
      // const from = this.currentYear;
      this.currentYear = year;
      this._daysPerMonth[1] = helper_isLeapYear(year) ? 29 : 28;
      this._triggerEvent(allowedEvents[4]);
      if (!this._monthChangeTriggeredLater) {
        if (+this._month.el.value === 2) {
          this._updateDays(this._month.el.value);
        }
      }
    }
  }, {
    key: "useLeadingZero",
    value: function useLeadingZero(value) {
      value = isTrue(value);
      if (value !== this.settings.leadingZero) {
        this.settings.leadingZero = value;
        if ('numeric' === this.settings.monthFormat) {
          this._updateMonthList();
        }
        this._updateDayList();
      }
    }
  }, {
    key: "_updateDayList",
    value: function _updateDayList() {
      var offset = this.settings.placeholder ? 1 : 0;
      for (var i = 0; i < 9; i++) {
        var el = this._day.el.childNodes[i + offset];
        el.innerHTML = (this.settings.leadingZero ? '0' : '') + (i + 1);
      }
    }
  }, {
    key: "_updateMonthList",
    value: function _updateMonthList() {
      var _this3 = this;
      var format = this.settings.monthFormat;
      var offset = this.settings.placeholder ? 1 : 0;
      this.monthFormat[format].forEach(function (text, i) {
        _this3._month.el.childNodes[i + offset].innerHTML = _this3._getMonthText(text);
      });
    }

    /**
     * Change the current active month format
     * @param  {[type]} format [description]
     * @return {[type]}        [description]
     */
  }, {
    key: "setMonthFormat",
    value: function setMonthFormat(format) {
      if (!this.monthFormat[format] || format === this.settings.monthFormat) {
        return false;
      }
      this.settings.monthFormat = format;
      this._updateMonthList();
    }
  }, {
    key: "setLanguage",
    value: function setLanguage(lang) {
      var _this4 = this;
      if (lang === this.settings.locale || ('' + lang).length < 2 || ('' + lang).length > 2) {
        // console.log('nothing to change');
        return false;
      }
      BirthdayPicker.createLocale(lang);
      var langTexts = BirthdayPicker.i18n[lang];

      // set the placeholder texts
      if (this.settings.placeholder) {
        this._date.forEach(function (item) {
          item.el.childNodes[0].innerHTML = langTexts.text[item.name];
        });
      }
      this.monthFormat = langTexts.month;
      // const from = this.settings.locale;
      this.settings.locale = lang;

      // todo: is this correct for all languages?
      if ('numeric' === this.settings.monthFormat) {
        return false;
      }
      var filter = this.settings.placeholder ? 1 : 0;
      this.monthFormat[this.settings.monthFormat].forEach(function (el, ind) {
        _this4._month.el.childNodes[filter + ind].innerHTML = el;
      });

      // trigger a datechange event, as the output format might change
      this._triggerEvent(allowedEvents[1]);
    }

    // todo: use a format option, eg.: yyyy-dd-mm
  }, {
    key: "setDate",
    value: function setDate(dateString) {
      var parsed = this._parseDate(dateString);
      if (parsed) {
        parsed = this._getDateValuesInRange(parsed);
        this._setDate(parsed);
      }
      return parsed;
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(eventName, listener, option) {
      if (allowedEvents.indexOf(eventName) < 0 || 'function' !== typeof listener) {
        return false;
      }
      this.element.addEventListener(eventName, listener, option);
      this._registeredEventListeners.push({
        eventName: eventName,
        listener: listener,
        option: option
      });

      // already fired
      if (this.eventFired[eventName]) {
        listener.call(this.element, this.eventFired[eventName]);
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventName, listener, option) {
      this.element.removeEventListener(eventName, listener, option);
    }

    // todo: undo everything
  }, {
    key: "kill",
    value: function kill() {
      var _this5 = this;
      this.eventFired = {};

      // remove all registered EventListeners
      if (this._registeredEventListeners) {
        this._registeredEventListeners.forEach(function (r) {
          return _this5.removeEventListener(r.eventName, r.listener, r.option);
        });
      }
      this._triggerEvent(allowedEvents[5]);
    }
  }, {
    key: "isLeapYear",
    value: function isLeapYear() {
      var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentYear;
      return undefined === year ? undefined : helper_isLeapYear(year);
    }
  }, {
    key: "getDate",
    value: function getDate(format) {
      if (!this.currentYear || !this.currentMonth || !this.currentDay) {
        return '';
      }
      // use the language default
      if (!format) {
        var tmp = new Date(Date.UTC(this.currentYear, +this.currentMonth - 1, this.currentDay));
        return tmp.toLocaleDateString(this.settings.locale);
      }

      // eg. 'YYYY-MM-DD'
      var result = format.toLowerCase();
      result = result.replace(/yyyy/g, this.currentYear);
      result = result.replace(/yy/g, ('' + this.currentYear).slice(2));
      result = result.replace(/mm/g, ('0' + this.currentMonth).slice(-2));
      result = result.replace(/m/g, this.currentMonth);
      result = result.replace(/dd/g, ('0' + this.currentDay).slice(-2));
      result = result.replace(/d/g, this.currentDay);
      return result;
    }

    /**
     * The init method
     * todo: test all(!) option values for correctness
     *
     * @return {*}
     * @memberof BirthdayPicker
     */
  }, {
    key: "init",
    value: function init() {
      if (this.initialized) {
        return true;
      }
      this.initialized = true;
      this.eventFired = {};
      this._registeredEventListeners = [];
      this._daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      this._date = [];

      // store all disabled elements in an array for quicker reenable
      this._disabled = [];
      var s = this.settings;
      s.placeholder = isTrue(s.placeholder);
      s.leadingZero = isTrue(s.leadingZero);
      s.selectFuture = isTrue(s.selectFuture);
      if ('now' === s.maxYear) {
        this._yearStart = todayYear;
      } else {
        this._yearStart = s.maxYear;
      }
      this._yearStart -= +s.minAge;
      if (s.minYear) {
        this._yearEnd = +s.minYear;
      } else {
        this._yearEnd = this._yearStart - +s.maxAge;
      }
      BirthdayPicker.createLocale(s.locale);
      this.monthFormat = BirthdayPicker.i18n[s.locale].month;
      this._create();
      this._triggerEvent(allowedEvents[0]);

      // set default start value
      if (s.defaultDate) {
        this.setDate(s.defaultDate === 'now' ? new Date().toString() : s.defaultDate);
      }
    }
  }]);
  return BirthdayPicker;
}();
BirthdayPicker.i18n = {};
BirthdayPicker.currentLocale = 'en';

// BirthdayPickerLocale
var locale = {
  en: {
    text: {
      year: 'Year',
      month: 'Month',
      day: 'Day'
    }
  },
  de: {
    text: {
      year: 'Jahr',
      month: 'Monat',
      day: 'Tag'
    }
  }
};
BirthdayPicker.createLocale = function (lang) {
  if (BirthdayPicker.i18n[lang]) {
    return;
  }
  var dd = new Date('2000-01-15');
  var obj = {
    month: {}
  };
  for (var i = 0; i < 12; i++) {
    dd.setMonth(i);
    monthFormats.forEach(function (format) {
      obj.month[format] = obj.month[format] || [];
      obj.month[format].push(dd.toLocaleDateString(lang, {
        month: format
      }));
    });
  }
  var i18n = 'BirthdayPickerLocale';
  var tmp = locale[lang] ? locale[lang] : locale.en;
  if (window[i18n] && window[i18n][lang] && window[i18n][lang].text) {
    tmp = Object.assign({}, tmp, window[i18n][lang]);
  }
  obj['text'] = tmp.text;
  BirthdayPicker.i18n[lang] = obj;
  return obj;
};

/**
 * Set the month format for all registered instances
 * @param  {String} format The available formats are: 'short', 'long', 'numeric'
 */
BirthdayPicker.setMonthFormat = function (format) {
  instances.forEach(function (bp) {
    bp.setMonthFormat(format);
  });
};

/**
 * Set the language of all registered instances
 * @param  {String} lang The language string, eg.: 'en', 'de'
 */
BirthdayPicker.setLanguage = function (lang) {
  BirthdayPicker.currentLocale = lang;
  instances.forEach(function (bp) {
    bp.setLanguage(lang);
  });
};
BirthdayPicker.getInstance = function (el) {
  return dataStorage.get(el, 'instance');
};
BirthdayPicker.killAll = function () {
  if (!instances) {
    return;
  }
  instances.forEach(function (instance) {
    BirthdayPicker.kill(instance);
  });
};
BirthdayPicker.kill = function (instance) {
  if (!instance) {
    return;
  }
  if (!instance.element) {
    // if an html element
    instance = BirthdayPicker.getInstance(instance);
  }
  if (!instance) {
    return;
  }

  // todo: reset all to default!
  instance.kill();
  var el = instance.element;
  el.dataset.bdpInit = false;
  delete el.dataset.bdpInit;
  dataStorage.remove(el, 'instance');
};
BirthdayPicker.defaults = {
  minYear: null,
  // overrides the value set by maxAge
  maxYear: 'now',
  minAge: 0,
  maxAge: 100,
  monthFormat: 'short',
  placeholder: true,
  defaultDate: null,
  autoInit: true,
  leadingZero: true,
  locale: 'en',
  selectFuture: false,
  arrange: 'ymd',
  yearEl: null,
  monthEl: null,
  dayEl: null,
  roundDownDay: true
};
BirthdayPicker.init = function () {
  if (initialized) {
    return false;
  }
  initialized = true;
  BirthdayPicker.createLocale(BirthdayPicker.currentLocale);
  var element = document.querySelectorAll('[' + dataName + ']');
  if (0 === element.length) {
    return !1;
  }
  element.forEach(function (el) {
    if (el.dataset.bdpInit) {
      return BirthdayPicker.getInstance(el);
    }
    var data = getJSONData(el, pluginName);
    new BirthdayPicker(el, data);
  });
  return instances;
};
docReady(BirthdayPicker.init);
/* harmony default export */ var src = (BirthdayPicker);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});