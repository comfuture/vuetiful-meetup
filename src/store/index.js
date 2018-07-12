export const state = () => ({
  user: null
})

export const getters = {
  user(state) {
    return state.user
  }  
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
  }
}
