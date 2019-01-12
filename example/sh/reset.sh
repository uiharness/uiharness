#!/bin/bash

rm -rf public
rm -rf build
rm -rf lib

rm .rescriptsrc.js
rm .prettierrc.js
rm tslint.json
rm tsconfig.json
rm tsconfig.lib.json
rm uiharness.yml
rm webpack.config.js
rm src/react-app-env.d.ts

echo
echo '👋   Auto-generated files removed.'
echo '    Run `yarn start` to recreate them.'
echo
