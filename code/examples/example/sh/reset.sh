#!/bin/bash
rm -f yarn.lock
rm -f uiharness*.yml
rm -f tsconfig.json

rm -rf dist
rm -rf lib
rm -rf src
rm -rf static
rm -rf test
rm -rf .cache
rm -rf .uiharness
rm -rf .dev

yarn sl
