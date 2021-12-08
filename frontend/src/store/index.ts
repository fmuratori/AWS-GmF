import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import navigationModule from "./navigation";
import sessionModule from "./session";
import socketioModule from "./socketio";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    navigation: navigationModule,
    session: sessionModule,
    socketio: socketioModule,
  },
  plugins: [createPersistedState()]
});
