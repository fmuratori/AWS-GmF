const screenSmallWidth = 576;
const screenMediumWidth = 768;
const screenLargeWidth = 992;
const screenExtraLargeWidth = 1200;

const navigationModule = {
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
    },
  },
  mutations: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarVisible(state, value: boolean) {
      state.isSidebarOpen = value;
    },
    updateScreenWidth(state, value: number) {
      state.screenWidth = value;

      if (
        state.screenWidth < screenExtraLargeWidth &&
        state.screenWidth >= screenLargeWidth
      )
        state.isSidebarOpen = false;
    },
  },
  actions: {
    showSidebar({ commit }) {
      commit("setSidebarVisible", true);
    },
    hideSidebar({ commit }) {
      commit("setSidebarVisible", false);
    },
    toggleSidebar({ commit }) {
      commit("toggleSidebar");
    },
    setMangerMode({ commit }) {
      commit("setMangerMode");
    },
    unsetMangerMode({ commit }) {
      commit("unsetMangerMode");
    },
    updateScreenWidth({ commit, state }, value: number) {
      commit("updateScreenWidth", value);
      
    },
  },
};

export default navigationModule;
