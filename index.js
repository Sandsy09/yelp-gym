const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Gym = require('./models/gym');

mongoose.connect('mongodb://localhost:27017/yelp-gym');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makegym', async (req, res) => {
    const gym = new Gym({
        title: 'Pure Gym',
        location: 'Crayford',
        description: 'A great place to workout. Has a cardio zone witha a range of supplies and a great selection of weights and machines.',
        price: '17.99'
    });
    await gym.save();
    res.send(gym)
});

app.listen(3000, () => {
    console.log("SERVING ON PORT 3000")
});
