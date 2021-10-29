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