interface Donation {
    user: String, // non ne sono sicuro
    chat: [
        {
            user: String,
            text: String,
            visualized: Boolean
        }
    ],
    foods: [
        {
            name: String
        }
    ],
    expirationDate: Date,
    creationDate: Date,
    address: {
        street: String,
        civicNumber: String,
        city: String
        // coordinates
    },
    additionalInformations: String,
    pickUpPeriods: [
        {
            weekDay: String,
            startTime: String,
            endTime: String
        }
    ],
    pickUpDate: Date,
    status: String,
    volunteer: String // non ne sono sicuro
}