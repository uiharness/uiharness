#!/bin/bash


rm -rf node_modules
rm -rf lib
rm -rf src
rm -rf static

sh ./sh/clean.sh
yarn reset
