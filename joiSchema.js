const Joi = require('joi');

const pinSchema = Joi.object({
    pin: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        link: Joi.string().allow("", null),
        board: Joi.string().required(),
        taggedTopics: Joi.string().required(),
    }).required(),
});



module.exports = {
    pinSchema,
};
