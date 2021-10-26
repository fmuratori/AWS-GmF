export default interface Pack {
    food_ids: [String],
    deliveryVolunteer_id: String,
    status: String,
    family_id: String, 
    qrCodeImage: String, // la stringa in base64 potrebbe essere troppo lunga
    deliveryDate: Date,
    deliveryPeriod: String
}