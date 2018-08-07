<template>
  <form @submit.prevent="validate" novalidate v-if="isReady">
    <div class="row">
      <div class="col-12 text-center avatar">
        <vue-cropper
          v-if="avatar.src || user.avatar"
          :src="avatar.src || user.avatar"
          :aspectRatio=" 1 / 1"
          :guides="false"
          :background="false"
          style="max-width: 400px; margin: 15px auto"
          ref="cropper"/>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            First Name:
          </div>

          <div class="col">
            <b-form-input
              v-model="user.first_name"
              type="text" v-validate="'required|alpha'"
              :class="{'red-shadow': errors.has('first name')}"
              name="first name"
              autocomplete="given-name"
              placeholder="Type in first name here  . . .">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Last Name:
          </div>

          <div class="col">
            <b-form-input
              name="last name"
              autocomplete="family-name"
              v-model="user.last_name" type="text" v-validate="'required|alpha'"
              :class="{'red-shadow': errors.has('last name')}"
              placeholder="Type in last name here  . . .">
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
                  :options="apiFields.month_array"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('month of birth')}"
                />
              </div>

              <div class="col-sm-12 col-md-4">
                <b-form-select
                  name="day of birth"
                  v-model="user.birth.day"
                  :options="apiFields.day_array"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('day of birth')}"
                />
              </div>

              <div class="col-sm-12 col-md-4">
                <b-form-select
                  name="year of birth"
                  v-model="user.birth.year"
                  :options="apiFields.years_array"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('year of birth')}"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row" v-if="!userData">
          <div class="col-sm-12 col-md-3 title">
            Password:
          </div>

          <div class="col">
            <b-form-input
              name="password"
              autocomplete="current-password"
              v-model="user.password"
              type="password" v-validate="'required'"
              :class="{'red-shadow': errors.has('password')}"
              placeholder="Type in password here  . . .">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Translator:
          </div>

          <div class="col">
            <b-form-select
              name="translator"
              v-model="user.translator_id"
              :options="translators_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('translator')}"
              :disabled="currentUser.role === 'translator'"
            />
          </div>
        </div>

      </div>

      <div class="col-sm-12 col-md-6">
        
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Country:
          </div>

          <div class="col">
            <b-form-select
              name="country"
              autocomplete="country-name"
              v-model="user.country"
              :options="apiFields.countries_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('country')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            City:
          </div>

          <div class="col">
            <vue-google-autocomplete
              id="autocomplete_input"
              name="city"
              autocomplete="address-level2"
              ref="city"
              v-model="user.city"
              :value="user.city"
              @placechanged="setAddressData"
              @change="change"
              placeholder="Type in city here . . ."
              :country="user.country"
              types="(cities)"
              v-validate="'required'"
              :classname="(errors.has('city') ? 'form-control red-shadow' : 'form-control')"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Email:
          </div>

          <div class="col">
            <b-form-input
              v-model="user.email"
              name="email"
              type="email"
              autocomplete="email"
              v-validate="'required|email'"
              :class="{'red-shadow': errors.has('email')}"
              placeholder="Type in email here  . . .">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Phone number
          </div>

          <div class="col">
            <b-form-input
              name="mobile"
              v-model="user.mobile"
              autocomplete='tel'
              type="text"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('mobile')}"
              placeholder="Type in your mobile number here . . .">
              </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Facebook:
          </div>

          <div class="col">
            <input
              name="fb"
              type="text"
              v-model="user.facebook"
              v-validate="'required'"
              class="form-control"
              :class="{'red-shadow': errors.has('fb')}" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            VK:
          </div>

          <div class="col">
            <input
              name="vk"
              type="text"
              v-model="user.vk"
              v-validate="'required'"
              class="form-control"
              :class="{'red-shadow': errors.has('vk')}" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Other Social:
          </div>

          <div class="col">
            <input
              name="other social"
              type="text"
              v-model="user.other_social"
              v-validate="'required'"
              class="form-control"
              :class="{'red-shadow': errors.has('other social')}" />
          </div>
        </div>

      </div>
    </div>


    <div class="row">
      <div class="col-12 title-block">
        Appearance:
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Height:
          </div>

          <div class="col">
            <b-form-select
              name="height"
              v-model="user.height_id"
              :options="apiFields.height_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('height')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Weight:
          </div>

          <div class="col">
            <b-form-select
              name="weight"
              v-model="user.weight_id"
              :options="apiFields.weight_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('weight')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Body Style:
          </div>

          <div class="col">
            <b-form-select
              name="body style"
              v-model="user.body_style"
              :options="apiFields.body_style_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('body style')}" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Eyes Color:
          </div>

          <div class="col">
            <b-form-select
              name="eyes color"
              v-model="user.eyes_id"
              :options="apiFields.eyes_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('eyes color')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Eye Wear:
          </div>

          <div class="col">
            <b-form-select
              name="eye wear"
              v-model="user.eye_wear"
              :options="apiFields.eye_wear_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('eye wear')}" />
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Hair Color:
          </div>

          <div class="col">
            <b-form-select
              name="hair color"
              v-model="user.hair_color_id"
              :options="apiFields.hair_colors_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('hair color')}" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Hair Length:
          </div>

          <div class="col">
            <b-form-select
              name="hair_length"
              v-model="user.hair_length_id"
              :options="apiFields.hair_lengths_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('hair_length')}"
            />
          </div>
        </div>

      </div>
    </div>

    <div class="row">
      <div class="col-12 title-block">
        Lifestyle, education and work:
      </div>
      

      <div class="col-md-6">

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Martial Status:
          </div>

          <div class="col">
            <b-form-select
              name="marital status"
              v-model="user.marital_status_id"
              :options="apiFields.marital_statuses_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('marital status')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Children:
          </div>

          <div class="col">
            <b-form-select
              name="has children"
              v-model="user.children"
              :options="apiFields.children_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('has children')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <about-children
              v-if="user.children && user.children !== 2"
              @addChild="user.about_children.unshift($event)"
              @removeChild="user.about_children.splice($event, 1)"
              :children="user.about_children"/>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Want Children:
          </div>

          <div class="col">
            <b-form-select
              name="want children"
              v-model="user.want_children_id"
              :options="apiFields.want_children_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('want children')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Do you smoke ?
          </div>

          <div class="col">
            <b-form-select
              name="smoke"
              v-model="user.smoke_id"
              :options="apiFields.smoke_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('smoke')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Do you drink ?
          </div>

          <div class="col">
            <b-form-select
              name="drink"
              v-model="user.drink_id"
              :options="apiFields.drink_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('drink')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Field of work:
          </div>

          <div class="col">
            <b-form-select
              name="field of work"
              v-model="user.field_of_work"
              :options="apiFields.field_of_work_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('field of work')}" />
          </div>
        </div>

      </div>

      <div class="col-12 col-md-6">

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Religion:
          </div>

          <div class="col">
            <b-form-select
              name="religion"
              v-model="user.religion_id"
              :options="apiFields.religions_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('religion')}" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Education:
          </div>

          <div class="col">
            <b-form-select
              name="education"
              v-model="user.education_id"
              :options="apiFields.education_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('education')}"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Employment status:
          </div>

          <div class="col">
            <b-form-select
              name="employment tatus"
              v-model="user.employment_status"
              :options="apiFields.employment_status_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('employment tatus')}" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Living situation:
          </div>

          <div class="col">
            <b-form-select
              name="living situation"
              v-model="user.living_situation"
              :options="apiFields.living_situation_array"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('living situation')}"/>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            About my family:
          </div>

          <div class="col-sm-12 col-md-9">
            <textarea
              class="form-control"
              name="about family"
              v-model="user.about_family"
              rows="4"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('about family')}"
              placeholder="Type in short description here . . .">
            </textarea>
          </div>
        </div>

        <div class="row">
           <div class="col-sm-12 col-md-3 title">
            My Languages:
          </div>
          <div class="col-sm-12 col-md-8">
            <Languages
            @addLanguage="user.languages.unshift($event)"
            @updateLanguage="user.languages.splice($event, 1)"
            :languages="user.languages" />
          </div>
        </div>

      </div>
    </div>

    <div class="row" v-if="!userData">
      <div class="col-sm-12 col-md-3 title">
        Picture:
      </div>

      <div class="col">
        <input
          name="avatar"
          id="upload"
          type="file"
          accept="image/*"
          v-validate="'required|image'"
          @change="inputChange"
          :class="{'red-shadow': errors.has('avatar')}" />
        <label class="pull-left" for="upload">
          <i class="fa fa-upload" aria-hidden="true" v-show="inputFileText === 'Add image'"></i> {{ inputFileText }}
        </label>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-3 title">
        More about me:
      </div>

      <div class="col-sm-12 col-md-9">
        <textarea
          name="about me"
          v-model="user.about_me"
          required rows="4"
          v-validate="'required'"
          class="form-control"
          :class="{'red-shadow': errors.has('about me')}"
          placeholder="Type in your message here . . .">
        </textarea>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-3 title">
        The one I would like to meet :
      </div>

      <div class="col-sm-12 col-md-9">
        <textarea
          name="like to meet"
          v-model="user.like_to_meet"
          required rows="4"
          v-validate="'required'"
          class="form-control"
          :class="{'red-shadow': errors.has('like to meet')}"
          placeholder="Describe your future partner . . .">
        </textarea>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-3 title">
        My future goals :
      </div>

      <div class="col-sm-12 col-md-9">
        <textarea
          name="future goals"
          v-model="user.future_goals"
          required rows="4"
          v-validate="'required'"
          class="form-control"
          :class="{'red-shadow': errors.has('future goals')}"
          placeholder="Describe your future goals . . .">
        </textarea>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-3 title">
        Partnter age:
      </div>

      <div class="col-sm-5 col-md-2">
        <b-form-select
          name="match from"
          v-model="user.match.from"
          :options="apiFields.match_array"
          v-validate="'required'"
          :class="{'red-shadow': errors.has('match from')}"
        />
      </div>

      <div class="col-sm-2 col-md-1 title tx-center">
        To
      </div>

      <div class="col-sm-5 col-md-2">
        <b-form-select
          name="match to"
          v-model="user.match.to"
          :options="apiFields.match_array"
          v-validate="'required'"
          :class="{'red-shadow': errors.has('match to')}"
        />
      </div>
    </div>

    <div class="row mt-4 checkboxes">
      <div class="col-sm-6 col-md-3" v-for="(interest, index) in apiFields.interests_array" :key="index">
        <label :title="interest.text">
          <input
            type="checkbox"
            :value="index + 1"
            v-model="user.interest_id" />
          {{ interest.text }}
        </label>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-3 title">
        Leisure time :
      </div>

      <div class="col-sm-12 col-md-9">
        <textarea
          name="leisure time"
          v-model="user.leisure_time"
          required rows="4"
          v-validate="'required'"
          class="form-control"
          :class="{'red-shadow': errors.has('leisure time')}"
          placeholder="Describe your leisure time . . .">
        </textarea>
      </div>
    </div>

    <div class="mt-5" >
      <button
        type="submit"
        class="btn btn-success">
        {{ userData ? 'Update' : 'Create'}}
      </button>

      <button
        class="btn btn-danger ml-5"
        @click.prevent="cancel">
        Cancel
      </button>
    </div>
  </form>
