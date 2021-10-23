import mongoose from "mongoose";
import Food from "./interfaces/food";

interface FoodDocument extends Document, Food { }

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "missing field name"]
    },
    number: {
        type: Number,
        required: false,
        default: () => 1
    },
    expirationDate: {
        type: Date,
        // required: [true, "missing field expirationDate"]
        default: () => new Date()
    },
    weight: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    labels: [{
        type: String,
        required: false
    }]
})

export { FoodDocument }
export default mongoose.model<FoodDocument>('Food', foodSchema)