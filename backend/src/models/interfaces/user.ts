import Address from "./utilInterfaces/address";

export default interface User {
    name: string,
    surname: string,
    hashPassword: string,
    email: string,
    phoneNumber: string,
    type: string,
    address: Address
}