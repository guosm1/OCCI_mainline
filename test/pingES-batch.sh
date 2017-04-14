#!/bin/sh
#bath-inserting into es cluster. Total count of data for each time inserting
#is passed into script, and batch inserting will be performed repeadedly for
#20 times at interval 60s by default.

#total count of times of ping es cluster
count=$1
#interval between two batch-insertings in s
batch_interval=0.8
#nodes which construct es cluster
ips=(ochadoop08)
#es http port
port=9225
checkInput()
{ 
  if [ ! -n "$1" ];then
    echo "Input parameter required: count(Integer)"
    exit 1
  fi
}
checkInput $count
pingCluster()
{
  for ip in ${ips[@]}
    do
      nohup sh pingES.sh $ip $port 1>/dev/null 2>&1 &
    done  
}
batchPing()
{
  for((i=0; i < $count; i++))
    do
      pingCluster
      sleep 0.001
    done
  echo "Batch-Inserting finished at repeat time = "$1
}
for((j=0; j < 600; j++))
  do
    batchPing $j
    sleep $batch_interval
  done
echo "All done!"

