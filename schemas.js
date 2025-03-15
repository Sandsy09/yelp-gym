const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension);

const gymSchema = Joi.object({
    gym: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        address: Joi.object({
            house_number: Joi.string().required().escapeHTML(),
            street: Joi.string().required().escapeHTML(),
            place: Joi.string().required().escapeHTML(),
            region: Joi.string().required().escapeHTML(),
            post_code: Joi.string().required().escapeHTML(),
            country: Joi.string().required().escapeHTML()
        }).required()
        //image: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML(),
        title: Joi.string().required().escapeHTML()
    }).required()
})


module.exports = { gymSchema, reviewSchema };