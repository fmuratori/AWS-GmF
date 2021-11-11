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
    const payload = { id: donationId, };
    return axios.post(`${process.env.VUE_APP_API_URL}/api/donation/delete`, payload, { headers: store.getters.getSessionHeader, });
  },

  async filterDonations(filter: any) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/donation/find`, { filter: filter }, { headers: store.getters.getSessionHeader, });
  },

  async filterUserActiveDonations(userId: string) {
    const filter = { 
      "$and": [
        { "userId": userId },
        { "expirationDate": { "$gte": moment().format('YYYY-MM-DD'), }, }
      ],
    }
    return this.filterDonations(filter)
  },

  async filterUnpickedDonations(pickUpDate: null|Date, pickUpPeriod:null|string) {
    const filter:any = {
      "$and": [ {
          "status": "waiting", 
        }, { 
          "expirationDate": { "$gte" : moment().format('YYYY-MM-DD'), } 
        }
      ],
    };

    const pickUpFilter = {}
    if (pickUpDate) {
      const dayName =  moment(pickUpDate).locale("it").format("dddd").substring(0, 3);
      pickUpFilter["weekDay"] = dayName;
      filter["$and"].push({ "expirationDate": { "$gte" : moment(pickUpDate).format('YYYY-MM-DD'), } });
    }

    if (pickUpPeriod) pickUpFilter["period"] = pickUpPeriod
    
    filter["$and"].push({
      "pickUpPeriod": {
        "$elemMatch": pickUpFilter,
      },
    })
    return this.filterDonations(filter);
  },

  async filterPickedDonations(volunteerId: string) {
    const filter = {
      "pickUp.volunteerId": volunteerId
    };

    return this.filterDonations(filter);
  },
}