import Item from "../Models/item.model.js";
import Shop from "../Models/shop.model.js";
 
import { uploadFile } from "../utility/cloudinary.js";


 export const creatItem = async (req, res) => {
  try {
    console.log( "initial data",req.body)
    const { name, category, price, foodType } = req.body;
     let shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    let img;
    if (req.file) {
    
      img = await uploadFile(req.file.path);
    } else
     {
      return res.status(400).json({ message: "File is not uploaded" });
    }
    const item = await Item.create({
      name,
      category,
      price,
      foodType,
      image: img,
      shop: shop._id
    });
    console.log( "itme id", item._id)
    if(!shop.items.includes(item._id)){
      shop.items.push(item._id);
    }
    await shop.save();
    await  shop.populate( {
      path: "items",
      options:{sort:{updatedAt:-1}}
    });
 
   

    return res.status(200).json({ message: "Item added", shop });

  } catch (error) {
    return res.status(500).json({ message: "Add item error", error });
  }
};


 export const Eddititem= async(req,res)=>{
  try {
    const itemid = req.params.itemId;
    const { name, category, price, foodType } = req.body;
    console.log( "itme id ",itemid)

    const existingItem = await Item.findById(itemid);
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    let image = existingItem.image;  

    if (req.file) {
    
      image = await uploadFile(req.file.path);
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemid,
      { name, category, price, foodType, image },
      { new: true }
    );

    return res.status(200).json({ message: "Item updated", updatedItem });

  } catch (error) {
    return res.status(500).json({ message: "Update item error", error });
  }
 }


 export const GetitemById=async(req,res)=>{
  try {
    const itemid= req.params.itemId;
    console.log( "itemid",itemid)
    const item = await Item.findById(itemid)
    if(!item){
      return res.status(400).json({message:"item not found"})
    }
    return res.status(200).json({message:"item found",item})
  } catch (error) {
    return res.status(500).json({message:"getitem by id error",error})
  }
 }
 

 export const deleteItem= async(req,res)=>{
  try {
    const itemid= req.params.itemId;
    console.log( "itemid to delete",itemid)
    const item= await Item.findByIdAndDelete(itemid);
    if(!item){
      return res.status(400).json({message:"item not found"})
    }
    const shop= await Shop.findOne({owner:req.userId});
    shop.items= shop.items.filter(itmId=> itmId.toString()!== itemid);
    console.log( "shiop itmews",shop.items)
    await shop.save();
     await shop.populate( {
      path: "items",
      options:{sort:{updatedAt:-1}}
    });
    return res.status(200).json({message:"item deleted successfully",shop})
  }

    catch (error) {
    return res.status(500).json({message:"delete item  error",error})
  }
 }