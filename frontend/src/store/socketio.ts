import api from "../api"
import Vue from "vue"
import { ChatMessage } from "../types"

export default {
  state: {
    unreadMessagesCounts: [],
    chat: new Array<ChatMessage>(),
    donationId: "",
  },
  getters: {
    unreadMessagesTotalCount(state) {
      return state.unreadMessagesCounts.map(e => e.count).reduce((a, b) => a + b, 0)
    }
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
    },

    updateUnreadMessages(state, counts) {
      state.unreadMessagesCounts = counts;
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

    SOCKET_chat_message({ commit, state, rootState }, stringMessage: string) {
      const message = JSON.parse(stringMessage);
      if (state.donationId == message.donationId) {
        commit("addMessage", message.message);

        // set message as visualized
        if (message.message.userId != rootState.session.userData._id)
          (new Vue()).$socket.emit("visualize_message", stringMessage);

      } else {
        // update messages count
        commit("addUnreadMessage");
      }
    },

    getChat({ commit, getters, rootState }, donationId:string) {
      api
        .getDonationChat(
          donationId,
          rootState.session.userData._id,
          getters.getSessionHeader
        )
        .then((r: any) => {
          commit("getChat", { "chat": r.data.data.chat, "donationId": donationId });
        })
        .catch((e) => console.log(e));
    },

    resetChat({ commit }) {
      commit("resetChat");
    },

    updateUnreadMessages({ commit }, counts) {
      commit("updateUnreadMessages", counts)
    }

  },
};
