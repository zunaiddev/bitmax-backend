import express from "express";
import AuthController from "../controller/AuthController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const authRouter = express.Router();

authRouter.post("/api/auth/register", authMiddleware, AuthController.signup);
authRouter.post("/api/auth/login", authMiddleware, AuthController.login);
authRouter.post("/api/auth/verify-email", authMiddleware, AuthController.verifyEmail);
authRouter.post("/api/auth/verify-phone", authMiddleware, AuthController.verifyPhone);
authRouter.post("/api/auth/resend-email-otp", authMiddleware, AuthController.resendEmailOtp);
authRouter.post("/api/auth/resend-phone-otp", authMiddleware, AuthController.resendPhoneOtp);
authRouter.post("/api/auth/request-login-otp", authMiddleware, AuthController.requestLoginOtp);
authRouter.post("/api/auth/login-otp", authMiddleware, AuthController.loginWithOtp);
authRouter.post("/api/auth/forget-password", authMiddleware, AuthController.forgotPassword);
authRouter.post("/api/auth/reset-password", authMiddleware, AuthController.resetPassword);

export default authRouter;