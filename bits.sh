#!/bin/sh

echo Top 10 device disconnects
grep 'Device disconnected' out.log | cut -c57- | sort | uniq -c | sort -rn | head -10

echo Top 10 device connects
grep 'Device connected' out.log | cut -c54- | sort | uniq -c | sort -rn | head -10

echo Top 10 admin logins
grep 'Admin login successful by' out.log | cut -c62- | sort | uniq -c | sort -rn | head -10

echo Top 10 client associated
grep 'Client associated$' out.log | cut -c36- | sort | uniq -c | sort -rn | head -10

echo Top 10 client disassociated
grep 'Client disassociated$' out.log | cut -c36- | sort | uniq -c | sort -rn | head -10

echo Top 10 spoofing protection
grep 'Spoofing protection' out.log | cut -c36- | sort | uniq -c | sort -rn | head -10

echo Top 10 wifi registration failed
grep 'WiFi registration failed' out.log | cut -c36- | sort | uniq -c | sort -rn | head -10

echo Top 10 IN BLOCK
grep 'IN: BLOCK' out.log | cut -c36- | sort | uniq -c | sort -rn | head -10

echo Top 10 IN ACCEPT
grep 'IN: ACCEPT' out.log | cut -c36- | sort | uniq -c | sort -rn | head -10

echo Last 10 system start
grep 'System start $' out.log | head -10 | sed -e 's/^/   /g'

echo Last 100 cwmp session start
grep 'CWMP: Session start now' out.log | head -100 | sed -e 's/^/   /g'

