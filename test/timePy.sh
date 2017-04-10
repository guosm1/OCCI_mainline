cd `dirname $0`
if [ $# -gt 0 ]
then
  interval=$1
else
  interval='10s'
fi
echo $0 $1
date
# watch duration: 60*interval
for i in $(seq 1 60) 
do
  find . -name yarn-apps.txt -size +10M -delete
  /usr/bin/time -o timePy.tmp python /opt/logstash/bin/yarn-apps.py>yarn-apps.txt 
  cat timePy.tmp |awk '/elapsed/{print $3}' |sed 's/elapsed//g'
  sleep $interval
done
