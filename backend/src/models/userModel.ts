import mongoose from "mongoose";
import User from "./interfaces/user";

interface UserDocument extends Document, User{ }

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "missing field name"]
    },
    surname: {
        type: String,
        required: [true, "missing field surname"]
    },
    username: {
        type: String,
        required: [true, "missing field username"]
    },
    password: {
        type: String,
        required: [true, "missing field password"]
    },
    email: {
        type: String,
        required: [true, "missing field email"]
    },
    phoneNumber: {
        type: String,
        required: [true, "missing field phone number"]
    },
    type: {        
        type: String,
        required: [true, "missing field type"]
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

export {UserDocument}
export default mongoose.model<UserDocument>('User', userSchema)