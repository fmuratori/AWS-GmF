import axios, { AxiosResponse } from "axios";

import store from "../store";
import { ChartDataResponse, FindPayload, FoodPayload } from "../types";

export default {
  async addFood(payload: FoodPayload): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/food/add-or-update`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async foodList(payload: FindPayload): Promise<AxiosResponse> {
    return axios.post(`${process.env.VUE_APP_API_URL}/api/food/find`, payload, {
      headers: store.getters.getSessionHeader,
    });
  },

  async deleteFood(payload: { id: string }): Promise<AxiosResponse> {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/api/food/delete`,
      payload,
      { headers: store.getters.getSessionHeader }
    );
  },

  async getChartData(): Promise<AxiosResponse<ChartDataResponse>> {
    return axios.get(
      `${process.env.VUE_APP_API_URL}/api/food/get-chart-data`,
      { headers: store.getters.getSessionHeader }
    );
  },
};
