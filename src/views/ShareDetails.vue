<template>
  <div class="animated fadeIn">
    <b-card header="Share Contact Details">
      <div class="loader mx-auto mt-5" v-show="!isReady"></div>

      <table class="table table-bordered table-responsive-sm" v-if="isReady">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" @click="sortBy(column.value, index)">
              {{ column.text }}
              <i class="fa fa-arrows-v" aria-hidden="true"></i>
            </th>

            <th>Approve</th>
            <th>Disapprove</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in filteredDetails">
            <td @click="goToUser(item.client_id)">{{ item.client_first_name + ' ' + item.client_last_name }}</td>
            <td @click="goToUser(item.girl_id)">{{ item.girl_first_name + ' ' +  item.girl_last_name}}</td>
            <td>{{ item.girl_email }}</td>
            <td>{{ item.girl_mobile }}</td>

            <td>
              <i
                class="fa fa-check-square text-success"
                aria-hidden="true"
                @click="approve(item.id)">
              </i>
            </th>

            <td>
              <i
                class="fa fa-window-close text-danger"
                aria-hidden="true"
                @click="disapprove(item.id)">
              </i>
            </td>
          </tr>
        </tbody>
      </table>

      <b-pagination
        size="md"
        v-model="currentPage"
        v-show="contactDetails.length > itemsPerPage"
        :total-rows="contactDetails.length"
        :per-page="itemsPerPage"
        class="justify-content-center">
      </b-pagination>
    </b-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { API_URL } from '@/settings.js'
  import router from '@/router'

  export default {
    name: 'ShareDetails',
    data () {
      return {
        isReady: false,
        currentPage: 1,
        itemsPerPage: 15,
        columns: [
          {value: 'client_name', text: 'Male Name', sort: true},
          {value: 'girl_name', text: 'Girl Name', sort: true},
          {value: 'mail', text: 'Girl Mail', sort: true},
          {value: 'phone', text: 'Girl Phone', sort: true}
        ],
        contactDetails: []
      }
    },
    created () {
      this.getContactDetails()
    },
    methods: {
      sortBy: function (sortKey, index) {
        if (this.columns[index].sort) {
          this.contactDetails.sort((a, b) => a[sortKey] > b[sortKey] ? -1 : b[sortKey] > a[sortKey] ? 1 : 0)
        } else {
          this.contactDetails.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0)
        }
        this.columns[index].sort = !this.columns[index].sort
      },
      goToUser (id) {
        router.push({path: '/users/edit/' + id})
      },
      getContactDetails () {
        Vue.axios.get(API_URL + 'admin/contacts').then((responce) => {
          this.contactDetails = responce.data.data
          this.isReady = true
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      approve (id) {
        this.isReady = false
        Vue.axios.get(API_URL + 'admin/contacts/' + id + '/approve').then((responce) => {
          this.$toastr('success', responce.data.message)
          this.getContactDetails()
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      disapprove (id) {
        this.isReady = false
        Vue.axios.get(API_URL + 'admin/contacts/' + id + '/disapprove').then((responce) => {
          this.$toastr('success', responce.data.message)
          this.getContactDetails()
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      }
    },
    computed: {
      filteredDetails () {
        return this.contactDetails.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
      }
    }
  }
</script>

<style scoped>
  thead th {
    white-space: nowrap;
  }

  th:hover,
  td:first-child,
  td:nth-child(2) {
    cursor: pointer;
  }

  th:last-child:hover,
  th:nth-child(5):hover {
    cursor: default;
  }

  td, th {
    text-align: center;
  }

  th > i {
    font-size: 12px;
  }

  td i {
    font-size: 21px;
    cursor: pointer;
  }
</style>