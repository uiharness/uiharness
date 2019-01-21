#!/bin/bash

rm -rf lib
rm -rf src
rm -rf static

sh ./sh/clean.sh
yarn reset

rm -rf node_modules
rm -f yarn.lock
