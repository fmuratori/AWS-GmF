import Address from "./utilInterfaces/address";

interface ChatNode {
    index: number, 
    userId: string,
    userFullname: string,
    text: string,
    date: Date,
    visualized: boolean
}

interface PickUp {
    volunteerId: string,
    date: Date, 
    period: string
}

export default interface Donation {
    userId: string,
    chat: [ChatNode],
    foods: [string],
    expirationDate: Date,
    creationDate: Date,
    address: Address,
    additionalInformations: string,
    pickUpPeriod: [{
        weekDay: string,
        period: string
    }],
    status: string,
    pickUp: PickUp
}