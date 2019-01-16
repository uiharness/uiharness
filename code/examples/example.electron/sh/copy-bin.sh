#!/bin/bash

# 
# DEBUG: Copy updates to the .bin/uiharness files during development
# 

cp ../../libs/electron/lib/bin/entry.js ./node_modules/.bin/uiharness-electron
chmod 777 ./node_modules/.bin/uiharness-electron
