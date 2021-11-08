export interface Address {
  street: string;
  civicNumber: string;
  city: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface UserData {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  type: string;
  address: Address;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SessionHeader {
  content: {
    "x-access-token": string;
    "x-user-id": string;
  };
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

export interface Donation {
  _id: string;
  userId: string;
  foods: [string];
  expirationDate: string;
  address: Address;
  additionalInformation: string;
  pickUpPeriod: [
    {
      weekDay: string;
      period: string;
    }
  ];
  chat: ChatMessage[];
  creationDate: string;
  status: string;
}

export interface ChatMessage {
  userId: string;
  userFullName: string;
  date: string;
  text: string;
  visualized: boolean;
}

export interface ChatRequestPayload {
  donationId: string;
}

export interface DonationDeletionPayload {
  id: string;
}

export interface FamilyPayload {
  userId: string;
  phoneNumber: string;
  components: number;
  address: Address;
}

export interface EventPayload {
  ownerVolunteerId: string;
  eventTitle: string;
  description: string;
  address: Address;
  date: Date;
  image: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  address: Address;
  image: string;
  date: Date;
  ownerVolunteerId: string;
}

// export interface OfferResponse {

// }

// export interface RegisteredUserData { }
