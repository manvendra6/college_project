import express from "express"
import { creatShop_edit, getMyShop, getShopBycity } from "../Controllers/shop.controller.js";
import { isAuth } from "../Middleware/isAuth.js";
import { upload } from "../Middleware/multer.js";
 
  const shoprouter= express.Router();
  shoprouter.post("/createdit",isAuth,upload.single("image"),creatShop_edit);
  shoprouter.get("/get-myshopData",isAuth,getMyShop);
  shoprouter.get("/get-city/:city",isAuth,getShopBycity);
  export default shoprouter;
