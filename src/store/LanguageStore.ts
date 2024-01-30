import { createStore } from 'vuex'

export default createStore<{
  checkJwt: any;
  displayPhao: boolean; language: number 
}>({
  state() {
    return {
      language: 1,
      displayPhao: false,
      checkJwt: false
    }
  },
  mutations: {
    changeLanguage(state, newLanguage) {
      state.language = newLanguage;
    },
    changeDisplayPhao(state, newDisplayPhao) {
      state.displayPhao = newDisplayPhao;
    },
    changeCheckJwt(state, newCheckJwt) {
      state.checkJwt = newCheckJwt;
    }
  }
})
