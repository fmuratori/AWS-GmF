export interface Address {
  street: string,
  civicNumber: string,
  city: string,
  coordinates: {
    x: number,
    y: number,
  },
}

export interface UserData {
  _id: string,
  name: string,
  surname: string,
  email: string,
  phoneNumber: string,
  type: string,
  address: Address,
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SessionHeader {
  content: {
    "x-access-token": string;
    "x-user-id": string;
  }
}

export interface RegistrationPayload {
  name: string;
  surname: string;
  password: string;
  email: string;
  phoneNumber: string;
  type: string;
  address: Address;
}

export interface DonationCreationPayload {
  userId: string,
  foods: [
    string
  ],
  expirationDate: string,
  address: Address,
  additionalInformation: string,
  pickUpPeriod: [{
      weekDay: string,
      period: string,
    }
  ]
}

export interface Donation {
  userId: string,
  foods: [
    string
  ],
  expirationDate: string,
  address: Address,
  additionalInformation: string,
  pickUpPeriod: [{
      weekDay: string,
      period: string,
    }
  ]
  chat: [ 
    {
      fullName: string,
      text: String,
      visualized: boolean,
    }, 
  ],
  creationDate: string, 
  status: string
}

// export interface OfferResponse {

// }

// export interface RegisteredUserData { }
