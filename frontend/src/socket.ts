// import { io } from "socket.io-client";
// const socket = io("http://localhost:3001", { transports : ["websocket"] });

// socket.on("connect", () => {
//   console.log(socket.connected);
// });

/* vuejs based implementation */
import { io } from "socket.io-client";
import VueSocketIO from "vue-socket.io";

import store from "./store";

const socket = io("http://localhost:3001", { transports: ["websocket"] })

const vueSocket = new VueSocketIO({
  debug: false, //true
  connection: socket,
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_",
  },
});

export default vueSocket
export { socket } 