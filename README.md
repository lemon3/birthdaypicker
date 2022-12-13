<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![MIT License][license-shield]][license-url]
![min coverage][mincoverage-shield]
![minified size][minified-shield]
![minified gzip size][minified-gzip-shield]

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/lemon3/birthdaypicker">
    <img src="https://raw.githubusercontent.com/lemon3/birthdaypicker/main/_assets/images/logo.svg" alt="Logo" width="360" height="auto">
  </a>
  <h3 align="center">an i18n javascript birthday picker</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li>
      <a href="#api">Api</a>
    </li>
    <li>
      <a href="#license">License</a>
    </li>
    <li>
      <a href="#contact">Contact</a>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

I needed a birthday input field that is easy to use and without JS dependencies. "Simple" in this context means: with as few clicks as possible to the result!

* Coded in vanilla JS.
* internationalisation (i18n)
* BirthdayPicker is dependency-free ;)

**[BirthdayPicker Demo >>](https://lemon3.github.io/birthdaypicker/)**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

you need to have **node** with **npm** and/or **yarn**.
skip to installation if you already have this ;)

1. Install node
    via brew (or [download here](https://nodejs.org/en/download/))
    this will install npm too.
    ```sh
    brew install node
    ```

2. Install yarn:
    via npm:
    ```sh
    npm install --global yarn
    ```
    test version, to see if it works:
    ```sh
    yarn --version
    ```
### Installation
how to install

1. Clone the repo
   ```sh
   git clone https://github.com/lemon3/birthdaypicker.git
   ```
2. cd into the cloned repo
    ```sh
    cd birthdaypicker
    ```
3. Install NPM packages
    ```sh
    yarn install
    ```
    or:
    ```sh
    npm install
    ```
4. start
    (opens a dev server at port 8080, with root set to ./examples directory)
    ```sh
    yarn run start
    ```
    or:
    ```sh
    npm run start
    ```
To see all available scripts, open the package.json file or run either
```sh
yarn run
```
```sh
npm run
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

### simple example (via data API)
#### html:
```html
<!-- initialize with default values -->
<div data-birthdaypicker></div>

<!-- initialize with current date -->
<div
  data-birthdaypicker
  data-birthdaypicker-default-date="now"
></div>
```

### simple example (via js)
#### html:
```html
<div id="bp1"></div>
<div id="bp2"></div>
```
#### js:
```js
// initialize with default values
const bp1 = new BirthdayPicker('#bp1');

// initialize with current date (new Date(), or 'now')
const el = document.getElementById('bp2');
const options = { defaultDate: new Date() };
const bp2 = new BirthdayPicker(el, options);
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>
## API
note: the API may change ...
### initialize
```js
// element: a dom reference to one element, or a querySelector string
const element = '#my-div';
// an options-object, see below
const options = {};
const myBirthdayPicker = new BirthdayPicker(element, options);
```

### option API
```js
options = {
  // sets the minimal age for a person, animal,...
  // if set > 0 it changes the maximal selectable year by it's value
  // e.g.: maxYear: 2022, minAge: 10 -> max selectable year: 2012!
  // default: 0
  // example: 10
  minAge: 0,

  // sets the maximal age for a person, animal,...
  // min selectable year is 1922 if maxYear is 2022 (2022 - 100)
  // default: 100,
  maxAge: 100,

  // sets the minimal year (overrides maxAge)
  // default: null
  // example: 1980
  minYear: null,

  // sets the maximal year
  // default: '(new Date()).getFullYear()'
  // example: 2040 | 'now'
  maxYear: 'now',

  // sets the month format for the select box
  // available: 'short', 'long', 'numeric'
  // default: 'short'
  monthFormat: 'short',

  // shows a placeholder for each select box
  // available: true | false
  // default: true
  placeholder: true,

  // sets the selected start date
  // available: 'now' | new Date() | '2020-10-12' (YYYY-MM-DD)
  // default: null
  // example: '2012-12-04'
  defaultDate: null,

  // if the initialize function should be called on creating an instance:
  // const myBp = new BirthdayPicker(el, {})
  // if set to false, you have to call myBp.init() afterwards.
  // available: true | false
  // default: true
  autoinit: true,

  // if the month and day values in the select-box should have a leading
  // zero or not. If set to true, you will get: 01, 02, 03, ... 10, 11, ...
  // if set to false, you will get: 1, 2, 3, ... 10, 11, ...
  // available: true | false
  // default: true
  leadingZero: true,

  // sets the language to be used
  // available: 'en', 'de', 'fr', ... all country codes with 2chars (ISO 3166-1 alpha-2)
  // default: 'en'
  locale: 'en',

  // if it should be possible to select a 'future' date
  // false means: unable to select a date in the future
  // available: true | false
  // default: false
  selectFuture: false,

  // to arrange the selectboxes
  // y: year, m: month, d: day
  // so ymd means:  year | month | day
  // available: 'ymd', 'ydm', 'myd', 'mdy', 'dmy', 'dym'
  // default: 'ymd'
  arrange: 'ymd',
};
```
### methods
```js
const element = '#my-div';
const options = {
  autoinit: false
};
const myBirthdayPicker = new BirthdayPicker(element, options);

// init: initializes the picker
myBirthdayPicker.init();

// getDate returns the current selected date with the language default date-formating!
// you can change the format, by calling the method with a specific data-format value.
// e.g.: 'yyyy-m-d'
// if date is 2. Sep. 1994
// return values are:
// 'yy'   -> 94
// 'yyyy' -> 1994
// 'mm'   -> 09
// 'm'    -> 9
// 'dd'   -> 02
// 'd'    -> 2
myBirthdayPicker.getDate('yyyy-m-d');

// just a small helper function, returns true or false
myBirthdayPicker.isLeapYear(2020); // true

// listen to different events eg.
// available events: init | datechange
const myEventListener = () => {};
myBirthdayPicker.addEventListener('datechange', myEventListener, false);

// remove the eventlistener
myBirthdayPicker.removeEventListener('datechange', myEventListener);

// set the date to a given value
// e.g.: '2020-10-22' // yyyy-mm-dd: this is the 22. oct. 2020
// or to the current date with new Date()
myBirthdayPicker.setDate(new Date());

// sets the language for the current instance
// e.g.: 'en', 'de', 'fr', ...
myBirthdayPicker.setLanguage('en');

// sets the month format for the current instance
// available: 'short', 'long', 'numeric'
myBirthdayPicker.setMonthFormat('short');

// setter, if the
myBirthdayPicker.useLeadingZero(true); // true | false

// kills the current instance and removes all event-listeners
myBirthdayPicker.kill();
```

### Demo
A **small demo** of this tool can be view here: [BirthdayPicker Demo](https://lemon3.github.io/birthdaypicker/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Wolfgang Jungmayer - wolfgang@lemon3.at

Project Link: [https://github.com/lemon3/birthdaypicker](https://github.com/lemon3/birthdaypicker)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<div align="center">coded with ❤ in vienna<br>by wolfgang jungmayer</div>


<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/lemon3/birthdaypicker?style=for-the-badge
[license-url]: https://github.com/lemon3/birthdaypicker/blob/main/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/wolfgangjungmayer/

[mincoverage-shield]: https://img.shields.io/nycrc/lemon3/birthdaypicker?style=for-the-badge

[minified-shield]: https://img.shields.io/github/size/lemon3/birthdaypicker/dist/birthdaypicker.esm.min.js?label=Minified%20Size&style=for-the-badge

[minified-gzip-shield]: https://img.shields.io/badge/minified%20gzip%20Size-4.7%20KB-blue?style=for-the-badge
