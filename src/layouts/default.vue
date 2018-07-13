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
  },
  mounted() {
    firebase.initializeApp({
      apiKey: "AIzaSyAnpvjBQXHY9Tuatuw1sVO6AgCg3-AVdgI",
      authDomain: "vuetiful-meetup.firebaseapp.com",
      databaseURL: "https://vuetiful-meetup.firebaseio.com",
      projectId: "vuetiful-meetup",
      storageBucket: "vuetiful-meetup.appspot.com",
      messagingSenderId: "613310856357"
    })
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
