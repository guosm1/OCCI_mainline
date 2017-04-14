#!/bin/sh
fileName=$3
if [ -f "$fileName" ];then
  rm -rf $fileName
fi
for((i=1;i<=$1;i++))
do
  rep_time=`date '+%Y-%m-%d %H:%M:%S'`
  echo "$rep_time,146 WARN containermanager.ContainerManagerImpl (ContainerManagerImpl.java:handle(1070)) - Event EventType: KILL_CONTAINER sent to absent container container_e01_1484116557201_9818_01_000005" >> $fileName 
  sleep `awk 'BEGIN{printf "%.3f",'$2'*0.001}'` 
done
