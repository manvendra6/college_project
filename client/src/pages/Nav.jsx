import React, { useState } from 'react';
import { MdLocationPin, MdDeliveryDining } from "react-icons/md";
import { FaSearch, FaUser, FaUtensils, FaMoon, FaSun } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { TbReceiptDollar } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setuserData } from '../Redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const Nav = () => {
  const { userData, city, cartItem } = useSelector(state => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      dispatch(setuserData(null));
      setShowProfileMenu(false);
      navigate("/signin");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className='w-full h-16 md:h-20 flex items-center justify-between px-4 md:px-8 fixed top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm dark:shadow-gray-800/30 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300'>
      
      {/* Logo Section */}
      <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate("/")}>
        <div className='flex items-center gap-2 group'>
          <div className='w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300'>
            <FaUtensils className='text-white text-lg' />
          </div>
          <h1 className='text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hidden sm:block'>
            ZestyCart
          </h1>
        </div>
      </div>

      {/* Search Bar - Only for users */}
      {userData?.role === "user" && (
        <div className='hidden lg:flex flex-1 max-w-2xl mx-8'>
          <div className='relative w-full'>
            <div className='flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl px-4 py-2.5 shadow-inner border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300'>
              <div className='flex items-center gap-2 border-r border-gray-300 dark:border-gray-600 pr-4 mr-4 min-w-[140px]'>
                <MdLocationPin className='text-red-500 text-xl' />
                <span className='text-gray-700 dark:text-gray-200 font-semibold truncate max-w-[100px]'>{city || 'Location'}</span>
              </div>
              
              <form onSubmit={handleSearchSubmit} className='flex-1 flex items-center'>
                <FaSearch className='text-gray-400 dark:text-gray-500 text-lg mr-3' />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search for delicious food...'
                  className='flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full'
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className='flex items-center gap-3 md:gap-5'>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className='p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 hover:text-orange-500 transition-all duration-300'
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? <FaMoon className='text-xl' /> : <FaSun className='text-xl' />}
        </button>

        {/* Cart for Users */}
        {userData?.role === "user" && (
          <div className='relative group cursor-pointer' onClick={() => navigate("/cart")}>
            <div className='p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-orange-100 dark:group-hover:bg-gray-700 transition-colors duration-300'>
              <BsCart2 className='text-2xl text-gray-700 dark:text-gray-300 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors' />
            </div>
            {cartItem?.length > 0 && (
              <span className='absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-md shadow-red-500/40 animate-bounce'>
                {cartItem.length}
              </span>
            )}
          </div>
        )}

        {/* Owner Actions */}
        {userData?.role === "owner" && (
          <div className='flex items-center gap-3'>
            <button 
              className='flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all duration-300 font-bold shadow-sm' 
              onClick={() => navigate("/add-items")}
            >
              <FaPlus className='text-lg' />
              <span className='hidden lg:block'>Add Food</span>
            </button>
            <button 
              onClick={() => navigate("/owner-orders")}
              className='flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 font-bold shadow-sm'
            >
              <TbReceiptDollar className='text-xl' />
              <span className='hidden lg:block'>Orders</span>
            </button>
          </div>
        )}

        {/* Delivery Boy Actions */}
        {userData?.role === "delivery Boy" && (
          <button 
            onClick={() => navigate("/delivery-dashboard")}
            className='flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-all duration-300 font-bold shadow-sm'
          >
            <MdDeliveryDining className='text-2xl' />
            <span className='hidden lg:block'>Deliveries</span>
          </button>
        )}

        {/* Profile Section */}
        <div className='relative'>
          <div 
            className='flex items-center gap-3 p-1.5 pr-3 rounded-full bg-gray-100 dark:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 cursor-pointer transition-all duration-300 group'
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className='w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-md'>
              <span className='text-white font-bold text-sm'>
                {userData?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className='hidden md:block text-left'>
              <p className='font-bold text-sm text-gray-800 dark:text-gray-100 leading-tight'>
                {userData?.fullName?.split(' ')[0]}
              </p>
            </div>
            <FaUser className='text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors text-sm' />
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className='absolute top-14 right-0 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
              <div className='flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-800 mb-2'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0'>
                  <span className='text-white font-bold text-lg'>
                    {userData?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className='overflow-hidden'>
                  <p className='font-bold text-gray-800 dark:text-white truncate'>{userData?.fullName}</p>
                  <p className='text-xs text-orange-500 font-semibold capitalize'>{userData?.role}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className='w-full text-left px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-colors duration-200 flex items-center gap-2'
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Nav;