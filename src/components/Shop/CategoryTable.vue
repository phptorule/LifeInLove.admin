<template>
  <div class="pt-2 h-100">
    <div class="loader mx-auto mt-2" v-if="!isReady"></div>

    <div
      class="warning-message"
      v-show="isReady && products.length === 0">
      There are no products in selected category
    </div>

    <table class="table table-bordered table-responsive-sm" v-if="isReady && products.length > 0">
      <thead>
        <th v-for="(column, index) in columns" @click="sortBy(column.value, index)">
          {{ column.text }}
          <i class="fa fa-arrows-v" aria-hidden="true"></i>
        </th>

        <th>Edit</th>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts">
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>

          <td>
            <i class="fa fa-pencil-square" aria-hidden="true" @click="editProduct(product.id)"></i>
          </td>
        </tr>
      </tbody>
    </table>

    <b-pagination
      size="md"
      v-model="currentPage"
      v-show="products.length > itemsPerPage"
      :total-rows="products.length"
      :per-page="itemsPerPage"
      class="justify-content-center">
    </b-pagination>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'CategoryTable',
  props: ['id'],
  data () {
    return {
      isReady: false,
      currentPage: 1,
      itemsPerPage: 15,
      columns: [
        {value: 'name', text: 'Name', sort: true},
        {value: 'price', text: 'Price', sort: false}
      ],
      products: []
    }
  },
  created () {
    if (this.id !== '0') {
      this.getCategories()
    } else {
      this.getOtherCategory()
    }
  },
  methods: {
    sortBy: function (sortKey, index) {
      if (this.columns[index].sort) {
        this.products.sort((a, b) => a[sortKey] > b[sortKey] ? -1 : b[sortKey] > a[sortKey] ? 1 : 0)
      } else {
        this.products.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0)
      }
      this.columns[index].sort = !this.columns[index].sort
    },
    getCategories () {
      this.isReady = false
      Vue.axios.get(API_URL + 'admin/shop/product/category/' + this.id).then((responce) => {
        this.products = responce.data.data
        this.isReady = true
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.isReady = true
      })
    },
    getOtherCategory () {
      Vue.axios.get(API_URL + 'admin/shop/product/category').then((responce) => {
        this.products = responce.data.data
        this.isReady = true
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.isReady = true
      })
    },
    goToCategories () {
      router.push({name: 'categories'})
    },
    editProduct (id) {
      router.push({name: 'edit product', params: {id: id}})
    }
  },
  computed: {
    filteredProducts () {
      return this.products.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
    }
  },
  watch: {
    id () {
      if (this.id !== '0') {
        this.getCategories()
      } else {
        this.getOtherCategory()
      }
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