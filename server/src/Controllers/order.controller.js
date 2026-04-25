import Order from "../Models/order.model.js";
import Shop from "../Models/shop.model.js";
import userModel from "../Models/user.model.js";
import { emitOrderUpdate } from "../Socket/socket.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const placeOrder = async (req, res) => {
  try {
    const { cartItems, deliveryAddress, paymentMethod, totalAmount } = req.body;
    console.log( "deliver",req.body)

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    if (!deliveryAddress?.text || !deliveryAddress?.latitude || !deliveryAddress?.longitude) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const groupedByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupedByShop[shopId]) {
        groupedByShop[shopId] = [];
      }
      groupedByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupedByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId);
        if (!shop) {
          throw new Error(`Shop with ID ${shopId} not found`);
        }
        const items = groupedByShop[shopId];
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

        return {
          shop: shop._id,
          owner: shop.owner,
          subtotal,
          shopOrderItems: items.map((item) => ({
            item: item.id || item._id,
            price: item.price,
            quantity: item.quantity,
            name: item.name,
          })),
        };
      })
    );

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
      otp,
      isPaid: false,
    });

    shopOrders.forEach(so => {
      if (so.owner) {
        emitOrderUpdate(so.owner, { type: "NEW_ORDER", orderId: newOrder._id });
      }
    });

    return res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const orders = await Order.find({ user: userId })
      .populate({ path: "shopOrders.shop", select: "name image city address" })
      .populate({ path: "shopOrders.owner", select: "fullName phone email" })
      .populate({ path: "shopOrders.shopOrderItems.item" });
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOwnerOrders = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const orders = await Order.find({ "shopOrders.owner": userId })
      .populate("shopOrders.shop", "name image")
      .populate("user", "fullName phone")
      .populate("shopOrders.shopOrderItems.item", "name price image");
    
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.shopOrders = orderObj.shopOrders.filter(so => 
        so.owner && so.owner.toString() === req.userId.toString()
      );
      return orderObj;
    });
    return res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error("Get owner orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateShopOrderStatus = async (req, res) => {
  try {
    const { orderId, shopOrderId, status, deliveryBoyId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) return res.status(404).json({ message: "Shop order not found" });

    let ownerId = shopOrder.owner;
    if (!ownerId && shopOrder.shop) {
      const shop = await Shop.findById(shopOrder.shop);
      if (shop) ownerId = shop.owner;
    }

    if (!ownerId || ownerId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (status) shopOrder.status = status;
    if (deliveryBoyId) {
      shopOrder.deliveryBoy = new mongoose.Types.ObjectId(deliveryBoyId);
    }
    await order.save();

    emitOrderUpdate(order.user, { type: "STATUS_UPDATE", orderId: order._id, shopOrderId, status: shopOrder.status });
    return res.status(200).json({ message: "Status updated successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "shopOrders.deliveryBoy": req.userId })
      .populate("user", "fullName phone")
      .populate("shopOrders.shop", "name location");
    
    const assignedOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.shopOrders = orderObj.shopOrders.filter(so => so.deliveryBoy && so.deliveryBoy.toString() === req.userId.toString());
      return orderObj;
    });
    return res.status(200).json({ orders: assignedOrders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyDeliveryOTP = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) return res.status(404).json({ message: "Shop order not found" });

    shopOrder.status = "Delivered";
    await order.save();
    return res.status(200).json({ message: "Order delivered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await userModel.find({
      $or: [
        { fullName: { $regex: /Sourabh/i } },
        { role: { $regex: /delivery/i } }
      ]
    }).select("fullName phone _id role");
    return res.status(200).json({ deliveryBoys });
  } catch (error) {
    console.error("Get delivery boys error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the user is the owner of any shop in this order
    const isOwner = order.shopOrders.some(
      (so) => so.owner && so.owner.toString() === req.userId.toString()
    );

    if (!isOwner) {
      return res.status(403).json({ message: "Unauthorized to delete this order" });
    }

    await Order.findByIdAndDelete(orderId);
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};