import Vue from 'vue'
import Router from 'vue-router'
import InputPage from "./components/InputPage.vue"
import RecommendedAction from "./components/RecommendedAction.vue"

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '/task/:taskId',
      name: 'InputPage',
      component: InputPage,
    },
    {
      path: '/task/:taskId/ra/:name',
      name: 'RecommendedAction',
      component: RecommendedAction,
    },
    {
      path: '/task/:taskId/ra',
      redirect: '/task/:taskId'
    }
  ]
})
