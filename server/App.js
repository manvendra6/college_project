import express from 'express';
import cors from 'cors';
import router from './src/Routs/user.rout.js';
import cookieParser from 'cookie-parser';
import shoprouter from './src/Routs/shop.rout.js';
import itemRouter from './src/Routs/item.rout.js';
import userRouter from './src/Routs/user2.rout.js';
import orderRouter from './src/Routs/order.rout.js';
 



 export const app= express();

  app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials:true
  }));
  app.use(express.json());
  app.use(cookieParser());
  
  app.use("/api/auth",router);
  app.use("/api/shop",shoprouter);
  app.use("/api/item",itemRouter);
  app.use("/api/user",userRouter)
  app.use("/api/order",orderRouter);
 

  
 

