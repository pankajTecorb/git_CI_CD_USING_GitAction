import Joi from 'joi';

const signUpSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required().min(4)

})

const logInSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().required()

})

const accountVerificationSchema = Joi.object({
    email: Joi.string().required()

})

const sendOtpSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required()

})

const verifyOtpSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    pin: Joi.string().required(),

})
const address = Joi.object({
    state: Joi.string().required(),
    city: Joi.string().required(),
    lat:Joi.string().required(),
    long:Joi.string().required(),
    type:Joi.string().required(),
    isPrimary:Joi.boolean(),

})


export {
    signUpSchema,
    logInSchema,
    accountVerificationSchema,
    sendOtpSchema,
    verifyOtpSchema,
    address

}