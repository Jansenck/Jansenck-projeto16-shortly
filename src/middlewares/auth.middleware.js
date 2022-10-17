import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import connection from "../database/database.js";

import { signUpSchema, signInSchema } from "../schemas/auth.schema.js";


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

    } catch (error) {
        console.error(error.message);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    next();
}

async function validationSignIn(req, res, next){

    const userData = req.body;
    if(!userData) return res.sendStatus(StatusCodes.BAD_REQUEST);
    
    const { email, password } = req.body;

    const isValidSignIn = signInSchema.validateAsync({email, password});

    if(isValidSignIn.error){
        const signInError = isValidSignIn.error.details.map(detail => detail.message);
        return res.status(StatusCodes.BAD_REQUEST).send(signInError);
    }
 
    try {
        const user = await connection.query(`SELECT * FROM "users" WHERE "email"=$1;`, [email]);
        if(user.rows[0].length === 0) return res.sendStatus(StatusCodes.NOT_FOUND);

        const encryptedPassword = user.rows[0].password;
        const isValidPassword = bcrypt.compareSync(password, encryptedPassword);
        if(!isValidPassword) return res.sendStatus(StatusCodes.UNAUTHORIZED);

        res.locals.user = user;

    } catch (error) {
        console.error(error.message);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    next();
}

export { validationSignUp, validationSignIn };