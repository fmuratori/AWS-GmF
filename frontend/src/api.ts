import axios from "axios";

import { EventPayload, PackPayload, FoodPayload } from "./types";

// axios.defaults.withCredentials = true

export default {
  /* events */

  async createEvent(payload: EventPayload) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/event/add`, payload);
  },

  async editEvent(payload: EventPayload) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/event/edit`, payload);
  },

  async eventList(payload: any) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/event/find`, payload);
  },

  /* packs */

  async createPack(payload: PackPayload) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/add`, payload);
  },

  async packList(payload: any) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/find`, payload);
  },

  /* foods */

  async addFood(payload: FoodPayload) {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/food/add-or-update`,
      payload
    );
  },

  async foodList(payload: any) {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/food/find`, payload);
  },
};
