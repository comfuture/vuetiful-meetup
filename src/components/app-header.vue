<template>
  <header class="ui fixed inverted menu">
    <div class="ui container">
      <nuxt-link :to="{name: 'index'}" class="header item">
        Vuetiful Meetup
      </nuxt-link>
      <nuxt-link :to="{name: 'organize'}" class="item">Organize</nuxt-link>
    </div>
  </header>
</template>
<script>
export default {
  name: 'app-header'
}
</script>
