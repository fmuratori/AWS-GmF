import mongoose from "mongoose";
import User from "./interfaces/user";

interface UserDocument extends Document, User{ }

const userSchema = new mongoose.Schema({
    expirationDate: Date,
    name: String,
    number: Number,
    weight: Number,
    description: String,
    labels: [String]
})

export {UserDocument}
export default mongoose.model<UserDocument>('User', userSchema)