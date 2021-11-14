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
  address: Address;
}

export interface editUserPayload {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: Address;
}

export interface changePasswordPayload {
  id: string;
  oldPassword: string;
  newPassword: string;
}

export interface DonationCreationPayload {
  userId: string;
  foods: Array<string>;
  expirationDate: string;
  address: Address;
  additionalInformation: string;
  pickUpPeriod: Array<{ weekDay: string; period: string }>;
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
  pickUp: {
    volunteerId: string;
    date: string;
    period: string;
  };
}

export interface ChatMessage {
  userId: string;
  userFullName: string;
  date: string;
  text: string;
  visualized: boolean;
  messages: string[]; // needed to display the chat in a different way
}

export interface ChatRequestPayload {
  donationId: string;
}

export interface DonationDeletionPayload {
  id: string;
}

export interface FamilyPayload {
  reporterId: string;
  name: string;
  phoneNumber: string;
  components: number;
  address: Address;
}

export interface Family {
  _id: string;
  reporterId: string;
  name: string;
  phoneNumber: string;
  components: number;
  status: string;
  address: Address;
}

export interface EventPayload {
  _id: string | null;
  ownerVolunteerId: string;
  eventTitle: string;
  description: string;
  address: Address;
  date: Date;
  image: string;
}

export interface Event {
  _id: string;
  eventTitle: string;
  description: string;
  address: Address;
  image: string;
  date: Date;
  ownerVolunteerId: string;
}

export interface PackPayload {
  foodList: [{ foodId: string; number: number }];
  familyId: string;
}

export interface Pack {
  foodIdList: [string];
  deliveryVolunteerId: string;
  status: string;
  familyId: string;
  deliveryDate: Date;
  deliveryPeriod: string;
}

export interface FoodPayload {
  name: string;
  number: number;
  expirationDate: Date;
  labels: [string];
}

export interface Food {
  _id: string;
  name: string;
  number: number;
  expirationDate: Date;
  labels: [string];
}
export interface SelectableFood extends Food {
  selected: number;
}

export interface FindPayload {
  filter?: any;
  sortBy?: any;
  pageSize?: number;
  page?: number;
}

export interface UserState {
  token: string;
  userData: UserData;
}

export interface NavigationState {
  isSidebarOpen: boolean;
  screenWidth: number;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

// export interface OfferResponse {

// }

// export interface RegisteredUserData { }
