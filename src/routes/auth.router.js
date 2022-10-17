import express from "express";
import { createUser, checkUser } from "../controllers/auth.controller.js";
import { validationSignUp, validationSignIn } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.use("/signup", validationSignUp, createUser);
route.use("/signin", validationSignIn, checkUser);

export default route;