const Joi = require('joi');

const schema = Joi.object({

    username: Joi.string().required(),
    email: Joi.string().email().required(),
    image: Joi.string()

})

module.exports = schema;