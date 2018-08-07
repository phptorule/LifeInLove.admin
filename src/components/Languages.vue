<template>
  <div>
    <div class="row mb-2">
      <div class="col-sm-12 col-md-5 mb-3 mb-lg-0 pr-md-1">
        <b-form-select
          name="language"
          v-model="currentLanguage.lang"
          :options="$root.apiArrays.primary_language_array" />
      </div>

      <div class="col-sm-12 col-md-5 mb-3 pl-md-1">
        <b-form-select
          name="level"
          v-model="currentLanguage.level"
          :options="$root.apiArrays.language_level_array" />
      </div>

      <div class="col-12 col-md-2 mb-3 pl-md-1">
        <button @click.prevent="addLanguage" class="btn btn-success w-100">+</button>
      </div>
    </div>

    <div
      class="row mb-2"
      v-for="(language, index) in languages"
      :key="index">
      <div class="col-sm-10 col-md-6">
        <b-form-select
          name="language"
          v-model="language.lang"
          disabled
          :options="$root.apiArrays.primary_language_array" />
      </div>

      <div class="col-sm-10 col-md-6">
        <b-form-select
          name="level"
          disabled
          v-model="language.level"
          :options="$root.apiArrays.language_level_array" />
      </div>

      <div class="deleteItem">
        <i @click="updateLanguage(index)" class="fa fa-trash"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Languages',
  props: ['languages'],
  data () {
    return {
      currentLanguage: {lang: '', level: ''}
    }
  },
  methods: {
    addLanguage () {
      if (this.currentLanguage.lang && this.currentLanguage.level) {
        this.$emit('addLanguage', this.currentLanguage)
        this.currentLanguage = {lang: '', level: ''}
      }
    },
    updateLanguage (index) {
      this.$emit('updateLanguage')
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
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  cursor: pointer;
  font-size: 20px;
  transition: color .25s ease;
}

@media screen and (max-width: 767px){
  .deleteItem {
    right: 20px;
  }
}

.deleteItem:hover {
  color: red;
}
</style>
