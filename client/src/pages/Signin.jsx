 import React from 'react'
import { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../uttils/firebase';
import { ClipLoader } from "react-spinners";
import {useDispatch} from "react-redux";
import { setuserData } from '../Redux/userSlice';

const Signin = () => {
   const [showpassword,setShowpassword]=useState(false)
      const [loader,setloader]=useState(false);
      const dispatch = useDispatch();
 
    
   const [form ,setform]= useState({
   
    email:"",
    password:"",
     
  
   })
 
   const manageForm= (e)=>{
  
   
    const {name,value}= e.target;
    setform({
      ...form,[name]:value
    })
   }

   const Handlebutton= async(e)=>{
    e.preventDefault();
    setloader(true);
    try {
      const res= await axios.post("http://localhost:5000/api/auth/signin",form,
        { 
          withCredentials:true,
          headers:{
            "Content-Type":"application/json"
          }
        });
          console.log("Signup success:", res.data);
          setform({
            email:"",
            password:"",
          })
          dispatch(setuserData(res.data))
          
          setloader(false);
    } catch (error) {
      console.log( "handlebutton error ",error)
      setloader(false);
      if(error.response){
        console.log("Server error:", error.response.data);
      }
    }
   }

  //  GoogleAuth

    const GoogleAuth= async()=>{
     
       const provider= new  GoogleAuthProvider();
       const result= await signInWithPopup(auth,provider);
         
         console.log( result)
         try {
           
           const res= await axios.post("http://localhost:5000/api/auth/googleauth",{
             email:result.user.email,
           },
         {
           withCredentials:true,
           timeout: 5000
         }
       )
        dispatch(setuserData(res.data))
           console.log("Google auth success:", res.data);
   
         } catch (error) {
           console.log("Google auth error",error)
           if(error.response){
             console.log("Server error:", error.response.data);
           }
         }
     
      }

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#ddd]'>
      <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>ZestyCart</h1>
      <p className='text-gray-800 mb-8'>Sign In to your account to get started with delicious food and deliveries</p>
      <div className='mb-4'>
        
  

       <label htmlFor="email" className='font-medium text-gray-800 block mb-1'>Email</label>
       <input
       type="email"
       name='email'
       required
       value={form.email}
       onChange={manageForm}
       placeholder="enter your email"
       className="focus:outline-none focus:border-orange-500 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />

      

       <label htmlFor="password" className='font-medium text-gray-800 block mb-1'>Password</label>
       <div className='relative'>
       <input
       name='password'
       value={form.password}
       required
       onChange={manageForm}
       type={showpassword ? "password":"text"}
       placeholder="enter your password"
       className="focus:outline-none focus:border-orange-500 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />
       <button className='absolute left-[92%] top-2/6 text-gray-700 cursor-pointer' onClick={()=>{
        setShowpassword(!showpassword)
       }}>{
         !showpassword ? <FaRegEyeSlash />:<FaRegEye />
        }</button>
       </div>

       <div className='font-medium text-[#ff4d2d] mb-4 text-right'><Link to="/forgotpass">Forgot Password</Link></div>
        


      </div>


      <button  onClick={Handlebutton} type='submit' className='w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white cursor-pointer hover:bg-[#e64323]' disabled={loader}>{loader?<ClipLoader/>:"Sign In"}</button>

      <button onClick={GoogleAuth} className='mt-4 flex justify-center cursor-pointer items-center border rounded-lg transition duration-200 gap-2 px-4 py-2 w-full border-gray-400 hover:bg-gray-100'><FcGoogle className='text-2xl' />
      <span>Sign In with google</span></button>
      <p className='text-center mt-6 cursor-pointer'>Want to ceate a new account ? <Link to="/signup"><span className='text-[#ff4d2d]'>Sign Up</span></Link> </p>
      </div>
    </div>
  )
}

export default Signin