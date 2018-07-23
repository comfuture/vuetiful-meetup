<template>
  <section>
    <h1>{{meetup.subject}}</h1>
    <table class="ui selectable celled striped table">
      <thead>
        <tr>
          <th colspan="4" class="shrinked">
            <div class="ui transparent- icon input">
              <input class="prompt" type="text" placeholder="Search anything..."
                @keyup="keyword=$event.target.value"
                @keyup.esc="keyword=''"
                v-model="keyword" v-focus-forever>
              <i class="close link icon" v-if="keyword" @click="keyword=''"></i>
              <i class="search icon" v-else></i>
            </div>
          </th>
        </tr>
        <tr>
          <th>참석여부</th>
          <th>이름</th>
          <th>이메일</th>
          <th>전화번호</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[id, attendee] in filteredAttendees" :key="id" @click="popup(id)">
          <td class="collapsing">
            <div class="ui green label" v-if="attendee.attend">참석</div>
            <div class="ui label" v-else>미참석</div>
          </td>
          <td>
            {{attendee.name}}
          </td>
          <td>
            {{attendee.email}}
          </td>
          <td>
            -
          </td>
        </tr>
      </tbody>
    </table>
    <ui-modal :active.sync="modalVisible">
      <div slot="header">출석확인</div>
      <div v-if="selectedId">
        <p>{{selectedAttendee.name}}
          <span class="ui teal label">발표자</span>
          <span class="ui orange label">스탭</span>
        </p>
        <p>{{selectedAttendee.email}}</p>
        <div class="ui toggle checkbox">
          <input type="checkbox" id="agree" checked :value="true">
          <label for="agree">사진 활용에 동의합니다.</label>
        </div>
      </div>
      <div slot="actions">
        <div class="ui fluid buttons">
          <div class="ui green ok button" @click="attend(true)">참석</div>
          <div class="ui dismiss button" @click="attend(false)">미참석</div>
        </div>
      </div>
    </ui-modal>
  </section>
</template>
<script>
import { db } from '~/plugins/firebase-init'
export default {
  name: 'meetup-index',
  directives: {
    focusForever: {
      inserted: function (el) {
        el.focus()
        el.addEventListener('blur', e => {
          el.focus()
        }, true)
      }
    }
  },
  data() {
    return {
      keyword: '',
      attendees_: {
        data: {},
        index: [],
        order: {name: 1}
      },
      selectedId: null,
      modalVisible: false
    }
  },
  computed: {
    id() {
      return this.$route.params.meetup
    },
    meetup() {
      return this.$store.getters['meetup/get'](this.id)
    },
    attendees: {
      get() {
        return this.attendees_.index.map(id => [id, this.attendees_.data[id]])
      },
      set(value) {
        // ignore
      }
    },
    filteredAttendees() {
      if (!this.keyword) {
        return this.attendees
      }
      let escaped = this.keyword.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
      let re = new RegExp(`^${c2(breakKorean(escaped))}`, 'gi')
      return this.attendees.filter(([id, item]) => {
        return re.test(c2(breakKorean(item.name))) || re.test(item.email)
      })
    },
    selectedAttendee() {
      return this.attendees_.data[this.selectedId]
    }
  },
  mounted() {
    // watch attendee
    db.doc(`meetup/${this.id}`).collection('attendee').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(({type, doc}) => {
        if (['added', 'modified'].includes(type)) {
          this.attendees_.data[doc.id] = doc.data()
          this.applyIndex()
        }
        if (type === 'removed') {
          delete this.attendees_.data[doc.id]
          this.applyIndex()
        }
      })
    })
  },
  methods: {
    applyIndex() {
      // apply index
      let pairs = Object.entries(this.attendees_.data)
      for (let [key, order] of Object.entries(this.attendees_.order)) {
        console.log(key, order)
        pairs.sort((a, b) => a[1][key] > b[1][key] ? order : -order)
      }
      this.attendees_.index.splice(0, this.attendees_.index.length, ...pairs.map(([id, _]) => id))
    },
    popup(id) {
      console.log(id)
      this.selectedId = id
      this.modalVisible = true
    },
    attend(how) {
      db.doc(`meetup/${this.id}`).collection('attendee').doc(this.selectedId).update({
        attend: how
      }).then(() => {
        this.dismiss()
      })
    },
    dismiss() {
      this.selectedId = null
      this.modalVisible = false
    }
  }
}

function breakKorean(str) {
  let [base, numS, numT, numN] = [0xAC00, 11172, 28, 588]
  let sylables = {
    L: 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split(''),
    V: 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split(''),
    T: ',ㄱ,ㄲ,ㄱㅅ,ㄴ,ㄴㅈ,ㄴㅎ,ㄷ,ㄹ,ㄹㄱ,ㄹㅁ,ㄹㅂ,ㄹㅅ,ㄹㅌ,ㄹㅍ,ㄹㅎ,ㅁ,ㅂ,ㅂㅅ,ㅅ,ㅆ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ'.split(',')
  }
  let broken = ''
  for (let c of str) {
    let code = c.charCodeAt()
    let ix = code - base
    if (0 > ix || ix > numS) {
      broken += c
      continue
    }
    let il = Math.floor(ix / numN)
    let iv = Math.floor((ix % numN) / numT)
    let it = Math.floor(ix % numT)
    broken += sylables.L[il] + sylables.V[iv] + sylables.T[it]
  }
  return broken
}

function c2(broken) {
  let h = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('')
  let e = 'r,R,s,e,E,f,a,q,Q,t,T,d,w,W,c,z,x,v,g,k,o,i,O,j,p,u,P,h,hk,ho,hl,y,n,nj,np,nl,b,m,ml,l'.split(',')
  let c2 = ''
  for (let c of broken) {
    let ix = h.indexOf(c)
    if (ix === -1) {
      c2 += c
      continue
    }
    c2 += e[ix]
  }
  return c2
}

</script>

<style scoped>
.ui.table thead th.shrinked {
  padding: 0;
}
.ui.search .prompt {
  border-radius: inherit;
}
.sticky.row {
  /* position: fixed; */
  /* top: 60px; */
  /* position:fixed; top: 40px; */
}

@media only screen and (max-width: 767px) {
  .ui.table thead tr {
    padding-top: 0;
    padding-bottom: 0;
  }
  .ui.table thead tr:nth-child(2) {
    /* background-color: red; */
    display: none !important;
  }

  .ui.table tbody td {
    display: inline-block !important;
  }
}
</style>
