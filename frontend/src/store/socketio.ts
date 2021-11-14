import chatApi from "../api/chat";
import Vue from "vue";
import { ChatMessage } from "../types";

export default {
  state: {
    unreadMessages: [],
    chat: new Array<ChatMessage>(),
    donationId: "",
  },
  getters: {
    unreadMessagesTotalCount(state): number {
      return state.unreadMessages
        .map((e) => e.chat.length)
        .reduce((a, b) => a + b, 0);
    },
  },
  mutations: {
    addUnreadMessage(state, message): void {
      const donationChat = state.unreadMessages.find(
        (e) => e._id == message._id
      );

      if (donationChat) donationChat.chat.push(message.message);
      else {
        const newUnreadMessage = {
          _id: message._id,
          chat: [message.message],
        };
        state.unreadMessages.push(newUnreadMessage);
      }
    },
    getChat(state, payload): void {
      state.chat = payload.chat;
      state.donationId = payload.donationId;
    },
    addMessage(state, message): void {
      state.chat.push(message);
    },
    resetChat(state): void {
      state.chat = new Array<ChatMessage>();
      state.donationId = "";
    },

    updateUnreadMessages(state, messages): void {
      state.unreadMessages = messages;
    },

    removeDonationUnreadMessages(state, donationId: string): void {
      state.unreadMessages = state.unreadMessages.filter(
        (d) => d._id != donationId
      );
    },
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
      if (state.donationId == message._id) {
        commit("addMessage", message.message);

        // set message as visualized
        if (message.message.userId != rootState.session.userData._id)
          new Vue().$socket.emit("visualize_message", stringMessage);
      } else {
        // update messages count
        commit("addUnreadMessage", message);
      }
    },

    getChat({ commit, getters, rootState }, donationId: string): void {
      chatApi
        .getDonationChat(donationId, rootState.session.userData._id)
        .then((r: any) => {
          commit("getChat", { chat: r.data, donationId: donationId });
          commit("removeDonationUnreadMessages", donationId);
        })
        .catch((e) => console.log(e));
    },

    resetChat({ commit }): void {
      commit("resetChat");
    },

    updateUnreadMessages({ commit }, messages): void {
      commit("updateUnreadMessages", messages);
    },
  },
};
