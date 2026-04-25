import React, { useState } from 'react';
import { FaMinus, FaPlus, FaShoppingCart, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../Redux/userSlice';

const ShopitemsCard = ({ data }) => {
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state) => state.user);
  
  const [quantity, setQuantity] = useState(
    Array(data?.length || 0).fill(0)
  );

  const QuantityIncrease = (idx) => {
    setQuantity((prev) => {
      const updated = [...prev];
      updated[idx] = updated[idx] + 1;
      return updated;
    });
  };

  const QuantityDecrease = (idx) => {
    setQuantity((prev) => {
      const updated = [...prev];
      if (updated[idx] > 0) {
        updated[idx] = updated[idx] - 1;
      }
      return updated;
    });
  };

  const handleAddToCart = (item, idx) => {
    if (quantity[idx] > 0) {
      dispatch(addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: quantity[idx],
        image: item.image,
        shop: item.shop?._id || item.shop,
        foodType: item.foodType,
      }));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {data?.map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-black/40 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full">
          
          {/* Image Section */}
          <div className='relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-900'>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            {/* Food Type Badge */}
            <div className='absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm'>
              <div className={`w-2 h-2 rounded-full ${item.foodType?.toLowerCase() === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className='text-xs font-bold text-gray-700 dark:text-gray-200 capitalize'>{item.foodType}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className='p-5 flex flex-col flex-grow'>
            <div className='flex justify-between items-start mb-2'>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">{item.name}</h2>
            </div>
            
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-700/50 inline-block px-3 py-1 rounded-lg w-fit">
              {item.category}
            </p>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-auto mb-5">
              <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                ₹{item.price}
              </p>
              <div className="flex flex-col items-end">
                <div className="flex gap-0.5 text-sm">
                  {renderStars(item.rating?.average || 4)}
                </div>
                <span className="text-xs font-medium text-gray-400 mt-1">{item.rating?.count || 12} reviews</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/30 p-2 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-2 py-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => QuantityDecrease(idx)}
                  className="p-1.5 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
                >
                  <FaMinus className='text-sm' />
                </button>
                <span className="text-base font-bold w-6 text-center text-gray-800 dark:text-gray-100">{quantity[idx]}</span>
                <button
                  onClick={() => QuantityIncrease(idx)}
                  className="p-1.5 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
                >
                  <FaPlus className='text-sm' />
                </button>
              </div>

              <button 
                onClick={() => handleAddToCart(item, idx)}
                disabled={quantity[idx] === 0}
                className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${quantity[idx] > 0 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-orange-500/30 hover:scale-105' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'}`}
              >
                <FaShoppingCart className='text-lg' />
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default ShopitemsCard;
