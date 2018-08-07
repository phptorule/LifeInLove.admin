<template>
  <div class="animated fadeIn">
    <b-card header="Devices">
      <div
        class="device"
        v-for="(device, index) in devices"
        v-show="device.device_id.length > 0">
        <button
          class="btn btn-outline-primary"
          @click="device.collapsed = !device.collapsed">
          {{ device.device_id }}
        </button>

        <b-collapse v-model="device.collapsed" :id="'device' + index" class="mt-4">
          <table class="table table-bordered table-responsive-sm">
            <thead>
              <tr>
                <th v-for="(column, index) in columns" @click="sortBy(column.value, index)">
                  {{ column.text }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(user, index) in device.users">
                <td class="poiter" @click="goToProfile(user.id)">{{ user.first_name }}</td>
                <td class="poiter" @click="goToProfile(user.id)">{{ user.last_name }}</td>
                <td>{{ user.ip }}</td>
              </tr>
            </tbody>
          </table>
        </b-collapse>
      </div>
    </b-card>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'Devices',
  data () {
    return {
      isReady: false,
      devices: [],
      columns: [
        {value: 'first_name', text: 'First Name', sort: true},
        {value: 'last_name', text: 'Last Name', sort: true},
        {value: 'ip', text: 'IP', sort: true}
      ]
    }
  },
  mounted () {
    Vue.axios.get(API_URL + 'admin/user/device').then((responce) => {
      let item
      for (let type in responce.data) {
        item = {}
        item.device_id = type
        item.collapsed = false
        item.users = responce.data[type]
        this.devices.push(item)
      }
      this.isReady = true
    })
  },
  methods: {
    goToProfile (id) {
      router.push({ name: 'edit user', params: {id: id} })
    }
  }
}
</script>

<style scoped>
  .device {
    margin-bottom: 20px;
  }

  .card,
  th {
    text-align: center;
  }

  .poiter {
    cursor: pointer;
  }
</style>