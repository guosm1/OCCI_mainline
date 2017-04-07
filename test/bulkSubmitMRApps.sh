#!/bin/bash
# $1 noBatch
# $2 noApp
function print_usage(){
  echo "Usage: ./apiDataCollectorTest.sh [noBatch] [noApp] [withSleep]"
  echo "if [withSleep] set ture, add extra sleep 60s to QuasiMonteCarlo Mapreduce example"
}
if [ $# -lt 3 ]; then
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
if [ $3 = 'true' ]
then
  jarFile='QuasiMonteCarlo.jar'
else
  jarFile='QuasiMonteCarlo_nosleep.jar'
fi
echo $jarFile
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
       #yarn jar /usr/hdp/2.4.0.0-169/hadoop-mapreduce/QuasiMonteCarlo_nosleep.jar QuasiMonteCarlo 1 1 1>>/dev/null 2>&1 &
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
