#!/bin/bash

# 
# DEBUG: Copy updates to the .bin/uiharness files during development.
# 

cp ../../libs/web/lib/bin/entry.js ./node_modules/.bin/uiharness
chmod 777 ./node_modules/.bin/uiharness
