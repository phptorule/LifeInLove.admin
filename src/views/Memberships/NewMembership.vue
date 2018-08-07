<template>
  <div class="animated fadeIn">
    <b-card header="Create New Membership">
      <form @submit.prevent="validate" novalidate>
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-3 title">
                Name:
              </div>

              <div class="col-md-9">
                <b-form-input
                  v-model="membership.name"
                  type="text"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('name')}"
                  name="name">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                Interests:
              </div>

              <div class="col-md-9">
                <b-form-select
                  name="interests"
                  v-model="membership.likes"
                  :options="likesArray"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('interests')}"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                Free letters:
              </div>

              <div class="col-md-9">
                <b-form-input
                  name="free letters"
                  v-model="membership.free_letter"
                  type="number"
                  v-validate="{required: true, numeric: true, min_value: 0}"
                  :class="{'red-shadow': errors.has('free letters')}" >
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                Discount:
              </div>

              <div class="col-md-9">
                <b-form-input
                  name="discount"
                  v-model="membership.discount"
                  type="number"
                  v-validate="{required: true, numeric: true, max_value: 100, min_value: 0}"
                  :class="{'red-shadow': errors.has('discount')}">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                View Photos:
              </div>

              <div class="col-md-9">
                <b-form-select
                  name="view photo"
                  v-model="membership.view_photo"
                  :options="likesArray"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('view photo')}"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                View Videos:
              </div>

              <div class="col-md-9">
                <b-form-select
                  name="view video"
                  v-model="membership.view_video"
                  :options="likesArray"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('view video')}"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                Photos in profile:
              </div>

              <div class="col-md-9">
                <b-form-input
                  name="photos in profile"
                  v-model="membership.my_photo"
                  type="number"
                  v-validate="{required: true, numeric: true, max_value: 10, min_value: 0}"
                  :class="{'red-shadow': errors.has('photos in profile')}">
                </b-form-input>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="row">
              <div class="col-md-3 title">
                Private photos:
              </div>

              <div class="col-md-9">
                <b-form-input
                  name="private photos"
                  v-model="membership.private_photo"
                  type="number"
                  v-validate="{required: true, numeric: true, min_value: 0}"
                  :class="{'red-shadow': errors.has('private photos')}">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                Share details:
              </div>

              <div class="col-md-9">
                <b-form-input
                  name="share contact details"
                  v-model="membership.contact_details"
                  type="number"
                  v-validate="{required: true, numeric: true, min_value: 0}"
                  :class="{'red-shadow': errors.has('share contact details')}">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                For:
              </div>

              <div class="col">
                <b-form-select
                  name="month"
                  v-model="membership.month"
                  :options="subsription"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('month')}"
                />
              </div>

              <div class="col title">
                {{ membership.month > 1 ? 'Months' : 'Month'}}
              </div>
            </div>

            <div class="row">
              <div class="col-md-3 title">
                Payment:
              </div>

              <div class="col">
                <b-form-input
                  name="payment"
                  v-model="membership.payment"
                  type="number"
                  v-validate="{required: true, decimal: true, min_value: 0}"
                  :class="{'red-shadow': errors.has('payment')}">
                </b-form-input>
              </div>

              <div class="col title">USD</div>
            </div>
          </div>
        </div>

        <button class="btn btn-success" @click="validate">Create</button>
        <button class="btn btn-danger ml-5" @click="cancel">Cancel</button>
      </form>
    </b-card>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'NewMembership',
  data () {
    return {
      membership: {
        name: '',
        likes: 'Limited',
        free_letter: 0,
        discount: 0,
        view_photo: 'Limited',
        view_video: 'Limited',
        private_photo: 0,
        my_photo: 0,
        contact_details: 0,
        payment: 0,
        month: 1
      },
      likesArray: [
        {value: 'Limited', text: 'Limited'},
        {value: 'Unlimited', text: 'Unimited'}
      ],
      subsription: [
        {value: 1, text: 1},
        {value: 3, text: 3},
        {value: 6, text: 6},
        {value: 12, text: 12}
      ]
    }
  },
  methods: {
    cancel () {
      router.push({name: 'memberships list'})
    },
    setOneMonth () {
      this.membership.values['1'].one_payment = this.membership.values['1'].month_payment
      this.membership.values['3'].one_payment = (this.membership.values['3'].month_payment / 3).toFixed(2)
      this.membership.values['6'].one_payment = (this.membership.values['6'].month_payment / 3).toFixed(2)
      this.membership.values['12'].one_payment = (this.membership.values['12'].month_payment / 3).toFixed(2)
    },
    validate () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.setOneMonth()
          this.createMembership()
          return
        }

        this.$validator.errors.items.forEach((element) => {
          this.$toastr('error', element.msg, '')
        })
      })
    },
    createMembership () {
      Vue.axios.post(API_URL + 'admin/membership/create', this.membership).then((responce) => {
        this.$toastr('success', responce.data.message, '')
        this.$root.updateMemberships(true)
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