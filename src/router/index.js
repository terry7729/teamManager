import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import personal from '@/components/personal'
import analysis from '@/components/analysis'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        index : 1
      }
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal,
      meta:{
        index : 2
      }
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: analysis,
      meta:{
        index : 3
      }
    }
  ]
})
