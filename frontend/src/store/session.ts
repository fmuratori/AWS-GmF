import { SessionHeader, UserData, UserState } from "../types";
import { AxiosResponse } from "axios";
import api from "../api/user";
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
      if (Vue.$cookies.get("jwt")) {
        api.loadData().then((r: AxiosResponse) => {
          sessionModule.mutations.login(state, {
            token: Vue.$cookies.get("jwt"),
            userData: r.data as UserData,
          });
        });
        return true;
      }
      return state.token != "";
    },
    isUser(state: UserState): boolean {
      return state.userData.type == "user";
    },
    isVolunteer(state: UserState): boolean {
      return state.userData.type == "volunteer";
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
    // isVolunteer(state: any) {
    //   return state.type != null;
    // },
    // isPrivilegedVolunteer(state: any) {
    //   return state.type != null;
    // },
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
    login({ commit }: any, payload: any): void {
      commit("login", payload);
    },
    logout({ commit }): void {
      commit("logout");
    },
  },
};

export default sessionModule;
