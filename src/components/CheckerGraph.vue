<template>
  <div>
    <div v-if="!checkResult" id="inputDiv">
      <h2>Plese input the following needed items:</h2>
      <el-form>
        <el-form-item>
          <label class="formItems">Vsystm URL:</label>
          <el-input class="formItems" v-model="formItems.vsystemUrl" placeholder="please edit here..."></el-input>
        </el-form-item>
        <el-form-item>
          <label class="formItems">Vsystm Password:</label>
          <el-input class="formItems" v-model="formItems.vsystemPassword" show-password placeholder="please edit here..."></el-input>
        </el-form-item>
        <el-form-item>
          <el-row><label class="formItems">Kubeconfig File: </label></el-row>
          <el-button class="formItems" icon="el-icon-document-copy" round @click="checkFile">Choose File</el-button>
          <span class="formItems">  {{ fileName }}  </span>
          <input type="file" id="fileinput" style="display:none;"  @change="onFileChange"/>
          <el-button class="formItems" id="removeBtn" icon="el-icon-document-copy" size="small" round @click="removeFile">Delete</el-button>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button class="formItems" round type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
      </el-form>
    </div>
    <span class="formItems" style="display:none;">{{ checkResult }}</span>
    <div v-if="checkResult" id="checkerGraph"></div>
    <div v-if="checkResult" id="rcaList">
      <h4>RCA List:</h4>
      <el-row>{{this.rcaList}}</el-row>
      <el-row><el-button class="formItems" round type="primary" @click="backBtn">Back</el-button></el-row>
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
        vsystemUrl: '',
        vsystemPassword: '',
        configFile: ''
      },
      fileName: '',
      checkResult: '',
      rcaList: ''
    };
  },

  watch: {
    checkResult: function (newValue, oldValue) {
      if (oldValue == "") {
        this.waitForResult()
      }
    }
  },

  methods: {
    drawRcaTable() {

    },

    backBtn() {
      this.checkResult = ''
      this.rcaList = ''
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
      console.log(jsonForm)
      var vm = this;
      client.post('/post', jsonForm)
      .then(function (res) {
        console.log(res);
        vm.checkResult = res.data.message
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    drawCheckerGraph(responseData) {
      var data_k8s = JSON.parse(responseData).k8s_runtimeGraph
      var data_vsystem = JSON.parse(responseData).vsystem_runtimeGraph
      const echarts = require('echarts');
      var myChart = echarts.init(document.getElementById('checkerGraph'));
      
      let option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        legend: {
          top: '2%',
          left: '3%',
          orient: 'vertical',
          data: [{
            name: 'k8s_checker_graph',
            icon: 'rectangle'
          },
          {
            name: 'vsystem_checker_graph',
            icon: 'rectangle'
          }],
          borderColor: '#c23531'
        },
        series:[
          {
            type: 'tree',
            name: 'k8s_checker_graph',
            data: [data_vsystem],
            top: '5%',
            left: '7%',
            bottom: '2%',
            right: '60%',
            symbolSize: 7,
            label: {
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
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
  
          },
          {
            type: 'tree',
            name: 'vsystem_checker_graph',
            data: [data_k8s],
            top: '20%',
            left: '60%',
            bottom: '22%',
            right: '18%',
            symbolSize: 7,
            label: {
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
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      };
      myChart.setOption(option)
    },

    checkTaskStatus(load) {
      var vm = this;
      client.get('/checkResult')
      .then(function (res) {
        console.log(res);
        load.close()
        if (res.status == 200 && res.data.status == "finished") {
            vm.checkResult = res.data.status
            vm.drawCheckerGraph(res.data.data)
            vm.rcaList = JSON.parse(res.data.data).rcaList.PairList
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
      const load = this.$loading({
        lock: true,
        text: 'Your Diagnostic Task is Running',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.checkTaskStatus(load)
    },

    submitForm() {
      for (var item in this.formItems) {
        console.log(item)
        if (this.formItems[item] == '') {
          this.$alert('Please check your inputs without empty.', 'Alert', {
            confirmButtonText: 'OK'
          });
          return
        }
      }
      var jsonForm = JSON.stringify([
        {
          itemName : "vsystemURL",
          itemValue : this.formItems.vsystemUrl
        },
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
  /* width: 900px; */
  height: 600px;
  text-align: left;
  border-style: solid;
  border-width: 2px;
  border-color: blue;
}
#raList {
  margin: auto;
  width: 900px;
  text-align: left;
  border-style: solid;
  border-width: 2px;
  border-color: blue;
}
.formItems {
  font-size:15px;
}
</style>
