import mongoose, { PopulatedDoc } from "mongoose";
import Family from "./interfaces/family";
import Food from "./interfaces/food";
import Pack from "./interfaces/pack";
import User from "./interfaces/user";

export interface PackDocument extends Document, Pack {
    Food?: PopulatedDoc<Food & Document>
    User?: PopulatedDoc<User & Document>
    Family?: PopulatedDoc<Family & Document>
 }

const packSchema = new mongoose.Schema({
    food_ids: {
        type: [mongoose.Types.ObjectId],
        required: [true, "missing required field food_ids"],
        ref: "Food"
    },
    deliveryVolunteer_id: {
        type: mongoose.Types.ObjectId,
        required: [true, "missing required field deliveryVolunteer_id"],
        ref: "User"
    },
    status: {
        type: String,
        default: () => "ready",
        enum: ["ready", "planned delivery", "delivered"]
    },
    family_id: {
        type: mongoose.Types.ObjectId,
        required: [true, "missing required field family_id"],
        ref: "Family"
    },
    qrCodeImage: {
        type: String,
        required: false
    }, // la stringa in base64 potrebbe essere troppo lunga
    deliveryDate: {
        type: Date,
        required: false,
        validate: {
            validator(this: PackDocument, deliveryDate: Date): Boolean {
                return new Date() < deliveryDate
            },
            message: "deliveryDate shound be a future date"
        }

    },
    deliveryPeriod: {
        type: String,
        required: false,
        enum: ["morning", "afternoon", "evening"]
    }
})

export default mongoose.model<PackDocument>('Pack', packSchema)