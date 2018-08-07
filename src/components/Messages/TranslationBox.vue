<template>
  <div class="translation-wrapper">
    <button
      @click="goToLastMessage"
      v-show="dialog.length > 2"
      class="btn btn-primary btn-to-bottom">
      <i class="fa fa-angle-double-down"></i>
    </button>
    <div v-if="isReady">
      <div
        class="mt-2 mb-5 holder"
        v-for="(message, index) in dialog"
        :key="index">
        <div :class="{'girl-sender': message.sender_id === senderId, 'male-sender': message.sender_id != senderId}">
          <img
            class="avatar"
            :src="message.sender_id != senderId ? clientAvatar : girlAvatar"
            alt="avatar"
            @click="goToPofile(message.sender_id)" />

            <span class="public-id">{{ message.sender_profile_id }}</span>

          <div class="message-box">
            <editor
              :content="message.original"
              :auto-height="true"
              :height="150"
              @change="message.original = $event">
            </editor>

            <div class="divider"></div>

            <editor
              :content="message.translation"
              :auto-height="true"
              :height="150"
              @change="message.translation = $event">
            </editor>

            <div class="message-control">
              <button
                class="btn btn-outline-danger"
                title="Remove Message"
                @click="deleteMessage(message.id)">
                <i class="fa fa-times" aria-hidden="true"></i>
              </button>

              <label class="btn btn-outline-primary" title="Upload image">
                <input
                  type="file"
                  :id="'upload' + message.id"
                  @change="inputChange(message.id, index)"
                  multiple
                  accept="image/*">
                  <i class="fa fa-upload" aria-hidden="true"></i>
              </label>

              <button
                class="btn btn-outline-success"
                title="Translate Message"
                @click="validateMessage(message)">
                <i class="fa fa-check" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div class="row my-3">
            <div
              v-for="(image, ind) in message.attachment"
              :key="ind"
              class="col-4 mb-3">
              <div class="attachment">
                <div>
                  <img
                    :id="`attachment-image${message.id}${ind}`"
                    :src="image"
                    alt="attachment"/>

                  <button
                    class="btn btn-danger"
                    title="Remove Image"
                    @click="removeImage(message.id, index, ind)">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            <div
              v-for="(image, ind) in message.previews"
              :key="ind"
              class="col-4 mb-3">
              <div class="attachment">
                <div>
                  <img
                    :id="`attachment-image${message.id}${ind}`"
                    :src="image"
                    alt="attachment"/>

                  <button
                    class="btn btn-danger"
                    title="Remove Image"
                    @click="removePreview(message.id, index, ind)">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loader mx-auto mt-5" v-show="!isReady"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import router from '@/router'
  import { API_URL } from '@/settings.js'

  export default {
    name: 'TranslationBox',
    props: ['dialogId', 'senderId', 'clientAvatar', 'girlAvatar'],
    data () {
      return {
        dialog: [],
        isReady: false
      }
    },
    created () {
      this.getMessages()
    },
    methods: {
      goToPofile (id) {
        router.push({ name: 'edit user', params: {id: id} })
      },
      inputChange (id, index) {
        let input = document.querySelector('#upload' + id)

        if (input.files.length > 0) {
          for (let i = 0; i < input.files.length; i++) {
            let file = input.files[i]

            if (file.type.match('image')) {
              let reader = new FileReader()
              const self = this
              reader.onload = function (e) {
                self.dialog[index].previews.push(e.target.result)
                self.dialog[index].tempFiles.push(file)
              }
              reader.readAsDataURL(file)
            }
          }
        }
      },
      goToLastMessage () {
        let messageId = this.dialog[this.dialog.length - 1].id
        var offset = document.getElementById(`upload${messageId}`).getBoundingClientRect().top + window.scrollY
        console.log(offset)

        window.scrollTo({
          behavior: 'smooth',
          left: 0,
          top: offset
        })
      },
      getMessages () {
        Vue.axios.get(API_URL + 'admin/user/message/messages/' + this.dialogId).then((responce) => {
          this.dialog = responce.data.data
          this.dialog.forEach((e, index) => {
            e.translation = e.translation ? e.translation : ''
            console.log(e.attachment)
            e.attachment = Array.isArray(e.attachment) ? e.attachment : []
            this.$set(this.dialog[index], 'previews', [])
            e.tempFiles = []
          })
          this.isReady = true
        })
      },
      translateMessage (message) {
        this.isReady = false
        let formData = new FormData()
        formData.append('message_id', message.id)
        formData.append('translation', message.translation)
        formData.append('original', message.original)

        if (message.tempFiles.length > 0) {
          message.attachment = message.attachment.concat(message.tempFiles)
        }

        for (var j = 0; j < message.attachment.length; j++) {
          formData.append('attachment', message.attachment[j])
        }

        Vue.axios.post(API_URL + 'admin/user/message/translate', formData).then((responce) => {
          this.$toastr('success', responce.data.message)
          this.getMessages()
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      validateMessage (message) {
        if (!message.original) {
          this.$toastr('error', 'Original message required')
          return
        }

        if (!message.translation) {
          this.$toastr('error', 'Translation required')
          return
        }

        this.translateMessage(message)
      },
      deleteMessage (id) {
        if (confirm('Delete this message ?')) {
          Vue.axios.delete(API_URL + 'admin/user/message/' + id + '/remove').then((responce) => {
            this.$toastr('success', responce.data.message)
            this.isReady = false
            this.getMessages()
          }).catch(e => {
            this.$toastr('error', JSON.parse(e.request.response).message)
          })
        }
      },
      removeImage (id, dIndex, index) {
        if (confirm('Delete this image ? ')) {
          this.dialog[dIndex].attachment.splice(index, 1)
        }
      },
      removePreview (id, dIndex, index) {
        if (confirm('Delete this image ? ')) {
          this.dialog[dIndex].previews.splice(index, 1)
          this.dialog[dIndex].tempFiles.splice(index, 1)
        }
      }
    }
  }
</script>

<style scoped>
.vue-html5-editor {
    border: none;
    border-radius: 15px;
  }

  textarea {
    border: none;
    width: 100%;
    overflow: auto;
    outline: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    resize: none;
    padding: 5px;
    height: 100px;
  }

  textarea.original {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }

  textarea.translation {
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .divider {
    width: 100%;
    border-bottom: 1px solid #c2cfd6;
  }

  .translation-wrapper {
    width: 100%;
    padding-right: 10px;
    position: relative;
  }

  .btn-to-bottom {
    position: absolute;
    top: -38px;
    right: 50px;
    width: 30px;
    height: 30px;
    font-size: 20px;
    display: flex;
    justify-content: center;
  }

  .btn-to-bottom i {
    transform: translateY(-3px);
  }

  .attachment {
    padding: 5px;
    border: 1px solid #c2cfd6;
  }

  .attachment > div {
    position: relative;
  }

  .attachment img {
    max-width: 100%;
    max-height: 200px;
  }

  .attachment button {
    position: absolute;
    top: 10px;
    display: none;
    justify-content: center;
    align-items: center;
  }

  .attachment:hover button {
    display: flex;
  }

  .male-sender .attachment button {
    left: 10px;
  }

  .girl-sender .attachment button {
    right: 10px;
  }

  .male-sender .attachment {
    right: calc(50% + 55px)
  }

  .girl-sender .attachment {
    left: calc(50% + 55px)
  }

  .message-control input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .message-control label {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
  }

  .message-control {
    position: absolute;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    top: 0;
  }

  .holder .btn {
    border-radius: 50%;
    padding: 0;
    height: 35px;
    width: 35px;
    font-size: 16px;
  }

  .male-sender .message-control {
    left: -50px;
  }

  .girl-sender .message-control {
    right: -50px;
  }

  .holder {
    width: 100%;
    position: relative;
  }

  .holder > div:first-child {
    width: 93%;
  }

  .holder .male-sender {
    margin-left: auto;
    text-align: right;
  }

  .avatar {
    position: absolute;
    cursor: pointer;
    top: 15px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .public-id {
    top: 70px;
    position: absolute;
  }

  .girl-sender .avatar,
  .girl-sender .public-id {
    left: 5px;
  }

  .male-sender .avatar,
  .male-sender .public-id {
    right: 5px;
  }

  .message-box {
    position: relative;
    border: 1px solid #c2cfd6;
    border-radius: 10px;
  }

  .male-sender .message-box {
    margin-right: 80px;
  }

  .girl-sender .message-box {
    margin-left: 80px;
  }

  .message-box:after,
  .message-box:before {
      bottom: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
  }

  .girl-sender .message-box:before {
      border-color: rgba(113, 158, 206, 0);
      border-bottom-color: #c2cfd6;
      border-width: 20px;
      left: -21px;
      top: 21px;
      transform: rotate(-90deg);
      margin-left: -19px;
  }

  .girl-sender .message-box:after {
      border-color: rgba(255, 255, 255, 0);
      border-bottom-color: white;
      border-width: 19px;
      left: -19px;
      top: 22px;
      margin-left: -19px;
      transform: rotate(-90deg);
  }

  .male-sender .message-box:before {
      border-color: rgba(113, 158, 206, 0);
      border-bottom-color: #c2cfd6;
      border-width: 20px;
      right: -40px;
      top: 21px;
      transform: rotate(90deg);
      margin-left: -19px;
  }

  .male-sender .message-box:after {
      border-color: rgba(255, 255, 255, 0);
      border-bottom-color: white;
      border-width: 19px;
      right: -38px;
      top: 22px;
      margin-left: -19px;
      transform: rotate(90deg);
  }
</style>
