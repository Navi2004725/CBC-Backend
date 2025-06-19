import express from "express";
import { creatUsers, loginUser } from "./controllers/userControllers.js";

const userRouter = express.Router();
userRouter.post("/", creatUsers);
userRouter.post("/login", loginUser);

export default userRouter;
