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

        const session = await connection.query(
            `SELECT * FROM sessions WHERE token=$1;`, [token]
        );

        const user = await connection.query(
            `
                SELECT 
                    sessions."userId" AS "id", 
                    users.name AS "name"
                FROM users 
                JOIN sessions ON sessions."userId" = $1;

            `, [session.rows[0].userId]
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
            [session.rows[0].id, user.rows[0].id]
        );

        const visitCount = await connection.query(
            `SELECT * FROM "shortUrls";`
        );

        let sumVisitsUrl = 0;

        const listVisitsUrl = visitCount.rows.map(urlVisitCount => {
            sumVisitsUrl += parseInt(urlVisitCount.visits);
        });

        const listShortenUrls = await connection.query(
            `SELECT 
                "shortUrls".id, 
                "shortUrls"."shortUrl", 
                urls.url,
                "shortUrls".visits
            FROM urls
            JOIN "shortUrls" ON urls.id = "shortUrls"."urlId";`
        );

        const userData = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            visitCount: sumVisitsUrl,
            shortenedUrls: listShortenUrls.rows
        };

        return res.status(StatusCodes.OK).send(userData);

    } catch (error) {
        console.error(error);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getRanking(req, res){

    try {

        const listRanking = await connection.query(
            `
            SELECT 
                users.id, 
                users.name,
                COUNT("shortUrls".id) AS "linksCount",
                SUM("shortUrls".visits) AS "visitCount"
            FROM users
            JOIN sessions ON users.id = sessions."userId"
            JOIN urls ON sessions.id = urls."sessionId"
            JOIN "shortUrls" ON  "shortUrls"."urlId" = urls.id

            GROUP BY  
                users.id, 
                users.name
                
            ORDER BY "linksCount" DESC
            LIMIT 10;`
        );

        if(listRanking.rows.length === 0) return res.sendStatus(StatusCodes.NOT_FOUND);

        return res.status(StatusCodes.OK).send(listRanking.rows);

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
    getUser,
    getRanking
 };