<template>
  <div>
    <div v-if="!requestResult" id="inputDiv">
      <h2>Please input the following needed items:</h2>
      <div style="margin-top: 20px">
        <el-radio-group v-model="diType">
          <el-radio-button label="DI On-Cloud"></el-radio-button>
          <el-radio-button label="DI On-Premise"></el-radio-button>
          <!-- <el-radio-button label="DI Enbeded"></el-radio-button> -->
        </el-radio-group>
      </div>
      <el-form>
        <el-form-item v-if="diType == 'DI On-Premise'">
          <label class="formItems">DI Namespace:</label>
          <el-input class="formItems" v-model="formItems.diNamespace" show-password placeholder="please edit here..."></el-input>
        </el-form-item>
        <el-form-item>
          <label class="formItems">Vsystem Password of System Tenant System User:</label>
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
          <el-tab-pane label="Root Cause Analysis">
            <el-col>
              <h3 style="text-align:center;">Root Cause List:</h3>
              <el-col :span="14.5" :offset="5">
                <el-table :data="tableData" stripe style="width:100%">
                  <el-table-column prop="rc" width="300" label="Root Cause"></el-table-column>
                  <el-table-column prop="entity" width="400" label="Unavailable Entity"></el-table-column>
                  <el-table-column prop="vote" width="100" label="Votes"></el-table-column>
                  <el-table-column width="300" label="Recommended Action">
                    <template slot-scope="scope">
                      <a v-for="ra in scope.row.raList" :key="ra" :href="appUrl + 'ra/' + ra" target="_blank">{{ ra }}, </a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="Entities Relationship">
            <componentGraph v-if="checkResultData" :checkResultData="checkResultData"></componentGraph>
          </el-tab-pane>
          <el-tab-pane label="Checkers Runtime" lazy='true'>
            <checkerGraph v-if="checkResultData" :checkResultData="checkResultData"></checkerGraph>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col style="margin:20px;">
        <el-button class="formItems" round type="primary" @click="backBtn">Back</el-button>
      </el-col>
    </div>
  </div>
</template>

<script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<script>
import client from "@/utils/client";
import checkerGraph from "@/components/CheckerGraph.vue"
import componentGraph from "@/components/ComponentGraph.vue"

export default {
  name: 'CheckGraph',
  components: {
    checkerGraph,
    componentGraph
  },
  data() {
    return {
      appUrl: this.$route.path + "#/",
      formItems: {
        diNamespace: '',
        vsystemPassword: '',
        configFile: ''
      },
      fileName: '',
      requestResult: '',
      checkResult: '',
      checkResultData: '',
      rcaList: '',
      tableData: '',
      load: '',
      diType: 'DI On-Cloud'
    };
  },

  watch: {
    requestResult: function (newValue, oldValue) {
      if (oldValue == "") {
        this.checkTaskStatus()
      }
    }
  },

  methods: {
    backBtn() {
      this.requestResult = ''
      this.checkResult = ''
      this.rcaList = ''
      this.tableData = ''
      this.checkResultData = ''
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
      var vm = this
      client.post('/post', jsonForm)
      .then(function (res) {
        console.log(res.data.message)
        vm.requestResult = res.data.message
      })
      .catch(function (error) {
        console.log(error)
        vm.$alert('Send Request failed.' + error, 'Alert', {
          confirmButtonText: 'OK'
        });
        vm.load.close()
      });
    },

    setRcaData(input) {
      this.rcaList = JSON.parse(input).rcaList.RcaList
      var rcaTableData = []
      for (var index in this.rcaList) {
        var rcaTableItem = new Object();
        rcaTableItem.rc = this.rcaList[index].RootCause
        rcaTableItem.entity = this.rcaList[index].Entity
        rcaTableItem.vote = this.rcaList[index].Vote
        rcaTableItem.raList = []
        if (this.rcaList[index].RecommendedActions != null) {
          for (var i in this.rcaList[index].RecommendedActions) {
            rcaTableItem.raList.push(this.rcaList[index].RecommendedActions[i])
          }
        }
        rcaTableData.push(rcaTableItem)
      }
      this.tableData = rcaTableData
    },
    
    checkTaskStatus() {
      var vm = this;
      client.get('/checkResult')
      .then(function (res) {
        vm.load.close()
        if (res.status == 200 && res.data.status == "finished") {
            vm.checkResult = res.data.status
            vm.checkResultData = res.data.data
            vm.setRcaData(vm.checkResultData)
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

    submitForm() {
      for (var item in this.formItems) {
        if (item == 'diNamespace' && this.diType != 'DI On-Premise' && this.formItems[item] == ''){
          continue
        }
        if (this.formItems[item] == '') {
          this.$alert('Please check your inputs without empty.', 'Alert', {
            confirmButtonText: 'OK'
          });
          return
        }
      }
      this.load = this.$loading({
        lock: true,
        text: 'Your Diagnostic Task is Running',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      var jsonForm = JSON.stringify([
        {
          itemName : "namespace",
          itemValue : this.formItems.diNamespace
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
  height: 800px;
}
</style>
