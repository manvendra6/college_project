import React from "react";
import { FaRegTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteCartitem, updateQuantity } from "../Redux/userSlice";

const CartitemCard = ({ data }) => {
  const dispatch = useDispatch();

  if (!data) return null;

  const handleDecrease = () => {
    if (data.quantity > 1) {
      dispatch(
        updateQuantity({
          id: data.id,
          quantity: data.quantity - 1,
        })
      );
    }
  };

  const handleIncrease = () => {
    dispatch(
      updateQuantity({
        id: data.id,
        quantity: data.quantity + 1,
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteCartitem(data.id));
  };

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5 transition-all duration-300 group">
      
      {/* Image container with badge */}
      <div className="relative shrink-0">
        <img
          src={data.image}
          className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
          alt={data.name}
        />
        {data.foodType && (
           <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 p-1 rounded-full shadow-sm">
             <div className={`w-3 h-3 rounded-full ${data.foodType.toLowerCase() === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></div>
           </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full gap-4 sm:gap-0 items-center sm:items-stretch">
        
        {/* Item Info */}
        <div className="flex flex-col flex-grow gap-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 transition-colors">
            {data.name}
          </h1>

          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            ₹ {data.price} × {data.quantity}
          </p>

          <p className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            ₹ {data.price * data.quantity}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 px-2 py-1.5 rounded-xl shadow-inner">
            <button
              onClick={handleDecrease}
              className="p-2 text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaMinus className="text-sm" />
            </button>

            <span className="font-bold text-gray-800 dark:text-gray-100 w-6 text-center">{data.quantity}</span>

            <button
              onClick={handleIncrease}
              className="p-2 text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all duration-300"
            title="Remove item"
          >
            <FaRegTrashAlt className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartitemCard;
