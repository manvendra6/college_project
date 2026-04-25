import mongoose, { Types } from "mongoose";

const shopschema= mongoose.Schema({
  name:{
    type:String,
    required:true
  },
    city:{
    type:String,
    required:true
  },
    state:{
    type:String,
    required:true
  },
    address:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
 items: [
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Item",
    required: true
  }
],

  


},{timestamps:true})

const Shop= mongoose.model("Shop",shopschema)

export default Shop;