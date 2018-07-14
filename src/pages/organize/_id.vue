<template>
  <div>
    <h1>밋업 상세</h1>
    <div class="ui form segment">
      <div class="field">
        <label for="">주제</label>
        <editable-input :editing="editing" v-model="meetup.subject" />
      </div>
      <div class="field">
        <label for="">장소</label>
        <editable-input :editing="editing" v-model="meetup.place" />
      </div>
      <div class="field">
        <label for="">일시</label>
        <editable-input :editing="editing" v-model="meetup.date" :parse="v => new Date(+v)">
          <flat-pickr v-model="meetup.date"
            :config="{wrap: false, enableTime: true, dateFormat: 'Y-m-d H:i:S'}"
            placeholder="날짜 선택" />
        </editable-input>
      </div>
      <div class="field">
        <label for="">인원</label>
        <editable-input :editing="editing" v-model.number="meetup.maxAttendee" :stringify="String" :parse="Number" />
      </div>
      <!-- <button class="ui primary button" @click="save">생성</button> -->
      <button class="ui teal button" @click="edit" v-if="!editing">수정</button>
      <div class="ui buttons" v-if="editing">
        <div class="ui primary button" @click="save">저장</div>
        <div class="ui button" @click="editing=false">취소</div>
      </div>
    </div>
  </div>
</template>
<script>
const EditableInput = {
  props: {
    editing: Boolean,
    value: [String, Number, Date, Object],
    parse: {
      type: Function,
      default: v => v
    },
    stringify: {
      type: Function,
      default: v => (v || '').toString()
    }
  },
  render(h) {
    return this.editing
      ? this.$slots.default
        ? h('span', [this.$slots.default])
        : h('input', {
          attrs: {
            type: 'text'
          },
          domProps: {
            value: this.value
          },
          on: {
            input: event => {
              // this.value = event.target.value
              this.$emit('input', event.target.value)
            }
          }
        })
      : h('span', [this.stringify(this.value)])
  }
}
export default {
  name: 'organize-id',
  asyncData({route, store}) {
    return {
      editing: false,
      meetup: {...store.getters['meetup/get'](route.params.id)}
    }
  },
  components: {
    EditableInput
  },
  mounted() {
    !this.meetup && this.$store.dispatch('meetup/get', this.$route.params.id).then(ref => {
      return ref.data()
    }).then(v => this.meetup = v)
  },
  methods: {
    edit() {
      this.editing = true
    },
    save() {
      this.editing = false
    }
  }
}
</script>
