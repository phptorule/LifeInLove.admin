<template>
  <div class="animated fadeIn">
    <b-card header="Categories and Products" no-block>
      <div class="card-body">
        <div class="loader mx-auto mt-2" v-if="! isReady"></div>

        <div class="wrapper" v-if="isReady">
           <div class="inner-sidebar">
              <ul class="nav">
                <li class="p-2 d-flex">
                  <b-form-input
                    v-model="categoryToCreate"
                    name="new category"
                    type="text"
                    v-validate="'required'"
                    placeholder="Category Name . . .">
                  </b-form-input>

                  <button
                    class="btn btn-success"
                    @click="createCategory">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                  </button>
                </li>

                <li
                  class="nav-link"
                  v-for="(category, index) in categories"
                  v-if="category.id"
                  :class="{'active': activeItem === category.id}">

                  <div
                    class="name-holder"
                    :title="category.name"
                    v-show="category.id !== categoryToEdit">
                    <div @click="editSwitch(category.id)">
                      {{ category.name }}
                    </div>

                    <i
                      v-show="category.id !== categoryToEdit"
                      class="fa fa-pencil-square"
                      aria-hidden="true"
                      @click="categoryToEdit = category.id">
                    </i>

                    <i
                      v-show="category.id !== categoryToEdit"
                      class="fa fa-window-close"
                      aria-hidden="true"
                      @click="deleteCategory(category.id)">
                    </i>
                  </div>

                  <div v-if="category.id === categoryToEdit" class="d-flex">
                    <b-form-input
                      v-model="category.name"
                      :name="'category' + category.id"
                      type="text"
                      v-validate="'required'">
                    </b-form-input>

                    <button
                      class="btn btn-success"
                      @click="editCategory(category.id, index)">
                      <i class="fa fa-check" aria-hidden="true"></i>
                    </button>
                  </div>
                </li>

                <li
                  class="nav-link"
                  :class="{'active': activeItem === '0'}"
                  @click="editSwitch('0')">
                  Others
                </li>
              </ul>
           </div>

           <div class="dialog-wrapper">
              <div class="warning-message" v-show="! activeItem">Select Category</div>

              <CategoryTable v-if="activeItem" :id="activeItem"/>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { API_URL } from '@/settings.js'
import { CategoryTable } from '@/components'

export default {
  components: {
    CategoryTable
  },
  data () {
    return {
      isReady: false,
      categoryToCreate: '',
      categories: [],
      backup: [],
      activeItem: null,
      categoryToEdit: -1
    }
  },
  created () {
    this.getData()
  },
  methods: {
    editCategory (id, index) {
      if (this.categories[index].name === this.backup[index].name) {
        this.categoryToEdit = -1
        return
      }

      this.$validator.validate('category' + id).then((result) => {
        if (result) {
          Vue.axios.put(API_URL + 'admin/shop/category/' + id + '/update', {name: this.categories[index].name}).then((responce) => {
            this.$toastr('success', responce.data.message)
            this.categoryToEdit = -1
            this.getData()
          }).catch((e) => {
            this.$toastr('error', JSON.parse(e.request.response).message)
          })
          return
        }

        this.$toastr('error', 'Category name is required')
      })
    },
    editSwitch (id) {
      if (this.categories.some((e, index) => { return e.name !== this.backup[index].name })) {
        this.categories = JSON.parse(JSON.stringify(this.backup))
      }

      this.categoryToEdit = -1
      this.activeItem = id
    },
    deleteCategory (id) {
      if (confirm('Delete selected category ?')) {
        Vue.axios.delete(API_URL + 'admin/shop/category/' + id + '/remove').then((responce) => {
          this.$toastr('success', responce.data.message)
          this.getData()
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
        })
      }
    },
    createCategory () {
      if (this.categoryToCreate.length === 0) {
        this.$toastr('error', 'Category name is required')
        return
      }

      if (this.categories.filter((e) => { return e.name === this.categoryToCreate }).length > 0) {
        this.$toastr('error', 'Category already exists')
        return
      }

      Vue.axios.post(API_URL + 'admin/shop/category/create', {name: this.categoryToCreate}).then((responce) => {
        this.$toastr('success', responce.data.message)
        this.getData()
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
      })
    },
    getData () {
      this.isReady = false
      this.categories = []
      Vue.axios.get(API_URL + 'admin/shop/category').then((responce) => {
        for (let val in responce.data.data) {
          this.$set(this.categories, val, responce.data.data[val])
        }

        this.categories.sort((a, b) => {
          return a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
        })

        this.backup = JSON.parse(JSON.stringify(this.categories))

        this.isReady = true
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.isReady = true
      })
    },
    cancel () {
      document.getElementById('category' + this.activeItem).value = this.categories[this.activeIndex].name
      this.activeItem = null
    }
  }
}
</script>

<style scoped>
  .card-body {
    padding: 0;
    position: relative;
  }

  .wrapper {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .dialog-wrapper {
    width: calc(100% - 210px);
    padding-right: 10px;
  }

  .active {
    background-color: #20a8d8;
  }

  .name-holder > div {
    max-width: 155px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  li {
    position: relative;
  }

  li.nav-link > div > i {
    position: absolute;
    display: none;
    font-size: 20px;
    top: 50%;
    right: 40px;
    transform: translateY(-50%);
    font-size: 20px;
  }

  li.nav-link > div > i:last-child {
    right: 10px;
  }

  li.nav-link.active > div > i {
    display: block;
  }
</style>