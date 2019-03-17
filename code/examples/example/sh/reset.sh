#!/bin/bash

rm -f yarn.lock
rm -f uiharness*.yml
rm -f tsconfig.json
rm -f tsconfig.test.json
rm -f tslint.json

rm -rf dist
rm -rf lib
rm -rf lib.test
rm -rf src
rm -rf static
rm -rf test
rm -rf .cache
rm -rf .uiharness
rm -rf .dev

msync sl
