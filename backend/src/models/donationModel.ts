import mongoose, { PopulatedDoc } from "mongoose";
import Donation from "./interfaces/donation";
import User from "./interfaces/user";

export interface DonationDocument extends Document, Donation { 
    User?: PopulatedDoc<User & Document>
}

const donationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "missing required field userId"],
        ref: "User"
    },
    chat: {
        type: [{
            index: Number,
            userId: mongoose.Types.ObjectId,
            userFullname: String,
            text: String,
            date: {
                type: Date,
                default: () => new Date()
            },
            visualized: {
                type: Boolean,
                default: false
            }
        }],
        default: [],
        select: false,
        ref: "User"
    },
    foods: {
        type: [String],
        required: [true, "missing required field foods"],
    },
    expirationDate: {
        type: Date,
        required: [true, "missing required field expirationDate"],
        // validate: {
        //     validator(this: DonationDocument, expirationDate: Date): Boolean {
        //         return new Date() < expirationDate
        //     },
        //     message: "expirationDate should be a future date"
        // }
    },
    creationDate: {
        type: Date,
        default: new Date()
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
            weekDay: {
                type: String,
                required: true,
                enum: [
                    "lun",
                    "mar",
                    "mer",
                    "gio",
                    "ven",
                    "sab",
                    "dom"
                ]
            },
            period: {
                type: String,
                required: true,
                enum: ["morning", "afternoon", "evening"]
            }
        }],
        required: [true, "missing required field pickUpPeriod"]
    },
    status: {
        type: String,
        default: "waiting",
        enum: ["waiting", "selected", "withdrawn"]
    },
    volunteerId: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "User",
        default: null
    }
})

export default mongoose.model<DonationDocument>('Donation', donationSchema)