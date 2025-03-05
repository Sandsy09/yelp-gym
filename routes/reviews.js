const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync.js');
const Gym = require('../models/gym.js');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware.js');
const Review = require('../models/review.js');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const gym = await Gym.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    gym.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/gyms/${gym.id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Gym.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/gyms/${id}`)
}))

module.exports = router;