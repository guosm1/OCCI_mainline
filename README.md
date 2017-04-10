# 橘云集群洞察(OCCI)
## 介绍
OCCI (Orange Cloud Cluster Insight) 是一个基于ELK的大数据平台Hadoop的智能化的辅助运维工具.可以利用它进行大数据集群面向租户和面向负载的监控,为集群高效运维，故障解决，集群调优等方面提供支持。
## 功能
### 集群运行时资源使用与作业运行情况
- 集群级别报表
- 租户级别报表(每个租户一个dashboad)
- hdfs磁盘使用
### 重要服务组件的错误日志
- hdfs
- yarn
- hive
- hbase
- zookeeper
### 告警
- 超长mapreduce作业告警
## 使用ELK版本
- Elasticsearch Version=2.3.5
- Logstash Version=2.3.4
- Kibana Version=4.5.4
## 安装部署
- [安装部署](https://github.com/Asiainfo-OCCI/OCCI_mainline/wiki/OCCI1.0安装部署)