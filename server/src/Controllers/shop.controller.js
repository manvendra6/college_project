import Shop from "../Models/shop.model.js";
import { uploadFile } from "../utility/cloudinary.js";
import mongoose from "mongoose";

 
 

export const creatShop_edit = async (req, res) => {
  try {
    const { _id, name, city, state, address } = req.body;
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }
    const ownerId = new mongoose.Types.ObjectId(req.userId);

    let shop;
    if (_id) {
      shop = await Shop.findById(_id);
      if (shop && shop.owner.toString() !== req.userId) {
        return res.status(403).json({ message: "Not authorized to edit this shop" });
      }
    }

    let img;
    if (req.file) {
      img = await uploadFile(req.file.path);
    }

    if (!shop) {
      // Create new shop
      if (!img) {
        return res.status(400).json({ message: "File is required to create shop" });
      }
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image: img,
        owner: req.userId,
      });
    } else {
      // Update existing shop
      shop.name = name || shop.name;
      shop.city = city || shop.city;
      shop.state = state || shop.state;
      shop.address = address || shop.address;
      if (img) shop.image = img;
      await shop.save();
    }

    await shop.populate("owner");

    // Fetch all shops to return the updated list
    const shops = await Shop.find({ owner: ownerId }).populate("items");

    return res.status(201).json({ 
      message: "Shop saved successfully", 
      shop, 
      shops 
    });
  } catch (error) {
    console.error("creatShop_edit error:", error);
    return res.status(500).json({ message: "creatShop_edit error", error: error.message });
  }
};


export const getMyShop = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }
    const userId = new mongoose.Types.ObjectId(req.userId);
    console.log("user id found", userId);

    const shops = await Shop.find({ owner: userId })
      .populate("owner", "fullName email")
      .populate("items");

    return res.status(200).json({
      message: "Shops fetched successfully",
      shops,
      shop: shops[0] || null, // Keep for backward compatibility
    });
  } catch (error) {
    console.error("Error fetching shop:", error);
    res.status(500).json({
      message: "Server error while fetching shop",
      error: error.message,
    });
  }
};

export const getShopBycity = async (req, res) => {
  try {

    const {city}= req.params;
    console.log( "city found",city)
    const shops = await Shop.find({city:{
      $regex: new RegExp(`^${city}$`, 'i')
    }}).populate("items")
    if(!shops){
      return res.status(404).json({message:"No shops found in this city"})
    }
    return res.status(200).json({message:"Shops fetched successfully",shops})
    
  } catch (error) {
    return res.status(500).json({message:"Server error while fetching shops by city",error:error.message})
  }
}