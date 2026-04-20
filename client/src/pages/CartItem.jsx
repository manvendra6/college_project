import React from 'react'
import { useSelector } from 'react-redux'
import CartitemCard from '../Components/CartitemCard';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { MdRemoveShoppingCart } from "react-icons/md";


const CartItem = () => {
  const {cartItem,totalAmount}= useSelector((state)=>state.user)
  const navigate= useNavigate();
  console.log( "cart",cartItem)
  return (
    <div className='min-h-full bg-[#fff9f6] h-screen p-6 w-screen'>
      <div className='h-full w-full'>
        <IoIosArrowRoundBack 
         className="text-5xl text-[#ff4d2d] hover:text-cyan-600 translate-x-1 cursor-pointer transition-transform duration-200 hover:translate-x-0" 
               onClick={()=>navigate("/")} />
          <div className=' text-center my-2 text-red-500'>
            
          <h1 className='text-4xl font-semibold '>Your Cart</h1>
         
                </div>
      
        
        <div className='grid grid-cols-1 gap-3 place-items-center mt-10'>
          {
            cartItem?.length===0?(
              <div className='min-h-32 min-w-32 rounded-xl border  flex flex-col justify-center items-center p-6 mt-20 shadow-2xl'>
              <MdRemoveShoppingCart className="text-7xl " />
              <h1 className='text-xl font-semibold mt-1'>Your cart is empty</h1>
              <p className='text-gray-500 mt-4'>Add items to your cart to see them here.</p>
                </div>
            ):(
  <>
    {cartItem?.map((item, index) => (
      <CartitemCard key={index} data={item} />
    ))}

    <div className="mt-6 text-2xl font-semibold h-16 w-full  max-w-4xl border rounded-md shadow-2xl flex items-center justify-center text-black  ">
      Total: ₹{totalAmount}
    </div>
    <div className='border px-4 py-2 rounded-md font-semibold text-xl shadow-2xl bg-gradient-to-r from-pink-500 via-blue-500 to-red-500 text-white cursor-pointer hover:bg-gradient-to-r hover:from-red-500 hover:via-pink-500 hover:to-blue-500 transition-all duration-300  ' onClick={()=>navigate("/chackout")}>
      checkout Page
    </div>
  </>
)
          }
        </div>
      </div>
    </div>
  )
}

export default CartItem