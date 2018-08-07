<template>
  <form @submit.prevent="validate" novalidate>
    <div class="row">
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-3 title">
            First Name:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="first name"
              v-model="user.first_name"
              type="text"
              v-validate="'required|alpha'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('first name')}">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 title">
            Last Name:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="last name"
              v-model="user.last_name"
              type="text"
              v-validate="'required|alpha'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('last name')}">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 title">
            Email:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="email"
              v-model="user.email"
              type="text"
              v-validate="'required|email'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('email')}">
            </b-form-input>
          </div>
        </div>

        <div class="row" v-if="!userData">
          <div class="col-md-3 title">
            Pasword:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="password"
              v-model="user.password"
              type="password"
              v-validate="'required'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('password')}">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Birth Date:
          </div>

          <div class="col">
            <div class="row mb-0 b-date">
              <div class="col-sm-12 col-md-4">
                <b-form-select
                  name="month of birth"
                  v-model="user.birth.month"
                  :options="month_array"
                  v-validate="'required'"
                  :disabled="isManager()"
                  :class="{'red-shadow': errors.has('month of birth')}"
                />
              </div>

              <div class="col-sm-12 col-md-4">
                <b-form-select
                  name="day of birth"
                  v-model="user.birth.day"
                  :options="day_array"
                  v-validate="'required'"
                  :disabled="isManager()"
                  :class="{'red-shadow': errors.has('day of birth')}"
                />
              </div>

              <div class="col-sm-12 col-md-4">
                <b-form-select
                  name="year of birth"
                  v-model="user.birth.year"
                  :options="years_array"
                  v-validate="'required'"
                  :disabled="isManager()"
                  :class="{'red-shadow': errors.has('year of birth')}"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 title">
            Home Phone:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="home phone"
              v-model="user.home_phone"
              type="text"
              :disabled="isManager()"
              v-validate="{required: true, regex: /^([+][(]?\d{3,5}[)]?[\s]?\d{7})$/}"
              :class="{'red-shadow': errors.has('home phone')}">
            </b-form-input>

            <div class="helper">For example: +(1443) 4324567</div>
          </div>
        </div>

        <div class="row" v-if="loggedUser.role === 'admin' && userData">
          <div class="col-md-3 title">
            New Password:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="new password"
              class="password-change"
              v-model="user.new_password"
              placeholder="Leave empty if you dont want to change password"
              type="password">
            </b-form-input>
          </div>
        </div>

        <div class="row" v-if="loggedUser.role === 'admin' && userData">
          <div class="col-md-3 title">
            Confirm Password:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="confirm password"
              class="password-change"
              v-model="user.confirm_password"
              placeholder="Leave empty if you dont want to change password"
              type="password">
            </b-form-input>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="row">
          <div class="col-md-3 title">
            Telegram:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="telegram"
              v-model="user.telegram"
              type="text"
              v-validate="'required'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('telegram')}">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 title">
            Skype:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="skype"
              v-model="user.skype"
              type="text"
              v-validate="'required'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('skype')}">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 title">
            Position:
          </div>

          <div class="col-md-9">
            <b-form-select
              name="position"
              v-model="user.role"
              :options="rolesArray"
              v-validate="'required'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('position')}"
            />
          </div>
        </div>

        <div class="row" v-if="user.role === 'translator'">
          <div class="col-md-3 title">
            Manager:
          </div>

          <div class="col-md-9">
            <b-form-select
              name="manager"
              v-model="user.manager_id"
              :options="managers_array"
              :disabled="isManager()"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('manager')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 title">
            Office:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="office"
              v-model="user.office"
              type="text"
              v-validate="'required'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('office')}">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 title">
            Office adress:
          </div>

          <div class="col-md-9">
            <b-form-input
              name="office address"
              v-model="user.office_address"
              type="text"
              v-validate="'required'"
              :disabled="isManager()"
              :class="{'red-shadow': errors.has('office address')}">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 title">
            Mobile Phone:
          </div>

          <div class="col-md-9">
             <b-form-input
                name="mobile phone"
                v-model="user.mobile_phone"
                type="text"
                v-validate="{required: true, regex: /^([+][(]?\d{3,5}[)]?[\s]?\d{7})$/}"
                :disabled="isManager()"
                :class="{'red-shadow': errors.has('mobile phone')}">
              </b-form-input>
             <div class="helper">For example: +(096) 5698756</div>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-success" :disabled="isManager()">{{ userData ? 'Update' : 'Create' }}</button>
    <button class="btn btn-danger ml-5" @click.prevent="cancel">Cancel</button>
  </form>
