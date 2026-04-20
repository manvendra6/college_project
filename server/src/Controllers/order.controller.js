import Order from "../Models/order.model.js";
import Shop from "../Models/shop.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, deliveryAddress, paymentMethod, totalAmount } = req.body;
    console.log( "deliver",req.body)

    // 1. Validation
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    if (
      !deliveryAddress?.text ||
      !deliveryAddress?.latitude ||
      !deliveryAddress?.longitude
    ) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    // 2. Group by shop
    const groupedByShop = {};

    cartItems.forEach((item) => {
 
      const shopId = item.shop.toString();
       

      if (!groupedByShop[shopId]) {
        groupedByShop[shopId] = [];
      }

      groupedByShop[shopId].push(item);
    });
    

    // 3. Create shop-wise orders
    const shopOrders = await Promise.all(
      Object.keys(groupedByShop).map(async (shopId) => {
         
        const shop = await Shop.findById(shopId).populate("owner");
       console.log( "owner",shop)
        const items = groupedByShop[shopId];
       

        const subtotal = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner?._id,
          subtotal,
          shopOrderItmes: items.map((item) => ({
            item: item.id,
            price: item.price,
            quantity: item.quantity,
            name:item.name,
          })),
        };
      })
    );
    console.log("shoporder",shopOrders)
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders 
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};