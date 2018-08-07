<template>
  <div class="animated fadeIn">
    <b-card header="Create New Package">
      <div class="row">
        <div class="col">
          <div class="row">
            <div class="col-3 title">
              Dibs:
            </div>

            <div class="col">
              <b-form-input
                name="dibs"
                v-model="item.credits"
                placeholder="Amount of dibs . . ."
                type="number"
                v-validate="'required|numeric'"
                :class="{'red-shadow': errors.has('dibs')}">
              </b-form-input>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="row">
            <div class="col-3 title">
              Price:
            </div>

            <div class="col-6">
              <b-form-input
                name="price"
                v-model="item.price"
                placeholder="Price . . ."
                type="number"
                v-validate="{required: true, decimal: true, min_value: 0}"
                :class="{'red-shadow': errors.has('price')}">
              </b-form-input>
            </div>

            <div class="col-3 title">
              USD
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <button class="btn btn-success" @click="validate">Create</button>
        <button class="btn btn-danger ml-5" @click="cancel">Cancel</button>
      </div>
    </b-card>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'NewPackage',
  data () {
    return {
      item: {
        credits: 0,
        price: 0
      }
    }
  },
  methods: {
    cancel () {
      router.push({name: 'packages list'})
    },
    validate () {
      this.item.price = (parseInt(this.item.price * 100)) / 100
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.createPackage()
          return
        }

        this.$validator.errors.items.forEach((element) => {
          this.$toastr('error', element.msg, '')
        })
      })
    },
    createPackage () {
      Vue.axios.post(API_URL + 'admin/credits/create', this.item).then((responce) => {
        this.$toastr('success', responce.data.message, '')
        router.push({name: 'packages list'})
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
      })
    }
  }
}
</script>

<style scoped>
  .red-shadow {
    box-shadow: 0 0 8px 2px red;
  }

  .row {
    margin-bottom: 10px;
  }

  .title {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .title {
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
</style>