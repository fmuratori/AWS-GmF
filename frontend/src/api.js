import axios from "axios"

// axios.defaults.withCredentials = true

export default {
  async getFood() {
    return axios.get(`http://127.0.0.1:3000/api/food`);
  },
  async addFood(payload) {
    return axios.post(`http://127.0.0.1:3000/api/food`, payload);
  },
}
