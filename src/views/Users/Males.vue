<template>
  <div class="animated fadeIn">
    <UserTable gender="client"/>
  </div>
</template>

<script>
import { UserTable } from '@/components/'

export default {
  name: 'Males',
  components: { UserTable }
}
</script>
