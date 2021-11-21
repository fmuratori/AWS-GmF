import axios, { AxiosResponse } from "axios";

import store from "../store";
import { FoodLabelsResponse, CountDataResponse, Event } from "../types";

export default {
    async getFoodLabels(): Promise<AxiosResponse<FoodLabelsResponse>> {
        return axios.get(
            `${process.env.VUE_APP_API_URL}/api/data/food-labels`,
            { headers: store.getters.getSessionHeader }
        );
    },

    async getNextEvents(): Promise<AxiosResponse<Event[]>> {
        return axios.get(
            `${process.env.VUE_APP_API_URL}/api/data/next-events`,
            { headers: store.getters.getSessionHeader }
        );
    },

    async getCountsData(): Promise<AxiosResponse<CountDataResponse>> {
        return axios.get(
            `${process.env.VUE_APP_API_URL}/api/data/count`,
            { headers: store.getters.getSessionHeader }
        );
    },
};
