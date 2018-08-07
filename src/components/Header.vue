<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <b-link class="navbar-brand" to="#" style="background-image: url('/static/img/logo.svg')"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarMinimize">&#9776;</button>
    <span class="header-item">{{ userInfo }}</span>
    <span class="log-out" @click="logOut">log out</span>
  </header>
</template>

<script>
import router from '@/router'

export default {
  name: 'header',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    let user = Object.assign({}, this.$root.currentUser)
    this.userInfo = user.first_name + ' ' + user.last_name + ' (' + user.role + ')'
  },
  methods: {
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    },
    logOut () {
      this.$cookie.delete('token')
      this.$cookie.delete('currentRole')
      router.push({name: 'login'})
    }
  }
}
</script>

<style scoped>
  .log-out {
    font-size: 15px;
    text-transform: capitalize;
    cursor: pointer;
    font-family: "Segoe UI";
    font-weight: 500;
    margin-right: 35px;
  }

  .header-item {
    font-size: 15px;
    margin-left: 20px;
    margin-right: 20px;
    font-weight: 500;
  }
</style>