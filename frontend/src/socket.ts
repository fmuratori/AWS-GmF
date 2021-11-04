// import { io } from "socket.io-client";
// const socket = io("http://localhost:3001", { transports : ["websocket"] });

// socket.on("connect", () => {
//   console.log(socket.connected);
// });

/* vuejs based implementation */
import { io } from "socket.io-client";
import VueSocketIO from "vue-socket.io";

import store from "./store";

export default new VueSocketIO({
  debug: false, //true
  connection: io("http://localhost:3001", { transports: ["websocket"] }),
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_",
  },
});
