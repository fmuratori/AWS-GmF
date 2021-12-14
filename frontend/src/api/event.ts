import axios, { AxiosResponse } from "axios";

import store from "../store";
import { EventPayload, FindPayload } from "../types/types";

export default {
  async createEvent(payload: EventPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/event/add`, payload, {
      headers: store.getters.getSessionHeader,
    });
  },

  async editEvent(payload: EventPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/event/edit`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async eventList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post<Event[]>(
      `${process.env.VUE_APP_API_URL}/api/event/find`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async deleteEvent(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/event/delete`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },
};
