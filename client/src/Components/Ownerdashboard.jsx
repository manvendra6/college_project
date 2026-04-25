import React, { useEffect, useState } from 'react';
import Nav from '../pages/Nav';
import { useDispatch, useSelector } from 'react-redux';
import { FaUtensils, FaPlus } from 'react-icons/fa';
import { MdOutlineEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { setmyshopData } from '../Redux/shopSlice';
import OwneritemsCard from './OwneritemsCard';

function OwnerDashboard() {
  const { myshopData, myShops } = useSelector((state) => state.owner);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddNew = () => {
    dispatch(setmyshopData(null)); // Clear to ensure it's a NEW shop
    navigate("/create-editshop");
  };

  const handleEdit = (shop) => {
    dispatch(setmyshopData(shop)); // Set to ensure it EDITS this shop
    navigate("/create-editshop");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fff9f6]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center relative pb-10">
      <Nav />
      
      <div className="mt-24 w-full max-w-4xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md"
          >
            <FaPlus /> Add New Shop
          </button>
        </div>

        {myShops && myShops.length > 0 ? (
          <div className="space-y-8">
            {myShops.map((shop) => (
              <div key={shop._id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="relative">
                  <img
                    src={shop.image?.url || shop.image || "/placeholder.png"}
                    alt={shop.name}
                    className="w-full h-48 object-cover"
                  />
                  <div 
                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full cursor-pointer shadow-md transition-all text-orange-500"
                    onClick={() => handleEdit(shop)}
                  >
                    <MdOutlineEdit className="text-2xl" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{shop.name}</h2>
                      <p className="text-gray-600">{shop.city}, {shop.state}</p>
                      <p className="text-gray-500 text-sm mt-1">{shop.address}</p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(setmyshopData(shop));
                        navigate("/add-items");
                      }}
                      className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200 transition-all"
                    >
                      Add Items
                    </button>
                  </div>

                  {shop.items && shop.items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {shop.items.map((item, index) => (
                        <OwneritemsCard key={index} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-xl mt-4">
                      <p className="text-gray-500">No items in menu</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <FaUtensils className="text-5xl text-orange-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800">No Shops Found</h2>
              <p className="text-gray-500 mt-2">Click "Add New Shop" to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
