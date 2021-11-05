import axios from "axios";

import {
  LoginPayload,
  RegistrationPayload,
  Donation,
  SessionHeader,
  FamilyPayload,
  EventPayload
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

  async addDonation(payload: Donation, headers: SessionHeader) {
    return axios.post(`${backendUrl}/api/donation`, payload, { headers: headers.content });
  },

  async editDonation(payload: Donation, headers: SessionHeader) {
    return axios.post(`${backendUrl}/api/donation/edit`, payload, { headers: headers.content });
  },

  async userDonationsList(userId: string, headers: SessionHeader) {
    const payload = {
      userId: userId,
    }
    return axios.post(`${backendUrl}/api/donation`, { "filter": payload }, { headers: headers.content });
  },

  async donationsMessagesCounts(userId:string, headers: SessionHeader) {
    const payload = {
      "filter": {
        "userId": userId,
        "chat": {
          "$elemMatch": {
            "visualized": false
          }
        }
      },
      "projection": {
        "chat.$": 1,
        "donationId": 1
      }
    }
    return axios.get(`${backendUrl}/api/donation`, { params: payload, headers: headers.content });
  },

  async getDonationChat(donationId: string, headers: SessionHeader) {
    const payload = {
      donationId: donationId,
    }
    return axios.post(`${backendUrl}/api/donation/get-chat`, payload, { headers: headers.content });
  },

  async deleteDonation(donationId: string, headers: SessionHeader) {
    const payload = {
      id: donationId,
    }
    return axios.delete(`${backendUrl}/api/donation`, { data: payload, headers: headers.content });
  },

  async addFamily(payload: FamilyPayload) {
    return axios.post(`${backendUrl}/api/family`, payload);
  },

  async familyList(payload: FamilyPayload) {
    return axios.get(`${backendUrl}/api/family`, { params: payload });
  },

  async createEvent(payload: EventPayload) {
    return axios.post(`${backendUrl}/api/event`, payload);
  },

  async eventList(payload: EventPayload) {
    return axios.get(`${backendUrl}/api/event`, { params: payload });
  },

};