</template>

<script>
import router from '@/router'
import Vue from 'vue'
import { API_URL } from '@/settings.js'

export default {
  name: 'AdminCreate',
  props: ['userData'],
  data () {
    return {
      user: {
        birth: {
          day: 1,
          month: 1,
          year: 1990
        },
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        telegram: '',
        skype: '',
        role: 'translator',
        position: '',
        office: '',
        office_address: '',
        home_phone: '',
        mobile_phone: '',
        manager_id: ''
      },
      rolesArray: [
        {value: 'manager', text: 'Regional Manager'},
        {value: 'translator', text: 'Translator'}
      ],
      day_array: [],
      month_array: [],
      years_array: [],
      managers_array: [{value: '', text: 'Select'}],
      loggedUser: {}
    }
  },
  created () {
    this.loggedUser = Object.assign({}, this.$root.currentUser)
    if (this.loggedUser.role === 'admin') {
      this.user.new_password = ''
      this.user.confirm_password = ''
      let managers = [].concat(this.$root.staff.managers)
      managers.forEach(e => {
        this.managers_array.push({
          value: e.id, text: e.first_name + ' ' + e.last_name
        })
      })
    }

    if (this.loggedUser.role === 'manager') {
      this.managers_array.push({ value: this.loggedUser.id, text: this.loggedUser.first_name + ' ' + this.loggedUser.last_name })
    }

    this.day_array = [].concat(this.$root.apiArrays.day_array)
    this.month_array = [].concat(this.$root.apiArrays.month_array)
    this.years_array = [].concat(this.$root.apiArrays.years_array)

    if (this.userData) {
      this.user = this.userData
    }
    if (this.isManager()) {
      this.user.manager_id = this.loggedUser.id
    }
  },
  methods: {
    isManager () {
      return this.loggedUser.role === 'manager'
    },
    cancel () {
      router.go(-1)
    },
    validate () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.user.position = this.user.role === 'manager' ? 'Regional Manager' : 'Translator'
          if (this.userData) {
            if (this.user.new_password === this.user.confirm_password) {
              this.updateStaff()
              return
            }

            this.$toastr('error', 'Password and confirm password does not match')
          } else {
            this.createStaff()
          }
        }

        this.$validator.errors.items.forEach((element) => {
          this.$toastr('error', element.msg)
        })
      })
    },
    createStaff () {
      Vue.axios.post(API_URL + 'admin/user/create', this.user).then((responce) => {
        this.$toastr('success', responce.data.message)
        this.$root.updateStaff(this.user.role, true)
      }).catch((err) => {
        let error = JSON.parse(err.request.response)
        let errors = []
        for (let k in error.validate) {
          errors.push(error.validate[k][0])
        }

        errors.forEach(e => {
          this.$toastr('error', e)
        })
      })
    },
    updateStaff () {
      Vue.axios.put(API_URL + 'admin/user/' + this.user.id, this.user).then((responce) => {
        if (responce.status && responce.status === 200) {
          this.$toastr('success', responce.data.message)
          this.$root.updateStaff(this.user.role, true)
        }
      }).catch((err) => {
        let error = JSON.parse(err.request.response)
        let errors = []
        for (let k in error.validate) {
          errors.push(error.validate[k][0])
        }

        errors.forEach(e => {
          this.$toastr('error', e, '')
        })
      })
    }
  }
}
</script>

<style scoped>
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
  }

  .title-block {
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 15px;
    font-weight: 700;
  }

  .red-shadow {
    box-shadow: 0 0 8px 2px red;
  }

  .helper {
    font-size: 12px;
    margin-top: 5px;
    font-style: italic;
  }

  .password-change::placeholder {
    font-size: 90%;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    .title {
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .b-date > div {
      margin-bottom: 10px;
    }
  }
</style>