 import React, {   useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { useDispatch,  } from 'react-redux';
 
import axios from 'axios';
import { setmyshopData } from '../Redux/shopSlice';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const Itemedit = () => {
 
  const {itemId}= useParams();
  console.log( "item id ",itemId)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(null);
  const [CurrentData,setCurrentData]= useState(null);
  const [loading, setLoading]= useState(false);
   

  const [form, setForm] = useState({
    name: "",
    image: null,
    category:"",
    price:"",
    foodType:"veg"
     
  });
  const categoryFood=[
    "Snacks",
      "Main Course",
      " Desserts",
      "Pizza",
      "Burgers",
      "Sandwiches",
      "South Indian",
      "North Indian",
      "Chinese",
      "Fast Food",
      "Others"
  ]
 
 

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

    try {
      console.log( "formd data",formData)
      const res = await axios.post(
        `http://localhost:5000/api/item/edit-item/${itemId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      dispatch(setmyshopData(res.data));  
          
      setLoading(false);
      navigate("/");  
  
    } catch (error) {
      setLoading(false);
      console.log("Server error:", error);
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

    useEffect(()=>{
      const fetchItemData= async()=>{
        try {
          const res = await axios.get(`http://localhost:5000/api/item/item-get-id/${itemId}`,{
            withCredentials:true
          }); 
          setCurrentData(res.data.shop);
           
        } catch (error) {
          console.log( "item fetch error",error)
        }
      }
      fetchItemData();
    },[itemId])
    
    useEffect(()=>{
      if(CurrentData){
        setForm({
          name: CurrentData?.name || "",
          image:CurrentData?.image || null,
          category:CurrentData?.category || "",
          price:CurrentData?.price || "",
          foodType:CurrentData?.foodType || "veg"
        });
        setPreviewImage(CurrentData?.image || null);
      }
    },[CurrentData]);

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
           <h1 className=" mt-2 text-xl font-semibold">Edit Food</h1>
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



                <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
            <input
              type="number"
              value={form.price}
              name='price'
              placeholder='0.00'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500'
              onChange={handleInput}
              required
            />
          </div>

      

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
             <select name="category" value={form.category} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500' onChange={handleInput}>
              <option value="">Select Category</option>
              {
                categoryFood.map((item,index)=>(
                  <option value={form.item} key={index}>{item}</option>
                ))
              }
             </select>
          </div>

             <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type </label>
             <select name="foodType" value={form.foodType} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500' onChange={handleInput}>
              <option value="veg">Veg</option>
              <option value="non veg">Non Veg</option>
             </select>
          </div>

          <button
            type='submit'
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-300 shadow-md hover:shadow-lg w-full" disabled={loading}
          >
            {loading ? <ClipLoader className='text-white text-2xl' /> : "Save Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

 

export default  Itemedit;
;
