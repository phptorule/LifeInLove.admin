<template>
  <div class="animated fadeIn">
    <b-card header="Create New Manager or Translator">
      <StaffCreate />
    </b-card>
  </div>
</template>

<script>
import { StaffCreate } from '@/components/'

export default {
  components: {
    StaffCreate
  },
  name: 'NewTranslator'
}
</script>