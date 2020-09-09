<template>
  <div id="app">
    <Header/>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import inputPage from "@/components/InputPage.vue";

export default {
  name: 'App',
  components: {
    Header,
    inputPage
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
</style>
