interface Family {
    name: String,
    password: String,
    salt: Number,
    email: String,
    phoneNumber: String,
    address: {
        street: String,
        civicNumber: String,
        city: String
        // coordinates
    },
    type: String
}

export default Family