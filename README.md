<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![MIT License][license-shield]][license-url]
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

1. simple example (via data API)
```html
<!-- initialize with default values -->
<div data-birthdaypicker></div>

<!-- initialize with current date -->
<div
  data-birthdaypicker
  data-birthdaypicker-default-date="now"
></div>
```

2. simple example (via js)
```html
<div id="bp1"></div>
<div id="bp2"></div>
```
```js
// initialize with default values
const bp1 = new BirthdayPicker('#bp1');

// initialize with current date (new Date(), or 'now')
const el = document.getElementById('bp2');
const options = { defaultDate: new Date() };
const bp2 = new BirthdayPicker(el, options);
```

### API

current option API (may change)
```js
options = {
  maxYear: '2040',      // default: (new Date()).getFullYear()
  minAge: 0,            // default: 0, min age for a person,animal,...
  maxAge: 100,          // default: 100, max age for a person,animal,...
  monthFormat: 'short', // default: 'short', available: 'short', 'long', 'numeric'
  placeholder: true,    // default: true, available: true | false
  defaultDate: null,    // default: null, available: 'now', new Date(), formated String eg.: '2012-12-23'
  autoinit: true,       // default: true, available: true | false
  leadingZero: true,    // default: true, available: true | false
  locale: 'en',         // default: 'en', available: 'en', 'de', 'fr', ... all country codes with 2chars (ISO 3166-1 alpha-2)
  selectFuture: false,  // default: false, available: true | false
};
```

###Demo
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


<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/lemon3/birthdaypicker.svg?style=for-the-badge
[license-url]: https://github.com/lemon3/birthdaypicker/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/wolfgangjungmayer/
