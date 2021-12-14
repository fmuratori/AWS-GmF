import eventbus from "@/eventbus";
import { AxiosError, AxiosResponse } from "axios";
import Vue from "vue";

import chatApi from "../api/chat";
import { ChatMessage } from "../types";
import { SocketIoState } from "../storeTypes";

export default {
  state: (): SocketIoState => ({
    unreadMessages: [],
    chat: new Array<ChatMessage>(),
    donationId: "",
    connected: false,
  }),
  getters: {
    unreadMessagesTotalCount(state: SocketIoState): number {
      return state.unreadMessages
        .map((e) => e.chat.length)
        .reduce((a, b) => a + b, 0);
    },
    unreadMessages(
      state: SocketIoState
    ): { _id: string; chat: ChatMessage[] }[] {
      return state.unreadMessages;
    },
  },
  mutations: {
    setConnected(state: SocketIoState, value: boolean): void {
      state.connected = value;
      if (!value)
        eventbus.$emit("startLoading", "Connecting with backend server.");
      else eventbus.$emit("stopLoading");
    },
    addUnreadMessage(state: SocketIoState, message): void {
      console.log(message);
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
    getChat(
      state: SocketIoState,
      payload: { chat: ChatMessage[]; donationId: string }
    ): void {
      state.chat = payload.chat;
      state.donationId = payload.donationId;
    },
    addMessage(state: SocketIoState, message: ChatMessage): void {
      state.chat.push(message);
    },
    resetChat(state: SocketIoState): void {
      state.chat = new Array<ChatMessage>();
      state.donationId = "";
    },

    updateUnreadMessages(
      state: SocketIoState,
      messages: { chat: ChatMessage[]; _id: string }[]
    ): void {
      state.unreadMessages = messages;
    },

    removeDonationUnreadMessages(
      state: SocketIoState,
      donationId: string
    ): void {
      state.unreadMessages = state.unreadMessages.filter(
        (d) => d._id != donationId
      );
    },
  },
  actions: {
    SOCKET_connect({ commit }): void {
      commit("setConnected", true);
      console.log("Connected to server socket.io");
    },

    SOCKET_disconnect({ commit }): void {
      commit("setConnected", false);
      console.log("Disconnected from server socket.io");
    },

    SOCKET_chat_message(
      { commit, state, rootState },
      stringMessage: string
    ): void {
      const message = JSON.parse(stringMessage);

      if (state.donationId == message._id) {
        commit("addMessage", message.message);

        // set message as visualized
        if (message.message.userId != rootState.session.userData._id)
          new Vue().$socket.emit("visualize_message", stringMessage);
      } else if (rootState.session.userData._id != message.message.userId) {
        // update messages count
        commit("addUnreadMessage", message);
      }
    },

    sendMessage(
      { rootState, rootGetters },
      message: { donationId: string; message: string; isEventMessage: boolean }
    ): void {
      message["userId"] = rootState.session.userData._id;
      message["fullname"] = rootGetters.userFullName;

      new Vue().$socket.emit("message_to_server", message);
    },

    getChat({ commit, rootState }, donationId: string): void {
      chatApi
        .getDonationChat(donationId, rootState.session.userData._id)
        .then((r: AxiosResponse): void => {
          commit("getChat", { chat: r.data, donationId: donationId });
          commit("removeDonationUnreadMessages", donationId);
        })
        .catch((e: AxiosError) => console.log(e));
    },

    resetChat({ commit }): void {
      commit("resetChat");
    },

    updateUnreadMessages({ commit }, messages: ChatMessage[]): void {
      commit("updateUnreadMessages", messages);
    },
  },
};
