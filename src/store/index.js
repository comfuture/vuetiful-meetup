import {db, auth} from '~/plugins/firebase-init'

export const plugins = [
  store => {
    // automatically fill user meta after login
    auth.onAuthStateChanged(user => {
      store.commit('user', user)
    })
  },
  // XXX: plugins are only valid on top level store
  store => {
    // load and sync meetups
    if (process.browser) {
      db.collection('meetup').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(({type, doc}) => {
          if (['added', 'modified'].includes(type)) {
            store.commit('meetup/set', doc)
          }
          if (type === 'removed') {
            store.commit('meetup/remove', doc.id)
          }
        })
      })
    }
    // apply index
    store.dispatch('meetup/setIndex', {created_at: -1})
  }
]

export const state = () => ({
  user: null
})

export const getters = {
  user: state => state.user
}

export const mutations = {
  user(state, user) {
    if (user) {
      let {uid, email, displayName} = user
      state.user = {uid, email, displayName}
    } else {
      state.user = null
    }
  }
}

export const actions = {
  nuxtServerInit({commit}, {req}) {
    // TODO: commit only needed keys
    if (req.user) {
      commit('user', req.user)
    }
    return db.collection('meetup').get().then(snapshot => {
      snapshot.forEach(doc => {
        commit('meetup/set', doc)
      })
    })
  }
}
