import Address from "./utilInterfaces/address";

interface ChatNode {
    index: Number, 
    userId: String,
    userFullname: String,
    text: String,
    date: Date,
    visualized: Boolean
}

export default interface Donation {
    userId: String,
    chat: [ChatNode],
    foods: [String],
    expirationDate: Date,
    creationDate: Date,
    address: Address,
    additionalInformations: String,
    pickUpPeriod: [{
        weekDay: String,
        period: String
    }],
    status: String,
    volunteerId: String
}