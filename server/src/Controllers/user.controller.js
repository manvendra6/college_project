import bcrypt from "bcryptjs"
import userModel from "../Models/user.model.js"
import gentoken from "../utility/webtoken.js";
import { sendOtpEmail } from "../utility/nodemailer.js";
 
 export const singUp= async(req,res)=>{
 try {
    const {fullName,email,password,role,phone}= req.body;
    console.log( fullName)
    if( !email || !fullName || !password || !phone || !role  ){
      return res.status(400).json({message:"All fields are required"})
    }
    const existingUser= await userModel.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "User already exists"})
    }
    console.log( existingUser)
    if(password.length <6){
      return res.status(400).json({message:"Password must be at least 6 characters"})
    }
    if(phone.length!==10){
      return res.status(400).json({message:"Phone number must be 10 digits"})
    }
    const passwordHash= await bcrypt.hash(password,10);
   const newUser= new userModel({
    fullName,
    email,
    password:passwordHash,
    role,
    phone
   })
   console.log( newUser)

   await newUser.save();
   const token= await gentoken(newUser._id);
    
   const options={
    secure:false,
    httpOnly:true,
    maxAge: 7*24*60*60*1000,
    sameSite:"strict"
   }

   return res.cookie("token",token,options).status(201).json({message:"User registered successfully",token:token})


 } catch (error) {
  return res.status(500).json({message:"Internal server error", error:error.message})
 }

}

//login controller

 export const singIN= async(req,res)=>{
 try {
    const {email,password }= req.body;
    if(!email || !password  ){
      return res.status(400).json({message:"All fields are required"})
    }
    const existingUser= await userModel.findOne({email});
    if(!existingUser){
      return res.status(400).json({message: "User not found, please sign up"})
    }
     const isMatch = bcrypt.compare(password, existingUser.password);
     if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"})
     }

      const token= await gentoken(existingUser._id);
    const options={
    secure:false,
    httpOnly:true,
    maxAge: 7*24*60*60*1000,
    sameSite:"strict"
   }
     

      return res.cookie("token",token,options).status(200).json({message:"User logged in successfully"})
 } catch (error) {
  return res.status(500).json({message:"Signin server error", error:error.message})
 }

}

//logout controller

export const Logout= async(req,res)=>{
  try {
    res.clearCookie("token");
    return res.status(200).json({message:"User logged out successfully"})
    
  } catch (error) {
    return res.status(500).json({message:"Logout server error", error:error.message})
  }
}


//forgot password controller

export const resetOtp= async(req,res)=>{
             try {
              const {email}= req.body;

              const user= await userModel.findOne({
                email
              })
              if(!user){
                return res.status(404).json({message:"User not found"})
              }
              //gen otp
              const otp= Math.floor(1000 + Math.random()*900).toString();
               const optExpiry= Date.now()+50*60*1000;
               user.resetOpt= otp;
               user.optExpiry=optExpiry;
               await user.save();

               //send otp gmail
                
               await sendOtpEmail(email,otp);
                return res.status(200).json({message:"OTP sent to your email"})
              
             } catch (error) {
              return res.status(500).json({message:"Send opt server error",error:error.message})
             }
}

//verify otp

export const verifyOtp= async(req,res)=>{
  try {
    const {email,otp}=req.body;
     
    const user= await userModel.findOne({email});
    if(!user || !user.resetOpt|| user.optExpiry<Date.now()){
      return res.status(400).json({message:"Invalid or expired OTP"})
    }
    if(user.resetOpt !== otp){
      return res.status(400).json({message:"Invalid OTP"})
    }
    user.otpVerified=true;
    user.resetOpt= undefined;
    user.optExpiry= undefined;
    await user.save();
    return res.status(200).json({message:"OTP verified successfully"})
  } catch (error) {
    return res.status(500).json({message:"Verify otp server error"})
  }
}

//reset pass

export const resetPassword= async(req,res)=>{
  try {
    const {email,newPassword}= req.body;
    const user= await userModel.findOne({email});
    if(!user|| !user.otpVerified ){
      return res.status(400).json({message:"invalid request"})
    }
    if(newPassword.length<=6){
      return res.status(400).json({message:"Password must be at least 6 characters"})
    }

    const newpasshash= await bcrypt.hash(newPassword,10);
    user.password=newpasshash;
    user.otpVerified=false;
    await user.save();
    return res.status(200).json({message:"Password reset successfully"})  
  } catch (error) {
    return res.status(500).json({message:"Reset password server error"})
  }
}

//Google auth

export const googleAuth = async (req, res) => {
  try {
    const { email, fullName, phone, role } = req.body;

   let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        fullName,
        email,
        phone,
        role
      });
      await user.save();
    }

    const token = await gentoken(user._id);   

    const options = {
      secure: false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict"
    };

    return res
      .cookie("token", token, options)
      .status(201)
      .json({ message: "User registered successfully", token });

  } catch (error) {
    console.error("Googleauth server error:", error);
    return res.status(500).json({ message: "Googleauth server error" });
  }
};
