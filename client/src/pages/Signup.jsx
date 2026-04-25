import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock, FaUser, FaPhoneAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../uttils/firebase';
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setuserData } from '../Redux/userSlice';

const Signup = () => {
  const [showpassword, setShowpassword] = useState(false);
  const [role, setRole] = useState("user");
  const [error, seterror] = useState("");
  const [loader, setloader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setform] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
    phone: ""
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
    seterror("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
      console.log("Signup success:", res.data);
      setform({
        fullName: "",
        email: "",
        password: "",
        role: "user",
        phone: ""
      });
      dispatch(setuserData(res.data));
      navigate('/');
    } catch (error) {
      console.log("handlebutton error ", error);
      if (error.response) {
        seterror(error.response.data.message);
        console.log("Server error:", error.response.data);
      } else {
        seterror("An unexpected error occurred. Please try again.");
      }
    } finally {
      setloader(false);
    }
  };

  const GoogleAuth = async () => {
    if (!form.phone) {
      seterror("Please enter your mobile number and select a role first.");
      return;
    }
    seterror("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await axios.post("http://localhost:5000/api/auth/googleauth", {
        fullName: result.user.displayName,
        email: result.user.email,
        phone: form.phone,
        role: form.role
      },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Google auth success:", res.data);
      dispatch(setuserData(res.data));
      navigate('/');
    } catch (error) {
      console.log("Google auth error", error);
      if (error.response) {
        seterror(error.response.data.message || "Google Authentication failed");
        console.log("Server error:", error.response.data);
      }
    }
  };

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-[#fff9f6] relative overflow-hidden py-10'>
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md p-8 border border-white relative z-10'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-extrabold mb-3 bg-gradient-to-r from-[#ff4d2d] to-orange-400 bg-clip-text text-transparent'>ZestyCart</h1>
          <p className='text-gray-500 text-sm'>Create your account to get started with delicious food and deliveries.</p>
        </div>

        <form onSubmit={Handlebutton}>
          <div className='space-y-4 mb-6'>
            {/* Full Name */}
            <div className='space-y-1.5'>
              <label htmlFor="fullname" className='text-sm font-semibold text-gray-700 block'>Full Name</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <FaUser className='text-gray-400' />
                </div>
                <input
                  type="text"
                  name='fullName'
                  value={form.fullName}
                  onChange={manageForm}
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className='space-y-1.5'>
              <label htmlFor="email" className='text-sm font-semibold text-gray-700 block'>Email Address</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <FaEnvelope className='text-gray-400' />
                </div>
                <input
                  type="email"
                  name='email'
                  value={form.email}
                  required
                  onChange={manageForm}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div className='space-y-1.5'>
              <label htmlFor="phone" className='text-sm font-semibold text-gray-700 block'>Mobile Number</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <FaPhoneAlt className='text-gray-400' />
                </div>
                <input
                  type="text"
                  value={form.phone}
                  name='phone'
                  onChange={manageForm}
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff4d2d] transition-all"
                />
              </div>
              {error && error.includes("mobile number") && (
                <p className='text-xs text-red-500 mt-1 font-medium'>* Required for Google Sign Up</p>
              )}
            </div>

            {/* Password */}
            <div className='space-y-1.5'>
              <label htmlFor="password" className='text-sm font-semibold text-gray-700 block'>Password</label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <FaLock className='text-gray-400' />
                </div>
                <input
                  name='password'
                  value={form.password}
                  onChange={manageForm}
                  required
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

            {/* Role Selection */}
            <div className='space-y-1.5 pt-2'>
              <label className='text-sm font-semibold text-gray-700 block mb-2'>I am a...</label>
              <div className='flex gap-2'>
                {["user", "owner", "delivery Boy"].map((r, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`flex-1 text-center font-bold text-sm transition-all duration-200 rounded-xl py-2.5 px-2 capitalize ${
                      role === r
                        ? "bg-[#ff4d2d] text-white shadow-md shadow-[#ff4d2d]/30 scale-105"
                        : "bg-gray-50 border border-gray-200 text-gray-500 hover:border-[#ff4d2d] hover:text-[#ff4d2d]"
                    }`}
                    onClick={() => {
                      setRole(r);
                      setform({ ...form, role: r });
                    }}
                  >
                    {r === "delivery Boy" ? "Delivery" : r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className='text-center text-red-500 text-sm font-semibold mb-4 bg-red-50 py-2 rounded-lg'>{error}</p>}

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full font-bold py-3.5 rounded-xl transition-all duration-300 bg-[#ff4d2d] text-white hover:bg-[#e64323] shadow-lg hover:shadow-[#ff4d2d]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex justify-center items-center gap-2'
            disabled={loader}
          >
            {loader ? <ClipLoader size={20} color="#ffffff" /> : "Create Account"}
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
          <span>Sign Up with Google</span>
        </button>

        <p className='text-center mt-8 text-sm text-gray-600 font-medium'>
          Already have an account? <Link to="/signin" className='text-[#ff4d2d] hover:text-[#e64323] transition-colors font-bold ml-1'>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;