<template>
    <div id="header">
      <el-row>
        <el-col :span="10"><img style="height: 100px;" src="@/assets/logo.png"></el-col>
        <el-col :span="14"><h1>DI Diagnostic Center</h1></el-col>
      </el-row>
    </div>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style scoped>
#header {
  text-align: right;
  height: 100px;
}
h1 {
  font-size: 35px;
  margin-top: 33px;
  text-align: left;
}
</style>