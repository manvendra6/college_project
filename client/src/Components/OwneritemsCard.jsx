import axios from 'axios';
import React, { use } from 'react'
import { useEffect } from 'react';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OwneritemsCard = ({item}) => {
  const navigate= useNavigate();
  const dispatch= useDispatch();
  console.log( "data come ",item)

  const handleDelete= async()=>{
     
    try {
      const result= await axios.delete(`http://localhost:5000/api/item/delete-item/${item._id}`,{
        withCredentials:true
      });
      console.log( "item delete",result)
         dispatch(setmyshopData(result.data.shop));
    } catch (error) {
      
    }
     
  }

  return (
    <div className='flex  bg-white items-center justify-center border border-[#ff4d2d] rounded-lg p-4 m-2 shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full'> 
      <div className='w-36 h-full flex-shrink-0 bg-gray-50'>
        <img src={item.image} alt="" className='w-full h-full object-cover'/>
      </div>
       <div className='flex flex-col justify-between p-3 flex-1'>
        <div>
          <h2 className='text-base  font-semibold text-[#ff4d2d] '>{item.name}</h2>
          <p><span className='font-medium text-gray-70'>Category:</span>{item.category}</p>
          <p><span className='font-medium text-gray-70'>Food Type:</span>{item.foodType}</p>
           
        </div>
        <div className=' flex justify-between items-center'>
          <p className='flex gap-1 text-xl items-center'><span className='text-xl text-red-500'><FaIndianRupeeSign /></span>{item.price}</p>
           <div className='flex items-center gap-2'>
          <div className='rounded-full border border-[#ff4d2d] p-2 hover:text-white hover:bg-[#ff4d2d] transition duration-200 'onClick={()=>{
            navigate(`/item-edit/${item._id}`)
          }}><FaPen /></div>
        <div className='rounded-full border border-[#ff4d2d] p-2 hover:text-white hover:bg-[#ff4d2d] transition duration-200' onClick={handleDelete}><RiDeleteBin6Line /></div>
        
        </div>
        </div>
       
       </div>

    </div>
  )
}

export default OwneritemsCard