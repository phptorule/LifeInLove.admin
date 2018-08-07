<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header" class="header">
        {{ (id ? 'Edit' : 'Add') + ' Success Story'}}
        <button
          v-if="id && isReady"
          class="btn btn-danger btn-sm pull-right"
          @click="deleteStory()">
          Delete Story
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
                Male Name:
              </div>

              <div class="col">
                <b-form-input
                  v-model="story.client_name"
                  name="male name"
                  type="text"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('male name')}"
                  placeholder="Type in male name here  . . .">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 col-md-3 title">
                Girl Name:
              </div>

              <div class="col">
                <b-form-input
                  v-model="story.girl_name"
                  name="girl name"
                  type="text"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('girl name')}"
                  placeholder="Type in girl name here  . . .">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 col-md-3 title">
                Story:
              </div>

              <div class="col">
                <textarea
                  rows="5"
                  name="story"
                  v-model="story.story"
                  class="form-control"
                  :class="{'red-shadow': errors.has('story')}"
                  placeholder="Type in story here  . . ."
                  v-validate="'required'">
                </textarea>
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
            :src="id ? story.image : '/static/img/default-avatar.jpg'"
            id="story-image"
            alt="story image" />
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { API_URL } from '@/settings.js'
import router from '@/router'

export default {
  name: 'NewStory',
  props: ['id'],
  data () {
    return {
      isReady: false,
      inputFileText: 'Add image',
      story: {
        client_name: '',
        girl_name: '',
        story: '',
        image: ''
      }
    }
  },
  created () {
    if (this.id) {
      this.getStoryInfo(this.id)
    } else {
      this.isReady = true
    }
  },
  methods: {
    inputChange () {
      let input = document.querySelector('#upload')
      let image = document.querySelector('#story-image')

      if (input.files.length === 1) {
        this.inputFileText = input.files[0].name
        this.story.image = 'image'
        let reader = new FileReader()
        reader.onload = function (e) {
          image.src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    validate () {
      if (this.story.image.length === 0) {
        this.$toastr('error', 'The image is required')
        return
      }

      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.id) {
            this.sendData('admin/stories/' + this.id + '/update')
          } else {
            this.sendData('admin/stories/create')
          }
          return
        }

        this.$validator.errors.items.forEach((element) => {
          this.$toastr('error', element.msg)
        })
      })
    },
    getStoryInfo () {
      Vue.axios.get(API_URL + 'admin/stories/' + this.id).then((responce) => {
        this.story = responce.data.data
        this.isReady = true
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.isReady = true
      })
    },
    sendData (path) {
      this.isReady = false
      let data = this.prepareItem()
      Vue.axios.post(API_URL + path, data).then((responce) => {
        this.$toastr('success', responce.data.message)
        router.push({name: 'succes stories list'})
      }).catch((e) => {
        this.$toastr('error', JSON.parse(e.request.response).message)
        this.isReady = true
      })
    },
    deleteStory () {
      this.isReady = false
      if (confirm('Delete this story ?')) {
        Vue.axios.delete(API_URL + 'admin/stories/' + this.id + '/remove').then((responce) => {
          this.$toastr('success', responce.data.message)
          router.push({name: 'succes stories list'})
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      }
    },
    cancel () {
      router.push({name: 'succes stories list'})
    },
    prepareItem () {
      let input = document.querySelector('#upload')
      let formData = new FormData()

      formData.append('client_name', this.story.client_name)
      formData.append('girl_name', this.story.girl_name)
      formData.append('story', this.story.story)

      if (input.files[0]) {
        formData.append('image', input.files[0])
      } else {
        formData.append('image', this.story.image)
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

  #story-image {
    max-width: 100%;
    max-height: 333px;
  }
</style>