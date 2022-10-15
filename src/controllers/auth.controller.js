import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

import connection from "../database/database.js";

async function signUp(req, res){

    const { name, email, password } = req.body;
    const encryptedPassword = bcrypt.hashSync(password, 10);

    try {
        await connection.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
            [name, email, encryptedPassword]
        );
        res.sendStatus(StatusCodes.CREATED);

    } catch (error) {
        console.error(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/* async function signIn(req, res){

    const { email, password } = req.body;

    try {
        await connection.query(`INSERT INTO...`);
    } catch (error) {
        console.error(error.message);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
} */

export { signUp };