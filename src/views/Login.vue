<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="card-group mb-0">
            <div class="card p-4">
              <form @submit.prevent="login()">
                <div class="card-body">
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <div class="input-group mb-3">
                    <span
                      class="input-group-addon">
                      <i class="icon-user"></i>
                    </span>

                    <input
                      type="email"
                      name="email"
                      class="form-control"
                      v-model="email"
                      placeholder="Email"
                      v-validate="'required|email'">
                  </div>

                  <div class="input-group mb-4">
                    <span class="input-group-addon">
                      <i class="icon-lock"></i>
                    </span>

                    <input
                      type="password"
                      name="password"
                      v-model="password"
                      class="form-control"
                      placeholder="Password"
                      v-validate="'required'">
                  </div>

                  <div class="row">
                    <div class="col-6">
                      <button
                        type="submit"
                        class="btn btn-primary px-4">
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { API_URL } from '@/settings.js'
import router from '@/router'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.sendData()
          return
        }

        this.$validator.errors.items.forEach((element) => {
          this.$toastr('error', element.msg, '')
        })
      })
    },
    sendData () {
      Vue.axios.post(API_URL + 'admin/login', {email: this.email, password: this.password}).then((responce) => {
        this.$cookie.set('token', responce.data.data, { expires: '1D' })
        this.$toastr('success', 'You are logged in')
        router.push({name: 'home'})
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
      })
    }
  }
}
</script>
