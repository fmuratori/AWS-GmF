export default interface Pack {
    foodIds: [String],
    deliveryVolunteerId: String,
    status: String,
    familyId: String, 
    qrCodeImage: String, // la stringa in base64 potrebbe essere troppo lunga
    deliveryDate: Date,
    deliveryPeriod: String
}