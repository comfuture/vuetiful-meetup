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
      <div class="field">
        <label for="">활성화</label>
        <div class="ui toggle checkbox">
          <input type="checkbox" name="active" :value="true" v-model="meetup.active" @change="applyActive">
          <label>밋업 게시</label>
        </div>
      </div>
      <button class="ui teal button" @click="edit" v-if="!editing">수정</button>
      <div class="ui buttons" v-if="editing">
        <button class="ui primary button" @click="save">저장</button>
        <button class="ui button" @click="editing=false">취소</button>
      </div>
      <div class="ui right floated red button" v-if="!deleteConfirming" @click="deleteConfirming=true">밋업 삭제</div>
      <div class="ui right floated buttons" v-if="deleteConfirming">
        <button class="ui red button" @click="removeMeetup">정말로 삭제</button>
        <button class="ui button" @click="deleteConfirming=false">삭제하지 않기</button>
      </div>
    </div>
    <div class="ui bottom attached pane segment" :class="{active: activeTab === 'attendee'}">
      <file-uploader :path="`meetup/${id}/attendee`"></file-uploader>
      <table class="ui striped compact table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>역할</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[id, attendee] in attendees" :key="id">
            <td>{{attendee.name}}</td>
            <td>{{attendee.email}}</td>
            <td>{{attendee.phone}}</td>
            <td class="collapsing">
              <div class="ui toggle checkbox">
                <input type="checkbox" name="speaker" :value="true" v-model="attendee.speaker"
                  @change="updateAttendeeRole(id, {speaker: $event.target.checked})">
                <label>발표자</label>
              </div>
              <div class="ui toggle checkbox">
                <input type="checkbox" name="staff" :value="true" v-model="attendee.staff"
                  @change="updateAttendeeRole(id, {staff: $event.target.checked})">
                <label>스탭</label>
              </div>
            </td>
            <td class="right aligned collapsing">
              <button class="ui tiny red button" @click="removeAttendee(id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { db } from '~/plugins/firebase-init'

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
      deleteConfirming: false,
      activeTab: 'basic',
      meetup: {},
      attendees_: {
        data: {},
        index: []
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    attendees: {
      get() {
        return this.attendees_.index.map(id => [id, this.attendees_.data[id]])
      },
      set(value) {
        // ignore
      }
    }
  },
  mounted() {
    // watch attendee
    db.doc(`meetup/${this.id}`).collection('attendee').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(({type, doc}) => {
        if (['added', 'modified'].includes(type)) {
          this.attendees_.data[doc.id] = doc.data()
          let ix = this.attendees_.index.indexOf(doc.id)
          if (ix === -1) {
            this.attendees_.index.push(doc.id)
          }
        }
        if (type === 'removed') {
          delete this.attendees_.data[doc.id]
          let ix = this.attendees_.index.indexOf(doc.id)
          if (ix > -1) {
            this.attendees_.index.splice(ix, 1)
          }
        }
      })
    })

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
    applyActive() {
      db.collection('meetup').doc(this.id).update({active: this.meetup.active})
    },
    removeAttendee(id) {
      db.doc(`meetup/${this.id}/attendee/${id}`).delete()
    },
    updateAttendeeRole(id, what) {
      db.doc(`meetup/${this.id}/attendee/${id}`).update(what)
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
