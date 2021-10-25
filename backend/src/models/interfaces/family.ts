import Address from "./address";

interface Family {
    name: String,
    password: String,
    salt: Number,
    email: String,
    phoneNumber: String,
    address: Address,
    type: String
}

export default Family