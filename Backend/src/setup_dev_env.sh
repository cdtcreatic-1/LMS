#!/bin/bash

rm node_modules/cccommon

#install all the node dependencies
npm install

#install pm2 package
npm install pm2 --save

# create the symbolic links
mkdir -p exchange_api/node_modules
ln -s -f ../ exchange_api/node_modules/this_pkg
ln -s -f ../common node_modules/cccommon