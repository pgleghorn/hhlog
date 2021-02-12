#!/usr/bin/env node

const pjson = require('./package.json');
const playwright = require('playwright');
var fs = require('fs');
var moment = require('moment');
moment().format();
const { program } = require('commander');
program.version(pjson.version);

program
  .option('-d, --debugging', 'Write debugging files', false)
  .option('-y, --assumed-year <year>', 'Year the log messages start', new Date().getFullYear())
  .option('-s, --strip-uptime', 'Strip uptimes in log messages')
  .option('-a, --address <address>', 'Router host/ip address')
  .option('-p, --admin-password <pw>', 'Admin password')
  .option('-w, --write-logfile <filename>', 'Write log to filename')
  .option('-t, --timestamp-string', 'Write timestamp as toString() format instead of ISO8601', false)


program.parse(process.argv);
const options = program.opts();

if (options.debugging) {
    console.log(options);
}

const idx_home = 9098;
const idx_login = 9148;
const idx_settings = 9100;
const idx_settings_wireless = 9103;
const idx_settings_accesscontrol = 9117;
const idx_settings_portforwarding = 9107;
const idx_settings_hublights = 9132;
const idx_settings_broadband = 9118;
const idx_settings_adminpassword = 9127;
const idx_advanced = 9102;
const idx_advanced_wireless = 9104;
const idx_advanced_broadband = 9121;
const idx_advanced_homenework = 9133;
const idx_advanced_firewall = 9108;
const idx_advanced_system = 9128;
const idx_troubleshooting = 9142;
const idx_troubleshooting_helpandadvice = 9142;
const idx_troubleshooting_helpdesk = 9143;
const idx_troubleshooting_eventlog = 9144;

(async () => {
    const browser = await playwright['firefox'].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`http://${options.address}/index.cgi?active_page=${idx_troubleshooting_eventlog}`);
    await page.type('#password', options.adminPassword);
    await page.press('#password', 'Enter');
    await page.waitForLoadState();

    if (options.writeLogfile) {
        fs.writeFileSync(options.writeLogfile, '');
        fs.truncateSync(options.writeLogfile);
    } 

    // now we have the first page of the log, iterate over all available pages
    let pagecount = 1;
    while (true) {
        let pageurl = page.url();
        let nextbutton = await page.$('a[name=submit_button_bt_next]')

        if (options.debugging) {
            fs.appendFileSync('debugging/pw.log', `pagecount ${pagecount}, pageurl ${pageurl}, nextbutton ${nextbutton}\n`);
            await page.screenshot({path: `debugging/pw${pagecount}.png`, fullPage: true });
            fs.writeFileSync(`debugging/pw${pagecount}.html`, await page.content());
        }

        // find the log entry rows
        let rows = await page.$$('tr[bgcolor^="#"]');
        for (let row of rows) {
            let logdate = await (await row.$('td:first-child')).textContent();
            let timestamp = moment(logdate, "HH:mm:ss, DD MMM");
            timestamp.set('year', options.assumedYear);
            let logmsg = await (await row.$('td:last-child')).textContent();
            if (options.stripUptime) {
                logmsg = logmsg.replace(/^\([ ]*[0-9]*.[0-9]*\) /i, '');
            }
            logmsg = logmsg.replace(/[\u200B-\u200D\uFEFF]/g, '');
            if (!options.timestampString) {
                timestamp = timestamp.format();
            }
            if (options.writeLogfile) {
                fs.appendFileSync(options.writeLogfile, `${timestamp}: ${logmsg}\n`);
            } else {
                console.log(`${timestamp}: ${logmsg}`);
            }
        }

        // stop iterating if no more pages
        if (nextbutton == null) break;

        await page.click('a[name=submit_button_bt_next]');
        await page.waitForLoadState();
        pagecount++;
    }

    await browser.close();
})();