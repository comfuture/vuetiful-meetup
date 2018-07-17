<template>
  <div>
    <h1>밋업 구성</h1>
    <div class="ui doubling two cards">
      <nuxt-link tag="a" :to="{name: 'organize-add'}" class="ui add new icon card button">
        <i class="white huge plus icon"></i>
      </nuxt-link>
      <meetup-item :id="id" v-bind="meetup" v-for="[id, meetup] in meetups" :key="id" />
    </div>
    <!-- <nuxt-link tag="button" :to="{name: 'organize-add'}" class="ui primary button">밋업 추가</nuxt-link> -->
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
.add.new.button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f3f3;
  box-shadow: inherit;
  min-height: 100px;
  border-style: dashed;
  border-width: 3px;
  border-color: #ccc;
}
</style>
