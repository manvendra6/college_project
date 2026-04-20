import express from "express";
import { placeOrder } from "../Controllers/order.controller.js";
import { isAuth } from "../Middleware/isAuth.js";

const orderRouter= express.Router();

orderRouter.post("/place-order",isAuth,placeOrder);

export default orderRouter;