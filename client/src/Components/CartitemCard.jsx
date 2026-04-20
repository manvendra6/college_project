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
    <div className="w-full max-w-4xl bg-white shadow-md border rounded-xl p-3 flex items-center gap-4">
      <img
        src={data.image}
        className="w-20 h-20 rounded-lg object-cover border"
        alt={data.name}
      />

      <div className="flex justify-between w-full">
        <div className="flex flex-col flex-grow gap-1">
          <h1 className="text-lg font-semibold text-gray-800">
            {data.name}
          </h1>

          <p className="text-sm text-gray-500">
            ₹ {data.price} × {data.quantity}
          </p>

          <p className="font-semibold">
            ₹ {data.price * data.quantity}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrease}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            <FaMinus />
          </button>

          <span className="font-semibold">{data.quantity}</span>

          <button
            onClick={handleIncrease}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            <FaPlus />
          </button>

          <button
            onClick={handleDelete}
            className="px-2 py-2 rounded-full bg-red-500"
          >
            <FaRegTrashAlt className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartitemCard;
