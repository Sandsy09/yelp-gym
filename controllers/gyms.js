const Gym = require('../models/gym');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const { cloudinary } = require('../cloudinary');
const { query } = require('express');

module.exports.index = async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gyms/index', { gyms });
};

module.exports.renderNewForm = (req, res) => {
    res.render('gyms/new');
};

module.exports.createGym = async (req, res, next) => {
    const gymData = req.body.gym;
    const geoData = await geocoder.forwardGeocode({
        query: gymData.location,
        limit: 1
    }).send()
    const gym = new Gym(gymData);
    gym.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    gym.author = req.user.id;
    gym.geometry = geoData.body.features[0].geometry
    await gym.save();
    req.flash('success', 'Successfully made a new gym!');
    res.redirect(`/gyms/${gym._id}`);
};

module.exports.showGym = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id).populate([
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        },
        'author'
    ]);
    if (!gym) {
        req.flash('error', 'Gym not found!')
        return res.redirect('/gyms')
    }
    res.render('gyms/show', { gym });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    if (!gym) {
        req.flash('error', 'Gym not found!')
        return res.redirect('/gyms')
    }
    res.render('gyms/edit', { gym });
};

module.exports.editGym = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    gym.images.push(...imgs);
    await gym.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await gym.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated a gym!');
    res.redirect(`/gyms/${gym._id}`);
};

module.exports.deleteGym = async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a gym!');
    res.redirect(`/gyms`);
};

