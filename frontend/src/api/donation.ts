import axios, { AxiosResponse } from "axios";
import moment from "moment";

import store from "../store";
import { Donation, FindPayload } from "../types/types";

export default {
  async addDonation(payload: Donation): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/add`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async editDonation(payload: Donation): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/edit`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async retrieveDonation(donationId: string): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/retrieve`,
      { donationId: donationId },
      { headers: store.getters.getSessionHeader }
    );
  },

  async deleteDonation(donationId: string): Promise<AxiosResponse> {
    const payload = { id: donationId };
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/delete`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async filterDonations(
    filter: FindPayload
  ): Promise<AxiosResponse<Donation[]>> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/donation/find`,
      filter,
      { headers: store.getters.getSessionHeader }
    );
  },

  async filterUserActiveDonations(userId: string): Promise<AxiosResponse> {
    const filter = {
      $and: [
        { userId: userId },
        { expirationDate: { $gte: moment().format("YYYY-MM-DD") } },
      ],
    } as FindPayload;
    return this.filterDonations({ filter: filter });
  },

  async filterUnpickedDonations(
    city: string,
    pickUpDate: string,
    pickUpPeriod: string
  ): Promise<AxiosResponse<Donation[]>> {
    const filter = {
      $and: [
        {
          status: "waiting",
        },
        {
          expirationDate: { $gte: moment().format("YYYY-MM-DD") },
        },
      ],
    } as FindPayload;

    if (city) {
      filter["$and"].push({ "address.city": city });
    }

    const pickUpFilter = {};
    if (pickUpDate) {
      const dayName = moment(pickUpDate)
        .locale("it")
        .format("dddd")
        .substring(0, 3);
      pickUpFilter["weekDay"] = dayName;
      filter["$and"].push({
        expirationDate: { $gte: moment(pickUpDate).format("YYYY-MM-DD") },
      });
    }

    if (pickUpPeriod) pickUpFilter["period"] = pickUpPeriod;

    filter["$and"].push({
      pickUpPeriod: {
        $elemMatch: pickUpFilter,
      },
    });

    return this.filterDonations({ filter: filter });
  },

  async filterPickedDonations(volunteerId: string): Promise<AxiosResponse> {
    const filter = {
      "pickUp.volunteerId": volunteerId,
    } as FindPayload;

    return this.filterDonations(filter);
  },

  async findDonation(donationId: string): Promise<AxiosResponse<Donation[]>> {
    const filter = {
      _id: donationId,
    } as FindPayload;

    return this.filterDonations({ filter: filter });
  },
};
