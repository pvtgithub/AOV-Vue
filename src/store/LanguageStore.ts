import { createStore } from 'vuex'

export default createStore<{
  displayPhao: boolean; language: number 
}>({
  state() {
    return {
      language: 1,
      displayPhao: false
    }
  },
  mutations: {
    changeLanguage(state, newLanguage) {
      state.language = newLanguage;
    },
    changeDisplayPhao(state, newDisplayPhao) {
      state.displayPhao = newDisplayPhao;
    }
  }
})
