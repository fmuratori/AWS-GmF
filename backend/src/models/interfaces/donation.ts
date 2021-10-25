import Address from "./address";

interface Donation {
    user: String, // non ne sono sicuro
    chat: [
        {
            user: String,
            text: String,
            visualized: Boolean
        }
    ],
    foods: [
        {
            name: String
        }
    ],
    expirationDate: Date,
    creationDate: Date,
    address: Address,
    additionalInformations: String,
    pickUpPeriods: [
        {
            weekDay: String,
            startTime: String,
            endTime: String
        }
    ],
    pickUpDate: Date,
    status: String,
    volunteer: String // non ne sono sicuro
}

export default Donation