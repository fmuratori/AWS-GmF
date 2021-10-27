import Vue from "vue";
import Vuex from "vuex";

import navigationModule from "@/store/navigation.js"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    navigation: navigationModule
  },
});
