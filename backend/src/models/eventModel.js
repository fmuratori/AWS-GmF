module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var EventSchema = new Schema({
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
    });
    return mongoose.model('Event', EventSchema);
};
