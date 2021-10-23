import Address from "./utilInterfaces/address";

interface Event {
    name: String,
    description: String,
    address: Address,
    image: String, // la stringa in base64 potrebbe essere troppo lunga
    date: Date,
    representativeVolunteer: String, // non ne sono sicuro 
}

export default Event