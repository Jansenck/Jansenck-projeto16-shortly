import joi from "joi";

const signUpSchema = joi.object({
    name: joi.string().empty().required().pattern(new RegExp("[a-zA-z]$")),
    email: joi.string().empty().email().required(),
    password: joi.string().empty().required(),
    confirmPassword: joi.string().empty().valid(joi.ref('password')).required()
});

const signInSchema = joi.object({
    email: joi.string().empty().email().required(),
    password: joi.string().empty().required()
});

export { signUpSchema, signInSchema };