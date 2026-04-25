import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
export const uploadFile=async(file)=>{

  cloudinary.config({ 
  cloud_name:process.env.CLOUD_NAME, 
  api_key:process.env.CLOUD_API , 
  api_secret:process.env.CLOUD_API_SECRETE
});
  try {
    const res= await cloudinary.uploader.upload(file)
    fs.unlinkSync(file)
    
    return res.secure_url
    
  } catch (error) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    console.error("file upload error", error);
    throw error;
  }
}