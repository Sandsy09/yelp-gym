const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const GymSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    address: {
        house_number: String,
        street: String,
        place: String,
        region: String,
        post_code: String,
        country: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

GymSchema.virtual('properties.popUpMarkup').get(function () {
    const address = this.address;
    return `
        <strong><a href='/gyms/${this.id}'>${this.title}</a></strong>
        <p>${address.house_number} ${address.street}, ${address.place}, ${address.region} ${address.post_code}</p>
        <p>From $${this.price} per month</p>
    `;
})

GymSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('Gym', GymSchema);
