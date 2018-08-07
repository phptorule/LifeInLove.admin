<template>
  <div class="animated fadeIn">
    <div class="loader mx-auto mt-5" v-if="!isReady"></div>

    <b-card v-if="isReady" header="Messages" no-block>
      <div class="card-body">
        <div class="wrapper">
          <div class="inner-sidebar">
            <ul v-if="getCurrentRole() === 'admin'" class="nav">
              <li class="nav-item" v-for="manager in staffInfo" :key="manager.id">
                <template v-if="manager.translators.length === 0">
                  <SidebarNavTitle :name="manager.first_name + ' ' + manager.last_name"/>
                </template>

                <template v-if="manager.translators.length > 0">
                  <InnerNavDropdown :name="manager.first_name + ' ' + manager.last_name">
                    <li
                      class="nav-item"
                      v-for="translator in manager.translators"
                      :key="translator.id">
                      <template v-if="translator.girls.length === 0">
                        <SidebarNavTitle :name="translator.first_name + ' ' + translator.last_name"/>
                      </template>

                      <template v-if="translator.girls.length > 0">
                        <InnerNavDropdown :name="translator.first_name + ' ' + translator.last_name">
                          <li
                            class="nav-item"
                            v-for="girl in translator.girls"
                            :key="girl.id"
                            @click="getDialogs(girl.id)"
                            :class="{'selected': selectedGirlId === girl.id}">
                            {{ girl.first_name + ' ' + girl.last_name }}
                          </li>
                        </InnerNavDropdown>
                      </template>
                    </li>
                  </InnerNavDropdown>
                </template>
              </li>
            </ul>

            <ul v-else-if="getCurrentRole() === 'manager'" class="nav">
              <li
                class="nav-item"
                v-for="translator in staffInfo"
                :key="translator.id">
                <template v-if="translator.girls.length === 0">
                  <SidebarNavTitle :name="translator.first_name + ' ' + translator.last_name"/>
                </template>

                <template v-if="translator.girls.length > 0">
                  <InnerNavDropdown :name="translator.first_name + ' ' + translator.last_name">
                    <li
                      class="nav-link"
                      v-for="(girl, index) in translator.girls"
                      :key="index"
                      @click="getDialogs(girl.id)"
                      :class="{'selected': selectedGirlId === girl.id}">
                      {{ girl.first_name + ' ' + girl.last_name }}
                    </li>
                  </InnerNavDropdown>
                </template>
              </li>
            </ul>

            <ul v-else-if="getCurrentRole() === 'translator'" class="nav">
              <li
                class="nav-link"
                v-for="(girl, index) in staffInfo"
                :key="index"
                @click="getDialogs(girl.id)"
                :class="{'selected': selectedGirlId === girl.id}">
                {{ girl.first_name + ' ' + girl.last_name }}
              </li>
            </ul>
          </div>

          <div class="dialog-wrapper" v-if="currentState === 'dialogs'">
            <div class="warning-message" v-show="initial">Select Girl</div>
            <div class="warning-message" v-show="dialogs.length === 0 && !initial && isDialogsLoaded">This girl has no dialogs</div>
            <div class="warning-message" v-show="!isDialogsLoaded"><div class="loader"></div></div>

            <div
              class="dialog-holder"
              v-for="(dialog, index) in dialogs"
              :key="index"
              v-show="isDialogsLoaded"
              @click="goToMessage(dialog.id, index)">
              <div class="receiver-info mr-2">
                <img :src="dialog.receiver_avatar" >
                <span>{{ dialog.receiver_first_name + ' ' + dialog.receiver_last_name + ', ' + dialog.receiver_profile_id }}</span>
              </div>

              <div class="last-message">
                Last message: {{ dialog.last_message.message}}
              </div>

              <div>
                Unread:
                <span
                  class="badge"
                  :class="{'badge-danger': dialog.unread > 0, 'badge-success': dialog.unread === 0}">
                  {{ dialog.unread }}
                </span>
              </div>
            </div>
          </div>

          <TranslationBox
            :dialogId="dialogId"
            :senderId="selectedGirlId"
            :clientAvatar="clientAvatar"
            :girlAvatar="girlAvatar"
            v-if="currentState === 'translation'" />
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { API_URL } from '@/settings.js'
  import { InnerNavDropdown, SidebarNavLink, TranslationBox, SidebarNavTitle } from '@/components'

  export default {
    name: 'Messages',
    components: {
      InnerNavDropdown,
      SidebarNavLink,
      TranslationBox,
      SidebarNavTitle
    },
    data () {
      return {
        staffInfo: [],
        dialogs: [],
        dialogId: null,
        isReady: false,
        currentState: 'dialogs',
        clientAvatar: '',
        girlAvatar: '',
        selectedGirlId: 0,
        selecterGirlPublicId: '',
        isDialogsLoaded: true,
        initial: true
      }
    },
    mounted () {
      this.getMessages()
    },
    methods: {
      getMessages () {
        Vue.axios.get(API_URL + 'admin/user/message/members').then((responce) => {
          this.staffInfo = responce.data.data
          this.isReady = true
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
        })
      },
      getCurrentRole () {
        return this.$root.currentUser.role
      },
      getDialogs (id) {
        this.selectedGirlId = id
        this.initial = false
        this.isDialogsLoaded = false
        Vue.axios.get(API_URL + 'admin/user/message/dialogs/' + id).then((responce) => {
          this.currentState = 'dialogs'
          this.dialogs = responce.data.data
          this.isDialogsLoaded = true
        }).catch((e) => {
          this.$toastr('error', JSON.parse(e.request.response).message)
          this.isDialogsLoaded = true
        })
      },
      goToMessage (id, index) {
        this.clientAvatar = this.dialogs[index].receiver_avatar
        this.girlAvatar = this.dialogs[index].avatar
        this.dialogId = id
        this.currentState = 'translation'
      }
    }
  }
</script>

<style scoped>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .selected {
    color: #fff;
    background-color: #20a8d8!important;
  }

  .btn-cancel {
    width: 80px;
  }

  .card-body {
    padding: 0;
    position: relative;
  }

  .wrapper {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .active {
    background-color: #20a8d8;
  }

  .dialog-wrapper {
    width: calc(100% - 210px);
    padding-right: 10px;
  }

  .dialog-holder {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 70px;
    border: 1px solid #c2cfd6;
    margin: 10px 0;
    padding: 5px 10px;
    cursor: pointer;
  }

  .warning-message {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .receiver-info img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .last-message {
    height: 21px;
    white-space: nowrap;
    max-width: 40%;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
  }
</style>