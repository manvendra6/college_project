import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import axios from 'axios';
import ShopitemsCard from '../Components/ShopitemsCard';
import { SyncLoader } from 'react-spinners';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaSearch, FaUtensils } from "react-icons/fa";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/item/search?query=${query}`);
      setResults(res.data.items || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-gray-950 transition-colors duration-300 pt-28 pb-10 flex flex-col items-center'>
      <Nav />
      
      <div className='w-full max-w-6xl px-4 sm:px-8 z-10'>
        <div className='flex items-center mb-8 relative'>
          <button 
            onClick={() => navigate("/")}
            className="absolute left-0 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md text-orange-500 transition-all hidden md:block"
          >
            <IoIosArrowRoundBack className="text-3xl" />
          </button>
          <div className='w-full text-center'>
            <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white flex justify-center items-center gap-3'>
              <FaSearch className="text-orange-500 text-2xl" />
              Results for "{query}"
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-2 font-medium'>
              Found {results.length} delicious matches
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <SyncLoader color="#ff4d2d" />
          </div>
        ) : results.length === 0 ? (
          <div className='w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-16 text-center shadow-lg border border-gray-100 dark:border-gray-800'>
             <div className='w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaUtensils className='text-3xl text-gray-400' />
             </div>
             <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>No food found</h2>
             <p className='text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto'>
               We couldn't find anything matching your search. Try different keywords or check your spelling.
             </p>
             <button 
               onClick={() => navigate("/")}
               className='mt-8 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform'
             >
               Go Back Home
             </button>
          </div>
        ) : (
          <div className='bg-white/50 dark:bg-gray-900/50 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-sm'>
            <ShopitemsCard data={results} />
          </div>
        )}
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-20 left-[-10%] w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="fixed top-40 right-[-10%] w-96 h-96 bg-red-500/10 dark:bg-red-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default SearchPage;
