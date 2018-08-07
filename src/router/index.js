import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import NewMembership from '@/views/Memberships/NewMembership'
import Memberships from '@/views/Memberships/Memberships'
import Messages from '@/views/Messages'
import Males from '@/views/Users/Males'
import Females from '@/views/Users/Females'
import UserEdit from '@/views/Users/UserEdit'
import NewUser from '@/views/Users/NewUser'
import PreUsers from '@/views/Users/PreUsers'
import Devices from '@/views/Users/Devices'
import Translators from '@/views/Staff/Translators'
import StaffEdit from '@/views/Staff/StaffEdit'
import NewStaff from '@/views/Staff/NewStaff'
import Managers from '@/views/Staff/Managers'
import Orders from '@/views/Shop/Orders'
import Goods from '@/views/Shop/Goods'
import Categories from '@/views/Shop/Categories'
import ShareDetails from '@/views/ShareDetails'
import NewStory from '@/views/Stories/NewStory'
import StoriesTable from '@/views/Stories/StoriesTable'
import NewBlog from '@/views/Blogs/NewBlog'
import BlogList from '@/views/Blogs/BlogList'
import PackagesList from '@/views/Packages/PackagesList'
import NewPackage from '@/views/Packages/NewPackage'

Vue.use(Router)
Vue.use(VueCookie)
window.VueCookie = VueCookie

export default new Router({
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard',
      component: Full,
      beforeEnter: (to, from, next) => {
        if (VueCookie.get('token')) {
          next()
          return
        }
        next({path: '/login'})
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'users',
          redirect: '/users/females',
          name: 'users',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'create-new-user',
              name: 'new user',
              component: NewUser,
              props: true
            },
            {
              path: 'males',
              name: 'males',
              component: Males,
              props: true
            },
            {
              path: 'females',
              name: 'females',
              component: Females,
              props: true
            },
            {
              path: 'edit/:id',
              name: 'edit user',
              component: UserEdit,
              props: true
            },
            {
              path: 'preusers',
              name: 'preusers',
              component: PreUsers,
              beforeEnter: (to, from, next) => {
                if (VueCookie.get('currentRole') === 'admin') {
                  next()
                  return
                }

                next({path: '/'})
              }
            },
            {
              path: 'devices',
              name: 'devices',
              component: Devices,
              beforeEnter: (to, from, next) => {
                if (VueCookie.get('currentRole') === 'admin') {
                  next()
                  return
                }

                next({path: '/'})
              }
            }
          ]
        },
        {
          path: '/memberships',
          name: 'memberships',
          redirect: '/memberships/list',
          beforeEnter: (to, from, next) => {
            if (VueCookie.get('currentRole') === 'admin') {
              next()
              return
            }
            next({path: '/'})
          },
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '/memberships/add',
              name: 'add membership',
              component: NewMembership
            },
            {
              path: '/memberships/list',
              name: 'memberships list',
              component: Memberships
            }
          ]
        },
        {
          path: '/staff',
          name: 'staff',
          redirect: '/staff/translators-list',
          beforeEnter: (to, from, next) => {
            if (VueCookie.get('currentRole') === 'translator') {
              next({path: '/'})
              return
            }
            next()
          },
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'add-to-staff',
              name: 'add to staff',
              component: NewStaff,
              beforeEnter: (to, from, next) => {
                if (VueCookie.get('currentRole') === 'manager') {
                  next({path: '/'})
                  return
                }
                next()
              }
            },
            {
              path: 'translators-list',
              name: 'translators list',
              component: Translators
            },
            {
              path: 'edit-staff/:id',
              name: 'edit staff',
              component: StaffEdit,
              props: true
            },
            {
              path: 'managers-list',
              name: 'managers list',
              component: Managers,
              beforeEnter: (to, from, next) => {
                if (VueCookie.get('currentRole') === 'admin') {
                  next()
                  return
                }
                next({path: '/'})
              }
            }
          ]
        },
        {
          path: '/shop',
          name: 'shop',
          redirect: '/shop/orders',
          beforeEnter: (to, from, next) => {
            if (VueCookie.get('currentRole') === 'admin') {
              next()
              return
            }
            next({path: '/'})
          },
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'add',
              name: 'add goods',
              component: Goods
            },
            {
              path: 'orders',
              name: 'orders',
              component: Orders
            },
            {
              path: 'categories',
              name: 'categories',
              component: Categories
            },
            {
              path: 'edit/:id',
              name: 'edit product',
              component: Goods,
              props: true
            }
          ]
        },
        {
          path: '/success-stories',
          name: 'stories',
          redirect: '/success-stories/list',
          beforeEnter: (to, from, next) => {
            if (VueCookie.get('currentRole') === 'admin') {
              next()
              return
            }
            next({path: '/'})
          },
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'add',
              name: 'add story',
              component: NewStory
            },
            {
              path: 'edit/:id',
              name: 'edit story',
              component: NewStory,
              props: true
            },
            {
              path: 'list',
              name: 'succes stories list',
              component: StoriesTable
            }
          ]
        },
        {
          path: '/blog',
          name: 'blog',
          redirect: '/blog/list',
          beforeEnter: (to, from, next) => {
            if (VueCookie.get('currentRole') === 'admin') {
              next()
              return
            }
            next({path: '/'})
          },
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'add',
              name: 'add blog',
              component: NewBlog
            },
            {
              path: 'edit/:id',
              name: 'edit blog',
              component: NewBlog,
              props: true
            },
            {
              path: 'list',
              name: 'blog list',
              component: BlogList
            }
          ]
        },
        {
          path: '/packages',
          name: 'packages',
          redirect: '/packages/list',
          component: {
            render (c) { return c('router-view') }
          },
          beforeEnter: (to, from, next) => {
            if (VueCookie.get('currentRole') === 'admin') {
              next()
              return
            }
            next({path: '/'})
          },
          children: [
            {
              path: 'add',
              name: 'add package',
              component: NewPackage
            },
            {
              path: 'list',
              name: 'packages list',
              component: PackagesList
            }
          ]
        },
        {
          path: '/messages',
          name: 'messages',
          component: Messages
        },
        {
          path: '/contact-details',
          name: 'contact details',
          component: ShareDetails,
          beforeEnter: (to, from, next) => {
            if (VueCookie.get('currentRole') === 'admin') {
              next()
              return
            }
            next({path: '/'})
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (VueCookie.get('token')) {
          next({path: '/dashboard'})
          return
        }
        next()
      }
    },
    {
      path: '/*',
      redirect: '/'
    }
  ]
})
