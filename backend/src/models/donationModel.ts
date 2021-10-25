import mongoose from "mongoose";
import Donation from "./interfaces/donation";

interface DonationDocument extends Document, Donation{ }

const donationSchema = new mongoose.Schema({
    user: String, // non ne sono sicuro
    chat: [
        {
            user: String,
            text: String,
            visualized: Boolean
        }
    ],
    foods: [
        {
            name: String
        }
    ],
    expirationDate: Date,
    creationDate: Date,
    address: {
        street: String,
        civicNumber: String,
        city: String
        // coordinates
    },
    additionalInformations: String,
    pickUpPeriods: [
        {
            weekDay: String,
            startTime: String,
            endTime: String
        }
    ],
    pickUpDate: Date,
    status: String,
    volunteer: String // non ne sono sicuro
})

export {DonationDocument}
export default mongoose.model<DonationDocument>('Donation', donationSchema)