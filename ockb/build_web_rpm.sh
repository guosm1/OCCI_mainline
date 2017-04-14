#! /bin/bash
OCKB_PATH=`dirname $0`
cd $OCKB_PATH

tar -Jxv -f node-v6.9.5-linux-x64.tar.xz

CURRENT_ABS_PATH=$(pwd)
NODEJS_FOLDER=node-v6.9.5-linux-x64
NODEJS_HOME=${CURRENT_ABS_PATH}/${NODEJS_FOLDER}
export PATH=$NODEJS_HOME/bin:$PATH

npm install
./node_modules/bower/bin/bower --allow-root install
./node_modules/gulp/bin/gulp.js


mkdir -pv rpm/{BUILD,RPMS,SOURCES,SPECS}
mkdir -pv rpm/SOURCES/ockb/app

cp -rf dist/* rpm/SOURCES/ockb/app
cp -rf server rpm/SOURCES/ockb
cp -rf bin rpm/SOURCES/ockb
cp -rf node_modules rpm/SOURCES/ockb
cp -rf node-v6.9.5-linux-x64 rpm/SOURCES/ockb
cp -rf package.json rpm/SOURCES/ockb
cp -rf OCKB.spec rpm/SPECS/OCKB.spec

tar -zcvf rpm/SOURCES/ockb-2.0.0.0.tar.gz -C rpm/SOURCES ockb

rpmbuild -bb rpm/SPECS/OCKB.spec
rm -rf rpm/SOURCES/*
