<template>
  <div>
    <h1>밋업 추가</h1>
    <div class="ui form segment">
      <div class="field">
        <label for="">주제</label>
        <input type="text" v-model="meetup.subject">
      </div>
      <div class="fields">
        <div class="six wide field">
          <label for="">일시</label>
          <date-input time picker v-model="meetup.date" />
        </div>
        <div class="eight wide field">
          <label for="">장소</label>
          <input type="text" v-model="meetup.place">
        </div>
        <div class="two wide field">
          <label for="">인원</label>
          <input type="text" v-model.number="meetup.maxAttendee">
        </div>
      </div>
      <div class="field">
        <label for="">상세</label>
        <quill-editor v-model="meetup.description" />
      </div>
      <button class="ui primary button" @click="save">생성</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'organize-new',
  data() {
    return {
      loading: false,
      meetup: {
        subject: '',
        place: '',
        date: new Date(),
        maxAttendee: 0,
        description: 'hello <b>world</b>',
        active: true
      }
    }
  },
  methods: {
    save() {
      this.loading = true
      this.$store.dispatch('meetup/add', this.meetup).then(() => {
        this.loading = false
        this.$router.replace({name: 'organize'})
      })
    }
  }
}
</script>

<style>

</style>
