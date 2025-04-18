# Changelog

## v0.2.2
### Added or Changed
- test update
- code optimization

## v0.2.1
### Added or Changed
- umd js fix

## v0.2.0
### Added or Changed
- event update: event-listeners registered to the instance are no longer registered to the main element.

## v0.1.23
### Added or Changed
- remove the datechange trigger when the language was changed via setLanguage()

## v0.1.22
### Added or Changed
- remove the datechange event-triggering when calling setDate(). Only the select boxes trigger this event.

## v0.1.21
### Added
- if select boxes found inside the main element: use them in the defined order, eg: 'ymd' (year, month, day).
- event callbacks can be defined inside the option object

## v0.1.20
### Added or Changed
- added getAge method
- fixed maxAge option issue

## v0.1.19
### Added or Changed
- added aria-label
- option to add classNames

## v0.1.18
### Added or Changed
- optimizations
- test update

## v0.1.17
### Added or Changed
- bug fixing

## v0.1.16
### Added or Changed
- added resetDate() method
- test updates

## v0.1.15
### Added or Changed
- added getDateString() method
- update getDate() method: it now returns a Date object (new Date());
- test updates

## v0.1.14
### Added or Changed
- small bug fixed (enable/disable select-box options)

## v0.1.13
### Added or Changed
- bug fixing
- performance improvements
- **yearEl**, **monthEl**, **dayElement** can now be referenced via query-string (querySelector) or via DOM element reference

## v0.1.12
### Added or Changed
- added a safari fix for parsing the date

## v0.1.11
### Added or Changed
- Added option “roundDownDay” (true | false), useful when the new month has fewer days than the previously selected month and the selected day is greater than the maximum number of days - for that month.
  - true: the day will be set to the number of days for that month
  - false: the day is set to undefined

## v0.1.10
### Added or Changed
- logic updates
- test updates
- demo/docs updates

## v0.1.9
### Added or Changed
- package.json update
- added static function killAll
- update to the demo/docs

## v0.1.8
### Added or Changed
- package update

## v0.1.7
### Added or Changed
- package update

## v0.1.6
### Added or Changed
- fixed a small npm issue

## v0.1.5
### Added or Changed
- readme update
- added index.js in root for npm import

## v0.1.4
### Added or Changed
- data API update (a setting string can be used now)
- possibility to specify selectors for the select-boxes in the option API (yearEl, monthEl, dayEl)

## v0.1.3
### Added or Changed
- test updates
- bug fixing
- added an option to set the order of the select boxes

## v0.1.2
### Added or Changed
- added *daychange*, *monthchange* and *yearchange* events.
- test updates
- bug fixing
- added this changelog :)

## v0.1.1
### Added or Changed
- update `README.md`
- test updates
- include code coverage to project

## v0.1.0
- The initial version
