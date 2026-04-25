import React from 'react'
import { useSelector } from 'react-redux'
import CartitemCard from '../Components/CartitemCard';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { MdRemoveShoppingCart } from "react-icons/md";
import { BsCartCheckFill } from "react-icons/bs";

const CartItem = () => {
  const {cartItem, totalAmount} = useSelector((state) => state.user)
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-gray-950 p-6 w-full flex justify-center transition-colors duration-300 relative'>
      
      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-5%] w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className='w-full max-w-4xl relative z-10'>
        
        {/* Header */}
        <div className='flex items-center mb-8 relative'>
          <button 
            onClick={() => navigate("/")}
            className="absolute left-0 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md hover:bg-orange-50 dark:hover:bg-gray-700 text-orange-500 hover:text-orange-600 transition-all duration-300 group"
          >
            <IoIosArrowRoundBack className="text-3xl group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className='w-full text-center'>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex justify-center items-center gap-3'>
              <BsCartCheckFill className="text-orange-500" />
              Your Cart
            </h1>
          </div>
        </div>
      
        <div className='flex flex-col gap-4 items-center'>
          {cartItem?.length === 0 ? (
            <div className='min-h-[400px] w-full max-w-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center p-8 mt-10 shadow-lg dark:shadow-none'>
              <div className='w-32 h-32 bg-orange-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner'>
                <MdRemoveShoppingCart className="text-6xl text-orange-500" />
              </div>
              <h1 className='text-2xl font-bold text-gray-800 dark:text-white mt-2'>Your cart is empty</h1>
              <p className='text-gray-500 dark:text-gray-400 mt-2 text-center max-w-sm'>Looks like you haven't added anything to your cart yet. Go ahead and explore top categories.</p>
              <button 
                onClick={() => navigate("/")}
                className='mt-8 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300'
              >
                Start Browsing
              </button>
            </div>
          ) : (
            <div className='w-full flex flex-col gap-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white dark:border-gray-800 shadow-xl dark:shadow-none'>
              
              <div className="flex flex-col gap-4">
                {cartItem?.map((item, index) => (
                  <CartitemCard key={index} data={item} />
                ))}
              </div>

              {/* Summary Section */}
              <div className="mt-4 pt-6 border-t border-gray-200 dark:border-gray-700/50 w-full flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  Total Amount: 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 text-2xl sm:text-3xl">
                    ₹{totalAmount}
                  </span>
                </div>
                
                <button 
                  onClick={() => navigate("/chackout")}
                  className='w-full sm:w-auto px-10 py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-300'
                >
                  Proceed to Checkout
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartItem;