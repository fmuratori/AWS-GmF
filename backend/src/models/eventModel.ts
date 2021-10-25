import mongoose from "mongoose";
import Event from "./interfaces/event";

interface EventDocument extends Document, Event{ }

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    address: {
        street: String,
        civicNumber: String,
        city: String
        // coordinates
    },
    image: String, // la stringa in base64 potrebbe essere troppo lunga
    date: Date,
    representativeVolunteer: String, // non ne sono sicuro 
})

export {EventDocument}
export default mongoose.model<EventDocument>('Event', eventSchema)