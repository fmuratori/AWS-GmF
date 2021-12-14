import { Event, Family, SelectableFood, Address } from "./types";

import { TableField, MapOptions } from "./miscTypes";

export interface HomepageEventsComponent {
  selected: number;
  eventList: Event[];
  showFullText: boolean;
  loadedData: boolean;
}

export interface InputAddressComponent {
  query: string;
  address: Address;
  isLocationLoaded: boolean;
}

export interface InputDateComponent {
  dateModel: string;
}

export interface InputListComponent {
  labels: string[];
}

export interface InputPasswordSelectComponent {
  password: string;
  regRepeatPassword: string;
}

export interface UserUpgradeModalComponent {
  userEmail: string;
}

export interface FamilyViewComponent {
  familyList: Family[];
  tableFields: TableField[];
  totalRows: number;
  currentPage: number;
  perPage: number;
  sortBy: string;
  sortDesc: boolean;
  sortDirection: string;
  filterOn: string[];
  filter: string;
}

export interface FilterButtonsComponent {
  selectedFilter: string;
}

export interface FoodViewComponent {
  foodList: SelectableFood[];
  tableFields: TableField[];
  totalRows: number;
  currentPage: number;
  perPage: number;
  sortBy: string;
  sortDesc: boolean;
  sortDirection: string;
  filterOn: string[];
  filter: string;
  index: number;
  deleteFoodId: string;
}

export interface LoadingComponent {
  isActive: boolean;
  message: string;
}

export interface MapLocationComponent {
  xCoord: number;
  yCoord: number;
  mapsOptions: MapOptions;
}
