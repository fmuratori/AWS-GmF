import Address from "./utilInterfaces/address";

interface ChatNode {
    user: String,
    text: String,
    visualized: Boolean
}

export default interface Donation {
    user_id: String,
    chat: [ChatNode],
    food_ids: [String],
    expirationDate: Date,
    creationDate: Date,
    address: Address,
    additionalInformations: String,
    pickUpPeriods: [{
        weekDay: String,
        startTime: String,
        endTime: String
    }],
    pickUpDate: Date,
    status: String,
    volunteer: String // non ne sono sicuro
}