<template>
  <section>
    <site-logo/>
    <login-box/>
  </section>
</template>

<script>
import SiteLogo from '~/components/site-logo'
import LoginBox from '~/components/login-box'

export default {
  name: 'index',
  components: {
    SiteLogo, LoginBox
  }
}
</script>
