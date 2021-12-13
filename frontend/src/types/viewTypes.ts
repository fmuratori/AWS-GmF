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
} from "../types";

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
  mapsOptions: {
    zoomControl: boolean;
    mapTypeControl: boolean;
    scaleControl: boolean;
    streetViewControl: boolean;
    rotateControl: boolean;
    fullscreenControl: boolean;
    disableDefaultUi: boolean;
    clickableIcons: boolean;
  };
  selectedCity: {
    name: string;
    coordinates: {
      x: 0;
      y: 0;
    };
  };
  donations: Donation[];
  selectedDonations: Donation[];
  windowDonations: Donation[];
  windowCoordinates: { x: number; y: number };
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
  tableFields: {key: string; sortable: boolean; label: string}[];    
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
  foodList: Food[];
  reloadIndex: number;
  isEditMode: boolean;
}

export interface ManagerPackCreateView {
  step: string;
  foodList: SelectableFood[];
  selectedFamily: Family;
  form: PackPayload;
  isPrinted: boolean;
}

export interface ManagerPackDeliveryView {
  mapsOptions: {
    zoomControl: boolean;
    mapTypeControl: boolean;
    scaleControl: boolean;
    streetViewControl: boolean;
    rotateControl: boolean;
    fullscreenControl: boolean;
    disableDefaultUi: boolean;
    clickableIcons: boolean;
  };
  filters: { // TODO: move to components types
    name: string;
    label: string;
    icon: null | string;
    isVisible: boolean;
  }[];
  selectedCity: {
    name: string;
    coordinates: {
      x: number;
      y: number;
    };
  };
  daysToExpiration: number;
  packs: Pack[];
  foods: Food[];
  selectedPacks: Pack[];
  unselectedPacks: Pack[];
  windowPacks: Pack[];
  windowCoordinates: { x: number; y: number };
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
  tableFields: { key: string; sortable: boolean; label: string }[];   
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

export interface ReportFamilyView {
  form: Family;
  submitLabel: string;
}

export interface FoodManagerView {
  form: FoodPayload;
  foodList: Array<Food>;
  tableFields: Array<string>;
  availableLables: Array<{ text: string; value: string }>;
  reloadIndex: number;
}

export interface PackCreateView {
  step: "selectFamily" | "selectFoods" | "loading" | "printableInfo";
  isPrinted: boolean;
  foodList: Array<SelectableFood>;
  familyList: Array<Family>;
  selectedFamily: Family | null;
  form: PackPayload;
}

export interface PackManagerView {
  statusFilter: "ready" | "planned delivery" | "delivered" | "all";
  packList: Array<Pack>;
  packListBackup: Array<Pack>;
  familyDetails?: Family;
  foodDetails?: Array<Food>;
  tableFields: Array<TableField>;
  deletePackId: string;
}

interface TableField {
  key: string;
  label: string;
  sortable: boolean;
  formatter?: any;
}

export interface FoodView {
  foodList: Array<SelectableFood>;
  tableFields: Array<TableField>;
  totalRows: number;
  currentPage: number;
  perPage: number;
  filter: string;
  filterOn: Array<string>;
  sortBy: string;
  sortDesc: false;
  sortDirection: "asc" | "desc";
  index: number;
  deleteFoodId: string;
}
