import axios from "axios";

import {
  LoginPayload,
  RegistrationPayload,
  DonationPayload,
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

  async addDonation(payload: DonationPayload, headers: SessionHeader) {
    return axios.post(`${backendUrl}/api/donation/add`, payload, { headers: headers.content });

    // x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTc4NjY3YmZhYTcyMGEwNThmN2YyZTEiLCJpYXQiOjE2MzUzNjQwNzQsImV4cCI6MTYzNTM2NzY3NH0.9OYz7fPmtXA9kOKqejuHZzqLWQ9TjRVpyaDj1Z9FbR8
    // x-user-id: 6178667bfaa720a058f7f2e1
  },

  async donationsList(headers: SessionHeader) {
    return axios.get(`${backendUrl}/api/donation/list-all`, { headers: headers.content });
  },
};
