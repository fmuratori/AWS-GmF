import mongoose from "mongoose";
import Family from "./interfaces/family";

interface FamilyDocument extends Document, Family{ }

const familySchema = new mongoose.Schema({
    name: String,
    password: String,
    salt: Number,
    email: String,
    phoneNumber: String,
    address: {
        street: String,
        civicNumber: String,
        city: String
        // coordinates
    },
    type: String
})

export {FamilyDocument}
export default mongoose.model<FamilyDocument>('Family', familySchema)