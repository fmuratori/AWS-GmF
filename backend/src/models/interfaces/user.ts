import Address from "./utilInterfaces/address";

interface User {
    name: String,
    surname: String,
    username: String,
    password: String,
    email: String,
    phoneNumber: String,
    type: String,
    address: Address
}

export default User