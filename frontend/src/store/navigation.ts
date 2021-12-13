import { NavigationState } from "@/storeTypes";

const screenSmallWidth = 576;
const screenMediumWidth = 768;
const screenLargeWidth = 992;
const screenExtraLargeWidth = 1200;

const navigationModule = {
  state: (): NavigationState => ({
    isSidebarOpen: false,
    screenWidth: 0,

    // those flags redirect the user after a successfull login
    donationCreationFlag: false,
    familySubscribeFlag: false,
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
    },

    setDonationCreationFlag(state: NavigationState, value: boolean): void {
      state.donationCreationFlag = value;
    },
    setFamilySubscribeFlag(state: NavigationState, value: boolean): void {
      state.familySubscribeFlag = value;
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
    updateScreenWidth({ commit, rootGetters }, value: number): void {
      commit("updateScreenWidth", value);

      commit("setSidebarVisible", rootGetters.isUserLogged);
    },

    setDonationCreationFlag({ commit }): void {
      commit("setDonationCreationFlag", true);
    },

    setFamilySubscribeFlag({ commit }): void {
      commit("setFamilySubscribeFlag", true);
    },

    unsetLoginNavigationFlags({ commit }): void {
      commit("setFamilySubscribeFlag", false);
      commit("setDonationCreationFlag", false);
    },

  },
};

export default navigationModule;
