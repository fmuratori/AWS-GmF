import Address from "./utilInterfaces/address";

export default interface Event {
    eventTitle: string,
    description: string,
    address: Address,
    image: string, // la stringa in base64 potrebbe essere troppo lunga
    date: Date,
    ownerVolunteerId: string
}