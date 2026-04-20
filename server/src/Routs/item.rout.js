import express from "express"
 
import { isAuth } from "../Middleware/isAuth.js";
import { creatItem, deleteItem, Eddititem, GetitemById } from "../Controllers/items.controller.js";
import { upload } from "../Middleware/multer.js";
 
 
  const  itemRouter= express.Router();
  itemRouter.post("/item-add",isAuth,upload.single("image"),creatItem);
  itemRouter.post("/edit-item/:itemId",isAuth,upload.single("image"),Eddititem);
  itemRouter.get("/item-get-id/:itemId",isAuth,GetitemById );
  itemRouter.delete("/delete-item/:itemId",isAuth, deleteItem);
  export default itemRouter;
