#!/usr/bin/env python
"""
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

"""

#from resource_management.libraries.functions.version import format_hdp_stack_version, compare_versions
from resource_management import *
import status_params

# server configurations
config = Script.get_config()

ockb_user = config['configurations']['ockb-env']['ockb_user']
ockb_user_group = config['configurations']['ockb-env']['ockb_user_group']
logstash_user = config['configurations']['logstash-env']['logstash_user']
logstash_user_group = config['configurations']['logstash-env']['logstash_user_group']
elastic_user = config['configurations']['elastic-env']['elastic_user']
elastic_user_group = config['configurations']['elastic-env']['elastic_user_group']
kibana_user = config['configurations']['kibana-env']['kibana_user']
kibana_user_group = config['configurations']['kibana-env']['kibana_user_group']
grafana_user =config['configurations']['grafana-env']['grafana_user']
grafana_user_group = config['configurations']['grafana-env']['grafana_user_group']

ockb_home = "/opt/ockb"
ockb_bin = "/opt/ockb/bin"
ockb_server_conf_dir = "/opt/ockb/server/conf"
ockb_log_dir = config['configurations']['ockb-site']['logging.dest']

elastic_home = "/usr/share/elasticsearch"
elastic_plugins = "/usr/share/elasticsearch/plugins"
elastic_bin = "/usr/share/elasticsearch/bin"
elastic_script_dir = "/etc/elasticsearch/scripts"
elastic_conf_dir = "/etc/elasticsearch"
elastic_data_dir = config['configurations']['elasticsearch-site']['path.data']
elastic_log_dir = config['configurations']['elasticsearch-site']['path.logs']

logstash_home = "/opt/logstash"
logstash_bin = "/opt/logstash/bin"
logstash_conf_dir = "/etc/logstash/conf.d"
logstash_log_dir = "/var/log/logstash"
logstash_sincedb_path = format("{logstash_log_dir}/.sincedb2")

occimon_bin_dir = "/opt/occimon/bin"
occimon_lib_dir = "/opt/occimon/lib"
metric_collector_zk_node = "/occimon_leader"

kibana_home = "/opt/kibana"
kibana_bin = "/opt/kibana/bin"
kibana_conf_dir = "/opt/kibana/config"
kibana_log_dir = config['configurations']['kibana-site']['logging.dest']

grafana_home = "/usr/share/grafana"
grafana_bin = "/usr/share/grafana/bin"
grafana_conf_dir = "/etc/grafana"
grafana_plugins = "/var/lib/grafana/plugins"
grafana_log_dir = config['configurations']['grafana-site']['logging.dest']
grafana_data_dir = config['configurations']['grafana-site']['path.data']
http_code = "%{http_code}"

ockb_pid_dir = status_params.ockb_pid_dir
ockb_pid_file = status_params.ockb_pid_file
logstash_pid_dir = status_params.logstash_pid_dir
log_collector_pid_file = status_params.log_collector_pid_file
metric_collector_pid_file = status_params.metric_collector_pid_file
elastic_pid_dir = status_params.elastic_pid_dir
elastic_pid_file = status_params.elastic_pid_file
kibana_pid_dir = status_params.kibana_pid_dir
kibana_pid_file = status_params.kibana_pid_file
grafana_pid_dir = status_params.grafana_pid_dir
grafana_pid_file = status_params.grafana_pid_file

hdfs_log_dir_prefix = ""
hdfs_user = ""
if 'hadoop-env' in config['configurations']:
    if 'hdfs_log_dir_prefix' in config['configurations']['hadoop-env']:
        hdfs_log_dir_prefix = config['configurations']['hadoop-env']['hdfs_log_dir_prefix'] 
    if 'hdfs_user' in config['configurations']['hadoop-env']:
        hdfs_user = config['configurations']['hadoop-env']['hdfs_user']

yarn_log_dir_prefix = ""
yarn_user = ""
if 'yarn-env' in config['configurations']:
    if 'yarn_log_dir_prefix' in config['configurations']['yarn-env']:
        yarn_log_dir_prefix = config['configurations']['yarn-env']['yarn_log_dir_prefix']
    if 'yarn_user' in config['configurations']['yarn-env']:
        yarn_user = config['configurations']['yarn-env']['yarn_user']

hbase_log_dir = ""
if 'hbase-env' in config['configurations'] and 'hbase_log_dir' in config['configurations']['hbase-env']:
    hbase_log_dir = config['configurations']['hbase-env']['hbase_log_dir']

zk_log_dir = ""
if 'zookeeper-env' in config['configurations'] and 'zk_log_dir' in config['configurations']['zookeeper-env']:
    zk_log_dir = config['configurations']['zookeeper-env']['zk_log_dir']
    
