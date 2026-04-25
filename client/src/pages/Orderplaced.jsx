import React, { useEffect } from 'react';
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineReceiptLong, MdHome } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Orderplaced = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-gray-950 flex justify-center items-center p-4 transition-colors duration-300 relative overflow-hidden'>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/20 dark:bg-green-500/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-500/10 dark:bg-orange-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <div className='z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12 rounded-[2rem] shadow-2xl dark:shadow-none flex flex-col items-center text-center max-w-md w-full transform transition-all duration-500 hover:scale-[1.02]'>
        
        {/* Animated Icon Container */}
        <div className='relative mb-8'>
          <div className='absolute inset-0 bg-green-500/20 dark:bg-green-500/10 rounded-full animate-ping duration-1000'></div>
          <div className='relative bg-green-100 dark:bg-green-500/20 p-4 rounded-full shadow-inner'>
            <IoCheckmarkCircle className='text-7xl text-green-500 drop-shadow-md' />
          </div>
        </div>

        <h1 className='text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-4'>
          Order Placed!
        </h1>
        
        <p className='text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed font-medium'>
          Thank you for your purchase.<br />
          Your delicious order is being prepared and will be with you shortly.
        </p>

        <div className='w-full space-y-4'>
          <button 
            onClick={() => navigate("/order-page")}
            className='w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2'
          >
            <MdOutlineReceiptLong className="text-2xl" />
            Track My Order
          </button>
          
          <button 
            onClick={() => navigate("/")}
            className='w-full py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-2 border-gray-100 dark:border-gray-700 font-bold text-lg rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2'
          >
            <MdHome className="text-2xl" />
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default Orderplaced;