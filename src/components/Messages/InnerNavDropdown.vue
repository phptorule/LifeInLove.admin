<template>
  <div class="nav-item nav-dropdown" tag="li" disabled>
    <div class="nav-link nav-dropdown-toggle header" @click="handleClick">{{name}}</div>
    <ul class="nav-dropdown-items overflow-y-auto">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'InnerNavDropdown',
  props: {
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick (e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    }
  }
}
</script>

<style scoped>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 5px;
  }

  .overflow-y-auto {
    overflow-y: auto!important;
  }
</style>