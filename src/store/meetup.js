import firebase, { db } from '~/plugins/firebase-init'

export const state = () => ({
  all: {},
  index: [],
  _indexer: {}  // XXX: only single indexer is allowed for now
})

export const getters = {
  all: state => state.index.map(id => [id, state.all[id]]),
  get: state => id => state.all[id] || {} // prevent getting property of undefined error
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
  },
  setIndex(state, indice) {
    // doing such a bothersome code to keep index order
    // state._indexer = Object.assign(...[...Object.entries(state._indexer), ...Object.entries(indice)].map(pair => {pair[0], pair[1]}))
    state._indexer = indice
    applyIndex(state)
  }
}

export const actions = {
  setIndex({commit}, indice) {
    commit('setIndex', indice)
  },
  fetch({commit}) {
    return db.collection('meetup').get().then(snapshot => {
      shapshot.forEach(doc => {
        commit('set', doc)
      })
    })
  },
  get(_ctx, id) {
    return db.collection('meetup').doc(id).get()
  },
  add(_ctx, data) {
    data.created_at = firebase.firestore.FieldValue.serverTimestamp() // add timestamp
    return db.collection('meetup').add(data).then(ref => {
      return ref.id
    })
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