module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var FamilySchema = new Schema({
        name: String,
        phoneNumber: String, 
        address: {
            street: String,
            civicNumber: String,
            city: String
            // coordinates
        },
        members: Number 
    });
    return mongoose.model('Family', FamilySchema);
};
