import { configureStore } from "@reduxjs/toolkit";
import userslice from "./userSlice"
import ownerSlice from "./shopSlice"
import mapSlice from "./mapSlice";

const store= configureStore({
 reducer:{
   user:userslice,
   owner:ownerSlice,
   map:mapSlice
 }
})
export default store;