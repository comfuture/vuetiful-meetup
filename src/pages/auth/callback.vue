<template>
  <div>이메일 인증절차를 진행중입니다...</div>
</template>
<script>
import firebase from '~/plugins/firebase-init'
import Cookie from 'universal-cookie'

export default {
  name: 'auth-callback',
  mounted() {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      let email = this.$route.query.email
      firebase.auth().signInWithEmailLink(email, window.location.href).then(result => {
        this.$router.push('/')
      }).catch(e => {
        alert(e)
      })
    }
  }
}
</script>
