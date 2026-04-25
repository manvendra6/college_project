import React, { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaImage, FaTag, FaDollarSign } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setmyshopData } from '../Redux/shopSlice';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';

const Additems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myshopData } = useSelector(state => state.owner);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image: null,
    category: "",
    price: "",
    foodType: "veg"
  });

  const categoryFood = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers", 
    "Sandwiches", "South Indian", "North Indian", "Chinese", 
    "Fast Food", "Others"
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 10MB limit (match Cloudinary)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large! Maximum size is 10MB.");
        e.target.value = ""; // Clear input
        return;
      }
      const imgUrl = URL.createObjectURL(file);
      setPreviewImage(imgUrl);
      setForm(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSaveButton = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("image", form.image);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("foodType", form.foodType);
    if (myshopData?._id) {
      formData.append("shopId", myshopData._id);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/item/item-add",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
     
      dispatch(setmyshopData(res.data.shop));  
      navigate("/");  
    } catch (error) {
      console.log("Server error:", error);
      if (error.response) {
        console.log(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center flex-col items-center p-6 bg-[#fff9f6] min-h-screen relative'>
      <div 
        className='absolute top-6 left-6 flex items-center gap-2 cursor-pointer group' 
        onClick={() => navigate("/")}
      >
        <div className='p-2 bg-white rounded-full shadow-md group-hover:shadow-lg transition-all'>
          <IoIosArrowRoundBack className="text-3xl text-[#ff4d2d] group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className='font-medium text-gray-700 group-hover:text-[#ff4d2d] transition-colors'>Back</span>
      </div>

      <div className='max-w-xl w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 border border-gray-100'>
        <div className='flex flex-col items-center mb-8'>
          <div className='bg-gradient-to-br from-orange-100 to-red-50 p-5 rounded-full mb-4 shadow-inner'>
            <FaUtensils className="w-10 h-10 text-[#ff4d2d]" />
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent'>Add New Item</h1>
          <p className='text-gray-500 mt-2 text-sm'>Expand your menu with delicious new options</p>
        </div>

        <form className='space-y-6' onSubmit={handleSaveButton}>
          {/* Name Field */}
          <div className='space-y-1.5'>
            <label className='block text-sm font-semibold text-gray-700'>Item Name</label>
            <div className='relative'>
              <input
                type="text"
                value={form.name}
                name='name'
                placeholder='E.g., Margherita Pizza'
                className='w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all'
                onChange={handleInput}
                required
              />
            </div>
          </div>

          {/* Image Field */}
          <div className='space-y-1.5'>
            <label className='block text-sm font-semibold text-gray-700'>Item Image</label>
            <div className='relative'>
              <div className='flex items-center gap-4'>
                <label className='flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer group'>
                  <FaImage className='text-3xl text-gray-400 group-hover:text-orange-400 mb-2 transition-colors' />
                  <span className='text-sm text-gray-500 group-hover:text-orange-600 font-medium'>Click to upload image</span>
                  <input
                    type="file"
                    name='image'
                    onChange={handleImage}
                    className='hidden'
                    accept="image/*"
                  />
                </label>
                {previewImage && (
                  <div className='w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Price Field */}
            <div className='space-y-1.5'>
              <label className='block text-sm font-semibold text-gray-700'>Price (₹)</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <FaDollarSign className='text-gray-400' />
                </div>
                <input
                  type="number"
                  value={form.price}
                  name='price'
                  placeholder='0.00'
                  className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all'
                  onChange={handleInput}
                  required
                />
              </div>
            </div>

            {/* Food Type Field */}
            <div className='space-y-1.5'>
              <label className='block text-sm font-semibold text-gray-700'>Food Type</label>
              <select 
                name="foodType" 
                value={form.foodType} 
                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all appearance-none cursor-pointer' 
                onChange={handleInput}
              >
                <option value="veg">🟢 Veg</option>
                <option value="non veg">🔴 Non Veg</option>
              </select>
            </div>
          </div>

          {/* Category Field */}
          <div className='space-y-1.5'>
            <label className='block text-sm font-semibold text-gray-700'>Category</label>
            <div className='relative'>
               <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <FaTag className='text-gray-400' />
              </div>
              <select 
                name="category" 
                value={form.category} 
                className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all appearance-none cursor-pointer' 
                onChange={handleInput}
                required
              >
                <option value="" disabled>Select a Category</option>
                {categoryFood.map((item, index) => (
                  <option value={item} key={index}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className="w-full bg-[#ff4d2d] hover:bg-[#e64323] text-white py-4 rounded-xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex justify-center items-center gap-2 mt-4"
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="#ffffff" /> : "Save Item to Menu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Additems;
