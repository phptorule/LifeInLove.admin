<template>
   <b-modal
      ref="modal"
      title="Crop and Save"
      class="centered-modal"
      :centered="true"
      ok-title="Save"
      @ok="saveAvatar">
     <b-card>
      Test
     </b-card>
    </b-modal>
</template>

<script>
export default {
  name: 'ModalCropper',
  mounted () {
    console.log('mounted')
    this.showModal()
  },
  methods: {
    showModal () {
      console.log('show')
      this.$refs.modal.show()
    },
    hideModal () {
      this.$refs.modal.hide()
    },
    saveAvatar () {
      console.log('save')
    }
  }
}
</script>

<style scoped>
.centered-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

