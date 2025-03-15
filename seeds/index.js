
const mongoose = require('mongoose');
const Gym = require('../models/gym');
const Review = require('../models/review');
const { descriptors, places, street } = require('./seedHelpers');
const cities = require('./cities')

mongoose.connect('mongodb://localhost:27017/yelp-gym');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const randArrayChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Gym.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const gym = new Gym({
            author: '67c3b78bd40f762f953d3c5f',
            //location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${randArrayChoice(descriptors)} ${randArrayChoice(places)}`,
            address: {
                house_number: Math.floor(Math.random() * (300 - 1) + 1),
                street: `${randArrayChoice(street)}`,
                place: `${cities[rand1000].city}`,
                region: `${cities[rand1000].state}`,
                post_code: Math.floor(Math.random() * (60000 - 10000) + 10000),
                country: 'United States'
            },
            geometry: {
                type: "Point",
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dxadixl1i/image/upload/v1741487214/YelpGym/n3aswtrszcye6zj1yyop.jpg',
                    filename: 'YelpGym/n3aswtrszcye6zj1yyop'
                },
                {
                    url: 'https://res.cloudinary.com/dxadixl1i/image/upload/v1741487215/YelpGym/gcfi5l3fepjybnhph9kb.jpg',
                    filename: 'YelpGym/gcfi5l3fepjybnhph9kb'
                },
                {
                    url: 'https://res.cloudinary.com/dxadixl1i/image/upload/v1741487215/YelpGym/ecco3y0mwdnedv8wxwxa.jpg',
                    filename: 'YelpGym/ecco3y0mwdnedv8wxwxa'
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a diam ut neque posuere maximus a id elit. Phasellus ut imperdiet ligula. Sed vitae cursus.',
            price: Math.floor(Math.random() * (50 - 10) + 10) - 0.01
        })
        await gym.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});