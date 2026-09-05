import express from "express";
import UserController from "../controller/UserController.js";
import userMiddleware from "../middleware/UserMiddleware.js";

const userRouter = express.Router();

userRouter.get("/api/user/me", userMiddleware, UserController.getUser);
userRouter.get("/api/user/sessions", userMiddleware, UserController.getSessions);
userRouter.post("/api/user/logout", userMiddleware, UserController.logout);
userRouter.post("/api/user/logout-all", userMiddleware, UserController.logAllOut);

export default userRouter;