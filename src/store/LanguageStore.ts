import { AuthenticateUtil } from '@/utils/auth';
import { createStore } from 'vuex'

export default createStore<{
  payloadUser: any;
  checkJwt: any;
  displayPhao: boolean; language: number;
  darkMode: boolean;
}>({
  state() {
    return {
      language: 1,
      displayPhao: false,
      checkJwt: AuthenticateUtil.checkJwt(),
      payloadUser: {},
      darkMode: false
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
    },
    changePayloadUser(state, newPayloadUser) {
      state.payloadUser = newPayloadUser;
    },
    changeDarkMode(state, newDarkMode) {
      state.darkMode = newDarkMode
    }
  },
  actions: {
    // Action để cập nhật payloadUser
    updatePayloadUser({ commit }) {
      const newPayloadUser = AuthenticateUtil.checkJwt()
        ? JSON.parse(localStorage.getItem('payloadUser') as any)
        : {};
      commit('changePayloadUser', newPayloadUser);
    }
  }
})
