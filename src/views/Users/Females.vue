<template>
  <div class="animated fadeIn">
    <UserTable gender="girl"/>
  </div>
</template>

<script>
import { UserTable } from '@/components/'

export default {
  name: 'Females',
  components: { UserTable }
}
</script>