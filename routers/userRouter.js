import express from "express";
import { creatUsers, getUser, loginUser } from "./controllers/userControllers.js";

const userRouter = express.Router();
userRouter.post("/", creatUsers);
userRouter.get("/", getUser);
userRouter.post("/login", loginUser);

export default userRouter;
