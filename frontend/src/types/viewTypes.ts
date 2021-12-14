import {
  Donation,
  Event,
  EventPayload,
  Family,
  Food,
  FoodPayload,
  Pack,
  PackPayload,
  SelectableFood,
  LoginPayload,
  RegistrationPayload,
  UserData,
  changePasswordPayload,
} from "./types";

import { TableField, MapOptions, Coordinates } from "./miscTypes";

export interface LoginView {
  isLoginSelected: boolean;
  showLoginErrorMessage: boolean;
  registrationPrivacyChecked: boolean;
  login: LoginPayload;
  registration: RegistrationPayload;
}

export interface ManagerDonationsCreateView {
  form: Donation;
  submitLabel: string;
  isLocationLoaded: boolean;
}

export interface ManagerDonationsInspectView {
  donation: Donation;
  chatMessage: string;
}

export interface ManagerDonationsListView {
  donations: Donation[];
  donationsBackup: Donation[];
  sortByMode: string;
  filterByMode: string;
  sorters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
  filters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
}

export interface ManagerDonationsRetrieveView {
  mapsOptions: MapOptions;
  selectedCity: {
    name: string;
    coordinates: Coordinates
  };
  donations: Donation[];
  selectedDonations: Donation[];
  windowDonations: Donation[];
  windowCoordinates: Coordinates;
  pickUpDate: Date;
  pickUpPeriod: string;
  isModalOpen: boolean;
}

export interface ManagerEditUserInfoView {
  regRepeatPassword: string;
  form: UserData;
  changePasswordForm: changePasswordPayload; // TODO: move to components type
  mode: string;
};

export interface ManagerEventCreateView {
  form: EventPayload;
  submitLabel: string;
}

export interface ManagerEventListView {
  statusFilter: string; //"past"; "present"; "future"
  sortByMode: string; // "eventDateAscending". "eventDateDescending"
  eventList: Event[];
  eventListBackup: Event[];
  deleteEventId: string;
  sorters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
  filters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
}

export interface ManagerFamilyCheckView {
  familyList: Family[];
  tableFields: TableField[];    
  filterOn: string[];
  filterQuery: string;
  selectedFamily: Family;
  currentPage: number;
  perPage: number;
  totalRows: number;
  deletedFamilyId: string;
}

export interface ManagerFamilyListView {
  statusFilter: string;
  sortByMode: string;
  familyList: Family[];
  familyListBackup: Family[];
  deleteFamilyId: string;
  sorters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
  filters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
}

export interface ManagerFamilySubscribeView {
  form: Family;
  submitLabel: string;
}

export interface ManagerFoodView {
  form: Food;
  foodList: Food[]; //SelectableFood
  reloadIndex: number;
  isEditMode: boolean;
}

export interface ManagerPackCreateView {
  step: "selectFamily" | "selectFoods" | "loading" | "printableInfo"; // string;
  foodList: SelectableFood[];
  selectedFamily: Family;
  form: PackPayload;
  isPrinted: boolean;
}

export interface ManagerPackDeliveryView {
  mapsOptions: MapOptions;
  filters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
  selectedCity: {
    name: string;
    coordinates: Coordinates;
  };
  daysToExpiration: number;
  packs: Pack[];
  foods: Food[];
  selectedPacks: Pack[];
  unselectedPacks: Pack[];
  windowPacks: Pack[];
  windowCoordinates: Coordinates;
  deliveryDate: Date;
  deliveryPeriod: string;
  isModalOpen: boolean;
}

export interface ManagerPackListView {
  filters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
  packList: Pack[];
  packListBackup: Pack[];
  selectedPack: Pack;
  tableFields: TableField[];   
  deletePackId: string;
}

export interface ManagerPackScanView {
  showScreen: string;
  isScannerVisible: boolean;
  result: string;
  isMobile: boolean;
  cameraState: string;
  scannerState: string;
  isScannerFullscreen: boolean;
  pack: Pack;
}

//////////////////////////////////

export interface FilterButton {
  value: string;
  label: string;
  icon: string;
  isVisible: boolean;
}
