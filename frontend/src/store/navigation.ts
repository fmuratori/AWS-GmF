import { NavigationState } from "@/types";

const screenSmallWidth = 576;
const screenMediumWidth = 768;
const screenLargeWidth = 992;
const screenExtraLargeWidth = 1200;

const navigationModule = {
  state: (): NavigationState => ({
    isSidebarOpen: false,
    screenWidth: /*Number*/ 0,
  }),
  getters: {
    isExtraSmallScreenWidth(state: NavigationState): boolean {
      return state.screenWidth < screenSmallWidth;
    },
    isSmallScreenWidth(state: NavigationState): boolean {
      return state.screenWidth < screenMediumWidth;
    },
    isMediumScreenWidth(state: NavigationState): boolean {
      return state.screenWidth < screenLargeWidth;
    },
    isLargeScreenWidth(state: NavigationState): boolean {
      return state.screenWidth < screenExtraLargeWidth;
    },
    isExtraLargeScreenWidth(state: NavigationState): boolean {
      return state.screenWidth >= screenExtraLargeWidth;
    },
  },
  mutations: {
    toggleSidebar(state: NavigationState): void {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarVisible(state: NavigationState, value: boolean): void {
      state.isSidebarOpen = value;
    },
    updateScreenWidth(state: NavigationState, value: number): void {
      state.screenWidth = value;

      if (
        state.screenWidth < screenExtraLargeWidth &&
        state.screenWidth >= screenLargeWidth
      )
        state.isSidebarOpen = false;
    },
  },
  actions: {
    showSidebar({ commit }): void {
      commit("setSidebarVisible", true);
    },
    hideSidebar({ commit }): void {
      commit("setSidebarVisible", false);
    },
    toggleSidebar({ commit }): void {
      commit("toggleSidebar");
    },
    setMangerMode({ commit }): void {
      commit("setMangerMode");
    },
    unsetMangerMode({ commit }): void {
      commit("unsetMangerMode");
    },
    updateScreenWidth({ commit, state }, value: number): void {
      commit("updateScreenWidth", value);
    },
  },
};

export default navigationModule;
