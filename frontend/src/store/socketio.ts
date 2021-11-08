import api from "../api"
import Vue from "vue"
import { ChatMessage } from "../types"

export default {
  state: {
    unreadMessagesCount: 0,
    chat: new Array<ChatMessage>(),
    donationId: "",
  },
  mutations: {
    addUnreadMessage(state) {
      state.unreadMessagesCount += 1;
    },
    getChat(state, payload) {
      state.chat = payload.chat;
      state.donationId = payload.donationId;
    },
    addMessage(state, message) {
      state.chat.push(message);
    },
    resetChat(state) {
      state.chat = new Array<ChatMessage>();
      state.donationId = "";
    }
  },
  actions: {
    SOCKET_connect() {
      // TODO: reset the entire application
      console.log("Connected to server socket.io");
    },

    SOCKET_disconnect() {
      console.log("Disconnected from server socket.io");
    },

    SOCKET_chat_message({ commit, state }, stringMessage: string) {
      console.log(stringMessage);
      const message = JSON.parse(stringMessage);
      if (state.donationId == message.donationId) {
        commit("addMessage", message.message);

        // set message as visualized
        (new Vue()).$socket.emit("visualize_message", stringMessage);
        
      } else {
        // update messages count
        commit("addUnreadMessage");
      }
    },

    getChat({ commit, getters }, donationId:string) {
      api
        .getDonationChat(
          donationId,
          getters.getSessionHeader
        )
        .then((r: any) => {
          commit("getChat", { "chat": r.data.data.chat.chat, "donationId": donationId });
        })
        .catch((e) => console.log(e));
    },

    resetChat({ commit }) {
      commit("resetChat");
    },

  },
};
