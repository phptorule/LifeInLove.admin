<template>
  <div>
    <div class="loader" v-show="!isReady"></div>

    <div class="app" v-if="isReady">
      <AppHeader/>
      <div class="app-body">
        <Sidebar :navItems="nav"/>
        <main class="main">
          <breadcrumb :list="list"/>
          <div class="container-fluid">
            <router-view></router-view>
          </div>
        </main>
      </div>
      <AppFooter/>
    </div>
  </div>
</template>

<script>
import nav from '@/_nav'
import { Header as AppHeader, Sidebar, Footer as AppFooter, Breadcrumb } from '@/components/'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppFooter,
    Breadcrumb
  },
  data () {
    return {
      nav: nav.items,
      isReady: false,
      mainFields: [
        'body_style',
        'eye_wear',
        'field_of_work',
        'living_situation',
        'employment_status',
        'ethnicities',
        'interests'
      ],
      fieldsArray: [
        'eyes',
        'hair_colors',
        'hair_lengths',
        'religions',
        'want_children',
        'marital_statuses',
        'education',
        'primary_language',
        'language_level',
        'drink',
        'smoke'
      ]
    }
  },
  created () {
    Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$cookie.get('token')
    this.$root.updateCurrentUser()
    this.$root.updateStaff('translator')
    this.$root.updateStaff('manager')
    this.$root.updateMemberships()
    this.getAllData()
  },
  methods: {
    getDayArray: () => {
      let temp = [{value: '', text: 'Choose'}]
      for (var k = 1; k <= 31; k++) {
        temp.push({value: k, text: k})
      }
      return temp
    },
    getYearsArray: () => {
      let temp = [{value: '', text: 'Choose'}]
      let date = new Date()
      let year = date.getFullYear()
      year -= 18
      let from = year - 72
      for (year; year >= from; year--) {
        temp.push({value: year, text: year})
      }
      return temp
    },
    getMatchArray: () => {
      let years = [{value: '', text: 'Choose'}]
      for (var i = 18; i < 56; i++) {
        years.push(i)
      }
      return years
    },
    getSimpleData (name) {
      this.fields[name + '_array'] = [{ value: '', text: 'Choose' }]
      Vue.axios.get(API_URL + name).then((responce) => {
        responce.data.data.forEach((e) => {
          this.fields[name + '_array'].push({
            value: e.id, text: e.value
          })
        })
      })
    },
    getAllData () {
      let counter = 1
      this.fields.day_array = this.getDayArray()
      this.fields.years_array = this.getYearsArray()
      this.fields.match_array = this.getMatchArray()
      this.fields.month_array = [
        { value: '', text: 'Choose' },
        { value: 1, text: 'Jan' },
        { value: 2, text: 'Feb' },
        { value: 3, text: 'Mar' },
        { value: 4, text: 'Apr' },
        { value: 5, text: 'May' },
        { value: 6, text: 'Jun' },
        { value: 7, text: 'Jul' },
        { value: 8, text: 'Aug' },
        { value: 9, text: 'Sep' },
        { value: 10, text: 'Oct' },
        { value: 11, text: 'Nov' },
        { value: 12, text: 'Dec' }
      ]

      this.fields.children_array = [{ value: '', text: 'Choose' }]
      Vue.axios.get(API_URL + 'children').then((responce) => {
        responce.data.data.forEach((e) => {
          this.fields.children_array.push({
            value: e.id, text: e.value
          })
        })
      })

      this.fields.height_array = [{value: '', text: 'Choose'}]
      Vue.axios.get(API_URL + 'height').then((responce) => {
        for (let x in responce.data.data) {
          this.fields.height_array.push({
            value: responce.data.data[x].id, text: responce.data.data[x].cm + ' cm / (' + responce.data.data[x].inch + ')'
          })
        }
      })

      this.fields.weight_array = [{value: '', text: 'Choose'}]
      Vue.axios.get(API_URL + 'weight').then((responce) => {
        for (let x in responce.data.data) {
          this.fields.weight_array.push({
            value: responce.data.data[x].id, text: responce.data.data[x].kg + ' kg / ' + responce.data.data[x].lbs + ' lbs'
          })
        }
      })

      this.fields.countries_array = [{value: '', text: 'Choose'}]
      Vue.axios.get(API_URL + 'countries').then((responce) => {
        for (let x in responce.data.data) {
          this.fields.countries_array.push({
            value: responce.data.data[x].country_code, text: responce.data.data[x].country_name
          })
        }
      })

      this.mainFields.forEach((field) => {
        this.getSimpleData(field)
      })

      this.fieldsArray.forEach((field) => {
        this.fields[field + '_array'] = [{value: '', text: 'Choose'}]
        Vue.axios.get(API_URL + field).then((responce) => {
          responce.data.data.forEach((e) => {
            this.fields[field + '_array'].push({
              value: e.id, text: e.value
            })
          })
          if (counter === this.fieldsArray.length) {
            this.fields.interests_array.shift()
            this.$root.apiArrays = this.fields
            this.isReady = true
          }
          counter++
        })
      })
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  }
}
</script>

<style scoped>
  .loader {
    margin-top: 45vh;
    margin-left: auto;
    margin-right: auto;
  }
</style>