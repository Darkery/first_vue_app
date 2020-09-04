<template>
  <div>
    <div v-if="!requestResult" id="inputDiv">
      <h2>Please input the following needed items:</h2>
      <el-form>
        <el-form-item>
          <label class="formItems">Vsystm Password of System Tenant System User:</label>
          <el-input class="formItems" v-model="formItems.vsystemPassword" show-password placeholder="please edit here..."></el-input>
        </el-form-item>
        <el-form-item>
          <el-row><label class="formItems">Kubeconfig File: </label></el-row>
          <el-button class="formItems" icon="el-icon-document-copy" round @click="checkFile">Choose File</el-button>
          <span class="formItems">  {{ fileName }}  </span>
          <input type="file" id="fileinput" style="display:none;"  @change="onFileChange"/>
          <el-button class="formItems" id="removeBtn" icon="el-icon-document-copy" size="small" round @click="removeFile">Delete</el-button>
        </el-form-item>
        <el-form-item style="text-align:right;">
          <el-button class="formItems" round type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="requestResult">
      <el-col :span="24">
        <el-tabs type="border-card">
          <el-tab-pane label="Checkers Runtime">
            <div style="position: relative;">
              <div v-if="checkResult" id="tags">
                <el-tag
                  v-for="item in tagItems"
                  :key="item.label"
                  :type="item.type"
                  effect="dark">
                  {{ item.label }}
                </el-tag>
              </div>
              <div id="checkerGraph"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Entities Relationship">
            <div>
              <div style="margin-bottom:10px;">　
                <el-dropdown trigger="click" @command="handleCommand">
                  <el-button type="primary">
                    Select View<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="Complete View">Complete View</el-dropdown-item>
                    <el-dropdown-item command="Issue View">Issue View</el-dropdown-item>
                    <el-dropdown-item command="K8s View">K8s View</el-dropdown-item>
                    <el-dropdown-item command="Vsystem View">Vsystem View</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>    
              <network ref="network"
                :nodes="comGraph.nodes"
                :edges="comGraph.edges"
                :options="comGraph.options"
              ></network>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Root Cause Analysis">
            <el-col>
              <h3 style="text-align:center;">Root Cause List:</h3>
              <el-col :span="24" :offset="1">
                <el-table :data="tableData" stripe style="width:100%">
                  <el-table-column prop="rc" width="300" label="Root Cause"></el-table-column>
                  <el-table-column prop="entity" width="400" label="Unavailable Entity"></el-table-column>
                  <el-table-column prop="vote" width="100" label="Votes"></el-table-column>
                  <el-table-column prop="ra" width="400" label="Recommended Action"></el-table-column>
                </el-table>
              </el-col>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col style="margin:20px;">
        <el-button class="formItems" round type="primary" @click="backBtn">Back</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import client from "@/utils/client";

