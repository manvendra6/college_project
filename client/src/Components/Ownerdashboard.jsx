import React, { useEffect, useState } from 'react';
import Nav from '../pages/Nav';
import { useSelector } from 'react-redux';
import { FaUtensils } from 'react-icons/fa';
import { MdOutlineEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import OwneritemsCard from './OwneritemsCard';

function OwnerDashboard() {
  const { myshopData } = useSelector((state) => state.owner);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log( "ownerdashbord mount hua hai ")

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);  
    return () => clearTimeout(timer);
  }, [myshopData]);

  console.log("Shop data:", myshopData);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fff9f6]">
        <div className="flex flex-col items-center space-y-4">
       
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen bg-[#fff9f6] flex flex-col items-center relative ${
        myshopData ? 'mt-30' : 'justify-center'
      }`}
    >
      <Nav />
 
      {!myshopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center space-y-3">
              <FaUtensils className="text-5xl text-orange-500 mb-3" />
              <h2 className="text-2xl font-bold text-gray-800">Add Your Restaurant</h2>
              <p className="text-gray-600 text-sm">
                Join our food delivery platform and reach thousands of hungry customers every day. Grow your business with us!
              </p>
              <button
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                onClick={() => navigate("/create-editshop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
 
      {myshopData && (
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300 mb-6">
          <div className="flex justify-center items-center mt-4 space-x-3">
            <FaUtensils className="text-5xl text-orange-500" />
            <h2 className="text-2xl font-semibold text-gray-700">{`Welcome to ${myshopData.name}`}</h2>
          </div>

          <div className="relative mt-4">
            <img
              src={myshopData.image?.url || myshopData.image || "/placeholder.png"}
              alt={myshopData.name}
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="absolute top-2 right-2 p-1 bg-red-500 rounded-full cursor-pointer">
              <MdOutlineEdit
                className="text-white text-xl"
                onClick={() => navigate("/create-editshop")}
              />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <img
                src={myshopData.image?.url || myshopData.image || "/placeholder.png"}
                alt={myshopData.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
              />
            </div>
          </div>

          <div className="mt-16 text-center px-6 pb-6">
            <h2 className="text-xl font-bold text-gray-800">{myshopData.name}</h2>
            <p className="text-gray-600 mt-2 text-sm">
              {myshopData.city}, {myshopData.state}
            </p>
            <p className="text-gray-600 mt-2 text-sm">{myshopData.address}</p>
          </div>
        </div>
      )}

   
      {myshopData?.items && myshopData.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full max-w-4xl px-4">
          {myshopData.items.map((item, index) => (
            <OwneritemsCard key={index} item={item} />
          ))}
        </div>
      ) : (
        myshopData && (
          <div className="flex justify-center items-center p-4 sm:p-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center space-y-3">
                <FaUtensils className="text-5xl text-orange-500 mb-3" />
                <h2 className="text-2xl font-bold text-gray-800">Add Your Menu Items</h2>
                <p className="text-gray-600 text-sm">
                  Your restaurant is set up, but it doesn't have any items yet. Add delicious dishes to your menu so customers can start ordering from your shop!
                </p>
                <button
                  className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                  onClick={() => navigate("/add-items")}
                >
                  Add Items
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default OwnerDashboard;
