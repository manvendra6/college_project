import userModel from "../Models/user.model.js";


 export const getCurrentuser= async(req,res)=>{
  
   try {
     const userid=req.userId;
      
     if(!userid){
      return res.status(400).json({message:"userid is not found"})
     }
     const user= await userModel.findById(userid)
     if(!user){
      return res.status(400).json({message:"user is not found"})
     }
     
     return res.status(200).json(user)
 
   } catch (error) {
       return res.status(500).json({message:"getcurrent user error",error})
   }
}