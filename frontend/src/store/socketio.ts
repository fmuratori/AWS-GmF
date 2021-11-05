export default {
  state: {},
  mutations: {},
  actions: {
    // SOCKET_connect() {},

    // SOCKET_disconnect() {},

    SOCKET_message_to_client({ commit }, payload) {
      console.log("ac message_to_client", payload);
    },
  },
};
