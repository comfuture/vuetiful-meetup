<template>
  <nuxt-link :to="{name: 'organize-id', params: {id}}" class="ui card">
    <div class="content">
      <div class="header">{{subject}}</div>
      <div class="meta"><i class="map marker icon"></i>{{place}}</div>
      <div class="ui green top right attached label" v-if="active">Active</div>
      <div class="ui top right attached label" v-else>Inactive</div>
    </div>
    <div class="extra content">
      <span class="right floated">
        {{date | date}}
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
