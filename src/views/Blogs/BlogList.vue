<template>
  <div class="row">
    <div class="col-md-12">
      <b-card header="Blogs List">
        <div class="loader mx-auto mt-5" v-if="!isReady"></div>

        <table class="table table-bordered table-responsive-sm" v-if="isReady">
          <thead>
            <th v-for="(column, index) in columns" @click="sortBy(column.value, index)">
              {{ column.text }}
              <i class="fa fa-arrows-v" aria-hidden="true"></i>
            </th>

            <th>Edit</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in filteredBlogs">
              <td>{{ item.title }}</td>

              <td class="pos-rel">
                <div class="popular-container">
                  <input
                    type="checkbox"
                    v-model="popularCounterArray"
                    :value="item.id"
                    @click="popularClick(index, item.id)"
                    :disabled="isPopularAvailable(item.popular)"
                  />

                  <span class="checkmark"><i class="fa fa-star-o"></i></span>
                  <span class="checkmark-checked"><i class="fa fa-star"></i></span>
                </div>
              </td>

              <td class="edit">
                <i class="fa fa-pencil-square" aria-hidden="true" @click="editBlog(item.id)"></i>
              </td>
            </tr>
          </tbody>
        </table>

        <b-pagination
          size="md"
          v-model="currentPage"
          v-show="blogs.length > itemsPerPage"
          :total-rows="blogs.length"
          :per-page="itemsPerPage"
          class="justify-content-center">
        </b-pagination>
      </b-card>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'BlogsList',
  data () {
    return {
      isReady: false,
      currentPage: 1,
      itemsPerPage: 15,
      popularCounterArray: [],
      columns: [
        {value: 'title', text: 'Title', sort: false},
        {value: 'popular', text: 'Popular', sort: true}
      ],
      blogs: []
    }
  },
  created () {
    this.getBlogs()
  },
  methods: {
    sortBy: function (sortKey, index) {
      if (this.columns[index].sort) {
        this.blogs.sort((a, b) => a[sortKey] > b[sortKey] ? -1 : b[sortKey] > a[sortKey] ? 1 : 0)
      } else {
        this.blogs.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0)
      }
      this.columns[index].sort = !this.columns[index].sort
    },
    getBlogs () {
      Vue.axios.get(API_URL + 'admin/blog/posts').then((responce) => {
        this.blogs = responce.data.data
        this.blogs.forEach((e) => {
          if (e.popular === 1) {
            this.popularCounterArray.push(e.id)
          }
        })
        this.blogs.sort((a, b) => a.created_at > b.created_at ? -1 : b.created_at > a.created_at ? 1 : 0)
        this.isReady = true
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.isReady = true
      })
    },
    isPopularAvailable (value) {
      return (this.popularCounterArray.length > 2) && !value
    },
    editBlog (id) {
      router.push({ name: 'edit blog', params: { id: id } })
    },
    popularClick (index, id) {
      this.blogs[index].popular = !this.blogs[index].popular
      Vue.axios.get(API_URL + 'admin/blog/posts/' + id + (!this.blogs[index].popular ? '/notpopular' : '/popular')).then((responce) => {
        this.$toastr('success', responce.data.message, '')
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.blogs[index].popular = !this.blogs[index].popular
      })
    }
  },
  computed: {
    filteredBlogs () {
      return this.blogs.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
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

  .pos-rel {
    position: relative;
  }

  .header {
    text-transform: capitalize;
  }

  .edit i {
    font-size: 21px;
    cursor: pointer;
  }

  .popular-container {
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    left: 50%;
    transform: translateX(-50%);
  }

  .popular-container input {
    position: absolute;
    opacity: 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
    z-index: 99;
  }

  .checkmark,
  .checkmark-checked {
    position: absolute;
    height: 15px;
    width: 15px;
    color: #FFDF00;
    transition: background-color .1s linear;
  }

  .popular-container input ~ .checkmark > i,
  .popular-container input:checked ~ .checkmark-checked > i {
    display: block;
    font-size: 20px;
  }

  .popular-container input:checked ~ .checkmark > i,
  .popular-container input ~ .checkmark-checked > i {
    display: none;
  }

  .popular-container input:disabled ~ .checkmark > i {
    color: #e3e3e3;

  }

  .popular-container input:disabled {
    cursor: default;
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