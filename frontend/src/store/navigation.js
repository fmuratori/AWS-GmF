const screenSmallWidth = 576;
const screenMediumWidth = 768;
const screenLargeWidth = 992;
const screenExtraLargeWidth = 1200;

export default {
  state: () => ({
    isSidebarOpen: false,
    screenWidth: Number,
  }),
  getters: {
    isExtraSmallScreenWidth(state) {
      return state.screenWidth < screenSmallWidth;
    },
    isSmallScreenWidth(state) {
      return state.screenWidth < screenMediumWidth;
    },
    isMediumScreenWidth(state) {
      return state.screenWidth < screenLargeWidth;
    },
    isLargeScreenWidth(state) {
      return state.screenWidth < screenExtraLargeWidth;
    },
    isExtraLargeScreenWidth(state) {
      return state.screenWidth >= screenExtraLargeWidth;
    }
  },
  mutations: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    updateScreenWidth(state, payload) {
      state.screenWidth = payload.value;

      if (state.screenWidth < screenExtraLargeWidth && !state.screenWidth < screenLargeWidth) 
        state.isSidebarOpen = true; 
    },
  },
  actions: {
    toggleSidebar({ commit }) {
      commit("toggleSidebar");
    },
    setMangerMode({ commit }) {
      commit("setMangerMode");
    },
    unsetMangerMode({ commit }) {
      commit("unsetMangerMode");
    },
    updateScreenWidth({ commit }, value) {
      commit("updateScreenWidth", value);
    },
  }
}