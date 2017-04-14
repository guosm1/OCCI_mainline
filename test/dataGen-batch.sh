#!/bin/sh
#To concurrently generate dummy datas into several log files, and 
#the total count and velocity of each file can be controlled
#by revising the array 'count', 'interval'.

#number of data to be generated
count=(10000 10000 10000 10000 10000 10000 10000 10000 10000 10000 10000 10000 10000 10000)
#count=(10 10 10 10 10 10 10 10 10 10 10 10 10 10)
#interval in ms
interval=(100 100 100 100 100 100 100 100 100 100 100 100 100 100)
#data path
dummyPath="./data"
#precheck to ensure valid input
precheck()
{
  if [ $1 != $2 ];then
    echo 'ERROR: Array sizes not match, make sure two arrays are same size!'    
    exit
  fi
}
precheck ${#count[@]} ${#interval[@]}
for((i=0;i<${#count[@]};i++))
do
  dummyFile=$dummyPath"/dummyData.$i"
  nohup ./dataGen.sh ${count[$i]} ${interval[$i]} $dummyFile 1>/dev/nul 2>&1 &
done
