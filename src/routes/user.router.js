import express from "express";

import { 
    validateShortenUrlData 
} from "../middlewares/user.middleware.js";

import { 
    urlShorten,
    getShortUrl,
    openUrl,
    deleteUrl,
    getUser
} from "../controllers/user.controller.js";

const route = express.Router();

route.post("/urls/shorten", validateShortenUrlData, urlShorten);
route.get("/urls/:id", getShortUrl);
route.get("/urls/open/:shortUrl", openUrl);
route.delete("/urls/:id", deleteUrl);
route.get("/users/me", getUser);

export default route;