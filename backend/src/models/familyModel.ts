import mongoose, { PopulatedDoc } from "mongoose";
import Family from "./interfaces/family";
import User from "./interfaces/user";

export interface FamilyDocument extends Document, Family{ 
    user?: PopulatedDoc<User & Document>
}

const familySchema = new mongoose.Schema({
    reporterId: {
        type: mongoose.Types.ObjectId,
        required: [true, "missing required field reporterId"],
        ref: "User"
    },
    name: {
        type: String,
        required: [true, "missing family name"]
    },
    phoneNumber: {
        type: String,
        required: [true, "missing required field phoneNumber"]
    },
    components: {
        type: Number,
        required: [true, "missing required field components number"],
        min: 1
    },
    address: {
        type: {
            street: String,
            civicNumber: String,
            city: String,
            coordinates: {
                x: Number,
                y: Number
            }
        },
        required: [true, "missing required field address"]
    },
    status: {
        type: String,
        enum: ["pending", "verified"],
        default: "pending"
    }
})

export default mongoose.model<FamilyDocument>('Family', familySchema)