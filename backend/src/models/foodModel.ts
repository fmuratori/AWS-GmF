import mongoose from "mongoose";
import Food from "./interfaces/food";
import { ObjectId } from 'mongodb';

interface FoodModel extends Document, Food{ }

const foodSchema = new mongoose.Schema({
    expirationDate: Date,
    name: String,
    number: Number,
    weight: Number,
    description: String,
    labels: [String]
})

export default mongoose.model<Food>('Food', foodSchema)