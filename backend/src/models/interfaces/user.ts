interface User {
    name: String,
    phoneNumber: String, 
    address: {
        street: String,
        civicNumber: String,
        city: String
        // coordinates
    },
    members: Number 
}

export default User