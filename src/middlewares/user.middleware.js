import { StatusCodes } from "http-status-codes";
import connection from "../database/database.js";
import { shortenUrlSchema } from "../schemas/user.schemas.js";

async function validateShortenUrlData(req, res, next){

    const token = await req.headers.authorization?.replace("Bearer ", "");
    if(!token) return res.sendStatus(StatusCodes.UNAUTHORIZED);

    const { url } = req.body;

    const isValidUrl = shortenUrlSchema.validate(
        {url}, 
        {abortEarly: false}
    );

    if(isValidUrl.error){
        const urlError = isValidUrl.error.details.map(detail => detail.message);
        return res.status(StatusCodes.BAD_REQUEST).send(urlError);
    }

    try {

        const isValidToken = await connection.query(
            `SELECT * FROM "sessions" WHERE "token"=$1;`, [token]
        );

        if(isValidToken.rows.length === 0){
            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        }

        const { id } = isValidToken.rows[0];

        res.locals.url = url;
        res.locals.sessionId = id;
        
        
    } catch (error) {
        console.error(error.message);
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    next();
}

export { validateShortenUrlData };
