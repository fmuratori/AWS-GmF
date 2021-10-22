import mongoose from "mongoose";
import Food from "./interfaces/food";

interface FoodDocument extends Document, Food{ }

const foodSchema = new mongoose.Schema({
    expirationDate: Date,
    name: String,
    number: Number,
    weight: Number,
    description: String,
    labels: [String]
})

export {FoodDocument}
export default mongoose.model<FoodDocument>('Food', foodSchema)