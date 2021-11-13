import Food from "./food";

export default interface Pack {
    foodList: [Food],
    deliveryVolunteerId: string,
    status: string,
    familyId: string, 
    qrCodeImage: string, // la stringa in base64 potrebbe essere troppo lunga
    deliveryDate: Date,
    deliveryPeriod: string
}