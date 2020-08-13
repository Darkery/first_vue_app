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
          <span class="formItems">  {{fileName}}  </span>
          <input type="file" id="fileinput" style="display:none;"  @change="onFileChange"/>
          <el-button class="formItems" id="removeBtn" icon="el-icon-document-copy" size="small" round @click="removeFile">Delete</el-button>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button class="formItems" round type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="checkResult" id="checkerGraph">
    </div>
    <div v-if="checkResult" id="raList">
    </div>
  </div>
</template>

<script>
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
      checkResult: ''
    };
  },
  methods: {
    submitForm() {
      console.log(this.formItems.vsystemUrl)
      console.log(this.formItems.vsystemPassword)
      console.log(this.formItems.configFile)
    },
    
    checkFile () {
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
      reader.readAsDataURL(file)
    },

    removeFile: function (e) {
      this.formItems.configFile = ''
      document.querySelector('#fileinput').value = null
      this.fileName = ''
      document.querySelector('#removeBtn').setAttribute("style", "display:none;")
    }

    // sendFile(file) {
    //   var formData = new FormData(form);
    //   formData.append("data", this.configFile);
    //   this.$http
    //     .post(that.$api.xxxx, data, {
    //       headers: { "Content-Type": "multipart/form-data" },
    //       transformRequest: [
    //         function(d) {
    //           return d;
    //         }
    //       ]
    //     })
    //     .then(res => {
    //       if (res.data.code == 200) {
           
    //       }
    //     });
    // },
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
