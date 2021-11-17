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
        default: 1,
        min: 0
    },
    expirationDate: {
        type: Date,
        required: [true, "missing field expirationDate"],
        // validate: {
        //     validator(this: FoodDocument, expirationDate: Date): Boolean {
        //         return new Date() < expirationDate
        //     },
        //     message: "Cannot store expired food"
        // }
    },
    labels: {
        type: [{
            type: String,
            enum: ["meat", "fish", "pasta", "vegetable", "fruit", "fresh", "long-life"]
        }],
        required: false
    }
})

export default mongoose.model<FoodDocument>('Food', foodSchema)