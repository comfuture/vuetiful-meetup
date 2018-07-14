<template>
  <div>
    <h1>밋업 구성</h1>
    <div class="ui doubling two cards">
      <!-- <meetup-item :id="id" v-bind="meetup" v-for="[id, meetup] in meetups" :key="id" /> -->
      <meetup-item :id="id" v-bind="meetup" v-for="[id, meetup] in meetups" :key="id" />
    </div>
    <nuxt-link tag="button" :to="{name: 'organize-add'}" class="ui primary button">밋업 추가</nuxt-link>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'organize',
  computed: {
    ...mapGetters({meetups: 'meetup/all'})
  }
}
</script>
<style scoped>
.ui.cards {
  margin-bottom: 1em;
}
</style>
