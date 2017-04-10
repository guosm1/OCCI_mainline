echo "**********************"
echo $0
date
cd `dirname $0`
kill -9 `ps -ef|grep "logstash.log" |grep -v 'grep'|awk '{print $2}'`
/opt/logstash/bin/logstash agent -f ./logstash.conf --log  /var/log/logstash/logstash.log & 
pid=$!
echo $pid > logstash.pid &
echo $pid
sleep 30s
# watch interval 1s, 600 samples
echo "top -p pid_logstash -n 600 -d 1 ..."
top -b -p $pid -n 600 -d 1 -c |awk -F ' ' '/'$pid'/{print $9"\t"$10}'>top_logstash.txt
echo "watch finished!"
