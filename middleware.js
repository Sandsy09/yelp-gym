const { gymSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Gym = require('./models/gym');
const Review = require('./models/review');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to do this!');
        return res.redirect('/login');
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    };
    next();
};

const validateGym = (req, res, next) => {
    const { error } = gymSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    if (!gym.author.equals(req.user.id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/gyms/${id}`);
    } else {
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/gyms/${id}`);
    } else {
        next();
    }
}


module.exports = { isLoggedIn, storeReturnTo, validateGym, isAuthor, validateReview, isReviewAuthor }