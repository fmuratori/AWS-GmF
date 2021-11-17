import mongoose, { PopulatedDoc } from "mongoose";
import Family from "./interfaces/family";
import Pack from "./interfaces/pack";
import User from "./interfaces/user";

export interface PackDocument extends Document, Pack {
    User?: PopulatedDoc<User & Document>
    Family?: PopulatedDoc<Family & Document>
}

const packSchema = new mongoose.Schema({
    foodList: {
        type: [{
            foodId: {
                type: String,
                required: true
            },
            number: {
                type: Number,
                required: true
            }
        }],
        required: [true, "missing required field foods"]
    },
    deliveryVolunteerId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "ready",
        enum: ["ready", "planned delivery", "delivered"]
    },
    familyId: {
        type: mongoose.Types.ObjectId,
        required: [true, "missing required field familyId"],
        ref: "Family"
    },
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