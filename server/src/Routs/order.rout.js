import express from "express";
import { getOrders, placeOrder, getOwnerOrders, updateShopOrderStatus, getDeliveryOrders, verifyDeliveryOTP, getDeliveryBoys, deleteOrder } from "../Controllers/order.controller.js";
import { isAuth } from "../Middleware/isAuth.js";

const orderRouter= express.Router();

orderRouter.post("/place-order",isAuth,placeOrder);
orderRouter.get("/my-orders",isAuth,getOrders);
orderRouter.get("/owner-orders",isAuth,getOwnerOrders);
orderRouter.put("/update-status", isAuth, updateShopOrderStatus);
orderRouter.get("/delivery-orders", isAuth, getDeliveryOrders);
orderRouter.post("/verify-otp", isAuth, verifyDeliveryOTP);
orderRouter.get("/delivery-boys", getDeliveryBoys);
orderRouter.delete("/delete-order/:orderId", isAuth, deleteOrder);

export default orderRouter;