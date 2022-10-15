import joi from "joi";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import connection from "../database/database.js";

const signUpSchema = joi.object({
    name: joi.string().empty().required().pattern(new RegExp("[a-zA-z]$")),
    email: joi.string().email().required(),
    password: joi.string().empty().required(),
    confirmPassword: joi.string().empty().valid(joi.ref('password')).required()
});

async function validationSignUp(req, res, next){
    const userData = req.body;
    if(!userData) return res.sendStatus(StatusCodes.BAD_REQUEST);

    const { name, email, password, confirmPassword } = req.body;
 
    try {

        const existingUser = await connection.query(`SELECT * FROM "users" WHERE email=$1;`,
            [email]
        );
        
        if(existingUser.rows.length !== 0) return res.sendStatus(StatusCodes.CONFLICT);
        
        const isValidSignUp = signUpSchema.validate({

            name, 
            email, 
            password, 
            confirmPassword

        }, {
            abortEarly: false
        });

        if(isValidSignUp.error){
            const signUpError = isValidSignUp.error.details.map(detail => detail.message);
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(signUpError);
        }

        res.locals.existingUser = existingUser;

    } catch (error) {
        console.error(error.message);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    next();
}

export { validationSignUp };