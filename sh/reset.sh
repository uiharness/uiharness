#!/bin/bash

cd ./code/examples/example.electron && yarn reset
cd ../../../

cd ./code/examples/example.web && yarn reset
cd ../../../

echo
echo '👋   All example projects reset.'

