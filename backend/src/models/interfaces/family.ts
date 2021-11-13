import Address from "./utilInterfaces/address";

export default interface Family {
    reporteId: string,
    name: string,
    phoneNumber: string,
    components: number,
    address: Address,
    status: string
}