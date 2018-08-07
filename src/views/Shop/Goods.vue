<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header" class="header">
        {{ id ? 'Edit Product' : 'Add Product' }}
        <button
          v-if="id && isReady"
          class="btn btn-danger btn-sm pull-right"
          @click="deleteProduct()">
          Delete Product
        </button>
      </div>

      <div class="loader mx-auto mt-5" v-show="!isReady"></div>

      <div class="row" v-if="isReady">
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-12 col-md-3 title">
              Image:
            </div>

            <div class="col">
              <input
                name="image"
                type="file"
                id="upload"
                @change="inputChange"
                accept="image/*" />

                <label
                  class="pull-left mr-2"
                  for="upload"
                  :class="{'red-shadow': errors.has('image')}">
                  <i
                    class="fa fa-upload mr-2"
                    aria-hidden="true"
                    v-show="inputFileText === 'Add image'">
                  </i>

                  {{ inputFileText }}
                </label>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 col-md-3 title">
                Title:
              </div>

              <div class="col">
                <b-form-input
                  v-model="item.name"
                  name="title"
                  type="text"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('title')}"
                  placeholder="Type in title here  . . .">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 col-md-3 title">
                Description:
              </div>

              <div class="col">
                <textarea
                  rows="3"
                  name="description"
                  v-model="item.description"
                  class="form-control"
                  :class="{'red-shadow': errors.has('description')}"
                  placeholder="Type in description here  . . ."
                  v-validate="'required'">
                </textarea>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 col-md-3 title">
                Price:
              </div>

              <div class="col">
                <b-form-input
                  v-model="item.price"
                  name="price"
                  type="number"
                  step="0.01"
                  v-validate="{required: true, decimal: true, min_value: 0}"
                  :class="{'red-shadow': errors.has('price')}"
                  placeholder="Type in price here  . . .">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 col-md-3 title">
                Category:
              </div>

              <div class="col">
                <div class="row">
                  <div
                    class="col-sm-6 col-md-4"
                    v-for="category in categories_array"
                    v-if="category.id">
                    <label :title="category.text">
                      <input
                        type="checkbox"
                        :value="category.id"
                        v-model="item.categories" />
                      {{ category.text }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-5">
              <button
                class="btn btn-success mr-5"
                @click="validate">
                {{ id ? 'Update' : 'Create' }}
              </button>

              <button
                class="btn btn-danger pull-right"
                @click="cancel()">
               Cancel
             </button>
            </div>
          </div>
        <div class="col-md-6 text-center">
          <img
            :src="id ? item.image : '/static/img/default-avatar.jpg'"
            id="goods-image"
            alt="goods image" />
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
  import router from '@/router'
  import Vue from 'vue'
  import { API_URL } from '@/settings.js'

  export default {
    name: 'Goods',
    props: ['id'],
    data () {
      return {
        inputFileText: 'Add image',
        isReady: false,
        item: {
          name: '',
          description: '',
          price: 0,
          categories: [],
          image: ''
        },
        categories_array: []
      }
    },
    created () {
      if (this.id) {
        this.getProductInfo(this.id)
      } else {
        this.isReady = true
      }

      this.getCategories()
    },
    methods: {
      getProductInfo (id) {
        Vue.axios.get(API_URL + 'admin/shop/product/' + id).then((responce) => {
          this.item = responce.data.data
          this.isReady = true
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      inputChange () {
        let input = document.querySelector('#upload')
        let image = document.getElementById('goods-image')

        if (input.files.length === 1) {
          this.item.image = 'image'
          this.inputFileText = input.files[0].name
          let reader = new FileReader()
          reader.onload = function (e) {
            image.src = e.target.result
          }
          reader.readAsDataURL(input.files[0])
        }
      },
      deleteProduct () {
        if (confirm('Delete selected product ?')) {
          this.isReady = false
          Vue.axios.delete(API_URL + 'admin/shop/product/' + this.id + '/remove').then((responce) => {
            this.$toastr('success', responce.data.message)
            router.push({name: 'categories'})
          }).catch((e) => {
            this.$toastr('error', JSON.parse(e.request.response).message)
            this.isReady = true
          })
        }
      },
      validate () {
        if (this.item.image.length === 0) {
          this.$toastr('error', 'The image is required')
          return
        }

        this.item.price = (parseInt(this.item.price * 100)) / 100

        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.id) {
              this.updateItem()
            } else {
              this.createItem()
            }
            return
          }

          this.$validator.errors.items.forEach((element) => {
            this.$toastr('error', element.msg)
          })
        })
      },
      createItem () {
        let data = this.prepareItem()
        this.isReady = false

        Vue.axios.post(API_URL + 'admin/shop/product/create', data).then((responce) => {
          this.$toastr('success', responce.data.message)
          this.isReady = true
          router.push({name: 'categories'})
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      updateItem () {
        let data = this.prepareItem()
        this.isReady = false

        Vue.axios.post(API_URL + 'admin/shop/product/' + this.item.id + '/update', data).then((responce) => {
          this.$toastr('success', responce.data.message)
          this.isReady = true
          router.push({name: 'categories'})
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      cancel () {
        router.push({name: 'categories'})
      },
      getCategories () {
        Vue.axios.get(API_URL + 'admin/shop/category').then((responce) => {
          responce.data.data.forEach((e) => {
            this.categories_array.push({
              id: e.id,
              text: e.name
            })
          })
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
        })
      },
      prepareItem () {
        let input = document.querySelector('#upload')
        let formData = new FormData()

        formData.append('name', this.item.name)
        formData.append('description', this.item.description)
        formData.append('price', this.item.price)

        if (input.files[0]) {
          formData.append('image', input.files[0])
        } else {
          formData.append('image', this.item.image)
        }

        if (this.item.categories) {
          for (var j = 0; j < this.item.categories.length; j++) {
            formData.append('category_id[]', this.item.categories[j])
          }
        }
        return formData
      }
    }
  }
</script>

<style scoped>
  .row {
    margin-bottom: 10px;
  }

  label {
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
  }

  #upload {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  #upload + label {
    width: 100%;
    height: 35px;
    background-color: #df474b;
    color: white;
    cursor: pointer;
    display: inline-block;
    transition: all 0.15s ease-in-out;
    text-align: center;
    margin-bottom: 0;
    padding: 0.5rem 0.75rem;
    line-height: 1.25;
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #upload + label:hover {
    background-color: #8e1b1e;
  }

  #goods-image {
    max-width: 100%;
    max-height: 333px;
  }
</style>