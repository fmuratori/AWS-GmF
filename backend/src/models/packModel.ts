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
    foodIdList: {
        type: [mongoose.Types.ObjectId],
        required: [true, "missing required field foodIds"],
        ref: "Food"
    },
    deliveryVolunteerId: {
        type: mongoose.Types.ObjectId,
        required: [true, "missing required field deliveryVolunteerId"],
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