import mongoose from "mongoose";
import Event from "./interfaces/event";

interface EventDocument extends Document, Event{ }

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "missing required field name"]
    },
    description: {
        type: String,
        required: false
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
    image: {
        type: String,
        required: false
    }, // la stringa in base64 potrebbe essere troppo lunga
    date: {
        type: Date,
        required: [true, "missing required field date"],
        validate: {
            validator(this: EventDocument, expirationDate: Date): Boolean {
                return new Date() < expirationDate
            },
            message: "Cannot create event in the past"
        }

    },
    ownerVolunteer_id: {
        type: String,
        required: [true, "missing required field ownerVolunteer_id"]
    }
})

export {EventDocument}
export default mongoose.model<EventDocument>('Event', eventSchema)