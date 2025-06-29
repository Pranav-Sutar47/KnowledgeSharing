const joi = require('joi');
const asyncHandler = require('../Utils/asyncHandler');
const APIError = require('../Utils/APIError');

const userValidation = asyncHandler((req,res,next)=>{
    const schema = joi.object({
        email: joi.string()
            .pattern(/^[a-zA-Z0-9._%+-]+@pccoepune\.org$/)
            .required()
            .messages({
              'string.pattern.base': 'Email must be a valid @pccoepune.org address',
            }),
        password:joi.string().min(4).max(8).required(),
        name : joi.string().min(5).max(40).required(),
        role: joi.string().valid('student', 'faculty').required(),

        branch: joi.when('role', {
            is: 'student',
            then: joi.string().required(),
            otherwise: joi.string().optional().allow(null, '')
        }),

        year : joi.when('role',{
            is: 'student',
            then: joi.string().required(),
            otherwise: joi.string().optional().allow(null,'')
        })
    });

    const { error } = schema.validate(req.body);

    // console.log(error);

    if(error){
        const messages = error.details.map(detail => detail.message);
        console.log(messages);
        throw new APIError(400,'Validation Failed',messages);
    }
    next();
});

module.exports = userValidation;