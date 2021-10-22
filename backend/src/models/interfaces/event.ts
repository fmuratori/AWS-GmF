interface Event {
    name: String,
    description: String,
    address: {
        street: String,
        civicNumber: String,
        city: String
        // coordinates
    },
    image: String, // la stringa in base64 potrebbe essere troppo lunga
    date: Date,
    representativeVolunteer: String, // non ne sono sicuro 
}

export default Event