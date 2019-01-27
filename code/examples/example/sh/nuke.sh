#!/bin/bash

rm -rf lib
rm -rf src
rm -rf static
rm -rf test

yarn reset

rm -rf node_modules
rm -f yarn.lock
