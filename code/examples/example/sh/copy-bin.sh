#!/bin/bash

# 
# DEBUG: Copy updates to the .bin/uiharness-electron files during development.
# 

cp ../../libs/dev/lib/bin/index.js ./node_modules/.bin/ui
chmod 777 ./node_modules/.bin/ui
