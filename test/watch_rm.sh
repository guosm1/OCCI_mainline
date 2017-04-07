echo "**********************"
echo $0
date
cd `dirname $0`
pid_rm=$(cat /var/run/hadoop-yarn/ocdp/yarn-ocdp-resourcemanager.pid)
echo "top -p pid_rm -n 600 -d 1 ..."
top -b -p $pid_rm -n 600 -d 1 -c |awk -F ' ' '/'$pid_rm'/{print $9"\t"$10}'>top_rm.txt
echo "watch finished!"
