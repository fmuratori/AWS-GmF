import Food from "./food";

export default interface Pack {
    foodList: [Food],
    deliveryVolunteerId: String,
    status: String,
    familyId: String, 
    qrCodeImage: String, // la stringa in base64 potrebbe essere troppo lunga
    deliveryDate: Date,
    deliveryPeriod: String
}