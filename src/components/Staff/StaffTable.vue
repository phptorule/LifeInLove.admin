<template>
  <div class="row">
    <div class="col-md-12">
      <b-card>
        <div slot="header" class="header">
          {{ gender }}
          <button class="btn btn-success btn-sm pull-right" @click="createUser()">Add To Staff</button>
        </div>

        <div class="loader mx-auto" v-if="!isReady"></div>

        <table class="table table-bordered table-responsive-sm" v-if="isReady">
          <thead>
            <tr>
              <th v-for="(column, index) in columns" @click="sortBy(column.value, index)">{{ column.text }}</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers">
              <td>{{ user.first_name }}</td>
              <td>{{ user.last_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.create }}</td>
              <td class="edit">
                <i class="fa fa-pencil-square" aria-hidden="true" @click="editUser(user.id)"></i>
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
  </div>
</template>

<script>
import router from '@/router'

export default {
  name: 'AdminsTable',
  props: ['gender'],
  data () {
    return {
      isReady: false,
      columns: [
        {value: 'first_name', text: 'First Name', sort: true},
        {value: 'last_name', text: 'Last Name', sort: true},
        {value: 'email', text: 'Email', sort: true},
        {value: 'create', text: 'Date of Registration', sort: true}
      ],
      users: [],
      currentPage: 1,
      itemsPerPage: 15
    }
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
    editUser (user) {
      router.push({name: 'edit staff', params: {id: user}})
    },
    createUser () {
      router.push({name: 'add to staff'})
    }
  },
  mounted () {
    this.$root.updateStaff(this.gender, false, () => {
      this.users = this.users.concat(this.$root.staff[this.gender])
      this.sortBy('create', 2)
      this.isReady = true
    })
  },
  computed: {
    filteredUsers () {
      return this.users.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
    }
  }
}
</script>

<style scoped>
  select {
    border: none;
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