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
const commentSchema = Joi.object({
    comment: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        message: Joi.string().required(),
    }).required(),
});




module.exports = {
    pinSchema,
    commentSchema
};
