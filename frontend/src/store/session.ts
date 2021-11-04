import {
  UserData,
} from "../types";

const sessionModule = {
  state: () => ({
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
      }
    } as UserData,
  }),
  getters: {
    isUserLogged(state: any) {
      return state.token != "";
    },
    isUser(state: any) {
      return state.type === "user";
    },
    // isVolunteer(state: any) {
    //   return state.type != null;
    // },
    // isPrivilegedVolunteer(state: any) {
    //   return state.type != null;
    // },
  },
  mutations: {
    login(state: any, payload: { token: string; userData: UserData; }) {
      state.token = payload.token;
      state.userData = payload.userData;
    },
    logout(state: any) {
      state.token = ""
      state.userData = null
    },
  },
  actions: {
    login({ commit }: any, payload: any) {
      commit("login", payload);
    },
    logout({ commit }) {
      commit("logout");
    },
  },
};

export default sessionModule;
