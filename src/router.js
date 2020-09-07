import Vue from 'vue'
import Router from 'vue-router'
import CheckerGraph from "./components/CheckerGraph.vue"
import RecommendedAction from "./components/RecommendedAction.vue"

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'CheckerGraph',
      component: CheckerGraph,
    },
    {
      path: '/ra/:name',
      name: 'RecommendedAction',
      component: RecommendedAction,
    },
    {
      path: '/ra',
      redirect: '/'
    }
  ]
})
