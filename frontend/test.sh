#!/bin/bash
set -e

npm ci
export CHROME_BIN=$(node -e "console.log(require('puppeteer').executablePath())")
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox
 