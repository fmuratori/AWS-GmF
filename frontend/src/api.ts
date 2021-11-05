import axios from "axios";

import {
  LoginPayload,
  RegistrationPayload,
  DonationCreationPayload,
  SessionHeader,
  FamilyPayload,
  ChatRequestPayload
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
    return axios.get(`${backendUrl}/api/donation/list-all`, { params: payload, headers: headers.content });

  },

  async getDonationChat(payload: ChatRequestPayload, headers: SessionHeader) {
    
    return axios.get(`${backendUrl}/api/donation/get-chat`, { params: payload, headers: headers.content });
  },
  
  async addFamily(payload: FamilyPayload) {
    return axios.post(`${backendUrl}/api/family/add`, payload);
  },

  async familyList(payload: FamilyPayload) {
    return axios.post(`${backendUrl}/api/family/list-all`, payload);
  },

};
