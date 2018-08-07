<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header" class="header">
        Memberships
        <button class="btn btn-success btn-sm pull-right" @click="addMembership()">Add New Membership</button>
      </div>

      <table class="table table-bordered table-responsive-sm">
         <thead>
            <td v-for="(column, index) in columns" key="" @click="sortBy(column.value, index)">{{ column.text }}</td>
         </thead>
         <tbody>
            <tr v-for="item in filteredMemberships">
              <td>{{ item.name }}</td>
              <td>
                <select
                  class="status"
                  v-model="item.active"
                  @change="changeStatus(item.id, item.active)"
                  :class="{approved: item.active == '1', disapproved: item.active == '0'}">
                  <option value="1">Active</option>
                  <option value="0">Disabled</option>
                </select>
              </td>

              <td>{{ item.likes }}</td>
              <td>{{ item.free_leter }}</td>
              <td>{{ item.discount }} %</td>
              <td>{{ item.view_photo }}</td>
              <td>{{ item.view_video }}</td>
              <td>{{ item.my_photo }}</td>
              <td>{{ item.private_photo }}</td>
              <td>{{ item.contact_details }}</td>
              <td v-for="value in item.values">{{ value.month_payment }}</td>
            </tr>
         </tbody>
      </table>

      <b-pagination
        size="md"
        v-model="currentPage"
        v-show="memberships.length > itemsPerPage"
        :total-rows="memberships.length"
        :per-page="itemsPerPage"
        class="justify-content-center">
      </b-pagination>
    </b-card>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'Memberships',
  data () {
    return {
      memberships: [],
      currentPage: 1,
      itemsPerPage: 15,
      columns: [
        {value: 'name', text: 'Membership\'s name', sort: true},
        {value: 'active', text: 'Active', sort: true},
        {value: 'likes', text: 'Expression of interests', sort: true},
        {value: 'free_leter', text: 'Free letters', sort: true},
        {value: 'discount', text: 'Discount', sort: true},
        {value: 'view_photo', text: 'View Photos', sort: true},
        {value: 'view_video', text: 'View Videos', sort: true},
        {value: 'my_photo', text: 'Photos in profile', sort: true},
        {value: 'private_photo', text: 'Accept/send private photos', sort: true},
        {value: 'contact_details', text: 'Share contact details', sort: true},
        {value: 'one_month_price', text: '1 month', sort: true},
        {value: 'three_month_price', text: '3 month', sort: true},
        {value: 'six_month_price', text: '6 month', sort: true},
        {value: 'twelve_month_price', text: '12 month', sort: true}
      ]
    }
  },
  created () {
    this.memberships = [].concat(this.$root.memberships)
    this.memberships.forEach((e) => {
      e.one_month_price = e.values[0].month_payment
      e.three_month_price = e.values[1].month_payment
      e.six_month_price = e.values[2].month_payment
      e.twelve_month_price = e.values[3].month_payment
    })
  },
  methods: {
    changeStatus (id, active) {
      Vue.axios.get(API_URL + 'admin/membership/' + id + (active === '1' ? '/activate' : '/deactivate')).then((responce) => {
        this.$toastr('success', responce.data.message, '')
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
      })
    },
    addMembership () {
      router.push({name: 'add membership'})
    },
    sortBy (sortKey, index) {
      this.$root.sortArray(this.memberships, sortKey, index)
    }
  },
  computed: {
    filteredMemberships () {
      return this.memberships.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
    }
  }
}
</script>

<style scoped>
  thead > td {
    max-width: 120px;
    font-size: 12px;
    font-weight: 700;
  }

  .approved {
    background-color: #4dbd74;
  }

  .disapproved {
    background-color: #f86c6b;
  }

  table {
    text-align: center;
  }

  select {
    border: none;
  }

  select option[value="0"]{
    background: red;
  }

  select option[value="1"]{
    background: green;
  }

  thead > td:hover {
    cursor: pointer;
  }

  td, th {
    text-align: center;
  }

  table {
    width: 100%;
    overflow-x: auto;
    display: block;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
</style>>