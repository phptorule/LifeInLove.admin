<template>
  <form @submit.prevent="validate" novalidate>
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
              type="text"
              v-validate="'required|alpha'"
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
              v-model="user.last_name"
              type="text"
              v-validate="'required|alpha'"
              :class="{'red-shadow': errors.has('last name')}"
              placeholder="Type in last name here  . . .">
            </b-form-input>
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
            Mobile №:
          </div>

          <div class="col">
            <b-form-input
              v-model="user.mobile"
              name="mobile"
              autocomplete="tel"
              type="text"
              placeholder="Type in mobile number here  . . .">
            </b-form-input>
          </div>
        </div>

        <div class="row" v-if="!userData">
          <div class="col-sm-12 col-md-3 title">
            Password:
          </div>

          <div class="col">
            <b-form-input
              name="password"
              v-model="user.password"
              type="password"
              autocomplete="current-password"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('password')}"
              placeholder="Type in password here  . . .">
            </b-form-input>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Membership:
          </div>

          <div class="col">
            <b-form-select
              name="membership subscribtion"
              v-model="user.value_id"
              :options="memberships_aray"
              v-validate="'required'"
              :class="{'red-shadow': errors.has('membership subscribtion')}"
            />
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Birth Date:
          </div>

          <div class="col">
            <div class="row mb-0 b-date">
              <div class="col-sm-12 col-md-4">
                <b-form-select
                  name="birth month"
                  v-model="user.birth.month"
                  :options="apiFields.month_array"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('birth month')}"
                />
              </div>

              <div class="col-sm-12 col-md-4">
                <b-form-select
                  name="birth day"
                  v-model="user.birth.day"
                  :options="apiFields.day_array"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('birth day')}"
                />
              </div>

              <div class="col-sm-12 col-md-4">
                <b-form-select
                  name="birth year"
                  v-model="user.birth.year"
                  :options="apiFields.years_array"
                  v-validate="'required'"
                  :class="{'red-shadow': errors.has('birth year')}"
                />
              </div>
            </div>
          </div>
        </div>

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
              ref="city"
              v-model="user.city"
              :value="user.city"
              autocomplete="address-level2"
              @placechanged="setAddressData"
              @change="change"
              placeholder="Type in city here  . . ."
              :country="user.country"
              types="(cities)"
              v-validate="'required'"
              :classname="(errors.has('city') ? 'form-control red-shadow' : 'form-control')"
            />
          </div>
        </div>

        <div class="row" v-if="userData">
          <div class="col-sm-12 col-md-3 title">
            Credits:
          </div>

          <div class="col">
            <b-form-input
              name="credits"
              v-model="user.credits"
              type="text"
              v-validate="'required|numeric'"
              :class="{'red-shadow': errors.has('credits')}"
              placeholder="Type in credits here  . . .">
            </b-form-input>
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
              @change="inputChange" />
            <label class="pull-left" for="upload">
              <i class="fa fa-upload" aria-hidden="true" v-show="inputFileText === 'Add image'"></i> {{ inputFileText }}
            </label>
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
              :options="apiFields.height_array" />
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
              :options="apiFields.weight_array" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Eyes Color:
          </div>

          <div class="col">
            <b-form-select
              name="eyes"
              v-model="user.eyes_id"
              :options="apiFields.eyes_array" />
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
              :options="apiFields.body_style_array" />
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
              name="hair_color"
              v-model="user.hair_color_id"
              :options="apiFields.hair_colors_array" />
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
              :options="apiFields.hair_lengths_array" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Eye Wear:
          </div>

          <div class="col">
            <b-form-select
              name="eye_wear"
              v-model="user.eye_wear"
              :options="apiFields.eye_wear_array" />
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Ethnicities:
          </div>

          <div class="col">
            <b-form-select
              name="ethnicity"
              v-model="user.ethnicity_id"
              :options="this.ethnicity_select_array"/>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Religion:
          </div>

          <div class="col">
            <b-form-select
              name="religion"
              v-model="user.religion_id"
              :options="apiFields.religions_array"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 title-block">
        Lifestyle
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Martial Status:
          </div>

          <div class="col">
            <b-form-select
              name="marital status"
              v-model="user.marital_status_id"
              :options="apiFields.marital_statuses_array" />
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Children:
          </div>

          <div class="col">
            <b-form-select
              name="has children"
              v-model="user.children"
              :options="apiFields.children_array" />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <about-children
              v-if="user.children !== 2 && user.children !== ''"
              @addChild="user.about_children.unshift($event)"
              @removeChild="user.about_children.splice($event, 1)"
              :children="user.about_children"/>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Do you drink ?
          </div>

          <div class="col">
            <b-form-select
              name="drink"
              v-model="user.drink_id"
              :options="apiFields.drink_array"
            />
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Do you smoke ?
          </div>

          <div class="col">
            <b-form-select
              name="smoke"
              v-model="user.smoke_id"
              :options="apiFields.smoke_array"
            />
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Want Children:
          </div>

          <div class="col">
            <b-form-select
              name="want children"
              v-model="user.want_children_id"
              :options="apiFields.want_children_array"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Preferred age:
          </div>

          <div class="col-sm-5 col-md-4">
            <b-form-select
              name="match from"
              v-model="user.match.from"
              :options="apiFields.match_array" />
          </div>

          <div class="col-sm-2 col-md-1 title">
            To
          </div>

          <div class="col-sm-5 col-md-4">
            <b-form-select
              name="match to"
              v-model="user.match.to"
              :options="apiFields.match_array" />
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 title-block">
        Work and background:
      </div>

      <div class="col-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Education:
          </div>

          <div class="col">
            <b-form-select
              name="education"
              v-model="user.education_id"
              :options="apiFields.education_array" />
          </div>
        </div>
      </div>

      <div class="col-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Living situation:
          </div>

          <div class="col">
            <b-form-select
              name="situation"
              v-model="user.living_situation"
              :options="apiFields.living_situation_array" />
          </div>
        </div>
      </div>

      <div class="col-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Field of work:
          </div>

          <div class="col">
            <b-form-select
              name="field of work"
              v-model="user.field_of_work"
              :options="apiFields.field_of_work_array" />
          </div>
        </div>
      </div>

      <div class="col-6">
        <div class="row">
          <div class="col-sm-12 col-md-3 title">
            Employment status:
          </div>

          <div class="col">
            <b-form-select
              name="employment status"
              v-model="user.employment_status"
              :options="apiFields.employment_status_array" />
          </div>
        </div>
      </div>

      <div class="col-12 title-block">
        My languages:
      </div>

      <div class="col-6">
        <Languages
          :languages="user.languages"
          @addLanguage="user.languages.unshift($event)"
          @updateLanguage="user.languages.splice($event, 1)"/>
      </div>
    </div>

    <div class="row">
      <div class="col-12 title-block">
        Interests:
      </div>

      <div class="col-sm-12 col-md-3 title">
        More about me:
      </div>

      <div class="col-sm-12 col-md-9 mb-3">
        <textarea
          name="message"
          v-model="user.about_me"
          required
          rows="4"
          class="form-control"
          placeholder="Type in message here  . . .">
        </textarea>
      </div>

      <div class="col-sm-12 col-md-3 title">
        The one I would like to meet:
      </div>

      <div class="col-sm-12 col-md-9 mb-3">
        <textarea
          name="like to meet"
          v-model="user.like_to_meet"
          rows="4"
          class="form-control"
          placeholder="Describe your future partner . . .">
        </textarea>
      </div>
    </div>

    <div class="row mt-4 checkboxes">
      <div
        class="col-sm-6 col-md-3"
        v-for="(interest, index) in apiFields.interests_array" :key="index"
        :title="interest.text">
        <label>
          <input
            type="checkbox"
            :value="index + 1"
            v-model="user.interest_id"
          />
          {{ interest.text }}
        </label>
      </div>
    </div>

    <div class="mt-5" >
      <button
        type="submit"
        class="btn btn-success">
        {{ userData ? 'Update' : 'Create' }}
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
import router from '@/router'
import { API_URL } from '@/settings.js'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import Languages from '@/components/Languages'
import AboutChildren from '@/components/AboutChildren'

