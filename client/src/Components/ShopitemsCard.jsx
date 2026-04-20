import React, { useState } from 'react';
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../Redux/userSlice';

const ShopitemsCard = ({ data }) => {

  const dispatch = useDispatch();
  const {cartItem}= useSelector((state)=>state.user)
  console.log( "cartItem",cartItem)

 
  const [quantity, setQuantity] = useState(
    Array(data.length).fill(0)
  );
  console.log( "array",Array(data.length).fill(0))

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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      i <= rating
        ? stars.push(<span key={i}>&#9733;</span>)
        : stars.push(<span key={i}>&#9734;</span>);
    }
    return stars;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data?.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">

          <img
            src={item.image}
            alt={item.name}
            className="w-full h-40 object-cover rounded-lg mb-3 transform hover:scale-95 transition-transform duration-300"
          />

          <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
          <p className="text-gray-600 mt-1">Category: {item.category}</p>
          <p className="text-gray-600">Food Type: {item.foodType}</p>

          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-800 font-medium">₹ {item.price}</p>
            <div className="text-yellow-500">
              <p className="text-lg">{renderStars(item.rating?.average || 0)}</p>
              <span className="text-xs text-gray-500">{item.rating?.count || 0} reviews</span>
            </div>
          </div>

          
          <div className="flex items-center justify-between mt-4 p-2 rounded-xl border border-orange-300">
            <div className="flex items-center gap-3">
              <button
                onClick={()=> QuantityDecrease(idx)}
                className="p-2 bg-orange-100 rounded-full hover:bg-orange-200"
              >
                <FaMinus />
              </button>

         
              <span className="text-lg font-semibold">{quantity[idx]}</span>

              <button
                onClick={() => QuantityIncrease(idx)}
                className="p-2 bg-orange-100 rounded-full hover:bg-orange-200"
              >
                <FaPlus />
              </button>
            </div>

            <button className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 ">
              
              <FaShoppingCart onClick={()=>{dispatch(addToCart(
                quantity[idx]>0?{
                id: item._id,
                name: item.name,
                price: item.price,
                quantity: quantity[idx],
                image: item.image,
                shop: item.shop,
                foodType: item.foodType,
              }:""))}}/>
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default ShopitemsCard;
