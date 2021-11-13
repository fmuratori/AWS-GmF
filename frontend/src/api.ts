import axios, { AxiosResponse } from "axios";

import { EventPayload, PackPayload, FoodPayload, FindPayload } from "./types";

// axios.defaults.withCredentials = true

export default {
  /* events */

  async createEvent(payload: EventPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/event/add`, payload);
  },

  async editEvent(payload: EventPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/event/edit`, payload);
  },

  async eventList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post<Event[]>(
      `${process.env.VUE_APP_API_URL}/api/event/find`,
      payload
    );
  },

  /* packs */

  async createPack(payload: PackPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/add`, payload);
  },

  async packList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/pack/find`, payload);
  },

  /* foods */

  async addFood(payload: FoodPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/food/add-or-update`,
      payload
    );
  },

  async foodList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/food/find`,
      payload
    );
  },

  async deleteFood(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/food/delete`,
      payload
    )
  }
};
