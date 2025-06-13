#!/bin/bash
set -e
npm ci
npx ng build --configuration production
