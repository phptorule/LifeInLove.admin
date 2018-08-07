<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header" class="header pt-2">
        <button
          :class="{'btn btn-primary': currentPage === 'info', 'btn btn-outline-primary': currentPage !== 'info'}"
          @click="currentPage = 'info'">
          User Info
        </button>

        <button
          :class="{'btn btn-primary': currentPage === 'gallery', 'btn btn-outline-primary': currentPage !== 'gallery'}"
          @click="currentPage = 'gallery'">
          Gallery
        </button>

        <button
          v-if="user.role === 'girl'"
          :class="{'btn btn-primary': currentPage === 'video', 'btn btn-outline-primary': currentPage !== 'video'}"
          @click="currentPage = 'video'">
          Video
        </button>
      </div>

      <div class="loader mx-auto" v-show="!isReady"></div>

      <div v-if="isReady && currentPage === 'info'">
        <MaleCreate v-if="user.role === 'client'" :userData="user"/>
        <GirlCreate v-if="user.role === 'girl'" :userData="user"/>
      </div>

      <div v-if="isReady">
        <Gallery
          v-if="currentPage === 'gallery'"
          :data="galleryImages"
          type="gallery"
          :id="id"
          @avatarChange="getUserInfo"
          :role="user.role"/>
      </div>

      <div v-if="isReady">
        <Gallery v-if="currentPage === 'video'" :data="userVideos" type="video" :id="id" role='girl'/>
      </div>
    </b-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { API_URL } from '@/settings.js'
import { MaleCreate, GirlCreate, Gallery } from '@/components/'

export default {
  components: {
    MaleCreate,
    GirlCreate,
    Gallery
  },
  name: 'UserEdit',
  props: ['id'],
  created () {
    this.getUserInfo()
  },
  data () {
    return {
      isReady: false,
      user: { },
      currentPage: 'info',
      galleryImages: [],
      userVideos: []
    }
  },
  methods: {
    getUserInfo () {
      Vue.axios.get(API_URL + 'admin/user/' + this.id).then((responce) => {
        this.user.avatar = responce.data.data.avatar.croped
        this.user.id = responce.data.data.id
        this.user.role = responce.data.data.role
        this.user.first_name = responce.data.data.first_name || ''
        this.user.last_name = responce.data.data.last_name || ''
        this.user.email = responce.data.data.email || ''
        this.user.children = responce.data.data.children.id || ''
        this.user.hair_length_id = responce.data.data.hair_length.id || ''
        this.user.hair_color_id = responce.data.data.hair_color.id || ''
        this.user.birth = responce.data.data.birth || ''
        this.user.country = responce.data.data.country.country_code || ''
        this.user.city = responce.data.data.city || ''
        this.user.weight_id = responce.data.data.weight.id || ''
        this.user.height_id = responce.data.data.height.id || ''
        this.user.eyes_id = responce.data.data.eyes.id || ''
        this.user.marital_status_id = responce.data.data.marital_status.id || ''
        this.user.match = responce.data.data.match
        this.user.ethnicity_id = responce.data.data.ethnicity.id || ''
        this.user.interest_id = responce.data.data.interests
        this.user.smoke_id = responce.data.data.smoke.id || ''
        this.user.drink_id = responce.data.data.drink.id || ''
        this.user.education_id = responce.data.data.education.id || ''
        this.user.body_style = responce.data.data.body_style.id || ''
        this.user.eye_wear = responce.data.data.eye_wear.id || ''
        this.user.religion_id = responce.data.data.religion.id || ''
        this.user.mobile = responce.data.data.mobile || ''
        this.user.living_situation = responce.data.data.living_situation.id || ''
        this.user.field_of_work = responce.data.data.field_of_work.id || ''
        this.user.employment_status = responce.data.data.employment_status.id || ''
        this.user.like_to_meet = responce.data.data.like_to_meet
        this.user.languages = responce.data.data.languages
        this.user.about_me = responce.data.data.about_me
        this.user.want_children_id = responce.data.data.want_children.id || ''
        this.user.about_children = responce.data.data.about_children || []

        if (this.user.role === 'client') {
          this.user.membership_id = responce.data.data.membership.id || ''
          this.user.value_id = responce.data.data.membership.value.id || ''
          this.user.credits = responce.data.data.credits
        }

        if (this.user.role === 'girl') {
          this.user.translator_id = responce.data.data.translator_id || ''
          this.user.vk = responce.data.data.vk
          this.user.facebook = responce.data.data.facebook
          this.user.other_social = responce.data.data.other_social
          this.user.leisure_time = responce.data.data.leisure_time
          this.user.about_family = responce.data.data.about_family
          this.user.future_goals = responce.data.data.future_goals
        }
      }).then((responce) => {
        this.getGallery()
      }).catch((e) => {
        console.error(e)
        this.$toastr('error', 'user not loaded')
      })
    },
    getGallery () {
      Vue.axios.get(API_URL + 'admin/gallery/' + this.id).then((images) => {
        this.galleryImages = images.data.data
      }).then(() => {
        Vue.axios.get(API_URL + 'admin/video/' + this.id).then((videos) => {
          this.userVideos = videos.data.data
          this.isReady = true
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
        })
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
      })
    }
  }
}
</script>

<style scoped>
  button {
    width: 80px;
  }

  button:hover, button:focus, .btn:hover, .btn:focus{outline-style: none!important; outline: none!important;}
</style>