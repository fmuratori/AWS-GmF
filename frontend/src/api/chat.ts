import axios from "axios";

import store from '../store'

export default {
  async unreadMessages(userId: string) {
    const payload = {
      userId: userId,
    };
    return axios.post(`${process.env.VUE_APP_API_URL}/api/donation/unread-messages`, payload, { headers: store.getters.getSessionHeader, });
  },

  async getDonationChat(donationId: string, userId: string) {
    const payload = {
      donationId: donationId,
      userId: userId,
    };
    return axios.post(`${process.env.VUE_APP_API_URL}/api/donation/get-chat`, payload, { headers: store.getters.getSessionHeader, });
  },
}