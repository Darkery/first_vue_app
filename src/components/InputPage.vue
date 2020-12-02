<template>
  <div>
    <div v-if="checkResult">
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
                      <a v-for="ra in scope.row.raList" :key="ra" :href="appUrl + '/ra/' + ra" target="_blank">{{ ra }}, </a>
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
      appUrl: this.$route.path,
      checkResult: '',
      checkResultData: '',
      rcaList: '',
      tableData: '',
      load: ''
    };
  },

  methods: {
    backBtn() {
      this.checkResult = ''
      this.rcaList = ''
      this.tableData = ''
      this.checkResultData = ''
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
    
    checkTaskStatus(taskId) {
      var vm = this;
      client.get('/checkResult/' + taskId)
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

  },

  mounted() {
    this.load = this.$loading({
      lock: true,
      text: 'Your Diagnostic Task is Running',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.checkTaskStatus(this.$route.params.taskId)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
