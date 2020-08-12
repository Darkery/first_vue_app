<template>
  <div>
    <div v-if="!checkResult" id="inputDiv">
      <h2>Plese input the following needed items:</h2>
      <el-form>
        <el-form-item>
          <label class="inputs">Vsystm URL:</label>
          <el-input class="inputs" v-model="inputs.vsystemUrl" placeholder="please edit here..."></el-input>
        </el-form-item>
        <el-form-item>
          <label class="inputs">Vsystm Password:</label>
          <el-input class="inputs" v-model="inputs.vsystemPassword" show-password placeholder="please edit here..."></el-input>
        </el-form-item>
        <el-form-item>
          <label class="inputs">Kubeconfig File:</label>
          <el-upload
            class="inputs"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :multiple="false"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList">
            <el-button class="inputs" round type="primary">Select File</el-button>
            <!-- <div slot="tip" class="inputs">Single file max 500kb</div> -->
          </el-upload>
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
  name: '#CheckGraph',
  data() {
    return {
      inputs: {
        vsystemUrl: '',
        vsystemPassword: ''
      },
      fileName: '',
      configFile: '',
      fileList: [],
      checkResult: ''
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Are you sure to remove ${ file.name }？`);
    },
    
    checkFile () {
      document.querySelector('#fileinput').click()
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.fileName = document.querySelector('#fileinput').files[0].name
      this.getFile(files[0]);
    },

    getFile(file) {
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.configFile = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    sendFile(file) {
      var formData = new FormData(form);
      formData.append("data", this.configFile);
      this.$http
        .post(that.$api.xxxx, data, {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: [
            function(d) {
              return d;
            }
          ]
        })
        .then(res => {
          if (res.data.code == 200) {
           
          }
        });
    },

    removeFile: function (e) {
      this.configFile = '';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#inputDiv {
  margin: auto;
  width: 900px;
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
.inputs {
  font-size:15px;
}
</style>
