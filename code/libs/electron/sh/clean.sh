#!/bin/bash

rm -rf .cache
rm -rf dist

rm -rf src/main/.parcel
rm -rf src/renderer/.parcel

rm -f yarn-error.log

# In case TSC builds into /src
cd src
find . -name "*.js" -type f|xargs rm -f
find . -name "*.jsx" -type f|xargs rm -f
find . -name "*.map" -type f|xargs rm -f
cd ..
