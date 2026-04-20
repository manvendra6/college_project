import Shop from "../Models/shop.model.js";
import { uploadFile } from "../utility/cloudinary.js";

 
 

export const creatShop_edit = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    let shop = await Shop.findOne({ owner: req.userId });

    let img;
    if (req.file) {
    
      img = await uploadFile(req.file.path);
    }

    if (!shop) {
    
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
     
      shop = await Shop.findOneAndUpdate(
        { owner: req.userId },
        {
          name,
          city,
          state,
          address,
          image: img || shop.image, 
        },
        { new: true }
      );
    }

    await shop.populate("owner");

    return res.status(201).json({ message: "Shop saved successfully", shop });
  } catch (error) {
    console.error("creatShop_edit error:", error);
    return res.status(500).json({ message: "creatShop_edit error", error: error.message });
  }
};


export const getMyShop = async (req, res) => {
  try {
    const userId = req.userId; 
    console.log( "user id  found",userId)

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const shop = await Shop.findOne({ owner: userId }).populate("owner", "fullName email ").populate("items");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    return res.status(200).json({
      message: "Shop fetched successfully",
      shop,
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