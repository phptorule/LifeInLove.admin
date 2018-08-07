<template>
  <div class="animated fadeIn">
    <StaffTable gender="managers" />
  </div>
</template>

<script>
import { StaffTable } from '@/components/'

export default {
  name: 'Managers',
  components: { StaffTable }
}
</script>
