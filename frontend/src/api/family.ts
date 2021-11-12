import axios from "axios";

import store from "../store";
import { FamilyPayload } from "../types";

export default {
  async addFamily(payload: FamilyPayload) {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/add`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async familyList(payload: any) {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/find`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async verifyFamily(payload: any) {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/verify`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async editFamily(payload: FamilyPayload) {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/edit`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },
};
