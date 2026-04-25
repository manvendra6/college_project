import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../uttils/firebase';
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setuserData } from '../Redux/userSlice';

const Signin = () => {
  const [showpassword, setShowpassword] = useState(false);
  const [loader, setloader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const manageForm = (e) => {
    const { name, value } = e.target;
    setform({
      ...form, [name]: value
    });
  };

  const Handlebutton = async (e) => {
    e.preventDefault();
    setloader(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signin", form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
      console.log("Signup success:", res.data);
      setform({
        email: "",
        password: "",
      });
      dispatch(setuserData(res.data));
      navigate('/');
    } catch (error) {
      console.log("handlebutton error ", error);
      if (error.response) {
        console.log("Server error:", error.response.data);
      }
    } finally {
      setloader(false);
    }
  };

  const GoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await axios.post("http://localhost:5000/api/auth/googleauth", {
        email: result.user.email,
      },
        {
          withCredentials: true,
          timeout: 5000
        }
      );
      dispatch(setuserData(res.data));
      console.log("Google auth success:", res.data);
      navigate('/');
    } catch (error) {
      console.log("Google auth error", error);
      if (error.response) {
        console.log("Server error:", error.response.data);
      }
    }
  };

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-[#fff9f6] relative overflow-hidden'>
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md p-8 border border-white relative z-10'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-extrabold mb-3 bg-gradient-to-r from-[#ff4d2d] to-orange-400 bg-clip-text text-transparent'>ZestyCart</h1>
          <p className='text-gray-500 text-sm'>Sign in to your account and discover delicious food nearby.</p>
        </div>

        <form onSubmit={Handlebutton}>
          <div className='space-y-5 mb-6'>
            <div className='space-y-1.5'>
              <label htmlFor="email" className='text-sm font-semibold text-gray-700 block'>Email Address</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <FaEnvelope className='text-gray-400' />
                </div>
                <input
                  type="email"
                  name='email'
                  required
                  value={form.email}
                  onChange={manageForm}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all"
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label htmlFor="password" className='text-sm font-semibold text-gray-700 block'>Password</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <FaLock className='text-gray-400' />
                </div>
                <input
                  name='password'
                  value={form.password}
                  required
                  onChange={manageForm}
                  type={showpassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all"
                />
                <button 
                  type="button" 
                  className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#ff4d2d] transition-colors' 
                  onClick={() => setShowpassword(!showpassword)}
                >
                  {!showpassword ? <FaRegEyeSlash className='text-lg' /> : <FaRegEye className='text-lg' />}
                </button>
              </div>
            </div>

            <div className='flex justify-end'>
              <Link to="/forgotpass" className='text-sm font-semibold text-[#ff4d2d] hover:text-[#e64323] transition-colors'>
                Forgot Password?
              </Link>
            </div>
          </div>

          <button 
            type='submit' 
            className='w-full font-bold py-3.5 rounded-xl transition-all duration-300 bg-[#ff4d2d] text-white hover:bg-[#e64323] shadow-lg hover:shadow-[#ff4d2d]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex justify-center items-center gap-2' 
            disabled={loader}
          >
            {loader ? <ClipLoader size={20} color="#ffffff" /> : "Sign In"}
          </button>
        </form>

        <div className='mt-6 mb-6 flex items-center gap-3'>
          <div className='flex-1 h-px bg-gray-200'></div>
          <span className='text-gray-400 text-sm font-medium'>OR</span>
          <div className='flex-1 h-px bg-gray-200'></div>
        </div>

        <button 
          onClick={GoogleAuth} 
          type="button"
          className='w-full flex justify-center items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200'
        >
          <FcGoogle className='text-2xl' />
          <span>Continue with Google</span>
        </button>

        <p className='text-center mt-8 text-sm text-gray-600 font-medium'>
          Don't have an account? <Link to="/signup" className='text-[#ff4d2d] hover:text-[#e64323] transition-colors font-bold ml-1'>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;