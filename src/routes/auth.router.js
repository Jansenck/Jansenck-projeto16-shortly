import express, { Router } from "express";
import { signUp } from "../controllers/auth.controller.js";
import { validationSignUp } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.use("/signup", validationSignUp, signUp);

export default route;