# hhlog

## Purpose

This is a nodejs script to fetch the entire eventlog from a BT HomeHub5 router.  It uses [playwright](https://playwright.dev/) to control a headless browser which scrapes the data, as there is no API or ssh for this device.

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
  -t, --timestamp-string          Write timestamp as toString() format instead of ISO8601 (default: false)
  -h, --help                      display help for command
  ```

Explanation of the less-obvious flags:

### -d, --debugging

Write out the command line options selected. For each page of the eventlog scraped:
    * output the page number and url and whether a "next" button is found
    * write the full page html to the debugging/ directory
    * write a full screenshot to the debugging/ directory

### -y, --assumed-year <year>

The log messages in the HomeHub5 eventlog appear like `16:04:35, 12 Feb.` without an explicit year field. This script outputs proper timestamps and assumes that all log messages occur in the current year, but you can override it with this flag.

### -s, --strip-uptime

The log messages in the HomeHub5 eventlog sometimes have a prefix which appears to be the device uptime in seconds, e.g.

`(723528.840000) Admin login successful by 192.168.1.178 on HTTP`

This flag will strip those out, e.g.

`Admin login successful by 192.168.1.178 on HTTP`

### -w, --write-logfile <filename>

Output to the specified filename, instead of writing to standard output. If the filename already exists it will be truncated.
### -t, --timestamp-string

Write log messages using JavaScript Date toString() format, e.g. `Tue Feb 12 2019 15:36:49 GMT+0000` instead of the default ISO8601 format e.g. `2019-02-12T16:45:15+00:00`.
## Examples

Capture eventlog to out.log file and suppress the uptime field:

```
./hhlog.js -a 192.168.1.254 -p pass1234 -w out.log -s
$ head -5 out.log 
2021-02-12T17:11:03+00:00: Admin login successful by 192.168.1.178 on HTTP
2021-02-12T17:11:02+00:00: New GUI session from IP 192.168.1.178
2021-02-12T17:10:52+00:00: Admin login successful by 192.168.1.178 on HTTP
2021-02-12T17:10:50+00:00: New GUI session from IP 192.168.1.178
2021-02-12T17:10:38+00:00: IN: BLOCK [12] Spoofing protection (IGMP 192.168.1.254->224.0.0.22 on ptm0.101)
```

## Stats

A helper script `stats.sh` gives a brief summary of interesting events in a captured log file, e.g.

```
Top 10 device disconnects
Top 10 device connects
Top 10 admin logins
Top 10 client associated
Top 10 client disassociated
Top 10 spoofing protection
Top 10 wifi registration failed
Top 10 IN BLOCK
Top 10 IN ACCEPT
Last 10 system start
Last 100 cwmp session start
```

It assumes the log is captured to `out.log` with default ISO timestamps, and suppression of the uptime field (-u flag).

## TODO

* Find a reasonable way to infer the year of each log message, eg when messages from Dec follow messages from Jan then decrement the year.
* Scrape other info besides just eventlog.