hive_log_dir = ""
webhcat_log_dir = ""
if 'hive-env' in config['configurations']:
    if 'hive_log_dir' in config['configurations']['hive-env']:
        hive_log_dir = config['configurations']['hive-env']['hive_log_dir']
    if 'hcat_log_dir' in config['configurations']['hive-env']:
        webhcat_log_dir = config['configurations']['hive-env']['hcat_log_dir']

rm_host = ""
if 'clusterHostInfo' in config and 'rm_host' in config['clusterHostInfo']:
    rm_hosts = config['clusterHostInfo']['rm_host']
    rm_host = rm_hosts[0]
else:
    rm_hosts = default("/clusterHostInfo/rm_host", None)
    if type(rm_hosts) is list:
        rm_host = rm_hosts[0]
    else:
        rm_host = rm_hosts
        
zk_client_port = "2181"
if 'zoo.cfg' in config['configurations'] and 'clientPort' in config['configurations']['zoo.cfg']:
    zk_client_port = str(config['configurations']['zoo.cfg']['clientPort'])
        
zk_connect_str = ""
if 'clusterHostInfo' in config and 'zookeeper_hosts' in config['clusterHostInfo']:
    zk_hosts = config['clusterHostInfo']['zookeeper_hosts']
    zk_url = []
    for item in zk_hosts:
        zk_url.append(item + ":" + zk_client_port)
    zk_connect_str = ",".join(zk_url)
    
rm_port = 8088
if 'yarn-site' in config['configurations'] and 'yarn.resourcemanager.webapp.address' in config['configurations']['yarn-site'] and ':' in config['configurations']['yarn-site']['yarn.resourcemanager.webapp.address']:
    rm_port = config['configurations']['yarn-site']['yarn.resourcemanager.webapp.address'].split(':')[-1]

hostname = config['hostname']
java64_home = config['hostLevelParams']['java_home']

elastic_cluster_name = config['configurations']['elasticsearch-site']['cluster.name']
elastic_port = config['configurations']['elasticsearch-site']['http.port']

kibana_port = config['configurations']['kibana-site']['server.port']
kinana_index = config['configurations']['kibana-site']['kibana.index']

grafana_port =config['configurations']['grafana-site']['grafana.server.port']

ockb_elastic_host = config['configurations']['ockb-site']['elasticsearch.host']
ockb_elastic_port = config['configurations']['ockb-site']['elasticsearch.port']
ockb_port = config['configurations']['ockb-site']['ockb.server.port']

if 'clusterHostInfo' in config and 'ockb_server_hosts' in config['clusterHostInfo']:
    ockb_server_hosts = config['clusterHostInfo']['ockb_server_hosts']
    ockb_host = ockb_server_hosts[0]
else:
    ockb_server_hosts = default("/clusterHostInfo/ockb_server_hosts", None)
    if type(ockb_server_hosts) is list:
        ockb_host = ockb_server_hosts[0]
    else:
        ockb_host = ockb_server_hosts

if (('log-data-source' in config['configurations']) and ('content' in config['configurations']['log-data-source'])):
    logstash_log_conf = config['configurations']['log-data-source']['content']
else:
    logstash_log_conf = None
    
if (('metric-data-source' in config['configurations']) and ('content' in config['configurations']['metric-data-source'])):
    logstash_metric_conf = config['configurations']['metric-data-source']['content']
else:
    logstash_metric_conf = None

elastic_data_hosts = []
if 'clusterHostInfo' in config and 'elastic_datanode_hosts' in config['clusterHostInfo']:
    elastic_data_hosts = config['clusterHostInfo']['elastic_datanode_hosts']
    es_host = elastic_data_hosts[0]
else:
    elastic_data_hosts = default("/clusterHostInfo/elastic_datanode_hosts", None)
    if type(elastic_data_hosts) is list:
        es_host = elastic_data_hosts[0]
    else:
        es_host = elastic_data_hosts

if 'clusterHostInfo' in config and 'kibana_server_hosts' in config['clusterHostInfo']:
    kibana_server_hosts = config['clusterHostInfo']['kibana_server_hosts']
    kibana_host = kibana_server_hosts[0]
else:
    kibana_server_hosts = default("/clusterHostInfo/kibana_server_hosts", None)
    if type(kibana_server_hosts) is list:
        kibana_host = kibana_server_hosts[0]
    else:
        kibana_host = kibana_server_hosts

if 'clusterHostInfo' in config and 'grafana_server_hosts' in config['clusterHostInfo']:
    grafana_server_hosts = config['clusterHostInfo']['grafana_server_hosts']
    grafana_host = grafana_server_hosts[0]
else:
    grafana_server_hosts = default("/clusterHostInfo/grafana_server_hosts", None)
    if type(grafana_server_hosts) is list:
        grafana_host = grafana_server_hosts[0]
    else:
        grafana_host = grafana_server_hosts
