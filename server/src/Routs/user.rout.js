import express from "express"
import { getDeliveryBoys, googleAuth, singUp } from "../Controllers/user.controller.js";
import { singIN } from "../Controllers/user.controller.js";
import {Logout} from "../Controllers/user.controller.js";
import { resetOtp } from "../Controllers/user.controller.js";
import { verifyOtp } from "../Controllers/user.controller.js";
import { resetPassword } from "../Controllers/user.controller.js";


const router= express.Router();

 router.post("/signup",singUp);
  router.post("/signin",singIN);
  router.get("/logout",Logout);
  router.post("/resetotp",resetOtp);
  router.post("/verifyotp",verifyOtp);
  router.post("/resetpass",resetPassword);
  router.post("/googleauth",googleAuth);
  router.get("/delivery-boys", getDeliveryBoys);

  export default router;
