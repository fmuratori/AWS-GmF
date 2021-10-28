import mongoose from "mongoose";
import User from "./interfaces/user";

export interface UserDocument extends Document, User { }

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "missing required field name"]
    },
    surname: {
        type: String,
        required: [true, "missing required field surname"]
    },
    hashPassword: {
        type: String,
        required: [true, "missing required field hashPassword"],
        select: false
    },
    email: {
        type: String,
        required: [true, "missing required field email"],
        lowercase: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, "missing required field phoneNumber"]
    },
    type: {
        type: String,
        default: () => "user",
        enum: ["user", "volunteer", "trusted"]
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
        required: false
    }
})

export default mongoose.model<UserDocument>('User', userSchema)