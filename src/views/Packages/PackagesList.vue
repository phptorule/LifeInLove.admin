<template>
  <div class="row">
    <div class="col-md-12">
      <b-card header="Success Stories">
        <div class="loader mx-auto mt-5" v-if="!isReady"></div>

        <table class="table table-bordered table-responsive-sm" v-if="isReady">
          <thead>
            <th v-for="(column, index) in columns" @click="sortBy(column.value, index)">
              {{ column.text }}
              <i class="fa fa-arrows-v" aria-hidden="true"></i>
            </th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in filteredPackages">
              <td>{{ item.credits }}</td>
              <td>{{ item.price }}</td>
              <td>
                <select
                  class="status"
                  v-model="item.removed"
                  @change="changeStatus(item.id, index)"
                  :class="{approved: item.removed == '0', disapproved: item.removed == '1'}">
                  <option value="0">Active</option>
                  <option value="1">Disabled</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <b-pagination
          size="md"
          v-model="currentPage"
          v-show="packages.length > itemsPerPage"
          :total-rows="packages.length"
          :per-page="itemsPerPage"
          class="justify-content-center">
        </b-pagination>
      </b-card>
    </div>
  </div>
</template>

<script>
// import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'PackagesList',
  data () {
    return {
      isReady: false,
      currentPage: 1,
      itemsPerPage: 15,
      columns: [
        {value: 'credits', text: 'Dibs', sort: false},
        {value: 'price', text: 'Price', sort: false},
        {value: 'removed', text: 'Active', sort: false}
      ],
      packages: []
    }
  },
  created () {
    this.getPackages()
  },
  methods: {
    sortBy: function (sortKey, index) {
      if (this.columns[index].sort) {
        this.packages.sort((a, b) => a[sortKey] > b[sortKey] ? -1 : b[sortKey] > a[sortKey] ? 1 : 0)
      } else {
        this.packages.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0)
      }
      this.columns[index].sort = !this.columns[index].sort
    },
    getPackages () {
      Vue.axios.get(API_URL + 'admin/credits').then((responce) => {
        this.packages = responce.data.data
        this.isReady = true
      }).catch(e => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.isReady = true
      })
    },
    changeStatus (id, index) {
      Vue.axios.get(API_URL + 'admin/credits/' + id + (this.packages[index].removed.toString() === '1' ? '/remove' : '/activate')).then((responce) => {
        this.$toastr('success', responce.data.message, '')
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.packages[index].removed = this.packages[index].removed === '1' ? '0' : '1'
      })
    }
  },
  computed: {
    filteredPackages () {
      return this.packages.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
    }
  }
}
</script>

<style scoped>
  thead th {
    white-space: nowrap;
  }

  th:hover {
    cursor: pointer;
  }

  th i {
    font-size: 12px;
  }

  th:last-child:hover,
  th:nth-child(3):hover {
    cursor: default;
  }

  td, th {
    text-align: center;
  }

  td i {
    font-size: 21px;
    cursor: pointer;
  }

  .header {
    text-transform: capitalize;
  }

  @media (max-width: 768px){
    .table-responsive-sm {
      width: 100%;
      overflow-x: auto;
      display: block;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: -ms-autohiding-scrollbar;
    }
  }
</style>