import { createSlice } from "@reduxjs/toolkit";
 

const userSlice= createSlice({
  name:"user",
  initialState:{
    userData:null,
    city:null,
    State:null,
     
    shopcity:null,
    cartItem:[],
    totalAmount:0,
  },
  reducers:{
    setuserData:(state,action)=>{
        state.userData= action.payload
    },
    setcity:(state,action)=>{
      state.city=action.payload
    },
      setState:(state,action)=>{
      state.State=action.payload
    },
       
    setshopcity:(state,action)=>{
      state.shopcity=action.payload
    },
    addToCart:(state,action)=>{
       const cartItems= {...action.payload};
       console.log( "cartItems",cartItems)
       const existItem= state.cartItem.find((item)=> item.id===cartItems.id);
        if(existItem){
          existItem.quantity+=cartItems.quantity;
        }else{
          state.cartItem.push(cartItems);
        }
         state.totalAmount=state.cartItem.reduce((sum,i)=>sum+i.price*i.quantity,0
          )
        console.log( "data come",state.cartItem)
    },
    updateQuantity:(state,action)=>{
      const {id,quantity}= action.payload;
      const item= state.cartItem.find((item)=> item.id===id);
      if(item){
        item.quantity= quantity;
      }
         state.totalAmount=state.cartItem.reduce((sum,i)=>sum+i.price*i.quantity,0
          )
    },
    deleteCartitem:(state,action)=>{
      state.cartItem= state.cartItem.filter(i=>i.id!=action.payload)
        state.totalAmount=state.cartItem.reduce((sum,i)=>sum+i.price*i.quantity,0
          )
    },
 
 


  }
})
 
 
export const {setuserData,setcity,setState,setshopcity,addToCart,updateQuantity,deleteCartitem,totalAmount}=userSlice.actions;

export default userSlice.reducer