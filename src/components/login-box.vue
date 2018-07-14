<template>
  <section class="login-box">
    <template v-if="user">
      <div class="item">
        {{user.email}} 님 안녕하세요
      </div>
      <div class="item">
        <button @click="signout">로그아웃</button>
      </div>
    </template>
    <template v-else-if="emailSent">
      <div class="item">
        {{email}}로 인증 메일이 발송되었습니다. 메일함으로 이동하여 나머지 절차를 진행해주세요.
      </div>
    </template>
    <template v-else>
      <div class="item">
        <input type="email" placeholder="your@email.com" v-model="email">
      </div>
      <div class="item">
        <button @click="signin">이메일로 로그인</button>
      </div>
    </template>
  </section>
</template>
<script>
import Cookie from 'universal-cookie'
import { mapGetters } from 'vuex'
import firebase from '~/plugins/firebase-init'

export default {
  name: 'login-box',
  data() {
    return {
      email: '',
      emailSent: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    signin() {
      let resolved = this.$router.resolve({name: 'auth-callback'})
      let url = `${location.protocol}//${location.host}${resolved.route.fullPath}`
      firebase.auth().sendSignInLinkToEmail(this.email, {
        url,
        handleCodeInApp: true
      }).then(() => {
        window.localStorage.setItem('emailForSignIn', this.email)
        this.emailSent = true
      }).catch(e => {
        // error!
        alert(e)
      })
    },
    signout() {
      firebase.auth().signOut().then(() => {
        let ivy = new Cookie()
        ivy.remove('_sess')
        this.$store.commit('user', null)
        this.emailSent = false
        alert('안전하게 로그아웃 했습니다')
      }).catch(e => {
        alert(e)
      })
    }
  }
}
</script>
<style scoped>
.login-box {
  margin: auto;
  margin-top: 2em;
  margin-bottom: 2em;
  padding: 1em 2em;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.3);
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item {
  padding: .5em 0;
}
</style>
