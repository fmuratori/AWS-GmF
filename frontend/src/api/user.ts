import axios, { AxiosResponse } from "axios";

import store from "../store";

import {
  LoginPayload,
  RegistrationPayload,
  editUserPayload,
  changePasswordPayload,
} from "../types";

export default {
  async loginRequest(payload: LoginPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/user/login`, payload);
  },

  async registrationRequest(
    payload: RegistrationPayload
  ): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/user/register`,
      payload
    );
  },

  async editUser(payload: editUserPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/user/update`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async changePassword(payload: changePasswordPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/user/change-password`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },
};
