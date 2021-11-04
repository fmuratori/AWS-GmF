import axios from "axios";

import {
  LoginPayload,
  RegistrationPayload,
  DonationPayload,
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

  async addDonation(payload: DonationPayload) {
    return axios.post(`${backendUrl}/api/donation/add`, payload);
  },

  async donationsList(payload: DonationPayload) {
    return axios.post(`${backendUrl}/api/donation/list-all`, payload);
  },
};
