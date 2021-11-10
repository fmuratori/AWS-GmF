import axios from "axios";
import moment from "moment";

import store from '../store'
import { Donation } from "../types"

export default {
  async addDonation(payload: Donation) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/donation/add`, payload, { headers: store.getters.getSessionHeader, });
  },

  async editDonation(payload: Donation) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/donation/edit`, payload, { headers: store.getters.getSessionHeader, });
  },

  async deleteDonation(donationId: string) {
    const payload = {
      id: donationId,
    };
    return axios.post(`${process.env.VUE_APP_API_URL}/api/donation/delete`, payload, { headers: store.getters.getSessionHeader, });
  },

  async userDonationsList(userId: string) {
    const payload = {
      userId: userId,
    };
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/find`,
      { filter: payload },
      { headers: store.getters.getSessionHeader, }
    );
  },

  async volunteerOpenDonations(expiredBy: null|Date, pickUpWeekDay: null|string, pickUpPeriod:null|string) {
    const payload = {
      "volunteerId": {
        "$in" : [null],
        "$exists" : true
      },
      "status": { "$ne": "selected" },   
    };
    if (expiredBy) payload["expirationDate"] = { "$lte" : moment(expiredBy).format('YYYY-MM-DD'), }
    if (pickUpWeekDay) payload["pickUpPeriod.weekDay"] = { "$in": [ pickUpWeekDay ], }
    if (pickUpPeriod) payload["pickUpPeriod.period"] = { "$in": [ pickUpPeriod ], }

    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/find`,
      { filter: payload },
      { headers: store.getters.getSessionHeader, }
    );
  },

  async volunteerUpdateDonations(donation: Donation) {
    // both for pick and reset picked donation
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/edit`,
      donation,
      { headers: store.getters.getSessionHeader, }
    );
  },

  async volunteerPickedDonations(volunteerId: string) {
    const payload = {
      "volunteerId": volunteerId
    };

    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/find`,
      { filter: payload },
      { headers: store.getters.getSessionHeader, }
    );
  },
}