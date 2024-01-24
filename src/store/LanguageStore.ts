import { createStore } from 'vuex'

export default createStore<{language: number}>({
  state () {
    return {
      language : 1
    }
  },
  mutations: {
    changeLanguage (state, newLanguage) {
      state.language = newLanguage;
    }
  }
})
