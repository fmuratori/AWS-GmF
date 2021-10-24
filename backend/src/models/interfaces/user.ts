import Address from "./utilInterfaces/address";

export default interface User {
    name: String,
    surname: String,
    username: String,
    password: String,
    email: String,
    phoneNumber: String,
    type: String,
    address: Address
}