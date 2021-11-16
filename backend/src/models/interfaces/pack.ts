export default interface Pack {
    foodList: [{
        foodId: string,
        number: number
    }],
    deliveryVolunteerId: string,
    status: string,
    familyId: string,
    qrCodeImage: string, // la stringa in base64 potrebbe essere troppo lunga
    deliveryDate: Date,
    deliveryPeriod: string
}