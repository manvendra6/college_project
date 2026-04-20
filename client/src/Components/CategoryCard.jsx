import React from 'react';

const CategoryCard = ({ name, image }) => {
  
  return (
    <div className='w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#ff4d2d] overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow shrink-0 relative cursor-pointer'>
      <img
        src={image}
        alt={name}
        className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-300'
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white text-center font-semibold text-sm md:text-base py-2 backdrop-blur-sm tracking-wide border-t border-white">
        {name}
      </div>
    </div>
  );
}

export default CategoryCard;
