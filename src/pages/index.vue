<template>
  <section>
    <site-logo/>
    <div v-for="[id, meetup] in activeMeetups" :key="id">
      <div class="ui green label">진행중</div>
      {{meetup.subject}}
    </div>
    <div v-if="activeMeetups.length === 0">진행중인 밋업이 없습니다</div>
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
    ...mapGetters({meetups: 'meetup/all'}),
    activeMeetups() {
      return this.meetups.filter(([id, meetup]) => meetup.active)
    }
  }
}
</script>
