import mongoose from "mongoose";
import FoodModel from "./foodModel";
import Pack from "./interfaces/pack";
import UserModel from "./userModel";

interface PackDocument extends Document, Pack{ }

const packSchema = new mongoose.Schema({
    foods: [{
        type: FoodModel,
        required: [true, "missing field foods"]
    }], // non ne sono sicuro
    deliveryVolunteer: UserModel, // non ne sono sicuro
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