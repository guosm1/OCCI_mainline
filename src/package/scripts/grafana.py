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
from resource_management import *
import json
import sys  
reload(sys)  
sys.setdefaultencoding('utf8') 


def grafana(role=None):
    import params
    directories = [params.grafana_home,
                   params.grafana_conf_dir,
                   params.grafana_pid_dir,
                   params.grafana_log_dir,
                   params.grafana_data_dir]

    Directory(directories,
              owner=params.grafana_user,
              group=params.grafana_user_group,
              mode=0755,
              cd_access='a'
              )

    File(format("/etc/sysconfig/grafana-server"),
         content=Template(format("grafana-server.sysconfig.j2")),
         owner=params.grafana_user,
         group=params.grafana_user_group,
         mode=0755
         )

    File(format("/etc/grafana/grafana.ini"),
         content=Template(format("grafana.ini.j2")),
         owner=params.grafana_user,
         group=params.grafana_user_group,
         mode=0755
         )

    File(format("/usr/lib/systemd/system/grafana-server.service"),
         content=Template(format("grafana-server.service.j2")),
         owner=params.grafana_user,
         group=params.grafana_user_group,
         mode=0755
         )

    File(format("{grafana_home}/ji-qun-zi-yuan-bao-biao.json"),
         content=Template(format("ji-qun-zi-yuan-bao-biao.json.j2")),
         owner=params.grafana_user,
         group=params.grafana_user_group,
         mode=0755
         )

    File(format("{grafana_home}/zu-hu-zi-yuan-shi-yong-bao-biao.json"),
         content=Template(format("zu-hu-zi-yuan-shi-yong-bao-biao.json.j2")),
         owner=params.grafana_user,
         group=params.grafana_user_group,
         mode=0755
         )

    File(format("{grafana_home}/logstash-disk.json"),
         content=Template(format("logstash-disk.json.j2")),
                          owner=params.grafana_user,
                          group=params.grafana_user_group,
                          mode=0755
         )

    File(format("{grafana_home}/mylogstash-yarn-apps.json"),
         content=Template(format("mylogstash-yarn-apps.json.j2")),
                          owner=params.grafana_user,
                          group=params.grafana_user_group,
                          mode=0755
         )

    File(format("{grafana_home}/mylogstash-yarn-running.json"),
         content=Template(format("mylogstash-yarn-running.json.j2")),
                          owner=params.grafana_user,
                          group=params.grafana_user_group,
                          mode=0755
         )

    File(format("{grafana_home}/grafana-create-multi-tenancy.sh"),
         content=Template(format("grafana-create-multi-tenancy.sh.j2")),
         owner=params.grafana_user,
         group=params.grafana_user_group,
         mode=0755
         )
