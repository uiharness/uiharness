#!/bin/bash

echo
echo 🐷 🐷   Bundle
echo


# Bundle main.
parcel build src/main.ts --out-dir .uiharness/.bundle/main --target electron


# Bundle renderer.
parcel build src/index.html --public-url ./ --out-dir .uiharness/.bundle/renderer/production


# Build electron distribution.
build --x64 --publish=never
