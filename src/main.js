// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VeeValidate from 'vee-validate'
import VueHtml5Editor from 'vue-html5-editor'
import VueToastr from '@deveodk/vue-toastr'
import { API_URL } from '@/settings.js'
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css'
require('../static/css/custom.css')

Vue.router = router
Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)
Vue.use(VeeValidate)
Vue.use(VueToastr, {
  defaultPosition: 'toast-bottom-right',
  defaultType: 'error',
  defaultTimeout: 3000
})

Vue.use(VueHtml5Editor, {
  name: 'editor',
  hiddenModules: [
    'image',
    'full-screen',
    'info'
  ]
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  data () {
    return {
      apiArrays: {},
      currentUser: {},
      staff: {
        managers: [],
        translators: []
      },
      memberships: []
    }
  },
  methods: {
    updateStaff (role, redirect, callback) {
      Vue.axios.get(API_URL + 'admin/user/profiles/' + role).then((responce) => {
        this.staff[role + 's'] = responce.data.data

        if (redirect) {
          router.push({name: role + 's list'})
        }

        if (callback) {
          callback()
        }
      })
    },
    updateMemberships (redirect) {
      Vue.axios.get(API_URL + 'memberships').then((responce) => {
        this.memberships = responce.data.data
        if (redirect) {
          router.push({name: 'Memberships List'})
        }
      })
    },
    updateCurrentUser () {
      Vue.axios.get(API_URL + 'admin/info').then((responce) => {
        this.currentUser = responce.data.data
        this.$cookie.set('currentRole', responce.data.data.role)
      })
    }
  }
})
