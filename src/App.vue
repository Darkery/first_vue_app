<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <p ref="a">111</p>
    <p>{{ banana }}</p>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Watch/>
    <Test/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Watch from './components/Watch'
import Test from './components/Test'

export default {
  name: 'App',
  data() {
    return {
      apple: 'apple',
      banana: 'banana'
    }
  },
  // data: {
  //   apple: 'cccc',
  //   banana: 'zzzzzzz'
  // },
  components: {
    // HelloWorld,
    Watch,
    Test
  },
  mounted () {
    this.jing()
  },
  methods: {
    jing () {
      this.$refs['a'].textContent = this.$data.apple
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
