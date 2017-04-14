#!/bin/sh
#ping es cluster by inserting datas
#input arguments should be:
#1.arrays of ips which correspond to es cluster
#2.es service port
ips=$1
port=$2
index="logstash-hdfs-log"
typ="hdfs.namenode"
insert()
{
  curl -XPOST $1:$port/$index/$typ -d '{"content":"Hello Im dymmy data"}'
}
for i in ${ips[@]}
 do
   insert $i
 done
