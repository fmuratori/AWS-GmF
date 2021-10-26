import mongoose from "mongoose";
import Food from "./interfaces/food";

export interface FoodDocument extends Document, Food { }

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "missing field name"]
    },
    number: {
        type: Number,
        required: false,
        default: () => 1,
        min: 0
    },
    expirationDate: {
        type: Date,
        validate: {
            validator(this: FoodDocument, expirationDate: Date): Boolean {
                return new Date() < expirationDate
            },
            message: "Cannot store expired food"
        }
    },
    weight: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: false
    },
    labels: {
        type: [String],
        required: false
    }
})

export default mongoose.model<FoodDocument>('Food', foodSchema)