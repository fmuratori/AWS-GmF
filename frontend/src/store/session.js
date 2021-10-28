
export default {
  state: () => ({
    isUserLogged: false,
    sessionToken: String,
    name: String,
    surname: String,
    username: String,
    email: String,
    phone: String, 
    type: String,
    address: {
      street: String,
      civicNumber: String,
      city: String,
      coordinates: {
          x: Number,
          y: Number
      }
    }
  }),
  getters: {
    isUserLogged(state){
      return state.isUserLogged
    },
  },
  mutations: {
    login(state, payload) {
      state.name = payload.name;
      state.surname = payload.surname;
      state.username = payload.username;
      state.email = payload.email;
      state.phone = payload.phone;
      state.type = payload.type;
      state.address = payload.address;
    },
    logout(state) {
      state.name = null;
      state.surname = null;
      state.username = null;
      state.email = null;
      state.phone = null;
      state.type = null;
      state.address = null;
    },
  },
  actions: {
    login({ commit }, payload) {
      commit("login", payload);
    },
    logout({ commit }) {
      commit("logout");
    },
  }
}