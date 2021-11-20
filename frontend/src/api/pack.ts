import axios, { AxiosResponse } from "axios";

import store from "../store";
import { FindPayload, PackPayload } from "../types";

export default {
  async createPack(payload: PackPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/add`, payload, {
      headers: store.getters.getSessionHeader,
    });
  },

  async packList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/find`, payload, {
      headers: store.getters.getSessionHeader,
    });
  },

  async deletePack(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/pack/delete`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async advancePackStatus(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/pack/advance`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },
};
