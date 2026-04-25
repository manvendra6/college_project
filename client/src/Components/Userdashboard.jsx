import React, { useEffect, useRef, useState } from 'react'
import Nav from '../pages/Nav'
import { categories } from '../uttils/Category'
import CategoryCard from './CategoryCard'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import ShopitemsCard from './ShopitemsCard';

const Userdashboard = () => {
  const [leftscrollshow, setleftscrollshow] = useState(false);
  const [rightscrollshow, setrightscrollshow] = useState(true);

  const [leftshopscrollshow, setleftshopscrollshow] = useState(false);
  const [rightshopscrollshow, setrightshopscrollshow] = useState(true);

  const scrollRef = useRef(null);
  const scrollshopRef = useRef(null);
  const { city, shopcity } = useSelector((state) => state.user);

  const scroll = (direction, type = "category") => {
    const current = type === "category" ? scrollRef.current : scrollshopRef.current;
    if (current) {
      if (direction === "left") {
        current.scrollBy({ left: -350, behavior: "smooth" });
      } else {
        current.scrollBy({ left: 350, behavior: "smooth" });
      }
    }
  }

  const handleScroll = (ref, setLeft, setRight) => {
    const current = ref.current;
    if (current) {
      setLeft(current.scrollLeft > 0);
      setRight(Math.ceil(current.scrollLeft + current.clientWidth) < current.scrollWidth);
    }
  };

  useEffect(() => {
    const handleCategoryScroll = () => handleScroll(scrollRef, setleftscrollshow, setrightscrollshow);
    const handleShopScroll = () => handleScroll(scrollshopRef, setleftshopscrollshow, setrightshopscrollshow);

    scrollRef.current?.addEventListener("scroll", handleCategoryScroll);
    scrollshopRef.current?.addEventListener("scroll", handleShopScroll);

    // Initial check (slight delay to ensure DOM is painted)
    setTimeout(() => {
      handleCategoryScroll();
      handleShopScroll();
    }, 100);

    return () => {
      scrollRef.current?.removeEventListener("scroll", handleCategoryScroll);
      scrollshopRef.current?.removeEventListener("scroll", handleShopScroll);
    };
  }, [shopcity]);

  // Premium Scroll Button Component
  const ScrollButton = ({ direction, onClick, isVisible }) => {
    if (!isVisible) return null;
    return (
      <button 
        onClick={onClick}
        className={`hidden md:flex absolute ${direction === 'left' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 z-10 
        w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-orange-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
        dark:shadow-black/50 rounded-full items-center justify-center border border-gray-100 dark:border-gray-700
        hover:bg-orange-500 hover:text-white hover:scale-110 transition-all duration-300`}
      >
        {direction === 'left' ? <FaChevronLeft className='text-xl mr-1' /> : <FaChevronRight className='text-xl ml-1' />}
      </button>
    );
  };

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-[#fff9f6] dark:bg-gray-950 transition-colors duration-300'>
      <Nav />
      
      {/* Decorative Background Elements */}
      <div className="fixed top-20 left-[-10%] w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="fixed top-40 right-[-10%] w-96 h-96 bg-red-500/10 dark:bg-red-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <main className='w-full max-w-7xl flex flex-col gap-12 items-start px-4 sm:px-8 pt-28 pb-20 relative z-10'>
        
        {/* Inspiration Section */}
        <section className='w-full relative group'>
          <div className='flex items-end justify-between mb-6'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
                Inspiration for your first order
              </h1>
              <p className='text-gray-500 dark:text-gray-400 mt-2 font-medium'>What's on your mind today?</p>
            </div>
          </div>
          
          <div className='w-full relative px-2'>
            <ScrollButton direction="left" onClick={() => scroll("left", "category")} isVisible={leftscrollshow} />
            <div 
              className="w-full flex overflow-x-auto gap-6 pb-6 pt-2 scroll-smooth px-2
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" 
              ref={scrollRef}
            >
              {categories.map((cat, index) => (
                <CategoryCard key={index} name={cat.category} image={cat.image} />
              ))}
            </div>
            <ScrollButton direction="right" onClick={() => scroll("right", "category")} isVisible={rightscrollshow} />
          </div>
        </section>
        
        {/* Popular Restaurants Section */}
        {shopcity && shopcity.length > 0 && (
          <section className='w-full relative group'>
            <div className='flex items-end justify-between mb-6'>
              <div>
                <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
                  Top Restaurants in <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500'>{city || 'your city'}</span>
                </h1>
                <p className='text-gray-500 dark:text-gray-400 mt-2 font-medium'>Explore local favorites</p>
              </div>
            </div>

            <div className='w-full relative px-2'>
              <ScrollButton direction="left" onClick={() => scroll("left", "shop")} isVisible={leftshopscrollshow} />
              <div 
                className="w-full flex overflow-x-auto gap-6 pb-6 pt-2 scroll-smooth px-2
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" 
                ref={scrollshopRef}
              >
                {shopcity.map((shops, index) => (
                  <CategoryCard key={index} name={shops.name} image={shops.image} />
                ))}
              </div>
              <ScrollButton direction="right" onClick={() => scroll("right", "shop")} isVisible={rightshopscrollshow} />
            </div>
          </section>
        )}

        {/* Suggested Food Items Section */}
        <section className='w-full relative'>
          <div className='flex items-end justify-between mb-8'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
                Suggested Food Items
              </h1>
              <p className='text-gray-500 dark:text-gray-400 mt-2 font-medium'>Handpicked dishes you'll love</p>
            </div>
          </div>
          
          <div className='flex flex-col gap-12'>
            {shopcity?.map((item, index) => {
              // Only render if the shop has items
              if (!item.items || item.items.length === 0) return null;
              return (
                <div key={index} className="bg-white/50 dark:bg-gray-900/50 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 rounded-full bg-gradient-to-b from-orange-500 to-red-500"></span>
                    From {item.name}
                  </h3>
                  <ShopitemsCard data={item.items} />
                </div>
              );
            })}
          </div>
        </section>
        
      </main>
    </div>
  )
}

export default Userdashboard;