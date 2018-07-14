<template>
  <div>
    <h1>밋업 추가</h1>
    <div class="ui form segment">
      <div class="field">
        <label for="">주제</label>
        <input type="text" v-model="meetup.subject">
      </div>
      <div class="field">
        <label for="">장소</label>
        <input type="text" v-model="meetup.place">
      </div>
      <div class="field">
        <label for="">일시</label>
        <flat-pickr v-model="meetup.date"
          :config="{wrap: false, enableTime: true, dateFormat: 'Y-m-d H:i:S K'}"
          placeholder="날짜 선택">
        </flat-pickr>
      </div>
      <div class="field">
        <label for="">인원</label>
        <input type="text" v-model.number="meetup.maxAttendee">
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
        date: +new Date(),
        maxAttendee: 0,
        active: true
      }
    }
  },
  methods: {
    save() {
      this.loading = true
      // XXX: why vue does not have .date model binding?
      this.meetup.date = new Date(Date.parse(this.meetup.date))
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
