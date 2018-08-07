<template>
  <div class="animated fadeIn">
    <StaffTable gender="translators" />
  </div>
</template>

<script>
import { StaffTable } from '@/components/'

export default {
  name: 'Translators',
  components: { StaffTable }
}
</script>
