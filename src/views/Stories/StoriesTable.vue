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

            <th>Edit</th>
          </thead>
          <tbody>
            <tr v-for="story in filteredStories">
              <td>{{ story.girl_name }}</td>
              <td>{{ story.client_name }}</td>

              <td>
                <i class="fa fa-pencil-square" aria-hidden="true" @click="editStory(story.id)"></i>
              </td>
            </tr>
          </tbody>
        </table>

        <b-pagination
          size="md"
          v-model="currentPage"
          v-show="stories.length > itemsPerPage"
          :total-rows="stories.length"
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
  name: 'BlogList',
  props: ['id'],
  data () {
    return {
      isReady: false,
      currentPage: 1,
      itemsPerPage: 15,
      columns: [
        {value: 'girl_name', text: 'Girl Name', sort: false},
        {value: 'client_name', text: 'Male Name', sort: false}
      ],
      stories: []
    }
  },
  created () {
    this.getStories()
  },
  methods: {
    sortBy: function (sortKey, index) {
      if (this.columns[index].sort) {
        this.stories.sort((a, b) => a[sortKey] > b[sortKey] ? -1 : b[sortKey] > a[sortKey] ? 1 : 0)
      } else {
        this.stories.sort((a, b) => a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0)
      }
      this.columns[index].sort = !this.columns[index].sort
    },
    getStories () {
      Vue.axios.get(API_URL + 'admin/stories').then((responce) => {
        console.log(responce)
        this.stories = responce.data.data
        this.isReady = true
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.isReady = true
      })
    },
    editStory (id) {
      router.push({name: 'edit story', params: {id: id}})
    }
  },
  computed: {
    filteredStories () {
      return this.stories.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
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