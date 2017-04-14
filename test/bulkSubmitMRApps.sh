#!/bin/bash
# $1 noBatch
# $2 noApp
function print_usage(){
  echo "Usage: ./bulkSubmitMRApps.sh  [noBatch] [noApp]"
}
function buildjar(){
  export CLASSPATH=$(hadoop classpath):$CLASSPATH
  javac QuasiMonteCarlo.java
  jar -cvf QuasiMonteCarlo.jar ./QuasiMonteCarlo*.class
  rm -rf QuasiMonteCarlo*.class
}
if [ $# -lt 2 ]; then
  print_usage
  exit 1
fi
cd `dirname $0`
noBatch=$1
noApp=$2
echo
echo "******************************"
echo "$0 $1 $2 $3"
echo "noBatch:$noBatch,noApp: $noApp" 
jarFile='QuasiMonteCarlo.jar'
if [ -e $jarFile ]
then
  echo "$jarFile exists. Skip build $jarFile ."
else
  buildjar
fi
mrPath='/usr/hdp/2.4.0.0-169/hadoop-mapreduce/'
if [ ! -e $mrPath$jarFile ]
then
  cp $jarFile $mrPath
fi

for j in $(seq 1 $noBatch)
do
    date
    for i in $(seq 1 $noApp)
    do
       nohup yarn jar $mrPath$jarFile QuasiMonteCarlo 1 1 1>>/dev/null 2>&1 &
    done
    echo "submit $noApp Apps"
    for pid in $(jobs -p)
    do
         wait $pid
         status=$?
         if [ $status != 0 ];then
            echo "$pid status is $status: have some error!"
         else
            echo "$pid status is $status: success!"
         fi
    done
    echo "batch $j finished!"
done
echo "all of the batch finished!"
date
