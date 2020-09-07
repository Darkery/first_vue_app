import Vue from 'vue'
import '@/plugins/element.js'
import App from '@/App.vue'
import router from '@/router'
import { Network } from 'vue-vis-network'

Vue.config.productionTip = false
Vue.component('network', Network);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
