echo "**********************"
echo $0
date
cd `dirname $0`
pid_es=$(cat /var/run/elasticsearch/elasticsearch.pid)
echo "top -p pid_es -n 600 -d 1 ..."
top -b -p $pid_es -n 600 -d 1 -c |awk -F ' ' '/'$pid_es'/{print $9"\t"$10}'>top_es.txt

echo "watch finished!"
