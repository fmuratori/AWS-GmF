import axios from "axios";

import {
  LoginPayload,
  RegistrationPayload,
  DonationCreationPayload,
  SessionHeader,
  FamilyPayload,
  EventPayload,
  editUserPayload,
  changePasswordPayload,
  PackPayload,
  FoodPayload
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

  async editUser(payload: editUserPayload) {
    return axios.post(`${backendUrl}/api/user/update`, payload);
  },

  async changePassword(payload: changePasswordPayload) {
    return axios.post(`${backendUrl}/api/user/change-password`, payload);
  },

  async addDonation(payload: DonationCreationPayload, headers: SessionHeader) {
    return axios.post(`${backendUrl}/api/donation`, payload, { headers: headers.content });
  },

  async donationsList(headers: SessionHeader) {
    return axios.post(`${backendUrl}/api/donation/find`, { headers: headers.content });
  },

  async donationsMessagesCounts(userId: string, headers: SessionHeader) {
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
    return axios.post(`${backendUrl}/api/donation`, { params: payload, headers: headers.content });

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
    return axios.post(`${backendUrl}/api/donation/find`,  {data: payload, headers: headers.content} );

  },

  async getDonationChat(payload: ChatRequestPayload, headers: SessionHeader) {
    
    return axios.get(`${backendUrl}/api/donation/get-chat`, { params: payload, headers: headers.content });
  },
  
  async addFamily(payload: FamilyPayload) {
    return axios.post(`${backendUrl}/api/family/add`, payload);
  },

  async familyList(payload: any) {
    return axios.post(`${backendUrl}/api/family/find`, payload);
  },

  async createEvent(payload: EventPayload) {
    return axios.post(`${backendUrl}/api/event/add`, payload);
  },

  async editEvent(payload: EventPayload, ) {
    return axios.post(`${backendUrl}/api/event/edit`, payload);
  },

  async eventList(payload: any) {
    return axios.post(`${backendUrl}/api/event/find`, payload);
  },

  async createPack(payload: PackPayload) {
    return axios.post(`${backendUrl}/api/pack/add`, payload);
  },

  async packList(payload: any) {
    return axios.post(`${backendUrl}/api/pack/find`, payload);
  },

  async addFood(payload: FoodPayload) {
    return axios.post(`${backendUrl}/api/food/add-or-update`, payload);
  },

  async foodList(payload: any) {
    return axios.post(`${backendUrl}/api/food/find`, payload);
  }

};
