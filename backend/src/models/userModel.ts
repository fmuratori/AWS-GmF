import mongoose from "mongoose";
import User from "./interfaces/user";

interface UserDocument extends Document, User{ }

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "missing required field name"]
    },
    surname: {
        type: String,
        required: [true, "missing required field surname"]
    },
    username: {
        type: String,
        required: [true, "missing required field username"]
    },
    password: {
        type: String,
        required: [true, "missing required field password"]
    },
    email: {
        type: String,
        required: [true, "missing required field email"]
    },
    phoneNumber: {
        type: String,
        required: [true, "missing required field phoneNumber"]
    },
    type: {        
        type: String,
        required: [true, "missing required field type"]
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