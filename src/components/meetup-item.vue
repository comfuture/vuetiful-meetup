<template>
  <nuxt-link :to="{name: 'organize-id', params: {id}}" class="ui card">
    
    <div class="content">
      <a class="ui ribbon label" :class="{green: active}">
        {{active ? 'Active' : 'Inactive'}}
      </a>
      <div class="header">{{subject}}</div>
      <div class="description" v-html="description"></div>
    </div>
    <!-- <div class="extra content">
      <slot name="extra"></slot>
    </div> -->
  </nuxt-link>
</template>
<script>
export default {
  name: 'meetup-item',
  props: {
    id: String,
    subject: String,
    active: Boolean,
    description: String
  }
}
</script>
