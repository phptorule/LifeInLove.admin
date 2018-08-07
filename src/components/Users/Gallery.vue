<template>
  <div>
    <div id="header" class="header">
      <input
        class="pull-left"
        type="file"
        id="upload"
        @change="inputChange"
        :accept="(type === 'gallery' ? 'image' : type) + '/*'"
      />

      <label class="pull-left mr-2" for="upload">{{ inputFileText }}</label>
      <button class="btn btn-success pull-left" v-show="isUpload" @click="uploadItem">Upload</button>
      <button class="btn btn-warning" @click="changeState('hide')" v-show="role === 'client'">Make Inactive</button>
      <button class="btn btn-success" @click="changeState('show')" v-show="role === 'client'">Make Active</button>
      <button class="btn btn-warning" @click="changeState('public')" v-show="role === 'girl'">Make public</button>
      <button class="btn btn-success" @click="changeState('private')" v-show="role === 'girl'">Make pivate</button>
    </div>

    <div class="loader mx-auto mt-2" v-show="!isReady"></div>

    <div class="row" id="row">
      <div class="col-md-4" v-for="(item, index) in myData" :key="index">
        <div class="item-holder text-center">
          <div class="image-holder">
            <img @click="openModal(item.image)" :src="item.image" v-if="type === 'gallery'">

            <video controls controlsList="nodownload" v-if="type === 'video'">
              <source :src="item.video" :type="'video/' + getVideoExtension(item.video)">
            </video>
          </div>

          <div class="buttons-holder">
            <button class="btn btn-outline-danger" @click="deleteItem(item.id, index)">Delete</button>

            <div
              class="indicator"
              :class="{'bg-success': item.active, 'bg-warning': !item.active}"
              v-show="role === 'client'">
              {{ item.active ? 'Active'  : 'Inactive'}}
            </div>

            <div
              class="indicator"
              :class="{'bg-success': !item.private, 'bg-warning': item.private}"
              v-show="role === 'girl'">
              {{ item.private ? 'Private'  : 'Public'}}
            </div>

            <div class="checkbox-container">
              <input type="checkbox" :checked="item.active" v-model="selectedArray" :value="item.id">
              <span class="checkmark"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      v-if="role === 'girl'"
      class="cropp-modal"
      v-model="isModalOpen"
      title="Cropp avatar"
    >
      <vue-cropper
        v-if="cropperSrc && isModalOpen"
        :src="cropperSrc"
        :aspectRatio=" 1 / 1"
        :guides="false"
        :background="false"
        style="max-width: 400px; margin: 15px auto"
        ref="modalCropper" />

      <div slot="modal-footer" class="d-flex justify-content-between w-100">
        <button
          @click="isModalOpen = false"
          class="btn btn-warning">
          Cancel
        </button>

        <button
          @click="makeNewAvatar"
          class="btn btn-success">
          Save
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { API_URL } from '@/settings.js'
  import VueCropper from 'vue-cropperjs'

  export default {
    name: 'Gallery',
    props: ['data', 'id', 'role', 'type'],
    components: {
      VueCropper
    },
    data () {
      return {
        selectedArray: [],
        isModalOpen: false,
        cropperSrc: '',
        isUpload: false,
        inputFileText: 'Add ' + (this.type === 'gallery' ? 'image' : this.type),
        myData: this.data,
        backup: [],
        isReady: true
      }
    },
    created () {
      this.sortData()
    },
    mounted () {
      window.addEventListener('scroll', this.stickyMenu)
    },
    destroyed () {
      window.removeEventListener('scroll', this.stickyMenu)
    },
    methods: {
      sortData () {
        this.myData.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at)
        })
      },
      openModal (image) {
        this.cropperSrc = image
        this.isModalOpen = true
      },
      makeNewAvatar () {
        const cropp = this.$refs.modalCropper.getData()
        const data = {
          avatar: this.cropperSrc,
          x: cropp.x.toFixed(),
          y: cropp.y.toFixed(),
          height: cropp.height.toFixed(),
          width: cropp.width.toFixed(),
          user_id: this.$route.params.id
        }

        Vue.axios.put(API_URL + 'admin/gallery/avatar', data).then((responce) => {
          this.$toastr('success', responce.data.message)
          this.isModalOpen = false
          this.$emit('avatarChange')
        }).catch((err) => {
          console.error(err)
          this.$toastr('error', err)
        })
      },
      inputChange () {
        let input = document.querySelector('#upload')

        if (this.role === 'client' && input.files.length > (10 - this.myData.length)) {
          input.value = ''
          this.$toastr('error', (10 - this.myData.length) + ' images left to upload for this user')
          this.isUpload = false
          return
        }
        this.isUpload = true

        if (input.files.length === 1) {
          this.inputFileText = input.files[0].name
        } else {
          this.inputFileText = 'Add image'
          this.isUpload = false
        }
      },
      stickyMenu () {
        if (window.pageYOffset > 150) {
          document.getElementById('header').className = 'pinned-top'
          document.getElementById('row').style.marginTop = '41px'
        } else {
          document.getElementById('header').className = 'header'
          document.getElementById('row').style.marginTop = '10px'
        }
      },
      changeState (state) {
        if (this.selectedArray.length === 0) {
          this.$toastr('error', 'No images selected')
          return
        }

        let data = {
          user_id: this.id
        }
        data[this.type === 'gallery' ? 'images' : this.type + 's'] = this.selectedArray
        Vue.axios.post(API_URL + 'admin/' + this.type + '/' + state, data).then((responce) => {
          this.$toastr('success', responce.data.message)
          if (state === 'hide' || state === 'show') {
            this.changeSelectedState(state)
          } else {
            this.changePublicState(state)
          }
          this.selectedArray = []
        }).catch((err) => {
          this.$toastr('error', JSON.parse(err.request.response).message)
        })
      },
      deleteItem (id, index) {
        if (confirm('Are you sure ?')) {
          this.isReady = false
          this.backup = this.myData
          Vue.axios.delete(API_URL + 'admin/' + this.type + '/' + id + '/remove').then((responce) => {
            this.$toastr('success', responce.data.message)
            this.myData = []
            Vue.axios.get(API_URL + 'admin/' + this.type + '/' + this.id).then((items) => {
              this.isReady = true
              this.myData = items.data.data
            }).catch((err) => {
              this.myData = this.backup
              this.$toastr('error', JSON.parse(err.request.response).message)
              this.isReady = true
            })
          }).catch((err) => {
            this.$toastr('error', JSON.parse(err.request.response).message)
            this.isReady = true
          })
        }
      },
      changeSelectedState (state) {
        this.myData.forEach((e) => {
          if (this.selectedArray.indexOf(e.id) >= 0) {
            e.active = state === 'hide' ? 0 : 1
          }
        })
      },
      changePublicState (state) {
        this.myData.forEach((e) => {
          if (this.selectedArray.indexOf(e.id) >= 0) {
            e.private = state === 'public' ? 0 : 1
          }
        })
      },
      selectItem (id) {
        let index = this.selectedArray.indexOf(id)
        if (index >= 0) {
          this.selectedArray.splice(index, 1)
        } else {
          this.selectedArray.push(id)
        }
      },
      getVideoExtension (path) {
        return path.substring(path.lastIndexOf('.') + 1, path.length)
      },
      uploadItem () {
        this.isReady = false
        let file = document.querySelector('#upload')
        let formData = new FormData()
        formData.append(this.type === 'gallery' ? 'image' : this.type, file.files[0])
        formData.append('user_id', this.id)
        this.backup = this.myData
        this.myData = []
        Vue.axios.post(API_URL + 'admin/' + this.type + '/add', formData).then((responce) => {
          this.$toastr('success', responce.data.message)
          Vue.axios.get(API_URL + 'admin/' + this.type + '/' + this.id).then((items) => {
            this.isReady = true
            this.myData = items.data.data
            this.sortData()
            file.value = ''
            this.inputFileText = 'Add ' + (this.type === 'gallery' ? 'image' : this.type)
            this.isUpload = false
          }).catch((err) => {
            console.log(err)
            this.myData = this.backup
            this.isReady = true
            this.$toastr('error', JSON.parse(err.request.response).message)
          })
        }).catch((err) => {
          console.log(err)
          this.$toastr('error', 'error')
          this.isReady = true
          this.myData = this.backup
        })
      }
    }
  }
