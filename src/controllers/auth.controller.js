import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

import connection from "../database/database.js";

async function createUser(req, res){

    const { 
        name,
        email, 
        password 
    } = req.body;

    const encryptedPassword = bcrypt.hashSync(password, 10);

    try {
        await connection.query(

            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,

            [
                name.trim(), 
                email.trim(), 
                encryptedPassword.trim()
            ]
        );

        res.sendStatus(StatusCodes.CREATED);

    } catch (error) {
        console.error(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function checkUser(req, res){

    const user = res.locals.user.rows[0];
    delete user.password;

    try {
        
        const userId = await connection.query(`SELECT "id" FROM "users" WHERE "email"=$1;`, [user.email]);
        const sessionUserExists = await connection.query(`SELECT * FROM "sessions" WHERE "userId"=$1;`, [userId.rows[0].id]);

        if(sessionUserExists.rows[0] !== undefined){
            const userToken = sessionUserExists.rows[0].token;
            return res.status(StatusCodes.CREATED).send({token: userToken});
        };

        const token = uuid();
        await connection.query(`INSERT INTO "sessions" ("userId", token) VALUES ($1, $2);`, [userId.rows[0].id, token]);

        return res.status(StatusCodes.OK).send({token: token});

    } catch (error) {
        console.error(error.message);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export { createUser, checkUser };