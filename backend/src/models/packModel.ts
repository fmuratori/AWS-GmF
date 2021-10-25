import mongoose from "mongoose";
import Pack from "./interfaces/pack";

interface PackDocument extends Document, Pack{ }

const packSchema = new mongoose.Schema({
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
})

export {PackDocument}
export default mongoose.model<PackDocument>('Pack', packSchema)