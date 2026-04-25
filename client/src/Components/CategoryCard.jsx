import React from 'react';

const CategoryCard = ({ name, image }) => {
  return (
    <div className='w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 shrink-0 relative cursor-pointer group'>
      <img
        src={image}
        alt={name}
        className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12">
        <h3 className="text-white text-center font-bold text-sm md:text-lg tracking-wide drop-shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          {name}
        </h3>
      </div>
    </div>
  );
}

export default CategoryCard;
