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
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
  if ('complete' === document.readyState || 'interactive' === document.readyState) {
    cb();
    document.removeEventListener('DOMContentLoaded', cb);
  } else {
    document.addEventListener('DOMContentLoaded', cb, false);
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
  // get all
  if (undefined === name) {
    return el.dataset;
  }
  var data = el.dataset[name];
  if (undefined === data) {
    return false;
  }
  try {
    // eslint-disable-next-line quotes
    data = JSON.parse(data.replaceAll("'", '"'));
    // eslint-disable-next-line no-empty
  } catch (e) {}
  var obj = {};
  var len = name.length;
  Object.entries(el.dataset).forEach(function (item) {
    if (item[0].toLowerCase().indexOf(name) >= 0 && item[0].length > len) {
      var key = item[0][len].toLowerCase() + item[0].substring(len + 1);
      if (defaults && undefined !== defaults[key]) {
        obj[key] = item[1];
      }
    }
  });
  return Object.assign(obj, data);
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
  _storage: new WeakMap(),
  put: function put(el) {
    if (!this._storage.has(el)) {
      this._storage.set(el, new Map());
    }
    for (var _len = arguments.length, keyVal = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keyVal[_key - 1] = arguments[_key];
    }
    if (keyVal.length > 1) {
      this._storage.get(el).set(keyVal[0], keyVal[1]);
    } else if ('object' === _typeof(keyVal[0])) {
      for (var k in keyVal[0]) {
        if ({}.hasOwnProperty.call(keyVal[0], k)) {
          this._storage.get(el).set(k, keyVal[0][k]);
        }
      }
    }
  },
  get: function get(el, key) {
    if (!this._storage.has(el)) {
      return new Map();
    }
    if (key) {
      return this._storage.get(el).get(key);
    }
    return this._storage.get(el);
  },
  has: function has(el, key) {
    return this._storage.has(el) && this._storage.get(el).has(key);
  },
  remove: function remove(el, key) {
    if (!this._storage.has(el)) {
      return false;
    }
    var ret = this._storage.get(el).delete(key);
    if (!this._storage.get(el).size === 0) {
      this._storage.delete(el);
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
function src_typeof(obj) { "@babel/helpers - typeof"; return src_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, src_typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return src_typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (src_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (src_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*!
 * (c) wolfgang jungmayer
 */


var instances = [];
var dataName = 'data-birthdaypicker';
var monthFormats = ['short', 'long', 'numeric'];
var allowedEvents = ['datechange'];
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

/**
 * The Main Class
 *
 * @class BirthdayPicker
 */
var BirthdayPicker = /*#__PURE__*/function () {
  function BirthdayPicker(element, options) {
    var _this = this;
    _classCallCheck(this, BirthdayPicker);
    _defineProperty(this, "_dateChanged", function (evt) {
      if (evt) {
        if (evt.target === _this._year.el) {
          _this._yearChanged(evt.target.value);
        } else if (evt.target === _this._month.el) {
          _this._monthChanged(evt.target.value);
        } else if (evt.target === _this._day.el) {
          _this._dayChanged(evt.target.value);
        }
      }
      if (_this.settings.noFutureDate) {
        _this._nofuturDate();
      }
      if (!_this._prevent) {
        _this._triggerEvent('datechange');
      }
    });
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
    if (element.dataset.bdpinit) {
      return BirthdayPicker.getInstance(element);
    }
    element.dataset.bdpinit = true;
    instances.push(this);
    dataStorage.put(element, 'instance', this);

    // from data api
    var data = getJSONData(element, 'birthdaypicker', BirthdayPicker.defaults);
    this.options = options; // user options
    this.settings = Object.assign({}, BirthdayPicker.defaults, data, options);
    this.element = element;
    if (this.settings.autoinit) {
      this.init();
    }
  }
  _createClass(BirthdayPicker, [{
    key: "addEventListener",
    value: function addEventListener(eventName, listener, option) {
      if (allowedEvents.indexOf(eventName) < 0 || 'function' !== typeof listener) {
        return false;
      }
      this.element.addEventListener(eventName, listener, option);

      // already fired
      if (this.eventFired[eventName]) {
        listener.call(this.element, this.eventFired[eventName]);
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventName, listener, option) {
      this.element.addEventListener(eventName, listener, option);
    }

    /**
     * Function to return the index of a chosen value for a given NodeList
     * @param  {NodeList} nodes Option List
     * @param  {String} value Value to find
     * @return {mixed}       The index value or undefined
     */
  }, {
    key: "_getNodeIndexByValue",
    value: function _getNodeIndexByValue(nodelist, value) {
      for (var i = 0; i < nodelist.length; i++) {
        var el = nodelist[i];
        if (+el.value === +value) {
          return [i, el.value];
        }
      }
      return [undefined, undefined];
    }
  }, {
    key: "_setYear",
    value: function _setYear(year) {
      year = restrict(year, this._yearEnd, this._yearBegin, this._yearEnd);
      var _this$_getNodeIndexBy = this._getNodeIndexByValue(this._year.el.childNodes, year),
        _this$_getNodeIndexBy2 = _slicedToArray(_this$_getNodeIndexBy, 2),
        newYearIndex = _this$_getNodeIndexBy2[0],
        newYearValue = _this$_getNodeIndexBy2[1];
      if (this.currentYear !== newYearValue) {
        this._year.el.selectedIndex = newYearIndex;
        this._yearChanged(newYearValue);
        // this._year.el.dispatchEvent(new Event('change'));
      }
    }
  }, {
    key: "_setDay",
    value: function _setDay(day) {
      day = restrict(day, 1, 31);
      var _this$_getNodeIndexBy3 = this._getNodeIndexByValue(this._day.el.childNodes, day),
        _this$_getNodeIndexBy4 = _slicedToArray(_this$_getNodeIndexBy3, 2),
        newDayIndex = _this$_getNodeIndexBy4[0],
        newDayValue = _this$_getNodeIndexBy4[1];
      if (this.currentDay !== newDayValue) {
        this._day.el.selectedIndex = newDayIndex;
        this._dayChanged(newDayValue);
      }
    }
  }, {
    key: "_setMonth",
    value: function _setMonth(month) {
      month = restrict(month, 1, 12);
      var _this$_getNodeIndexBy5 = this._getNodeIndexByValue(this._month.el.childNodes, month),
        _this$_getNodeIndexBy6 = _slicedToArray(_this$_getNodeIndexBy5, 2),
        newMonthIndex = _this$_getNodeIndexBy6[0],
        newMonthValue = _this$_getNodeIndexBy6[1];
      if (this.currentMonth !== newMonthValue) {
        this._month.el.selectedIndex = newMonthIndex;
        this._monthChanged(newMonthValue);
      }
    }

    /**
     * Set the date
     * @param {String | Int} year  The year.
     * @param {String | Int} month The month.
     * @param {String | Int} day   The day.
     */
  }, {
    key: "setDate",
    value: function setDate(year, month, day) {
      this._prevent = true; // prevent _dateChanged to fire

      this._setYear(year);
      this._setMonth(month);
      this._setDay(day);
      this._prevent = false; // stop prevent _dateChanged to fire
      this._dateChanged();
    }
  }, {
    key: "setLanguage",
    value: function setLanguage(lang) {
      var _this2 = this;
      if (lang === this.settings.locale) {
        // console.log('nothing to change');
        return false;
      }
      BirthdayPicker.createLocale(lang);
      this.monthFormat = BirthdayPicker.i18n[lang].month;

      // todo: is this correct for all languages?
      if ('numeric' === this.settings.monthFormat) {
        return false;
      }
      var filter = this.settings.placeholder ? 1 : 0;
      this.monthFormat[this.settings.monthFormat].forEach(function (el, ind) {
        _this2._month.el.childNodes[filter + ind].innerHTML = el;
      });
      this.settings.locale = lang;
    }

    /**
     * Change the current active month format
     * @param  {[type]} format [description]
     * @return {[type]}        [description]
     */
  }, {
    key: "setMonthFormat",
    value: function setMonthFormat(format) {
      var _this3 = this;
      if (!this.monthFormat[format] || format === this.settings.monthFormat) {
        return false;
      }
      this.settings.monthFormat = format;
      var filter = this.settings.placeholder ? 1 : 0;
      this.monthFormat[format].forEach(function (text, ind) {
        _this3._month.el.childNodes[filter + ind].innerHTML = _this3._getMonthText(text);
      });
    }

    // getter
  }, {
    key: "isLeapYear",
    value: function isLeapYear() {
      var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return helper_isLeapYear(year || this.currentYear);
    }

    // todo: return the correct date format, or if set the value as given in the string
  }, {
    key: "getDate",
    value: function getDate(format) {
      // eg. 'YYYY-MM-DD'
      var result = format.toLowerCase();
      result.replace('yyyy', this.currentYear);
      result.replace('mm', this.currentMonth);
      result.replace('dd', this.currentDay);
    }

    // function for opdate or create
  }, {
    key: "_getMonthText",
    value: function _getMonthText(text) {
      if ('numeric' !== this.settings.monthFormat) {
        return text;
      }
      return this.settings.useLeadingZero ? +text < 10 ? '0' + text : text : text;
    }

    /**
     * Create the gui and set the default (start) values if available
     * @return {void}
     */
  }, {
    key: "_createBirthdayPicker",
    value: function _createBirthdayPicker() {
      var _this4 = this;
      // placeholder
      if (this.settings.placeholder) {
        this._date.forEach(function (item) {
          var option = createEl('option', {
            value: ''
          }, '', item.name);
          item.df.appendChild(option);
        });
      }

      // add option data to year field
      for (var i = this._yearBegin; i >= this._yearEnd; i--) {
        var el = createEl('option', {
          value: i
        }, '', i);
        this._year.df.append(el);
      }

      // add to month
      this.monthFormat[this.settings.monthFormat].forEach(function (text, ind) {
        var el = createEl('option', {
          value: ind + 1
        }, '', _this4._getMonthText(text));
        _this4._month.df.append(el);
      });

      // add day
      var number;
      for (var _i2 = 1; _i2 <= 31; _i2++) {
        number = this.settings.useLeadingZero ? _i2 < 10 ? '0' + _i2 : _i2 : _i2;
        var _el = createEl('option', {
          value: _i2
        }, '', number);
        this._day.df.append(_el);
      }

      // append fragments to elements
      this._date.forEach(function (item) {
        return item.el.append(item.df);
      });

      // set default start value
      if (this.settings.defaultDate) {
        this.setDate(this.settings.defaultDate.year, this.settings.defaultDate.month, this.settings.defaultDate.day);
      }
    }

    /**
     * function to update the days, according to the given month
     * @param  {String} month The month String
     * @return {[type]}       [description]
     */
  }, {
    key: "_updateDays",
    value: function _updateDays(month) {
      var newDays = this._monthDayMapping[+month - 1];
      var currentDays = this._day.el.children.length - (this.settings.placeholder ? 1 : 0);
      if (newDays === currentDays) {
        return;
      }
      if (newDays - currentDays > 0) {
        // add days
        for (var i = currentDays; i < newDays; i++) {
          var el = createEl('option', {
            value: i + 1
          }, '', '' + (i + 1));
          this._day.el.append(el);
        }
      } else {
        // remove days
        for (var _i3 = currentDays; _i3 > newDays; _i3--) {
          this._day.el.children[_i3].remove();
        }
      }
    }
  }, {
    key: "_triggerEvent",
    value: function _triggerEvent(eventName) {
      var eventData = {
        detail: {
          instance: this,
          year: this._year.el.value,
          month: this._month.el.value,
          day: this._day.el.value
        }
      };
      var ce = new CustomEvent(eventName, eventData);
      this.element.dispatchEvent(ce);
      this.eventFired[eventName] = ce;

      // for inline events
      trigger(this.element, eventName, ce);
    }
  }, {
    key: "_nofuturDate",
    value: function _nofuturDate() {
      var _this5 = this;
      // set all to false (again)
      if (this.disabledReference.length) {
        this.disabledReference.forEach(function (el) {
          el.disabled = false;
        });
        this.disabledReference = [];
      }
      if (+this.currentYear === todayYear) {
        // Disable months greater than the current month
        this._month.el.childNodes.forEach(function (el) {
          if (el.value > todayMonth) {
            el.disabled = true;
            _this5.disabledReference.push(el);
          }
        });

        // set month back
        if (+this.currentMonth > todayMonth) {
          var _this$_getNodeIndexBy7 = this._getNodeIndexByValue(this._month.el.childNodes, todayMonth),
            _this$_getNodeIndexBy8 = _slicedToArray(_this$_getNodeIndexBy7, 2),
            newMonthIndex = _this$_getNodeIndexBy8[0],
            newMonthValue = _this$_getNodeIndexBy8[1];
          if (this.currentMonth !== newMonthValue) {
            this._month.el.selectedIndex = newMonthIndex;
            this._monthChanged(newMonthValue);
            // this._month.el.dispatchEvent(new Event('change'));
          }
        }

        // disable all days greater than the current day
        if (+this.currentMonth === todayMonth) {
          this._day.el.childNodes.forEach(function (el) {
            if (el.value > todayDay) {
              el.disabled = true;
              _this5.disabledReference.push(el);
            }
          });

          // set days back
          if (+this.currentDay >= todayDay) {
            this._setDay(todayDay);
          }
        }
      }

      // && this.currentMonth >= todayMonth) {
      // if(this.currentMonth > todayMonth) {
      //   this._month.el.childNodes.forEach(el => {
      //     if (el.value > this.currentMonth) {
      //       el.disabled = true;
      //     }
      //   })
      // }
    }

    /**
     * date change event handler, called if one of the fields is updated
     * @param  {Event} e The event
     * @return {void}
     */
  }, {
    key: "_dayChanged",
    value: function _dayChanged(day) {
      // console.log('_dayChanged:', day);
      this.currentDay = day;
    }
  }, {
    key: "_monthChanged",
    value: function _monthChanged(month) {
      // console.log('_monthChanged:', month);
      this.currentMonth = month;
      this._updateDays(month);
    }
  }, {
    key: "_yearChanged",
    value: function _yearChanged(year) {
      // console.log('_yearChanged:', year);
      this.currentYear = year;
      this._monthDayMapping[1] = helper_isLeapYear(year) ? 29 : 28;

      // if feb
      var month = this._month.el.value;
      if (2 === +month) {
        this._updateDays(month);
        if (this._day.el.value >= 29) {
          this._dayChanged(this._day.el.value);
        }
      }
    }

    /**
     * The init method
     * @param  { Object } s Settings Object
     * @return { void }
     */
  }, {
    key: "init",
    value: function init() {
      this._monthDayMapping = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      // todo: find or create(!)
      this._year = {
        el: this.element.querySelector('[' + dataName + '-year]'),
        df: document.createDocumentFragment(),
        name: 'year'
      };
      this._month = {
        el: this.element.querySelector('[' + dataName + '-month]'),
        df: document.createDocumentFragment(),
        name: 'month'
      };
      this._day = {
        el: this.element.querySelector('[' + dataName + '-day]'),
        df: document.createDocumentFragment(),
        name: 'day'
      };
      this._date = [this._year, this._month, this._day];

      //calculate the year to add to the select options.
      this._yearBegin = todayYear - this.settings.minAge;
      this._yearEnd = todayYear - this.settings.maxAge;
      if (this.settings.maxYear != todayYear && this.settings.maxYear > todayYear) {
        this._yearBegin = this.settings.maxYear;
        this._yearEnd = this._yearEnd + (this.settings.maxYear - todayYear);
      }

      // todo: able to get a real date string
      if (this.settings.defaultDate) {
        if ('today' === this.settings.defaultDate) {
          this.settings.defaultDate = {
            year: todayYear,
            month: todayMonth,
            day: todayDay
          };
        } else {
          // todo: check for correctness
          var split = this.settings.defaultDate.split('-');
          this.settings.defaultDate = {
            year: split[0],
            month: split[1],
            day: split[2]
          };
        }
      }
      this._year.el.addEventListener('change', this._dateChanged);
      this._month.el.addEventListener('change', this._dateChanged);
      this._day.el.addEventListener('change', this._dateChanged);
      this.settings.locale;
      BirthdayPicker.createLocale(this.settings.locale);
      this.monthFormat = BirthdayPicker.i18n[this.settings.locale].month;

      // store all disabled elements in an array for quicker reenable
      this.disabledReference = [];
      this.eventFired = {};
      this._createBirthdayPicker();
    }
  }]);
  return BirthdayPicker;
}();
var dataapi = function dataapi(element) {
  if (!element) {
    return !1;
  }
  element = 'string' === typeof element ? document.querySelectorAll(element) : element;
  if (0 === element.length) {
    return !1;
  }
  if (undefined === element.length) {
    element = [element];
  }
  element.forEach(function (el) {
    if (el.dataset.bdpinit) {
      return BirthdayPicker.getInstance(el);
    }
    var data = getJSONData(el, 'birthdaypicker');
    new BirthdayPicker(el, data);
  });

  // return 1 === len ? instances[0] : instances[1];
  // return 1 === instances.length ? instances[0] : instances;
};

BirthdayPicker.i18n = {};
BirthdayPicker.defaultLocale = 'en';
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
  BirthdayPicker.i18n[lang] = obj;
  return lang;
};
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
  BirthdayPicker.createLocale(lang);
  BirthdayPicker.defaultLocale = lang;
  instances.forEach(function (bp) {
    bp.setLanguage(lang);
  });
};
BirthdayPicker.getInstance = function (el) {
  return dataStorage.get(el, 'instance');
};
BirthdayPicker.defaults = {
  maxAge: 100,
  // maximal age for a person
  minAge: 0,
  // minimal age for a person
  maxYear: todayYear,
  monthFormat: 'short',
  // order: 'ymd',
  placeholder: true,
  defaultDate: null,
  // null || 'today'
  autoinit: true,
  useLeadingZero: true,
  locale: 'de',
  noFutureDate: true // max date is current date
};

var init = function init() {
  if (initialized) {
    return false;
  }
  initialized = true;
  BirthdayPicker.createLocale(BirthdayPicker.defaultLocale);
  dataapi('[' + dataName + ']');
};
docReady(init);
/* harmony default export */ var src = (BirthdayPicker);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=birthdaypicker.js.map