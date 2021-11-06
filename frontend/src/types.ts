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
  address: Address;
}

export interface editUserPayload {
  id: string,
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: Address;
}

export interface changePasswordPayload {
  id: string,
  oldPassword: string,
  newPassword: string
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
  _id: string,
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
  chat: ChatMessage[],
  creationDate: string, 
  status: string
}

export interface ChatMessage {
  fullName: string,
  text: string,
  visualized: boolean,
}

export interface ChatRequestPayload {
  donationId: string,
}

export interface FamilyPayload {
  reporterId: string,
  name: string,
  phoneNumber: string,
  components: number,
  address: Address
}

export interface Family {
  _id: string,
  reporterId: string,
  name: string,
  phoneNumber: string,
  components: number,
  status: string,
  address: Address
}

export interface EventPayload {
  id: string | null, 
  ownerVolunteerId: string,
  eventTitle: string,
  description: string,
  address: Address,
  date: Date,
  image: string
}

export interface Event {
  _id: string,
  eventTitle: String,
  description: String,
  address: Address,
  image: String,
  date: Date,
  ownerVolunteerId: String
}

// export interface OfferResponse {

// }

// export interface RegisteredUserData { }
