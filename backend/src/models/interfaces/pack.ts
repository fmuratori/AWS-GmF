interface Pack {
    foods: [String], // non ne sono sicuro
    deliveryVolunteer: String, // non ne sono sicuro
    status: String,
    family: String, // non ne sono sicuro
    qrCodeImage: String, // la stringa in base64 potrebbe essere troppo lunga
    deliveryDate: Date,
    deliveryTime: {
        startTime: String,
        endTime: String
    }
}

export default Pack