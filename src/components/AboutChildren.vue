<template>
  <div>
    <div class="row mb-2">
      <div class="col-sm-12 col-md-3">
        <b-form-select
          name="sex"
          v-model="currentChild.sex"
          :options="sexArray" />
      </div>

      <div class="col-12 col-md-7">
        <the-mask
          placeholder="dd/mm/yyyy"
          type="tel"
          mask="##/##/####"
          :masked="true"
          class="form-control"
          v-model="currentChild.birth" />
      </div>

      <div class="col-12 col-md-2 text-right">
        <button class="btn btn-success" @click.prevent="updateChildren">+</button>
      </div>
    </div>

    <div
      class="row mb-2"
      v-for="(child, index) in children"
      :key="index">
      <div class="col-sm-12 col-md-6">
        <b-form-select
          name="gender"
          disabled
          v-model="child.sex"
          :options="sexArray" />
      </div>

      <div class="col-sm-12 col-md-5">
        <b-form-input
          name="date of birth"
          disabled
          v-model="child.birth"
          type="text">
          </b-form-input>
      </div>

      <div class="deleteItem">
        <i @click="removeChild(index)" class="fa fa-trash"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { TheMask } from 'vue-the-mask'

export default {
  name: 'AboutChildren',
  components: {
    TheMask
  },
  props: ['children'],
  data () {
    return {
      currentChild: {
        birth: '',
        sex: ''
      },
      sexArray: [
        {value: '', text: 'Choose'},
        {value: 'male', text: 'Male'},
        {value: 'female', text: 'Female'}
      ]
    }
  },
  methods: {
    updateChildren () {
      if (this.currentChild.sex && this.currentChild.birth) {
        console.log(this.currentChild)
        this.$emit('addChild', this.currentChild)
        this.currentChild = {
          birth: '',
          sex: ''
        }
      }
    },
    removeChild (index) {
      this.$emit('removeChild', index)
    }
  }
}
</script>

<style scoped>
.row {
  position: relative;
}

.deleteItem {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  cursor: pointer;
  font-size: 20px;
  transition: color .25s ease;
}

.deleteItem:hover {
  color: red;
}
</style>
