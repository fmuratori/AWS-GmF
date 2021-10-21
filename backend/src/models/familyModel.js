module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var UserSchema = new Schema({
        name: String,
        password: String,
        salt: Number, 
        email: String,
        phoneNumber: String, 
        address: {
            street: String,
            civicNumber: String,
            city: String
            // coordinates
        },
        type: String 
    });
    return mongoose.model('User', UserSchema);
};
