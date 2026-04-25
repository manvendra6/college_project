import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
 
import axios from 'axios';
import { setmyshopData, setMyShops } from '../Redux/shopSlice';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';

const CreateEditShop = () => {
  const { myshopData } = useSelector(state => state.owner);
  console.log( myshopData)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(null);
  const  [loading, setloading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image: null,
    city: "",
    state: "",
    address: ""
  });
 
  useEffect(() => {
    if (myshopData) {
      setForm({
        name: myshopData.name || "",
        image: myshopData.image||"",  
        city: myshopData.city || "",
        state: myshopData.state || "",
        address: myshopData.address || ""
      });
      if (myshopData.image) {
        setPreviewImage(myshopData.image);  
      }
    }
  }, [myshopData]);

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
    setloading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("address", form.address);

   
    if (myshopData?._id) {
      formData.append("_id", myshopData._id); 
    }

    if (form.image) {
      formData.append("image", form.image);
    } else if (myshopData?.image) {
      formData.append("image", myshopData.image);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/shop/createdit",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      console.log("Shop saved successfully", res.data);

      dispatch(setmyshopData(res.data.shop));  
      dispatch(setMyShops(res.data.shops));
      setloading(false);
      toast.success(myshopData ? "Shop updated!" : "Shop created!");
      navigate("/");  
    } catch (error) {
      setloading(false);
      console.log("Server error:", error);
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
      <div className='absolute top-[20px] z-[10px]' onClick={() => navigate("/")}>
        <IoIosArrowRoundBack 
          className="text-5xl text-[#ff4d2d] hover:text-cyan-600 translate-x-1 cursor-pointer transition-transform duration-200 hover:translate-x-0" 
        />
      </div>

      <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
        <div className='flex flex-col items-center mb-6'>
          <div className='bg-orange-100 p-4 rounded-full mb-4'>
            <FaUtensils className="w-16 h-16 text-[#ff4d2d]" />
          </div>
          <div>{myshopData? "Edit Shop" : "Add Shop"}</div>
        </div>

        <form className='space-y-4' onSubmit={handleSaveButton}>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
            <input
              type="text"
              value={form.name}
              name='name'
              placeholder='Enter Shop Name'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'
              onChange={handleInput}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Shop Image</label>
            <input
              type="file"
              name='image'
              onChange={handleImage}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'
            />
            {previewImage && (
              <div className='flex justify-center mb-4'>
                <img
                  src={previewImage}
                  alt="Shop Preview"
                  className='w-full h-32 object-cover rounded-lg border border-orange-200 mt-1'
                />
              </div>
            )}
          </div>

          <div className='flex justify-between gap-2'>
            <div className='w-1/2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
              <input
                type="text"
                name='city'
                value={form.city}
                placeholder='Enter Your City'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'
                onChange={handleInput}
                required
              />
            </div>
            <div className='w-1/2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
              <input
                type="text"
                name='state'
                value={form.state}
                placeholder='Enter Your State'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'
                onChange={handleInput}
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
            <input
              type="text"
              name='address'
              value={form.address}
              placeholder='Enter Your Address'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'
              onChange={handleInput}
              required
            />
          </div>

          <button
            type='submit'
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-300 shadow-md hover:shadow-lg w-full" disabled={loading}
          >
            {loading ?  <ClipLoader className='text-white text-2xl'/> : "Save Shop"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
