import axios from "axios";

import {
  LoginPayload,
  RegistrationPayload,
  Donation,
  SessionHeader,
  FamilyPayload,
  EventPayload,
  editUserPayload,
  changePasswordPayload
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

  async addDonation(payload: Donation, headers: SessionHeader) {
    return axios.post(`${backendUrl}/api/donation/add`, payload, {
      headers: headers.content,
    });
  },

  async editDonation(payload: Donation, headers: SessionHeader) {
    return axios.post(`${backendUrl}/api/donation/edit`, payload, {
      headers: headers.content,
    });
  },

  async deleteDonation(donationId: string, headers: SessionHeader) {
    const payload = {
      id: donationId,
    };
    return axios.post(`${backendUrl}/api/donation/delete`, payload, {
      headers: headers.content,
    });
  },

  async userDonationsList(userId: string, headers: SessionHeader) {
    const payload = {
      userId: userId,
    };
    return axios.post(
      `${backendUrl}/api/donation/find`,
      { filter: payload },
      { headers: headers.content }
    );
  },

  async unreadMessages(userId: string, headers: SessionHeader) {
    const payload = {
      userId: userId
    };
    return axios.post(`${backendUrl}/api/donation/unread-messages`, payload, {
      headers: headers.content,
    });
  },

  async getDonationChat(donationId: string, userId: string, headers: SessionHeader) {
    const payload = {
      donationId: donationId,
      userId: userId,
    };
    return axios.post(`${backendUrl}/api/donation/get-chat`, payload, {
      headers: headers.content,
    });
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
};
