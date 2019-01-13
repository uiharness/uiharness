#!/bin/bash

cd ./examples/parcel && yarn reset
cd ../../

cd ./examples/webpack && yarn reset
cd ../../

echo
echo '👋   All example projects reset.'
