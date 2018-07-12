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
    let {uid, email, displayName} = user
    state.user = {uid, email, displayName}
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
