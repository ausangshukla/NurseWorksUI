#!/bin/bash

ionic cordova platform rm ios
rm -rf ./plugins
rm -rf ./platforms 
ionic cordova platform add ios --save
pod setup
