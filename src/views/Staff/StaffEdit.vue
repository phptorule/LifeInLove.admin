<template>
  <div class="animated fadeIn">
    <b-card header="Edit Staff">
      <StaffCreate v-if="isReady" :userData="user"/>
    </b-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { API_URL } from '@/settings.js'
import { StaffCreate } from '@/components'

export default {
  components: {
    StaffCreate
  },
  name: 'TranslatorEdit',
  props: ['id'],
  created () {
    this.getStaffInfo()
  },
  data () {
    return {
      isReady: false,
      user: {}
    }
  },
  methods: {
    getStaffInfo () {
      Vue.axios.get(API_URL + 'admin/user/' + this.id).then((responce) => {
        this.user = responce.data.data
        this.user.birth = responce.data.data.birthday
        this.isReady = true
      })
    }
  }
}
</script>