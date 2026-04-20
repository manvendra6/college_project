import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   fullName:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   password:{
    type:String,
   },
    role:{
    type:String,
    enum:["user","owner","delivery Boy"],
    },
    phone:{
    type:String,
    required:true,
    unique:true
    },
    resetOpt:{
     type:String,

    },
    otpVerified:{
        type:Boolean,
        default:false
    },
    optExpiry:{
        type:Date,
    }
},{timestamps:true});

const userModel = mongoose.model("user",userSchema);
export default userModel;