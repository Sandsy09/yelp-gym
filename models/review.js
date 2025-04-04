const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    title: String,
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model("Review", ReviewSchema)