export default {
  name: 'CheckGraph',
  data() {
    return {
      formItems: {
        vsystemPassword: '',
        configFile: ''
      },
      tagItems: [
        { type: 'success', label: 'Finished' },
        { type: 'info', label: 'Skipped' },
        { type: 'danger', label: 'Failed' }
      ],
      fileName: '',
      requestResult: '',
      checkResult: '',
      rcaList: '',
      tableData: '',
      myChart: '',
      comGraph: {
        options: {
          height: "1200px",
        },
        edges: [],
        nodes: [],
        edgesComplete: [],
        nodesComplete: [],
        edgesK8s: [],
        nodesK8s: [],
        edgesVsystem: [],
        nodesVsystem: [],
        edgesIssue: [],
        nodesIssue: [],
        nodesNameIssue: []
      },
      load: '',
    };
  },

  watch: {
    requestResult: function (newValue, oldValue) {
      if (oldValue == "") {
        this.waitForResult()
      }
    }
    // checkResult: function (newValue, oldValue) {
    //   if (oldValue == "") {
    //     this.waitForResult()
    //   }
    // }
  },

  methods: {
    handleCommand(command) {
      if (command == "K8s View") {
        this.comGraph.nodes = this.comGraph.nodesK8s
        this.comGraph.edges = this.comGraph.edgesK8s
      } else if (command == "Vsystem View") {
        this.comGraph.nodes = this.comGraph.nodesVsystem
        this.comGraph.edges = this.comGraph.edgesVsystem
      } else if (command == "Issue View") {
        this.comGraph.nodes = this.comGraph.nodesIssue
        this.comGraph.edges = this.comGraph.edgesIssue
      } else {
        this.comGraph.nodes = this.comGraph.nodesComplete
        this.comGraph.edges = this.comGraph.edgesComplete
      }
    },

    backBtn() {
      this.requestResult = ''
      this.checkResult = ''
      this.rcaList = ''
      this.tableData = ''
      this.myChart.dispose()
      this.comGraph.edges = []
      this.comGraph.nodes = []
      this.comGraph.edgesComplete = []
      this.comGraph.nodesComplete = []
      this.comGraph.edgesK8s = []
      this.comGraph.nodesK8s = []
      this.comGraph.edgesVsystem = []
      this.comGraph.nodesVsystem = []
      this.comGraph.edgesIssue = []
      this.comGraph.nodesIssue = []
      this.comGraph.nodesNameIssue = []
    },

    checkFile() {
      document.querySelector('#fileinput').click()
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length)
        return;
      this.fileName = document.querySelector('#fileinput').files[0].name
      this.getFile(files[0])
      document.querySelector('#removeBtn').setAttribute("style", "display;")
    },

    getFile(file) {
      var reader = new FileReader()
      var vm = this;
      reader.onload = (e) => {
        vm.formItems.configFile = e.target.result
      };
      reader.readAsText(file)
    },

    removeFile(e) {
      this.formItems.configFile = ''
      document.querySelector('#fileinput').value = null
      this.fileName = ''
      document.querySelector('#removeBtn').setAttribute("style", "display:none;")
    },

    sendForm(jsonForm) {
      var vm = this;
      client.post('/post', jsonForm)
      .then(function (res) {
        console.log(res.data.message)
        vm.requestResult = res.data.message
      })
      .catch(function (error) {
        console.log(error);
        vm.$alert('Send Request failed.' + error, 'Alert', {
          confirmButtonText: 'OK'
        });
      });
    },

    drawCheckerGraph(responseData) {
      var data_k8s = JSON.parse(responseData).k8s_runtimeGraph
      var data_vsystem = JSON.parse(responseData).vsystem_runtimeGraph
      const echarts = require('echarts');
      this.myChart = echarts.init(document.getElementById('checkerGraph'));
      
      let option = {
        title: {
          text: 'Checker Result',
          subtext: '',
          top: 10,
          left: 10,
          textStyle: {
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        legend: [
          {
            top: '40',
            left: '10',
            orient: 'horizontal',
            icon: 'roundRect',
            textStyle: {
              fontSize: 15
            }
          }
        ],
        series:[
          {
            type: 'tree',
            name: 'k8s_checker_graph',
            data: [data_vsystem],
            left: '14%',
            right: '65%',
            symbolSize: 10,
            initialTreeDepth: 2,
            roam: true,
            itemStyle: {
            },
            label: {
              fontSize: 15,
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            }
          },
          {
            type: 'tree',
            name: 'vsystem_checker_graph',
            data: [data_k8s],
            left: '60%',
            right: '20%',
            symbolSize: 10,
            initialTreeDepth: 2,
            roam: true,
            label: {
              fontSize: 15,
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            }
          }
        ]
      };
      this.myChart.setOption(option)
    },

    checkTaskStatus() {
      var vm = this;
      client.get('/checkResult')
      .then(function (res) {
        vm.load.close()
        if (res.status == 200 && res.data.status == "finished") {
            vm.checkResult = res.data.status
            vm.drawCheckerGraph(res.data.data)
            vm.rcaList = JSON.parse(res.data.data).rcaList.RcaList
            var rcaTableData = []
            for (var index in vm.rcaList) {
              var rcaTableItem = new Object();
              rcaTableItem.rc = vm.rcaList[index].RootCause
              rcaTableItem.entity = vm.rcaList[index].Entity
              rcaTableItem.vote = vm.rcaList[index].Vote
              rcaTableItem.ra = ""
              if (vm.rcaList[index].RecommendedActions != null) {
                rcaTableItem.ra = vm.rcaList[index].RecommendedActions.join(",")
              }
              rcaTableData.push(rcaTableItem)
            }
            vm.tableData = rcaTableData
            vm.comGraph.edges = JSON.parse(res.data.data).componentsGraph.edges;
            vm.comGraph.nodes = JSON.parse(res.data.data).componentsGraph.nodes;
            vm.comGraph.edgesComplete = JSON.parse(res.data.data).componentsGraph.edges;
            vm.comGraph.nodesComplete = JSON.parse(res.data.data).componentsGraph.nodes;
            
            for (var i in vm.comGraph.nodesComplete) {
              if (vm.comGraph.nodesComplete[i].id.indexOf("cluster")==0 || vm.comGraph.nodesComplete[i].id.indexOf("node")==0 || vm.comGraph.nodesComplete[i].id.indexOf("pod")==0 || vm.comGraph.nodesComplete[i].id.indexOf("container")==0) {
                vm.comGraph.nodesK8s.push(vm.comGraph.nodesComplete[i])
                if (vm.comGraph.nodesComplete[i].id.indexOf("cluster")==0) {
                  vm.comGraph.nodesVsystem.push(vm.comGraph.nodesComplete[i])
                }
              } else if (vm.comGraph.nodesComplete[i].id.indexOf("cluster")==0 || vm.comGraph.nodesComplete[i].id.indexOf("tenant")==0 || vm.comGraph.nodesComplete[i].id.indexOf("user")==0 || vm.comGraph.nodesComplete[i].id.indexOf("app")==0) {
                vm.comGraph.nodesVsystem.push(vm.comGraph.nodesComplete[i])
              }
              // record the problem node
              if (vm.comGraph.nodesComplete[i].color == "red") {
                vm.comGraph.nodesIssue.push(vm.comGraph.nodesComplete[i])
                vm.comGraph.nodesNameIssue.push(vm.comGraph.nodesComplete[i].id)
              }
            }

            // var currProblemNodeNum = vm.comGraph.nodesNameIssue.length
            var nodesNameIssueAdded = new Array()
            for (var i in vm.comGraph.edgesComplete) {
              if ((vm.comGraph.edgesComplete[i].from.indexOf("cluster")==0 || vm.comGraph.edgesComplete[i].from.indexOf("node")==0 || vm.comGraph.edgesComplete[i].from.indexOf("pod")==0 || vm.comGraph.edgesComplete[i].from.indexOf("container")==0) 
                    && (vm.comGraph.edgesComplete[i].to.indexOf("node")==0 || vm.comGraph.edgesComplete[i].to.indexOf("pod")==0 || vm.comGraph.edgesComplete[i].to.indexOf("container")==0)) {
                vm.comGraph.edgesK8s.push(vm.comGraph.edgesComplete[i])
              } else if ((vm.comGraph.edgesComplete[i].from.indexOf("cluster")==0 || vm.comGraph.edgesComplete[i].from.indexOf("tenant")==0 || vm.comGraph.edgesComplete[i].from.indexOf("user")==0 || vm.comGraph.edgesComplete[i].from.indexOf("app")==0) 
                    && (vm.comGraph.edgesComplete[i].to.indexOf("tenant")==0 || vm.comGraph.edgesComplete[i].to.indexOf("user")==0 || vm.comGraph.edgesComplete[i].to.indexOf("app")==0)) {
                vm.comGraph.edgesVsystem.push(vm.comGraph.edgesComplete[i])
              }
              if (vm.comGraph.nodesNameIssue.indexOf(vm.comGraph.edgesComplete[i].to) != -1) {
                vm.comGraph.edgesIssue.push(vm.comGraph.edgesComplete[i])
                nodesNameIssueAdded.push(vm.comGraph.edgesComplete[i].from)
              }
            }
            vm.comGraph.nodesNameIssue = nodesNameIssueAdded
            for (var i in vm.comGraph.nodesComplete) {
                if (vm.comGraph.nodesNameIssue.indexOf(vm.comGraph.nodesComplete[i].id) != -1) {
                  vm.comGraph.nodesIssue.push(vm.comGraph.nodesComplete[i])
                }
            }
            
            // construct issue view
            while (vm.comGraph.nodesNameIssue.length != 0) {
              // add edges and record node name
              nodesNameIssueAdded = []
              for (var i in vm.comGraph.edgesComplete) {
                if (vm.comGraph.nodesNameIssue.indexOf(vm.comGraph.edgesComplete[i].to) != -1) {
                  vm.comGraph.edgesIssue.push(vm.comGraph.edgesComplete[i])
                  nodesNameIssueAdded.push(vm.comGraph.edgesComplete[i].from)
                }
              }
              vm.comGraph.nodesNameIssue = nodesNameIssueAdded
              vm.comGraph.nodesNameIssue = Array.from(new Set(vm.comGraph.nodesNameIssue))

              // add node according to node name
              for (var i in vm.comGraph.nodesComplete) {
                if (vm.comGraph.nodesNameIssue.indexOf(vm.comGraph.nodesComplete[i].id) != -1) {
                  vm.comGraph.nodesIssue.push(vm.comGraph.nodesComplete[i])
                }
              }
            }
            vm.comGraph.nodesIssue = Array.from(new Set(vm.comGraph.nodesIssue))

        } else if (res.data.status == "failed") {
          vm.checkResult = ""
          vm.$alert('Task job failed.' + res.data.data, 'Alert', {
            confirmButtonText: 'OK'
          });
        } else {
          vm.checkResult = ""
          vm.$alert('Task job failed. Please check your inputs and try again.', 'Alert', {
            confirmButtonText: 'OK'
          });
        }
      })
    },

    waitForResult() {
      this.checkTaskStatus()
    },

    submitForm() {
      this.load = this.$loading({
        lock: true,
        text: 'Your Diagnostic Task is Running',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      for (var item in this.formItems) {
        if (this.formItems[item] == '') {
          this.$alert('Please check your inputs without empty.', 'Alert', {
            confirmButtonText: 'OK'
          });
          return
        }
      }
      var jsonForm = JSON.stringify([
        {
          itemName : "password",
          itemValue : this.formItems.vsystemPassword
        },
        {
          itemName : "kubeConfig",
          itemValue : this.formItems.configFile
        },
      ]);
      this.sendForm(jsonForm)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#inputDiv {
  margin: auto;
  width: 800px;
  text-align: left;
}
#checkerGraph {
  margin: auto;
  height: 1200px;
  text-align: left;
}
#tags {
  position: absolute;
  top: 70px;
  left: 15px;
}
#rcaListDiv {
  margin: auto;
  text-align: center;
}
.formItems {
  font-size:15px;
}
.el-tab-pane {
  height: 1200px;
}
</style>
