import mongoose from "mongoose";
import Donation from "./interfaces/donation";

export interface DonationDocument extends Document, Donation { }

const donationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, "missing required field user_id"]
    },
    chat: {
        type: [{
            user_id: String,
            text: String,
            visualized: Boolean
        }],
        default: () => []
    },
    food_ids: {
        type: [String],
        required: [true, "missing required field foods"]
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
        type: String,
        required: false
    }
})

export default mongoose.model<DonationDocument>('Donation', donationSchema)