#!/bin/bash

# 
# DEBUG: Copy updates to the .bin/uiharness-electron files during development.
# 

cp ../../libs/electron.dev/lib/bin/entry.js ./node_modules/.bin/uiharness-electron
chmod 777 ./node_modules/.bin/uiharness-electron
