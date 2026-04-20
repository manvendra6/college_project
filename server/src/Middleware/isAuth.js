import jwt from "jsonwebtoken";
import dotenv, { config } from "dotenv";

dotenv.config(
   {
    path:'./src/.env'
   }
)

export const isAuth =(req,res,next)=>{
  try {
    const token =req.cookies.token;
 
    if(!token){
      return res.status(401).json({message:"unauthorized access no token found"})
    }
     const decoded = jwt.verify(token,process.env.JWT_SECRET)

     req.userId= decoded.userId;
     console.log( "req",req.userId)
     next();
    
  } catch (error) {
    return res.status(500).json({message:"isauth error",error})
  }
}