import { Commit } from "vuex";

import { NavigationState } from "@/types/storeTypes";

const screenSmallWidth = 576;
const screenMediumWidth = 768;
const screenLargeWidth = 992;
const screenExtraLargeWidth = 1200;

const navigationModule = {
  state: (): NavigationState => ({
    isSidebarOpen: false,
    isNavbarMobileOpen: false,
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
    setNavbarMobileVisible(state: NavigationState, value: boolean): void {
      state.isNavbarMobileOpen = value;
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
    showSidebar({ commit }: { commit: Commit }): void {
      commit("setSidebarVisible", true);
    },
    hideSidebar({ commit }: { commit: Commit }): void {
      commit("setSidebarVisible", false);
    },
    showNavbarMobile({ commit }: { commit: Commit }): void {
      commit("setNavbarMobileVisible", true);
    },
    hideNavbarMobile({ commit }: { commit: Commit }): void {
      commit("setNavbarMobileVisible", false);
    },
    toggleSidebar({ commit }: { commit: Commit }): void {
      commit("toggleSidebar");
    },
    setMangerMode({ commit }: { commit: Commit }): void {
      commit("setMangerMode");
    },
    unsetMangerMode({ commit }: { commit: Commit }): void {
      commit("unsetMangerMode");
    },
    updateScreenWidth(
      { commit, state, getters, rootGetters },
      value: number
    ): void {
      commit("updateScreenWidth", value);

      if (rootGetters.isUserLogged)
        commit(
          "setSidebarVisible",
          getters.isMediumScreenWidth ? state.isNavbarMobileOpen : true
        );
    },

    setDonationCreationFlag({ commit }: { commit: Commit }): void {
      commit("setDonationCreationFlag", true);
    },

    setFamilySubscribeFlag({ commit }: { commit: Commit }): void {
      commit("setFamilySubscribeFlag", true);
    },

    unsetLoginNavigationFlags({ commit }: { commit: Commit }): void {
      commit("setFamilySubscribeFlag", false);
      commit("setDonationCreationFlag", false);
    },
  },
};

export default navigationModule;
