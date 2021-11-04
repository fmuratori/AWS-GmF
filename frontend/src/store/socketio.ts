export default {
  state: {},
  mutations: {},
  actions: {
    SOCKET_connect() {
      console.log("ac connection");
      // eslint-disable-next-line
      // console.log(this.$socket)
      // $socket.emit('pingServer', 'PING!')
    },

    SOCKET_disconnect() {
      console.log("ac disconnection");
    },

    SOCKET_message_to_client({ commit }, payload) {
      console.log("ac message_to_client", payload);
    },
  },
};
