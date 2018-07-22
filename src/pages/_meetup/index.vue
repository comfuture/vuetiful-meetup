<template>
  <section>
    <h1>{{meetup.subject}}</h1>
    <table class="ui celled striped table">
      <thead>
        <tr class="sticky row">
          <th colspan="4" class="ui shrinked menu-">
            <div class="ui transparent- icon input">
              <input class="prompt" type="text" placeholder="Search anything..."
                @keyup="keyword=$event.target.value"
                @keyup.esc="keyword=''"
                v-model="keyword" v-focus-forever>
              <i class="close link icon" v-if="keyword" @click="keyword=''"></i>
              <i class="search link icon" v-else></i>
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
        <tr v-for="[id, attendee] in filteredAttendees" :key="id">
          <td class="collapsing"><div class="ui label">미참석</div></td>
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
        index: []
      }
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
