import React, { useState } from 'react';
import { MdLocationPin } from "react-icons/md";
import { FaSearch, FaUser, FaUtensils } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { TbReceiptDollar } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setuserData } from '../Redux/userSlice';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const { userData, city,cartItem } = useSelector(state => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      dispatch(setuserData(null));
      setShowProfileMenu(false);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <nav className='w-full h-16 md:h-20 flex items-center justify-between px-4 md:px-8 fixed top-0 z-50 bg-white shadow-lg border-b'>
      
      {/* Logo Section */}
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg'>
            <FaUtensils className='text-white text-lg' />
          </div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent'>
            ZestyCart
          </h1>
        </div>
      </div>

      {/* Search Bar - Only for users */}
      {userData.role === "user" && (
        <div className='hidden md:flex flex-1 max-w-2xl mx-8'>
          <div className='relative w-full'>
            <div className='flex items-center bg-gray-50 rounded-2xl px-4 py-3 shadow-sm border hover:shadow-md transition-shadow duration-200'>
              <div className='flex items-center gap-2 border-r border-gray-300 pr-4 mr-4 min-w-[140px]'>
                <MdLocationPin className='text-red-500 text-xl' />
                <span className='text-gray-700 font-medium truncate max-w-[100px]'>{city}</span>
              </div>
              
              <form onSubmit={handleSearchSubmit} className='flex-1 flex items-center'>
                <FaSearch className='text-gray-400 text-lg mr-3' />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search for delicious food...'
                  className='flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-full'
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className='flex items-center gap-4 md:gap-6'>

        {/* Cart for Users */}
        {userData.role === "user" && (
          <div className='relative group cursor-pointer'>
            <div className='p-3 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors duration-200 group-hover:shadow-md' onClick={()=>{
              navigate("/cart")
            }}>
              <BsCart2 className='text-2xl text-gray-700 group-hover:text-orange-500 transition-colors' />
            </div>
            <span className='absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow-lg'>
              {cartItem.length}
            </span>
          </div>
        )}

        {/* Owner Actions */}
        {userData.role === "owner" && (
          <div className='flex items-center gap-3'>
            <button className='flex items-center gap-2 px-4 py-3 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md' onClick={()=>{
              navigate("/add-items")
            }}>
              <FaPlus className='text-lg' />
              <span className='hidden lg:block'>Add Food</span>
            </button>

            <button className='flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md'>
              <TbReceiptDollar className='text-xl' />
              <span className='hidden lg:block'>Orders</span>
            </button>
          </div>
        )}

        {/* Profile Section */}
        <div className='relative'>
          <div 
            className='flex items-center gap-3 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200 group'
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className='w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg'>
              <span className='text-white font-bold text-lg'>
                {userData?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className='hidden lg:block'>
              <p className='font-semibold text-gray-800'>{userData.fullName}</p>
              <p className='text-sm text-gray-500 capitalize'>{userData.role}</p>
            </div>
            <FaUser className='text-gray-400 group-hover:text-gray-600 transition-colors' />
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className='absolute top-16 right-0 w-64 bg-white rounded-2xl shadow-2xl border p-4 z-50'>
              <div className='flex items-center gap-3 p-3 border-b border-gray-100'>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>
                    {userData?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className='font-bold text-gray-800'>{userData.fullName}</p>
                  <p className='text-sm text-gray-500 capitalize'>{userData.role}</p>
                </div>
              </div>
              
              <div className='space-y-2 mt-3'>
                <button 
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-colors duration-200'
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Nav;