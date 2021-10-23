import Address from "./utilInterfaces/address";
import PickUpPeriod from "./utilInterfaces/pickUpPeriod";

interface ChatNode {
    user: String,
    text: String,
    visualized: Boolean
}

interface Donation {
    user_id: String,
    chat: [ChatNode],
    food_ids: [String],
    expirationDate: Date,
    creationDate: Date,
    address: Address,
    additionalInformations: String,
    pickUpPeriods: [PickUpPeriod],
    pickUpDate: Date,
    status: String,
    volunteer: String // non ne sono sicuro
}

export default Donation