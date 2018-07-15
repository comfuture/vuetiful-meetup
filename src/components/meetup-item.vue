<template>
  <nuxt-link :to="{name: 'organize-id', params: {id}}" class="ui card">
    <!-- <div class="ui green right ribbon label" v-if="active">Active</div>
    <div class="ui label" v-else>Inactive</div> -->
    <div class="content">
      <div class="header">{{subject}}</div>
      <div class="meta">{{place}}</div>
      <div class="description" v-html="description"></div>
    </div>
    <div class="extra content">
      <span class="right floated">
        {{date}}
      </span>
      <span>
        <i class="user icon"></i>
        {{maxAttendee}}
      </span>
    </div>
  </nuxt-link>
</template>
<script>
export default {
  name: 'meetup-item',
  props: {
    id: String,
    subject: String,
    place: String,
    active: Boolean,
    description: String,
    maxAttendee: Number,
    date: [Date, Object, String]
  }
}
</script>
