import express from "express";
import AuthController from "../controller/AuthController.js";
import authMiddleware from "../AuthMiddleware.js";

const authRouter = express.Router();

authRouter.post("/api/auth/register", authMiddleware, AuthController.signup);
authRouter.post("/api/auth/login", authMiddleware, AuthController.login);
authRouter.post("/api/auth/verify-email", authMiddleware, AuthController.verifyEmail);
authRouter.post("/api/auth/verify-phone", authMiddleware, AuthController.verifyPhone);
authRouter.post("/api/auth/resend-email-otp", authMiddleware, AuthController.resendEmailOtp);
authRouter.post("/api/auth/resend-phone-otp", authMiddleware, AuthController.resendPhoneOtp);

export default authRouter;