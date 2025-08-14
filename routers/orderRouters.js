import express from "express";
import { createOrder, getOrder, updateOrder } from "./controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/:page/:limit", getOrder);
orderRouter.put("/:orderID", updateOrder);

export default orderRouter;
