import React, { useEffect, useRef, useState } from 'react'
import Nav from '../pages/Nav'
import { categories } from '../uttils/Category'
import CategoryCard from './CategoryCard'
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import ShopitemsCard from './ShopitemsCard';

const Userdashboard = () => {
  const [leftscrollshow,setleftscrollshow]= useState(false);
  const [rightscrollshow,setrightscrollshow]= useState(true);

  const [leftshopscrollshow,setleftshopscrollshow]= useState(false);
  const [rightshopscrollshow,setrightshopscrollshow]= useState(true);

  const scrollRef= useRef(null);
  const scrollshopRef= useRef(null);
  const {city,shopcity}=useSelector((state)=>state.user);
  console.log( "city shopcity" ,shopcity)

  


  const scroll= (direction)=>{
    const {current}= scrollRef;
    if(direction==="left"){
      current.scrollBy({
        left:-300,
        behavior:"smooth"
      })
     
  }else{
    current.scrollBy({
      left:300,
      behavior:"smooth"
    })
  }
}
const handleScroll = (ref, setLeft, setRight) => {
  const current = ref.current;

  
  if (current) {
    setLeft(current.scrollLeft > 0);
    setRight(current.scrollLeft + current.clientWidth < current.scrollWidth);
  }
};

useEffect(() => {

  const handleCategoryScroll = () =>
    handleScroll(scrollRef, setleftscrollshow, setrightscrollshow);

  const handleShopScroll = () =>
    handleScroll(scrollshopRef, setleftshopscrollshow, setrightshopscrollshow);

  scrollRef.current?.addEventListener("scroll", handleCategoryScroll);
  scrollshopRef.current?.addEventListener("scroll", handleShopScroll);

  
  handleCategoryScroll();
  handleShopScroll();

  return () => {
    scrollRef.current?.removeEventListener("scroll", handleCategoryScroll);
    scrollshopRef.current?.removeEventListener("scroll", handleShopScroll);
  };

}, []);   

  


  return (
     <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto '>
    <Nav/>
    <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'> 
      <h1 className='text-gray-800 text-2xl sm:text-3xl mt-20'>Inspiration for you first order</h1>
      <div className='w-full relative'>
        {leftscrollshow && (
           <button onClick={()=>scroll("left")}
             
            className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 z-10 bg-white text-[#ff4d2d] shadow-md rounded-full p-2 hover:bg-[#ff4d2d] hover:text-white transition duration-300"
          >
            <FaChevronLeft className='text-xl' />
          </button>
          )}
        <div className="w-full flex overflow-x-auto gap-4 pb-4 scroll-smooth 
             [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" ref={scrollRef}>
        {categories.map((cat,index)=>(
          <CategoryCard key={index} name={cat.category} image={cat.image} />
        ))}
        </div>
       {rightscrollshow && (
        <button onClick={()=>{
        scroll("right")
       }} className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 z-10 bg-white text-[#ff4d2d] shadow-md rounded-full p-2 hover:bg-[#ff4d2d] hover:text-white transition duration-300">
            <FaChevronRight className='text-xl'/>
       </button>
        )}
      </div>
    </div>
    
    <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
      <h1 className='text-gray-800 text-2xl sm:text-3xl '>Popular Categories  {city}</h1>

       <div className='w-full relative'>
        {leftshopscrollshow && (
           <button onClick={()=>scroll("left")}
             
            className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 z-10 bg-white text-[#ff4d2d] shadow-md rounded-full p-2 hover:bg-[#ff4d2d] hover:text-white transition duration-300"
          >
            <FaChevronLeft className='text-xl' />
          </button>
          )}
        <div className="w-full flex overflow-x-auto gap-4 pb-4 scroll-smooth 
             [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" ref={scrollshopRef}>
        {shopcity?.map((shops,index)=>(
          <CategoryCard key={index} name={shops.name} image={shops.image}/>
        ))}
        </div>
       {rightshopscrollshow && (
        <button onClick={()=>{
        scroll("right")
       }} className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 z-10 bg-white text-[#ff4d2d] shadow-md rounded-full p-2 hover:bg-[#ff4d2d] hover:text-white transition duration-300">
            <FaChevronRight className='text-xl'/>
       </button>
        )}
      </div>
    </div>

    <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
    <h1 className='text-gray-800 text-2xl sm:text-3xl '>Suggested Food Items</h1>
       <div >
          {
  shopcity?.map((item,index) => (
    <ShopitemsCard key={index} data={item.items} />
  ))
}

</div>



    </div >
    
    </div>
  
  )
}

export default Userdashboard