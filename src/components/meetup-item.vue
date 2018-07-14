<template>
  <nuxt-link :to="{name: 'organize-id', params: {id}}" class="ui card">
    <div class="content">
      <div class="header">{{subject}}</div>
      <div class="description" v-html="description"></div>
    </div>
    <div class="extra content">
      <slot name="extra"></slot>
    </div>
  </nuxt-link>
</template>
<script>
export default {
  name: 'meetup-item',
  props: {
    id: String,
    subject: String,
    description: String
  }
}
</script>
