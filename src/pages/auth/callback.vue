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
      let email = window.localStorage.getItem('emailForSignIn')
      firebase.auth().signInWithEmailLink(email, window.location.href).then(result => {
        window.localStorage.removeItem('emailForSignIn')
        this.$router.push('/')
        result.user
      }).catch(e => {
        window.localStorage.removeItem('emailForSignIn')
      })
    }
  }
}
</script>
