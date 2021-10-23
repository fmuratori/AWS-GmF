import mongoose from "mongoose";
import Donation from "./interfaces/donation";

interface DonationDocument extends Document, Donation { }

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
        required: [true, "missing required field expirationDate"]
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
    pickUpPeriods: {
        type: [{
            weekDay: String,
            startTime: String,
            endTime: String
        }],
        required: [true, "missing required field pickUpPeriods"]
    },
    pickUpDate: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        default: () => "pending"
    },
    volunteer_id: {
        type: String,
        required: false
    }
})

export { DonationDocument }
export default mongoose.model<DonationDocument>('Donation', donationSchema)