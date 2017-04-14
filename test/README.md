# Performance test for OCCI
## API data collector
### Usage
```
nohup ./bulkSubmitMRApps.sh 3 10 true >>bulkSubmitMRApps.log 2>&1 &
nohup ./timePy.sh >timePy.txt 2>&1 &
nohup ./watch_logstash.sh >>watch_logstash.log 2>&1 &
nohup ./watch_es.sh >>watch_es.log 2>&1 &
nohup ./watch_rm.sh >>watch_rm.log 2>&1 &"
```
### Note
- Hosts in logstash.conf need to be modified before use
- To get the application stat of Resource Manager, run: 
    ```
    curl localhost:8088/ws/v1/cluster/metrics"
    ```
