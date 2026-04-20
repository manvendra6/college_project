import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({
  path:"./src/.env"
})

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
  port: 465,
  secure:true,  
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail= async(email,otp)=>{
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is ${otp}. It is valid for 2 minutes.`,
      
    })
    
  } catch (error) {
    console.log("otp is not send error due to sendOtp email")
  }
}