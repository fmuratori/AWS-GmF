import { Commit } from "vuex";

import { SessionHeader, UserData } from "../types/types";
import { UserState } from "@/types/storeTypes";
import Vue from "vue";

const sessionModule = {
  state: (): UserState => ({
    token: "",
    userData: {
      _id: "",
      name: "",
      surname: "",
      email: "",
      phoneNumber: "",
      type: "",
      address: {
        street: "",
        civicNumber: "",
        city: "",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    } as UserData,
  }),
  getters: {
    isUserLogged(state: UserState): boolean {
      return state.token != "";
    },
    isUser(state: UserState): boolean {
      return state.userData.type == "user";
    },
    isVolunteer(state: UserState): boolean {
      return state.userData.type == "volunteer";
    },
    isTrustedVolunteer(state: UserState): boolean {
      return state.userData.type == "trusted";
    },
    getSessionHeader(): SessionHeader {
      return {
        "x-access-token": Vue.$cookies.get("jwt"),
        "x-user-id": Vue.$cookies.get("user-id"),
      } as SessionHeader;
    },
    userFullName(state: UserState): string {
      return state.userData.name + " " + state.userData.surname;
    },
  },
  mutations: {
    login(state: UserState, payload: UserState): void {
      state.token = payload.token;
      state.userData = payload.userData;
    },
    logout(state: UserState): void {
      state.token = "";
      state.userData = {} as UserData;
    },
  },
  actions: {
    login({ commit }: { commit: Commit }, payload: UserState): void {
      commit("login", payload);
    },
    logout({ commit }: { commit: Commit }): void {
      commit("logout");
    },
  },
};

export default sessionModule;
