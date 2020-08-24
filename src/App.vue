<template>
  <div id="app">
    <div id="logo">
      <el-row>
        <el-col :span="10"><img style="height: 200px;" src="./assets/logo.png"></el-col>
        <el-col :span="14"><h1>DI Diagnostic Center</h1></el-col>
      </el-row>
    </div>
    <div>
      <CheckerGraph/>
    </div>
  </div>
</template>

<script>
import CheckerGraph from './components/CheckerGraph.vue'

export default {
  name: 'App',
  components: {
    CheckerGraph
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#logo {
  text-align: right;
  height: 200px;
}
h1 {
  font-size: 50px;
  margin-top: 80px;
  text-align: left;
}
</style>
