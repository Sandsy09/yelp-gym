const Gym = require('../models/gym.js');
const Review = require('../models/review.js');


module.exports.createReview = async (req, res, next) => {
    const gym = await Gym.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    gym.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/gyms/${gym.id}`)
};

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Gym.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/gyms/${id}`)
};
