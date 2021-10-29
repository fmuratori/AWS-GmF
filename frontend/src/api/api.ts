import axios from "axios";

import {LoginRequest, LoginResponse, RegistrationRequest, RegistrationResponse} from "../api/types"

// axios.defaults.withCredentials = true

const backendUrl = "http://localhost:3000";

export default {
  async loginRequest(payload: LoginRequest): Promise<LoginResponse> {
    return axios.post(`${backendUrl}/api/user/login`, payload);
  },

  async registrationRequest(
    payload: RegistrationRequest ): Promise<RegistrationResponse> {
    return axios.post(`${backendUrl}/api/user/register`, payload);
  },
};
