<template>
  <div class="animated fadeIn">
    <b-card header="Create New User">
      <div class="row role">
        <div class="col-sm-12 col-md-6 mx-auto">
          <div class="row">
            <div class="col-md-2 title">
              Role:
            </div>

            <div class="col-md-10">
              <b-form-select
                v-model="role"
                :options="rolesArray"
                :disabled="currentUserRole === 'translator'"/>
            </div>
          </div>
        </div>
      </div>
      <MaleCreate v-if="role === 'client' && currentUserRole != 'translator'"/>
      <GirlCreate v-if="role === 'girl'" />
    </b-card>
  </div>
</template>

<script>
import { MaleCreate, GirlCreate } from '@/components/'

export default {
  components: {
    MaleCreate,
    GirlCreate
  },
  name: 'NewUser',
  data () {
    return {
      currentUserRole: '',
      role: 'girl',
      rolesArray: [
        {value: 'client', text: 'Male'},
        {value: 'girl', text: 'Female'}
      ]
    }
  },
  created () {
    this.currentUserRole = this.$root.currentUser.role
  }
}
</script>

<style>
.title {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.role {
  margin-bottom: 10px;
}
</style>