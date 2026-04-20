import { getCurrentuser } from "../Controllers/user2.controller.js";

import express from "express"
import { isAuth } from "../Middleware/isAuth.js";

const userRouter= express.Router();

 userRouter.get("/current",isAuth,getCurrentuser);

 export default userRouter;
