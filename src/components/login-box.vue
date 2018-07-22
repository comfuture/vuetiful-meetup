<template>
  <section>
    <div class="ui top attached segment">
      <strong>로그인</strong>
    </div>
    <div class="ui bottom attached form segment">
      <template v-if="user">
        <div class="item">
          {{user.email}} 님 안녕하세요
        </div>
        <div class="item">
          <button @click="signout" class="ui button">로그아웃</button>
        </div>
      </template>
      <template v-else-if="emailSent">
        <div class="item">
          {{email}}로 인증 메일이 발송되었습니다. 메일함으로 이동하여 나머지 절차를 진행해주세요.
        </div>
      </template>
      <template v-else>
        <div class="field">
          <input type="email" placeholder="your@email.com" v-model="email">
        </div>
        <div class="field">
          <button @click="signin" class="ui fluid primary button">이메일로 로그인</button>
        </div>
      </template>
    </div>
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
      let resolved = this.$router.resolve({name: 'auth-callback', query: {email: this.email}})
      let url = `${location.protocol}//${location.host}${resolved.route.fullPath}`
      firebase.auth().sendSignInLinkToEmail(this.email, {
        url,
        handleCodeInApp: true
      }).then(() => {
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
section {
  margin: auto;
  margin-top: 2em;
  margin-bottom: 2em;
  padding: 1em 2em;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item {
  padding: .5em 0;
}
</style>
