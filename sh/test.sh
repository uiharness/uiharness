#!/bin/bash
cwd=$(pwd)

test () {
  cd code/$1 
  yarn test
  cd $cwd
}

test libs/core
test libs/dev
test libs/electron
test libs/spec
test libs/types
test libs/ui
