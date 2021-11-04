import axios from "axios";

import {
  LoginPayload,
  RegistrationPayload,
  DonationCreationPayload,
  SessionHeader
} from "./types";

// axios.defaults.withCredentials = true
const backendUrl = "http://localhost:3000";

export default {
  async loginRequest(payload: LoginPayload) {
    return axios.post(`${backendUrl}/api/user/login`, payload);
  },

  async registrationRequest(payload: RegistrationPayload) {
    return axios.post(`${backendUrl}/api/user/register`, payload);
  },

  async addDonation(payload: DonationCreationPayload, headers: SessionHeader) {
    return axios.post(`${backendUrl}/api/donation/add`, payload, { headers: headers.content });
  },

  async donationsList(headers: SessionHeader) {
    return axios.get(`${backendUrl}/api/donation/list-all`, { headers: headers.content });
  },
};
