#!/bin/bash

cd ./examples/example.parcel && yarn reset
cd ../../

cd ./examples/example.webpack && yarn reset
cd ../../

echo
echo '👋   All example projects reset.'
