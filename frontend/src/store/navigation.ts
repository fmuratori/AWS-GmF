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
    isExtraSmallScreenWidth(state: any) {
      return state.screenWidth < screenSmallWidth;
    },
    isSmallScreenWidth(state: any) {
      return state.screenWidth < screenMediumWidth;
    },
    isMediumScreenWidth(state: any) {
      return state.screenWidth < screenLargeWidth;
    },
    isLargeScreenWidth(state: any) {
      return state.screenWidth < screenExtraLargeWidth;
    },
    isExtraLargeScreenWidth(state: any) {
      return state.screenWidth >= screenExtraLargeWidth;
    }
  },
  mutations: {
    toggleSidebar(state: any) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarVisible(state: any, value: any) {
      state.isSidebarOpen = value;
    },
    updateScreenWidth(state: any, payload: any) {
      state.screenWidth = payload.value;

      if (state.screenWidth < screenExtraLargeWidth && !(state.screenWidth < screenLargeWidth)) 
        state.isSidebarOpen = false; 
    },
  },
  actions: {
    showSidebar(commit: any) {
      commit("setSidebarVisible", true);
    },
    hideSidebar(commit: any) {
      commit("setSidebarVisible", false);
    },
    toggleSidebar(commit: any) {
      commit("toggleSidebar");
    },
    setMangerMode(commit: any) {
      commit("setMangerMode");
    },
    unsetMangerMode(commit: any) {
      commit("unsetMangerMode");
    },
    updateScreenWidth(commit: any, value: any) {
      commit("updateScreenWidth", value);
    },
  }
}

export default navigationModule