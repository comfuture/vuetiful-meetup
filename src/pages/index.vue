<template>
  <section class="container">
    <div>
      <logo/>
      <login-box></login-box>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo'
import LoginBox from '~/components/login-box'

export default {
  name: 'index',
  components: {
    Logo, LoginBox
  }
}
</script>
