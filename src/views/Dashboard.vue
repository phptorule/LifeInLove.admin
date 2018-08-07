<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-6 col-lg-3">
        <b-card class="bg-primary" :no-block="true">
          <div class="card-body pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Test</b-dropdown-item>
              <b-dropdown-item>Test</b-dropdown-item>
              <b-dropdown-item>Test</b-dropdown-item>
              <b-dropdown-item disabled>Test</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">9.823</h4>
            <p>Test</p>
          </div>
          <card-line1-chart-example class="chart-wrapper px-3" style="height:70px;" height="70"/>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
// import router from '../router'
import CardLine1ChartExample from './dashboard/CardLine1ChartExample'

export default {
  name: 'Dashboard',
  components: { CardLine1ChartExample },
  mounted () {
  }
}
</script>
