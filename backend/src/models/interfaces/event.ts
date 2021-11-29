import Address from "./utilInterfaces/address";

export default interface Event {
    eventTitle: string,
    description: string,
    address: Address,
    date: Date,
    ownerVolunteerId: string
}