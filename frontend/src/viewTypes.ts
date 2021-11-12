import { DonationCreationPayload, EventPayload, Family, Food, FoodPayload, Pack, PackPayload, SelectableFood } from "./types";

export interface CreateEventView {
    form: EventPayload,
    cancelRoute: string,
    submitLabel: string
}
export interface CreatedonationView {
    weekDays: object,
    form: DonationCreationPayload,
    submitLabel: string
}

export interface FoodManagerView {
    form: FoodPayload,
    foodList: Array<Food>,
    tableFields: Array<string>,
    reloadIndex: number
}

export interface PackCreateView {
    foodList: Array<SelectableFood>,
    family: Family,
    form: PackPayload
}

export interface PackManagerView {
    view: string,
    packList: Array<Pack>,
    tableFields: Array<string>
}

interface TableField {
    key: string,
    label: string,
    sortable: boolean,
    formatter?: (value: any) => {}
}

export interface FoodView {
    foodList: Array<Food>,
    tableFields: Array<TableField>,
    totalRows: number,
    currentPage: number,
    perPage: number,
    filter: string,
    filterOn: Array<string>,
    sortBy: string,
    sortDesc: false,
    sortDirection: "asc" | "desc",
    index: number,
}

