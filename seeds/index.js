
const mongoose = require('mongoose');
const Gym = require('../models/gym');
const { descriptors, places } = require('./seedHelpers');
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
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const gym = new Gym({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${randArrayChoice(descriptors)} ${randArrayChoice(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a diam ut neque posuere maximus a id elit. Phasellus ut imperdiet ligula. Sed vitae cursus.',
            price: Math.floor(Math.random() * (50 - 10) + 10) - 0.01
        })
        await gym.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});