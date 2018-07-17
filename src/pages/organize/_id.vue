<template>
  <div>
    <h1>밋업 상세</h1>
    <div class="ui top attached tabular menu">
      <a class="item" :class="{active: activeTab === 'basic'}" @click="activateTab('basic')">
        기본정보
      </a>
      <a class="item" :class="{active: activeTab === 'attendee'}" @click="activateTab('attendee')">
        참여자 정보
      </a>
    </div>
    <div class="ui bottom attached form pane segment" :class="{loading, active: activeTab === 'basic'}">
      <div class="field">
        <label for="">주제</label>
        <editable-input :editing="editing" v-model="meetup.subject" />
      </div>
      <div class="fields">
        <div class="six wide field">
          <label for="">일시</label>
          <editable-input :editing="editing" v-model="meetup.date" :parse="v => new Date(+v)">
            <date-input time picker v-model="meetup.date" />
          </editable-input>
        </div>
        <div class="eight wide field">
          <label for="">장소</label>
          <editable-input :editing="editing" v-model="meetup.place" />
        </div>
        <div class="two wide field">
          <label for="">인원</label>
          <editable-input :editing="editing" v-model.number="meetup.maxAttendee" :stringify="String" :parse="Number" />
        </div>
      </div>
      <div class="field">
        <label for="">상세</label>
        <quill-editor v-if="editing" v-model="meetup.description"></quill-editor>
        <div v-else v-html="meetup.description || ''"></div>
      </div>
      <button class="ui teal button" @click="edit" v-if="!editing">수정</button>
      <div class="ui buttons" v-if="editing">
        <div class="ui primary button" @click="save">저장</div>
        <div class="ui button" @click="editing=false">취소</div>
      </div>
      <div class="ui right floated red button">밋업 삭제</div>
    </div>
    <div class="ui bottom attached pane segment" :class="{active: activeTab === 'attendee'}">
      <file-uploader :path="`meetup/${id}/attendee`"></file-uploader>
      <table class="ui striped compact table">
        <thead>
          <tr>
            <th>이메일</th>
            <th>이름</th>
            <th>역할</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>comfuture@gmail.com</td>
            <td>김창균</td>
            <td>
              <div class="ui toggle checkbox">
                <input type="checkbox" name="public">
                <label>발표자</label>
              </div>
              <div class="ui toggle checkbox">
                <input type="checkbox" name="public">
                <label>스탭</label>
              </div>
            </td>
            <td class="right aligned collapsing">
              <button class="ui tiny red button">삭제</button>
            </td>
          </tr>
          <tr>
            <td>comfuture@gmail.com</td>
            <td>김창균</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
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
  components: {
    EditableInput
  },
  asyncData({route, store}) {
    return {
      meetup: {...store.getters['meetup/get'](route.params.id)}
    }
  },
  data() {
    return {
      loading: false,
      editing: false,
      activeTab: 'basic',
      meetup: {}
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.loading = true
    this.$store.dispatch('meetup/get', this.id).then(ref => {
      this.loading = false
      let data = ref.data()
      data['created_at'] = new Date(data['created_at'].seconds * 1000)
      data['date'] = new Date(data['date'].seconds * 1000)
      return data
    }).then(v => this.meetup = v)
  },
  methods: {
    edit() {
      this.editing = true
    },
    save() {
      this.loading = true
      this.$store.dispatch('meetup/set', {id: this.id, data: this.meetup}).then(() => {
        this.loading = false
        this.editing = false
      })
    },
    activateTab(name) {
      this.activeTab = name
    }
  }
}
</script>
<style>
.ui.pane.segment {
  display: none;
}
.active.pane.segment {
  display: block;
}
.toggle.checkbox {
  margin-right: 1.5em;
}
</style>
