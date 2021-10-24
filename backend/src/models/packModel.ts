import mongoose from "mongoose";
import Pack from "./interfaces/pack";

export interface PackDocument extends Document, Pack { }

const packSchema = new mongoose.Schema({
    food_ids: {
        type: [String],
        required: [true, "missing required field food_ids"]
    },
    deliveryVolunteer_id: {
        type: String,
        required: [true, "missing required field deliveryVolunteer_id"]
    },
    status: {
        type: String,
        default: () => "ready",
        enum: ["ready", "planned delivery", "delivered"]
    },
    family_id: {
        type: String,
        required: [true, "missing required field family_id"]
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
        enum: ["8-12", "14-18", "18-20"]
    }
})

export default mongoose.model<PackDocument>('Pack', packSchema)