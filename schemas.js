const Joi = require('joi');

const gymSchema = Joi.object({
    gym: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required()
})

module.exports = { gymSchema }