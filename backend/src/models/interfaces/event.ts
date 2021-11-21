import Address from "./utilInterfaces/address";

export default interface Event {
    eventTitle: string,
    description: string,
    address: Address,
    image: File,
    date: Date,
    ownerVolunteerId: string
}