<template>
  <div class="animated fadeIn">
    <b-card>
      <div slot="header" class="header">
        {{ (id ? 'Edit' : 'Add') + ' Blog'}}
        <button
          v-if="id && isReady"
          class="btn btn-danger btn-sm pull-right"
          @click="deleteBlog()">
          Delete Blog
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
                Title:
              </div>

              <div class="col">
                <b-form-input
                  v-model="blog.title"
                  name="title"
                  type="text"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('title')}"
                  placeholder="Type in title name here  . . .">
                </b-form-input>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 col-md-3 title">
                Description:
              </div>

              <div class="col">
                <textarea
                  class="form-control"
                  rows="4"
                  v-model="blog.description"
                  name="description"
                  type="text"
                  v-validate="{ required: true, max: 300 }"
                  :class="{'red-shadow': errors.has('description')}"
                  placeholder="Type in description here  . . .">
                </textarea>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <editor
                  :content="blog.post"
                  :auto-height="true"
                  @change="editorChange">
                </editor>
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
            :src="id ? blog.image : '/static/img/default-avatar.jpg'"
            id="blog-image"
            alt="story image" />

          <div class="comments mt-5 pt-3">
            <div
              v-for="(comment, index) in filteredComments"
              :key="index"
              class="comment">
              <div class="name">
                {{ comment.name }}
              </div>

              <div class="date">
                {{ comment.created_at }}
              </div>

              <textarea
                class="form-control mb-2"
                v-model="comment.comment"
                rows="4">
              </textarea>

              <button
                @click="updateComment(comment.id)"
                class="btn btn-outline-success">
                Update
              </button>

              <button
                @click="deleteComment(comment.id)"
                class="btn btn-outline-danger pull-right">
                Delete
              </button>
            </div>
          </div>

          <b-pagination
            size="md"
            v-model="currentPage"
            v-show="blog.comments.length > itemsPerPage"
            :total-rows="blog.comments.length"
            :per-page="itemsPerPage"
            class="justify-content-center">
          </b-pagination>
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
    name: 'NewBlog',
    props: ['id'],
    data () {
      return {
        isReady: false,
        inputFileText: 'Add image',
        blog: {
          title: '',
          post: '',
          description: '',
          image: '',
          comments: []
        },
        currentPage: 1,
        itemsPerPage: 5
      }
    },
    created () {
      if (this.id) {
        this.getBlogInfo()
      } else {
        this.isReady = true
      }
    },
    methods: {
      inputChange () {
        let input = document.querySelector('#upload')
        let image = document.querySelector('#blog-image')

        if (input.files.length === 1) {
          this.inputFileText = input.files[0].name
          this.blog.image = 'image'
          let reader = new FileReader()
          reader.onload = function (e) {
            image.src = e.target.result
          }
          reader.readAsDataURL(input.files[0])
        }
      },
      editorChange (e) {
        this.blog.post = e
      },
      deleteBlog () {
        if (confirm('Delete this blog ?')) {
          this.isReady = false
          Vue.axios.delete(API_URL + 'admin/blog/posts/' + this.id + '/remove').then((responce) => {
            this.$toastr('success', responce.data.message)
            router.push({name: 'blog list'})
          }).catch((e) => {
            this.$toastr('error', JSON.parse(e.request.response).message)
            this.isReady = true
          })
        }
      },
      validate () {
        if (this.blog.image.length === 0) {
          this.$toastr('error', 'The image is required')
          return
        }

        if (this.blog.post.match(/<img/g)) {
          this.$toastr('error', 'Images not allowed inside blog text')
          return
        }

        if (this.blog.post.replace(/<[^>]*>/g, '').length === 0) {
          this.$toastr('error', 'The blog text is required')
          return
        }

        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.id) {
              this.sendData('admin/blog/posts/' + this.id + '/update')
            } else {
              this.sendData('admin/blog/posts/create')
            }
            return
          }

          this.$validator.errors.items.forEach((element) => {
            this.$toastr('error', element.msg)
          })
        })
      },
      getBlogInfo () {
        Vue.axios.get(API_URL + 'admin/blog/posts/' + this.id).then((responce) => {
          this.blog = responce.data.data
          this.isReady = true
        }).catch(e => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      sendData (path) {
        this.isReady = false
        let data = this.prepareItem()
        Vue.axios.post(API_URL + path, data).then((responce) => {
          this.$toastr('success', responce.data.message)
          router.push({name: 'blog list'})
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      updateComment (id) {
        this.isReady = false
        let commentIndex = this.blog.comments.findIndex((element) => {
          if (element.id === id) {
            return element
          }
        })

        Vue.axios.post(API_URL + 'admin/blog/comments/' + id + '/update', this.blog.comments[commentIndex]).then((responce) => {
          this.$toastr('success', responce.data.message)
          this.getBlogInfo()
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isReady = true
        })
      },
      deleteComment (id) {
        if (confirm('Delete this comment ?')) {
          this.isReady = false
          Vue.axios.delete(API_URL + 'admin/blog/comments/' + id + '/remove').then((responce) => {
            this.$toastr('success', responce.data.message)
            this.getBlogInfo()
          }).catch((e) => {
            this.$toastr('error', JSON.parse(e.request.response).message)
            this.isReady = true
          })
        }
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
        router.push({name: 'blog list'})
      },
      prepareItem () {
        let input = document.querySelector('#upload')
        let formData = new FormData()

        formData.append('title', this.blog.title)
        formData.append('post', this.blog.post)
        formData.append('description', this.blog.description)

        if (input.files[0]) {
          formData.append('image', input.files[0])
        } else {
          formData.append('image', this.blog.image)
        }

        return formData
      }
    },
    computed: {
      filteredComments () {
        return this.blog.comments.slice((this.currentPage * this.itemsPerPage) - this.itemsPerPage, this.currentPage * this.itemsPerPage)
      }
    }
  }
</script>

<style scoped>
  .vue-html5-editor {
    border: 1px solid #c2cfd6;
    border-radius: 0;
  }

  .comments {
    text-align: left;
  }

  .comment {
    position: relative;
    margin-bottom: 50px;
  }

  .comment > .name,
  .comment > .date {
    position: absolute;
    top: -20px;
    font-size: 12px;
  }

  .comment > .name {
    left: 0;
  }

  .comment > .date {
    right: 0;
  }

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

  #blog-image {
    max-width: 100%;
    max-height: 512px;
  }
</style>