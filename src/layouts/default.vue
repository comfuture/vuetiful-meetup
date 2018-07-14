<template>
  <div>
    <app-header />
    <main class="ui container">
      <nuxt />
    </main>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '~/components/app-header'
import AppFooter from '~/components/app-footer'
export default {
  components: {
    AppHeader, AppFooter
  }
}
</script>
<style>
  #app-wrapper {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  main {
    padding-bottom: 7em;
  }
  main.container {
    margin-top: 7em;
  }
</style>
