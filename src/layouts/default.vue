<template>
  <div id="app-wrapper">
    <div id="content-wrapper" class="mui--text-center">
      <nuxt class="ui container"/>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter'
export default {
  components: {
    AppFooter
  }
}
</script>
<style>
  #app-wrapper {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
</style>
