<template>
  <section>
    <site-logo/>
    <meetup-item :id="id" v-bind="meetup" v-for="[id, meetup] in meetups" :key="id" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import SiteLogo from '~/components/site-logo'
import LoginBox from '~/components/login-box'

export default {
  name: 'index',
  components: {
    SiteLogo, LoginBox
  },
  computed: {
    ...mapGetters({meetups: 'meetup/all'})
  }
}
</script>
