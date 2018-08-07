<template>
  <div class="animated fadeIn">
    <div class="loader mx-auto mt-5" v-if="!isReady"></div>

    <b-card v-if="isReady">
      <div slot="header" class="header">
        Users that quited registration
      </div>

      <table class="table table-bordered table-responsive-sm" v-if="isReady">
        <thead>
          <tr>
            <th v-for="(item, index) in columns" @click="sortBy(item.value, index)" :key="index">
              {{ item.text }}
              <i class="fa fa-arrows-v" aria-hidden="true"></i>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="index">
            <td>
              {{ user.first_name }}
            </td>

            <td>
              {{ user.last_name }}
            </td>

            <td>
              {{ user.email }}
            </td>

            <td>
              {{ user.date }}
            </td>
          </tr>
        </tbody>
      </table>

      <b-pagination
        size="md"
        v-model="currentPage"
        v-show="users.length > itemsPerPage"
        :total-rows="users.length"
        :per-page="itemsPerPage"
        class="justify-content-center">
      </b-pagination>
    </b-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { API_URL } from '@/settings.js'

  export default {
    name: 'PreUsers',
    data () {
      return {
        isReady: false,
        users: [],
        columns: [
          {value: 'first_name', text: 'First Name', sort: true},
          {value: 'last_name', text: 'Last Name', sort: true},
          {value: 'email', text: 'Email', sort: true},
          {value: 'date', text: 'Date', sort: true}
        ],
        currentPage: 1,
        itemsPerPage: 15
      }
    },
    mounted () {
      Vue.axios.get(API_URL + 'admin/user/unfinished').then((responce) => {
        this.users = responce.data.data
        this.sortBy('date', 3)
        this.isReady = true
      }).catch((e) => {
        this.$toastr(e)
        this.isReady = true
      })
    },
    methods: {
      sortBy: function (sortKey, index) {
        if (this.columns[index].sort) {
          this.users.sort((a, b) => a[sortKey] > b[sortKey] ? -1 : b[sortKey] > a[sortKey] ? 1 : 0)
        } else {
          this.users.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0)
        }
        this.columns[index].sort = !this.columns[index].sort
      }
    },
    computed: {
      filteredUsers () {
        return this.users.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
      }
    }
  }
</script>

<style scoped>
  table {
    text-align: center;
  }

  tr th {
    text-align: center;
    cursor: pointer;
  }
</style>