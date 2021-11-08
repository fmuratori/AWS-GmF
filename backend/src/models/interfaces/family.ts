import Address from "./utilInterfaces/address";

export default interface Family {
    reporteId: String,
    name: String,
    phoneNumber: String,
    components: Number,
    address: Address,
    status: String
}