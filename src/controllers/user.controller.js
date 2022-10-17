import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";

import connection from "../database/database.js";

async function urlShorten(req, res){

    const url = await res.locals.url;
    const sessionId = await res.locals.sessionId;

    try {
        
        await connection.query(
            `INSERT INTO "urls" ("sessionId", url) VALUES($1, $2);`,[sessionId, url]
        );

        const newUrl = await connection.query(
            `SELECT id FROM "urls" WHERE url=$1;`, [url]
        );

        const urlId = newUrl.rows[0].id;
        const urlKey = nanoid();

        await connection.query(
            `INSERT INTO "shortUrls" ("urlId", "shortUrl") VALUES($1, $2);`, [urlId, urlKey]
        );

        const shortUrl = await connection.query(
            `SELECT "shortUrl" FROM "shortUrls" WHERE "urlId"=$1;`, [urlId]
        );

        return res.status(StatusCodes.CREATED).send(shortUrl.rows[0]);

    } catch (error) {
        console.error(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getShortUrl(req, res){

    const { id } = req.params;

    try {

        const url = await connection.query(
            `SELECT urls.id, urls.url, "shortUrls"."shortUrl" 
                FROM urls JOIN "shortUrls" ON "urlId"=$1;`, [id]
        );

        if(url.rows.length === 0) return res.sendStatus(StatusCodes.NOT_FOUND);

        const URL = url.rows[0];
        return res.status(StatusCodes.OK).send(URL);

    } catch (error) {
        console.error(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function openUrl(req, res){
  
    const { shortUrl } = req.params;

    try {

        const urlId = await connection.query(
            `SELECT * FROM "shortUrls" WHERE "shortUrl"=$1;`, [shortUrl]
        );

        if(urlId.rows.length === 0) return res.sendStatus(StatusCodes.NOT_FOUND);

        const url = await connection.query(
            `SELECT url FROM urls WHERE id=$1;`, [urlId.rows[0].urlId]
        );

        if(url.rows.length === 0) return res.sendStatus(StatusCodes.NOT_FOUND);

        let updateVisitsCount = parseInt(urlId.rows[0].visits) +1;

        await connection.query(

            `UPDATE "shortUrls" SET visits = $1 WHERE "shortUrls".id=$2;`, 
            [updateVisitsCount, urlId.rows[0].id]
        );
        
        const URL = url.rows[0].url;
        return res.redirect(URL);

    } catch (error) {
        console.error(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteUrl(req, res){

    const token = await req.headers.authorization?.replace("Bearer ", "");
    if(!token) return res.sendStatus(StatusCodes.UNAUTHORIZED);
    
    const { id } = req.params;

    try {

        const sessionId = await connection.query(
            `SELECT "sessionId" FROM urls WHERE urls.id=$1;`, [id]
        );

        if(sessionId.rows.length === 0) return res.sendStatus(StatusCodes.NOT_FOUND);

        const token = await connection.query(
            `SELECT token FROM sessions WHERE id=$1;`, [sessionId.rows[0].sessionId]
        );

        if(token.rows.length === 0) return res.sendStatus(StatusCodes.NOT_FOUND);

        const isValidUserToDelete = await connection.query(`

            SELECT urls.id, urls."sessionId", "shortUrls"."urlId" 
            FROM urls JOIN "shortUrls" ON "urlId"=$1
            JOIN sessions ON urls."sessionId"=$2;`, 

            [id, sessionId.rows[0].sessionId]
        );

        if(isValidUserToDelete.rows.length === 0){
            return res.sendStatus(StatusCodes.NOT_FOUND);
        }

        await connection.query(
            `DELETE FROM "urls" WHERE urls.id=$1;`, 
            [isValidUserToDelete.rows[0].urlId]
        );

        return res.sendStatus(StatusCodes.NO_CONTENT);

    } catch (error) {
        console.error(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getUser(req, res){

    const token = await req.headers.authorization?.replace("Bearer ", "");
    if(!token) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    try {

        const userId = await connection.query(
            `SELECT "userId" FROM sessions WHERE token=$1;`, [token]
        );

        const user = await connection.query(
            `
                SELECT 
                    sessions."userId" AS "id", 
                    users.name AS "name"
                FROM users 
                JOIN sessions ON sessions."userId" = $1;

            `, [userId.rows[0]]
        );

        if(user.rows.length === 0) return res.sendStatus(StatusCodes.NOT_FOUND);

        const url = await connection.query(
            `SELECT 
                urls.id AS "urlId", 
                users.id AS "userId", 
                "sessionId"
            FROM urls
            JOIN sessions ON urls."sessionId" = $1
            JOIN users ON sessions."userId" = $2;`,
            [userId.rows[0].sessionId, userId.rows[0].userId]
        );

        const visitCount = await connection.query(
            `SELECT visits FROM "shortUrls" WHERE token=$1;`, [url.rows[0].urlId]
        );

        const URL = user.rows[0];
        return res.status(StatusCodes.OK).send(URL);

    } catch (error) {
        console.error(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export { 
    urlShorten,
    getShortUrl,
    openUrl,
    deleteUrl,
    getUser
 };