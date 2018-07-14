import { db } from '~/plugins/firebase-init'

export const state = () => ({
  all: {},
  index: [],
  _indexer: {}  // XXX: only single indexer is allowed for now
})

export const getters = {
  all: state => state.index.map(id => [id, state.all[id]]),
  get: state => id => state.all[id]
}

function applyIndex(state) {
  // apply index
  let pairs = Object.entries(state.all)
  for (let [key, order] of Object.entries(state._indexer)) {
    pairs.sort((a, b) => a[1][key] > b[1][key] ? order : -order)
  }
  state.index.splice(0, state.index.length, ...pairs.map(([id, _]) => id))
}

export const mutations = {
  set(state, doc) {
    state.all[doc.id] = doc.data()
    applyIndex(state)
  },
  remove(state, id) {
    delete state.all[id]
    let ix = -1;
    if ((ix = state.index.indexOf(id)) > -1) {
      state.index.splice(ix, 1)
    }
  }
}

export const actions = {
  add({dispatch}, data) {
    let id = db.collection('meetup').doc()
    return dispatch('set', id, data)
  },
  set({commit}, id, data, merge = true) {
    let doc = db.collection('meetup').doc(id)
    let unsubscribe = doc.onSnapshot(doc => {
      doc.metadata.hasPendingWrites && commit('set', doc)
      unsubscribe()
    })
    return doc.set(data, {merge}).then(ref => ref.id)
  },
  remove({commit}, id) {
    db.collection('meetup').doc(id).delete().then(() => {
      commit('remove', id)
    })
  }
}