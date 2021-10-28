import Vue from "vue";
import Vuex from "vuex";

import navigationModule from "@/store/navigation.js";
import sessionModule from "@/store/session.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    navigation: navigationModule,
    session: sessionModule,
  },
});