</script>

<style scoped>
  #row {
    margin-top: 10px;
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
    min-width: 115px;
    max-width: 400px;
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

  .header > button {
    width: 115px;
  }

  .indicator {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    width: 70px;
    height: 35px;
    justify-content: center;
    align-items: center;
    background-color: white;
  }

  .checkbox-container {
    display: block;
    position: relative;
    cursor: pointer;
    width: 70px;
    height: 35px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 35px;
    width: 70px;
    z-index: 99;
  }

  .checkmark {
    position: absolute;
    top: 0;
    right: 0;
    height: 35px;
    width: 70px;
    padding-top: 6px;
    color: white;
    background-color: #20a8d8;
    transition: background-color .1s linear;
  }

  .checkbox-container:hover input ~ .checkmark {
    background-color: #157fa5;
  }

  .checkbox-container input:checked ~ .checkmark {
    background-color: #4dbd74;
  }

   .checkbox-container input:disabled ~ .checkmark {
    background-color: #eee;
  }

  .checkbox-container input ~ .checkmark:after {
    content: "Check";
    position: absolute;
    left: 25%;
  }

  .checkbox-container input:checked ~ .checkmark:after {
    content: "";
    left: 45%;
    width: 10px;
    height: 18px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .image-holder > img {
    margin-left: auto;
    margin-right: auto;
    width: 99%;
    height: 300px;
    cursor: pointer;
  }

  .image-holder > video {
    margin-left: auto;
    margin-right: auto;
    width: 99%;
    height: 300px;
  }

  .image-holder {
    padding: 5px;
  }

  .item-holder {
    border: 1px solid #d3d3d3;
    margin-bottom: 30px;
  }

  .buttons-holder {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    border-top: 1px solid #d3d3d3;
    background-color: rgba(211,211,211, .7);
    text-align: left;
    padding: 10px 5px 5px 5px;
  }

  .buttons-holder > button {
    display: inline;
  }

  .header {
    padding: 5px;
    width: 100%;
    border: 1px solid #d3d3d3;
    transition: background-color .1s linear;
    text-align: right;
  }

  .pinned-top {
    padding: 5px;
    position: fixed;
    text-align: right;
    top: 55px;
    width: calc(100% - 302px);
    background-color: rgba(255,255,255, 1);
    z-index: 5;
    border: 1px solid #d3d3d3;
    transition: background-color .1s linear;
  }

  .pinned-top button {
    width: 115px;
  }

  .pinned-top:hover {
    background-color: rgba(255,255,255, 1);
  }
</style>