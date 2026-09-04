import express from "express";
import AuthController from "../controller/AuthController.js";

const authRouter = express.Router();

authRouter.post("/api/auth/register", AuthController.signup);
authRouter.post("/api/auth/login", AuthController.login);
authRouter.post("/api/auth/verify-email", AuthController.verifyEmail);

export default authRouter;