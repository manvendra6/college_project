import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({
  path:"./src/.env"
});
const gentoken = async(userId)=>{
  try {
    const token= jwt.sign({userId},process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRETIME
    }
    );
    return token;
    
  } catch (error) {
    console.log("server error of the token")
  }
}
export default gentoken;