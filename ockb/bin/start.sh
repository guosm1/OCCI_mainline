#!/bin/bash

export NODEJS=../node-v6.9.5-linux-x64
export PATH=$NODEJS/bin:$PATH
../node_modules/http-server/bin/http-server -p 9000 ../app