export default {
  name: 'UserCreate',
  components: { VueGoogleAutocomplete, Languages, AboutChildren },
  props: ['userData'],
  data () {
    return {
      inputFileText: 'Add image',
      apiFields: {},
      memberships_aray: [{value: '', text: 'Choose'}],
      ethnicity_select_array: [{value: '', text: 'Choose'}],
      image: null,
      avatar: {
        src: ''
      },
      user: {
        about_me: '',
        about_children: [],
        role: 'client',
        body_style: '',
        birth: {
          day: '',
          year: '',
          month: ''
        },
        credits: 0,
        country: '',
        children: '',
        city: '',
        drink_id: '',
        eye_wear: '',
        eyes_id: '',
        religion_id: '',
        ethnicity_id: '',
        want_children_id: '',
        education_id: '',
        employment_status: '',
        match: {
          from: '',
          to: ''
        },
        interest_id: [],
        living_situation: '',
        like_to_meet: '',
        languages: [],
        mobile: '',
        height_id: '',
        weight_id: '',
        field_of_work: '',
        smoke_id: '',
        marital_status_id: '',
        hair_color_id: '',
        hair_length_id: '',
        membership_id: '',
        value_id: ''
      }
    }
  },
  created () {
    let arr = [...this.$root.memberships]
    this.apiFields = Object.assign({}, this.$root.apiArrays)
    this.ethnicity_select_array = [...this.ethnicity_select_array, ...this.apiFields.ethnicities_array]
    arr.forEach(e => {
      e.values.forEach(value => {
        this.memberships_aray.push({value: value.id, text: e.name + ' for ' + value.month + ' months', memb_id: e.id})
      })
    })

    if (this.userData) {
      this.user = Object.assign({}, this.userData)
    }
  },
  methods: {
    setAddressData (addressData) {
      this.user.city = addressData.locality
    },
    change (event) {
      if (event.length === 0) {
        this.user.city = ''
      }
    },
    cancel () {
      router.push({name: 'males'})
    },
    createUser () {
      let image = document.querySelector('input[type=file]')
      let file = image.files[0]
      let formData = new FormData()

      if (this.$refs.cropper) {
        const cropp = this.$refs.cropper.getData()
        formData.append('avatar', file)
        formData.append('avatar_x', cropp.x.toFixed())
        formData.append('avatar_y', cropp.y.toFixed())
        formData.append('avatar_height', cropp.height.toFixed())
        formData.append('avatar_width', cropp.width.toFixed())
      } else {
        formData.append('avatar', '')
        formData.append('avatar_x', 0)
        formData.append('avatar_y', 0)
        formData.append('avatar_height', 500)
        formData.append('avatar_width', 500)
      }

      for (let key in this.user) {
        formData.append(key, this.user[key])
      }

      formData.append('about_children', JSON.stringify(this.user.about_children))

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

      Vue.axios.post(API_URL + 'admin/user/create', formData).then((responce) => {
        this.$toastr('success', responce.data.message, '')
        router.push({name: 'males'})
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
          this.$toastr('success', responce.data.message)
          router.push({name: 'males'})
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
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.memberships_aray.forEach(e => {
            if (e.value === this.user.value_id) {
              this.user.membership_id = e.memb_id
            }
          })

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

  .avatar > img {
    max-height: 300px;
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