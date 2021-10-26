import mongoose, { PopulatedDoc } from "mongoose";
import Donation from "./interfaces/donation";
import Food from "./interfaces/food";
import User from "./interfaces/user";

export interface DonationDocument extends Document, Donation { 
    Food?: PopulatedDoc<Food & Document>
    User?: PopulatedDoc<User & Document>
}

const donationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: [true, "missing required field user_id"],
        ref: "User"
    },
    chat: {
        type: [{
            user_id: mongoose.Types.ObjectId,
            text: String,
            visualized: Boolean
        }],
        default: () => [],
        ref: "User"
    },
    food_ids: {
        type: [mongoose.Types.ObjectId],
        required: [true, "missing required field foods"],
        ref: "Food"
    },
    expirationDate: {
        type: Date,
        required: [true, "missing required field expirationDate"],
        validate: {
            validator(this: DonationDocument, expirationDate: Date): Boolean {
                return new Date() < expirationDate
            },
            message: "expirationDate should be a future date"
        }

    },
    creationDate: {
        type: Date,
        default: () => new Date()
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
        required: [true, "missing required field address"]
    },
    additionalInformations: {
        type: String,
        required: false
    },
    pickUpPeriod: {
        type: [{
            weekDay: String,
            startTime: String,
            endTime: String
        }],
        required: [true, "missing required field pickUpPeriod"],
        //TODO validare startTime e endTime
    },
    status: {
        type: String,
        default: () => "waiting",
        enum: ["waiting", "selected", "withdrawn"]
    },
    volunteer_id: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "User"
    }
})

export default mongoose.model<DonationDocument>('Donation', donationSchema)