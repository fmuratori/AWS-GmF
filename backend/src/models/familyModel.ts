import mongoose from "mongoose";
import Family from "./interfaces/family";

interface FamilyDocument extends Document, Family{ }

const familySchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: [true, "missing required field phoneNumber"]
    },
    componentsNumber: {
        type: Number,
        required: [true, "missing required field componentsNumber"],
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
    }
})

export {FamilyDocument}
export default mongoose.model<FamilyDocument>('Family', familySchema)