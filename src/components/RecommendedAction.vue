<template>
  <div id="ra">
    <div v-html=htmlStr></div>
  </div>
</template>

<script>
import client from "@/utils/client";

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      raName: '',
      htmlStr: '',
    };
  },
  methods: {
    fetchData(name) {
      var vm = this;
      vm.raName = name
      client.get('/recommendedAction/' + vm.raName)
      .then(function (res) {
        vm.htmlStr = res.data
      })
    }
  },
  created() {
    this.fetchData(this.$route.params.name);
    document.title = "Recommended Action " + this.raName
  }
}
</script>

<style sc>
#ra {
  margin: auto;
  width: 1200px;
}
</style>
