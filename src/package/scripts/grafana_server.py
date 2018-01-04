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
import sys
import os, time


class GrafanaMaster(Script):
    def install(self, env):
        import params
        env.set_params(params)
        self.install_packages(env)

    def configure(self, env):
        import params
        from grafana import grafana
        env.set_params(params)
        grafana()

    def start(self, env, upgrade_type=None):
        import params
        env.set_params(params)
        self.configure(env)
        start_cmd = format("service grafana-server start")
        Execute(start_cmd)
        p_cmd = format(
            "curl -i -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST --data @{grafana_home}/logstash-disk.json  http://admin:admin@{grafana_host}:{grafana_port}/api/datasources -o /dev/null -s -w {http_code}")
        process = os.popen(p_cmd)
        outputStr = process.read()
        outputInt = int(outputStr)
        print outputInt
        count = 1
        while outputInt != 200 and outputInt != 409:
            time.sleep(3)
            print outputInt
            process = os.popen(p_cmd)
            outputStr = process.read()
            outputInt = int(outputStr)
            print outputInt
            count += 1
            if count > 4:
                break
        process.close()
        importdatasource1_cmd = format(
            "curl -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST --data @{grafana_home}/logstash-disk.json  http://admin:admin@{grafana_host}:{grafana_port}/api/datasources")
        Execute(importdatasource1_cmd)
        importdatasource2_cmd = format(
            "curl -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST --data @{grafana_home}/mylogstash-yarn-apps.json http://admin:admin@{grafana_host}:{grafana_port}/api/datasources")
        Execute(importdatasource2_cmd)
        importdatasource3_cmd = format(
            "curl -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST --data @{grafana_home}/mylogstash-yarn-running.json  http://admin:admin@{grafana_host}:{grafana_port}/api/datasources")
        Execute(importdatasource3_cmd)
        importdashboaed1_cmd = format(
            "curl -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST --data @{grafana_home}/zu-hu-zi-yuan-shi-yong-bao-biao.json  http://admin:admin@{grafana_host}:{grafana_port}/api/dashboards/db")
        Execute(importdashboaed1_cmd)
        importdashboaed2_cmd = format(
            "curl -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST --data @{grafana_home}/ji-qun-zi-yuan-bao-biao.json http://admin:admin@{grafana_host}:{grafana_port}/api/dashboards/db")
        Execute(importdashboaed2_cmd)

    def stop(self, env, upgrade_type=None):
        import params
        env.set_params(params)
        stop_cmd = format("service grafana-server stop")
        Execute(stop_cmd)

    def status(self, env):
        import params
        env.set_params(params)
        check_process_status(params.grafana_pid_file)

if __name__ == "__main__":
    GrafanaMaster().execute()
