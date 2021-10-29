import axios from "axios";

// axios.defaults.withCredentials = true

const backendUrl = "http://localhost:3000";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {}

export interface RegistrationRequest {
  name: string;
  surname: string;
  password: string;
  email: string;
  phoneNumber: string;
  type: string;
  address: {
    street: string;
    civicNumber: string;
    city: string;
    coordinates: {
      x: number;
      y: number;
    };
  };
}

export interface RegistrationResponse {
  a: number
}


export default {
  async loginRequest(payload: LoginRequest): Promise<LoginResponse> {
    return axios.post(`${backendUrl}/api/user/login`, payload);
  },

  async registrationRequest(
    payload: RegistrationRequest ): Promise<RegistrationResponse> {
    return axios.post(`${backendUrl}/api/user/register`, payload);
  },
};
