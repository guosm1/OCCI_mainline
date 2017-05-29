#!/bin/bash


source /opt/ockb/bin/elasticdump-env

filename=`date +%Y%m%d`
# dump the ES data
elasticdump --input=http://<ex server>:<es port>/occikb --output=/opt/ockb/bin/backup/$filename.json --type=data

#remove the before 7 days data
find /opt/ockb/bin/backup/ -name '*.json' -type f -mtime +7 -exec rm -rf {} \;


############################################################
# You can use crontab to add the script running
# 0 1 * * * /opt/ockb/bin/backup/backup.sh
#
# Also can use crontab to send the backup file to backup server
# 10 5 * * 0 find /opt/ockb/bin/backup/ -name '*.json' -type f -mtime -1 -exec scp {} root@<backup server>:/<backup folder> \;
############################################################
