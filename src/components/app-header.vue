<template>
  <header class="ui fixed inverted menu">
    <div class="ui container">
      <nuxt-link :to="{name: 'index'}" class="header item">
        Vuetiful Meetup
      </nuxt-link>
      <nuxt-link :to="{name: 'organize'}" class="item">밋업 구성</nuxt-link>
      <div class="right menu">
        <nuxt-link :to="{name: 'login'}" class="item" v-if="!$store.getters.user">로그인</nuxt-link>
        <div class="ui simple dropdown item" v-else>
          {{$store.getters.user.email}} <i class="dropdown icon"></i>
          <div class="menu">
            <a class="item" href="#">프로필</a>
            <a class="item" @click="logout">로그아웃</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'app-header',
  methods: {
    ...mapActions(['logout'])
  }
}
</script>
