import axios, { AxiosResponse } from "axios";

import store from "../store";
import { Family, FamilyPayload, FindPayload } from "../types";

export default {
  async addFamily(payload: FamilyPayload): Promise<AxiosResponse<Family[]>> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/add`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async editFamily(payload: FamilyPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/edit`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async familyList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/find`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async familyWithPacksList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/find-more`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async verifyFamily(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/verify`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async deleteFamily(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/family/delete`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },
};
