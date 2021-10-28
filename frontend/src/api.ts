import axios from "axios"

// axios.defaults.withCredentials = true

interface LoginPaylod {
  name: string, 
  password: string
}

interface RegistrationPayload {
  name: string,
  surname: string,
  username: string,
  password: string,
  email: string,
  phoneNumber: string,
  type: string,
  address: {
    street: string,
    civicNumber: string,
    city: string,
    coordinates: {
        x: number,
        y: number,
    },
  },
}

export default {
  // async getFood() {
  //   return axios.get(`http://127.0.0.1:3000/api/food`);
  // },
  // async addFood(payload) {
  //   return axios.post(`http://127.0.0.1:3000/api/food`, payload);
  // },

  async loginRequest(payload: LoginPaylod ) {
    return axios.post(`http://localhost:3000/api/user/login`, payload);
  },

  async registrationRequest(payload: RegistrationPayload ) {
    return axios.post(`http://localhost:3000/api/user/register`, payload);
  },

  // async updateUserRequest() {
  //   return axios.post(`http://localhost:3000/api/user/update`, payload);
  // }

  // async logoutRequest() {
  //   return axios.post(`http://localhost:3000/api/user/logout`, payload);
  // }
}
