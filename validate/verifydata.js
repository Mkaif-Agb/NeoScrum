const Joi = require('joi');

const schema = Joi.object({

    username: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    image: Joi.string()

})

module.exports = schema;