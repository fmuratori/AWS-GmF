module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var FoodSchema = new Schema({
        expirationDate:  Date,
        name: String,
        number: Number,
        weight: Number,
        description: String,
        labels: [String]
    });
    return mongoose.model('Food', FoodSchema);
};
