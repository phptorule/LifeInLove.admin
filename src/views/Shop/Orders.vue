<template>
  <div class="animated fadeIn">
    <b-card header="Orders">
      <div class="loader mx-auto mt-5" v-if="!isReady"></div>

      <table class="table table-bordered table-responsive-sm" v-if="isReady">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" @click="sortBy(column.value, index)">
            {{ column.text }}
            <i class="fa fa-arrows-v" aria-hidden="true"></i></th>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders">
            <td>{{ order.date }}</td>
            <td>{{ order.client_name }}</td>
            <td>{{ order.girl_name }}</td>
            <td>
              <div class="status" :class="{'bg-success': order.status === 'success', 'bg-danger': order.status !== 'success'}">
                {{ order.status }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <b-pagination
        size="md"
        v-model="currentPage"
        v-show="orders.length > itemsPerPage"
        :total-rows="orders.length"
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
    name: 'Orders',
    data () {
      return {
        isReady: false,
        currentPage: 1,
        itemsPerPage: 15,
        orders: [],
        columns: [
          {value: 'date', text: 'Date', sort: true},
          {value: 'client_name', text: 'From', sort: true},
          {value: 'girl_name', text: 'To', sort: true},
          {value: 'status', text: 'Status', sort: true}
        ]
      }
    },
    created () {
      this.getOrders()
    },
    methods: {
      getOrders () {
        Vue.axios.get(API_URL + 'admin/shop/orders').then((responce) => {
          this.orders = responce.data.data
          this.orders.forEach((e) => {
            if (e.info.length > 0) {
              e.client_name = e.info[0].client_first_name + ' ' + e.info[0].client_last_name
              e.girl_name = e.info[0].girl_first_name + ' ' + e.info[0].girl_last_name
            }
          })
          this.isReady = true
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      sortBy: function (sortKey, index) {
        if (this.columns[index].sort) {
          this.orders.sort((a, b) => a[sortKey] > b[sortKey] ? -1 : b[sortKey] > a[sortKey] ? 1 : 0)
        } else {
          this.orders.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0)
        }
        this.columns[index].sort = !this.columns[index].sort
      }
    },
    computed: {
      filteredOrders () {
        return this.orders.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
      }
    }
  }
</script>

<style scoped>
  th:hover {
    cursor: pointer;
  }

  td, th {
    text-align: center;
  }

  .status {
    color: black;
  }

  th > i {
    font-size: 12px;
  }

</style>