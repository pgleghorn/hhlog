# hhlog

## Purpose

This is nodejs script to fetch the entire eventlog from a BT HomeHub5 router.  It uses [playwright](https://playwright.dev/) to control a headless browser which scrapes the data, as there is no API or ssh for this device.

## Requirements

* NodeJS 10.x
* BT HomeHub5 type A (other models untested)

## Build

Run `npm install`

## Usage

Run `./hhlog.js -h` to see a list of options:

```
Usage: hhlog [options]

Options:
  -V, --version                   output the version number
  -d, --debugging                 Write debugging files (default: false)
  -y, --assumed-year <year>       Year the log messages start (default: 2021)
  -s, --strip-uptime              Strip uptimes in log messages
  -a, --address <address>         Router host/ip address
  -p, --admin-password <pw>       Admin password
  -w, --write-logfile <filename>  Write log to filename
  -h, --help                      display help for command
  ```
