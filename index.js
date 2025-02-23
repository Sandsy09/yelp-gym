const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/gyms', async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gyms/index', { gyms });
});

app.get('/gyms/new', (req, res) => {
    res.render('gyms/new');
})

app.post('/gyms', async (req, res) => {
    const gym = new Gym(req.body.gym);
    await gym.save();
    res.redirect(`/gyms/${gym._id}`);
});

app.get('/gyms/:id', async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    res.render('gyms/show', { gym });
});

app.get('/gyms/:id/edit', async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    res.render('gyms/edit', { gym });
});

app.put('/gyms/:id', async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    res.redirect(`/gyms/${gym._id}`);
})

app.delete('/gyms/:id', async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    res.redirect(`/gyms`);
})

app.listen(3000, () => {
    console.log("SERVING ON PORT 3000");
});
