import joi from "joi";

const shortenUrlSchema = joi.object({
    url: joi
        .string()
        .empty()
        .regex(
                /^https?:\/\/(?:www.)?[-a-zA-Z0-9@:%.+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%+.~#?&/=]*)/
            )
        .required()
});

export { shortenUrlSchema };