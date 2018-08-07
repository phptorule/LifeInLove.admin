<template>
  <b-card>
    <div slot="header" class="header">
      {{ gender === 'client' ? 'Male' : 'Female'}} Users

      <span class="searchField"  v-show="isReady">
        <input type="text" name="searchField" v-model="searchStr">
        <i class="fa fa-search" aria-hidden="true"></i>
      </span>
      <button class="btn btn-success btn-sm pull-right" @click="createUser()">Add New User</button>
    </div>
    <div class="loader-wrapper" v-show="!isReady">
      <div class="loader"></div>
    </div>
    <table class="table table-bordered table-responsive-sm" v-if="isReady">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" @click="sortBy(column.value, index)" :key="index">
            {{ column.text }}
            <i class="fa fa-arrows-v" aria-hidden="true"></i></th>
          <th>Edit</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="index">
          <td>{{ user.profile_id }}</td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.create }}</td>

          <td>
            <div class="popular-container">
              <input
                type="checkbox"
                v-model="popularCounterArray"
                :value="user.id"
                @click="popularClick(index, user.id)"
              />
              <span class="checkmark"><i class="fa fa-star-o"></i></span>
              <span class="checkmark-checked"><i class="fa fa-star"></i></span>
            </div>
          </td>

          <td>
            <select
              class="status"
              v-model="user.approved"
              @change="changeStatus(user.id, user.approved, index)"
              :class="{approved: user.approved == '1', disapproved: user.approved == '0', pending: user.approved == '2'}">
              <option disabled value="2">Pending</option>
              <option value="1">Approved</option>
              <option value="0">Disapproved</option>
            </select>
          </td>
          <td class="edit">
            <i class="fa fa-pencil-square" aria-hidden="true" @click="editUser(user.id)"></i>
          </td>
        </tr>
      </tbody>
    </table>

    <b-pagination
      size="md"
      v-model="currentPage"
      v-show="usersAfterSearch.length > itemsPerPage"
      :total-rows="users.length"
      :per-page="itemsPerPage"
      class="justify-content-center">
    </b-pagination>
  </b-card>
</template>

<script>
import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'UserTable',
  props: ['gender'],
  data () {
    return {
      isReady: false,
      searchStr: '',
      popularCounterArray: [],
      columns: [
        {value: 'profile_id', text: 'User ID', sort: true},
        {value: 'first_name', text: 'First Name', sort: true},
        {value: 'last_name', text: 'Last Name', sort: true},
        {value: 'email', text: 'Email', sort: true},
        {value: 'create', text: 'Date of Registration', sort: true},
        {value: 'popular', text: 'Popular', sort: true},
        {value: 'approved', text: 'Status', sort: true}
      ],
      sortKey: 'Date of registration',
      users: [],
      currentPage: 1,
      itemsPerPage: 15
    }
  },
  mounted () {
    Vue.axios.get(API_URL + 'admin/user/profiles/' + this.gender).then((responce) => {
      this.users = responce.data.data
      this.users.forEach((e) => {
        if (e.popular === 1) {
          this.popularCounterArray.push(e.id)
        }

        e.approved = e.pending === '0' ? '2' : e.approved
      })
      this.sortBy('create', 4)
      this.isReady = true
    }).catch((e) => {
      this.$toastr('error', 'network error. Try again in a minute')
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
    },
    editUser (id) {
      router.push({ name: 'edit user', params: {id: id} })
    },
    createUser () {
      router.push({ name: 'new user', params: {'gender': this.gender} })
    },
    popularClick (index, id) {
      this.users[index].popular = !this.users[index].popular
      Vue.axios.get(API_URL + 'admin/user/' + id + (!this.users[index].popular ? '/notpopular' : '/popular')).then((responce) => {
        this.$toastr('success', responce.data.message, '')
      }).catch((e) => {
        this.$toastr('error', 'error', '')
        this.users[index].popular = !this.users[index].popular
      })
    },
    changeStatus (id, approved, index) {
      Vue.axios.get(API_URL + 'admin/user/' + id + (approved === '1' ? '/approve' : '/disapprove')).then((responce) => {
        this.$toastr('success', responce.data.message, '')
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.users[index].approved = '2'
      })
    }
    // isPopularAvailable (value) {
    //   return this.$root.currentUser.role !== 'admin' || (this.popularCounterArray.length > 11 && value === 0)
    // }
  },
  computed: {
    usersAfterSearch () {
      if (this.searchStr.length === 0) {
        return this.users
      }

      return this.users.filter((e, i) => {
        let searchStr = this.searchStr.trim().toLowerCase()

        return e.create.toLowerCase().includes(searchStr) ||
        e.email.toLowerCase().includes(searchStr) ||
        e.first_name.toLowerCase().includes(searchStr) ||
        e.last_name.toLowerCase().includes(searchStr) ||
        e.profile_id.toLowerCase().includes(searchStr)
      })
    },
    filteredUsers () {
      return this.usersAfterSearch.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
    }
  }
}
</script>

<style scoped>
  select {
    border: none;
  }

  thead th {
    white-space: nowrap;
  }

  select option[value="0"]{
    background: red;
  }

  select option[value="1"]{
    background: green;
  }

  th:hover {
    cursor: pointer;
  }

  th:last-child:hover {
    cursor: default;
  }

  td, th {
  	text-align: center;
  }

  th > i {
    font-size: 12px;
  }

  .loader-wrapper {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .edit i {
    font-size: 21px;
    cursor: pointer;
  }

  .approved {
    background-color: #4dbd74;
  }

  .disapproved {
    background-color: #f86c6b;
  }

  .pending {
    background-color: #E0C200;
  }

  .header {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    justify-content: space-between;
  	text-transform: capitalize;
  }

  .searchField {
    width: 40%;
  }

  .searchField input {
    width: 95%;
  }

  .searchField i {
    transform: translateX(-25px);
  }

  .popular-container {
    display: block;
    position: relative;
    width: 20px;
    height: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-left: 25%;
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