</template>

<script>
import Vue from 'vue'
import { API_URL } from '@/settings.js'
import router from '@/router'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import Languages from '@/components/Languages'
import AboutChildren from '@/components/AboutChildren'
import VueCropper from 'vue-cropperjs'

export default {
  name: 'GirlCreate',
  props: ['userData'],
  components: { VueGoogleAutocomplete, Languages, AboutChildren, VueCropper },
  data () {
    return {
      inputFileText: 'Add image',
      avatar: {
        src: ''
      },
      isReady: false,
      apiFields: {},
      currentUser: {},
      image: null,
      translators_array: [{value: '', text: 'Choose'}],
      user: {
        role: 'girl',
        about_my_family: '',
        about_me: '',
        country: '',
        about_children: [],
        city: '',
        birth: {
          day: '',
          year: '',
          month: ''
        },
        match: {
          from: '',
          to: ''
        },
        interest_id: [],
        height_id: '',
        leisure_time: '',
        weight_id: '',
        body_style: '',
        employment_status: '',
        eye_wear: '',
        want_children_id: '',
        eyes_id: '',
        field_of_work: '',
        marital_status_id: '',
        hair_color_id: '',
        like_to_meet: '',
        future_goals: '',
        hair_length_id: '',
        children: '',
        religion_id: '',
        education_id: '',
        living_situation: '',
        smoke_id: '',
        drink_id: '',
        translator_id: '',
        languages: [],
        vk: '',
        facebook: ''
      }
    }
  },
  created () {
    this.apiFields = Object.assign({}, this.$root.apiArrays)
    this.apiFields.match_array = this.getMatchArray()
    this.currentUser = Object.assign({}, this.$root.currentUser)

    this.apiFields.field_of_work_array = this.apiFields.field_of_work_array.filter((field) => {
      let exclude = ['Automotive/Aviation/Aerospace']
      return exclude.indexOf(field.text) === -1
    })

    this.apiFields.religions_array = this.apiFields.religions_array.filter((religion) => {
      let exclude = ['Agnostic', 'Anglican', 'Hindu', 'Lutheran', 'Methodist', 'Pagan', 'Presbyterian', 'Quaker', 'Sikh']
      return exclude.indexOf(religion.text) === -1
    })

    this.apiFields.field_of_work_array = this.apiFields.field_of_work_array.filter(field => {
      let exlude = ['Technical', 'Transportation']
      return exlude.indexOf(field.text) === -1
    })

    if (this.userData) {
      this.user = Object.assign({}, this.userData)
    }

    if (this.currentUser.role === 'translator') {
      this.translators_array.push({value: this.currentUser.id, text: this.currentUser.first_name + ' ' + this.currentUser.last_name})
      return
    }

    ([].concat(this.$root.staff.translators)).forEach((e) => {
      this.translators_array.push({value: e.id, text: e.first_name + ' ' + e.last_name})
    })

    this.isReady = true
  },
  watch: {
    userData (newVal, oldVal) {
      console.log(newVal)
    }
  },
  methods: {
    setAddressData (addressData) {
      this.user.city = addressData.locality
    },
    getMatchArray: () => {
      let years = [{value: '', text: 'Choose'}]
      for (var i = 19; i < 71; i++) {
        years.push(i)
      }
      return years
    },
    change (event) {
      if (event.length === 0) {
        this.user.city = ''
      }
    },
    cancel () {
      router.push({name: 'females'})
    },
    createUser () {
      let image = document.querySelector('input[type=file]')
      let file = image.files[0]
      let cropp = this.$refs.cropper.getData()
      let formData = new FormData()
      formData.append('avatar', file)
      formData.append('avatar_x', cropp.x.toFixed())
      formData.append('avatar_y', cropp.y.toFixed())
      formData.append('avatar_height', cropp.height.toFixed())
      formData.append('avatar_width', cropp.width.toFixed())

      for (let key in this.user) {
        formData.append(key, this.user[key])
      }

      formData.delete('interest_id')
      formData.append('birth[day]', this.user.birth.day)
      formData.append('birth[month]', this.user.birth.month)
      formData.append('birth[year]', this.user.birth.year)
      formData.append('match[from]', this.user.match.from)
      formData.append('match[to]', this.user.match.to)

      for (var j = 0; j < this.user.interest_id.length; j++) {
        formData.append('interest_id[]', this.user.interest_id[j])
      }

      formData.append('languages', JSON.stringify(this.user.languages))
      formData.append('about_children', JSON.stringify(this.user.about_children))

      Vue.axios.post(API_URL + 'admin/user/create', formData).then((responce) => {
        this.$toastr('success', responce.data.message, '')
        router.push({name: 'females'})
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
    updateUser () {
      Vue.axios.put(API_URL + 'admin/user/' + this.user.id, this.user).then((responce) => {
        if (responce.status && responce.status === 200) {
          this.$toastr('success', responce.data.message, '')
          router.push({name: 'females'})
        }
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
    validate () {
      let errorArray = []
      let error = 1
      let isEnglishLang = false
      let isRussianLang = false

      error *= this.user.city.length
      if (this.user.city.length === 0) errorArray.push('The city field is required')

      if (this.user.children && this.user.children !== 2) {
        if (this.user.about_children.length === 0) {
          error *= false
          errorArray.push('The about children field is required')
        }
      }

      if (this.user.interest_id.length < 5) {
        error *= false
        errorArray.push('Minimum 5 interests are required')
      }

      this.user.languages.forEach((lang) => {
        let currentLanguage = parseInt(lang.lang)
        if (currentLanguage === 1) {
          isEnglishLang = true
        }

        if (currentLanguage === 2) {
          isRussianLang = true
        }
      })

      if (!isEnglishLang) {
        error *= false
        errorArray.push('English language is required')
      }

      if (!isRussianLang) {
        error *= false
        errorArray.push('Russian language is required')
      }

      this.$validator.validateAll().then((result) => {
        if (result && error) {
          if (this.userData) {
            this.updateUser()
          } else {
            this.createUser()
          }
          return
        }

        this.$validator.errors.items.forEach((element) => {
          this.$toastr('error', element.msg)
        })

        errorArray.forEach((element) => {
          this.$toastr('error', element)
        })
      })
    },
    inputChange () {
      let input = document.querySelector('#upload')
      let self = this

      if (input.files.length === 1) {
        let reader = new FileReader()

        this.inputFileText = input.files[0].name
        reader.onload = function (e) {
          self.avatar.src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      } else {
        this.inputFileText = 'Add image'
      }
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
    white-space: nowrap;
  }

  .title-block {
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 15px;
    font-weight: 700;
    min-height: 25px;
  }

  .tx-center{
    justify-content: center;
  }

  label {
    white-space: nowrap;
  }

  textarea {
    resize: none;
    width: 100%;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .red-shadow {
    box-shadow: 0 0 8px 2px red;
  }

  .avatar > img {
    max-height: 100%;
    max-width: 300px;
    margin-bottom: 20px;
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

  .checkboxes label {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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