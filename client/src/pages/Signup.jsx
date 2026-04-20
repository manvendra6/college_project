import React from 'react'
import { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider} from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import {auth} from '../uttils/firebase.jsx'
import { ClipLoader } from "react-spinners"
import {useDispatch} from "react-redux";
import { setuserData } from '../Redux/userSlice.jsx';
 
 

const Signup = () => {
   const [showpassword,setShowpassword]=useState(false)
   const [role,setRole]=useState("user");
   const [error,seterror]= useState("");
   const [loader,setloader]=useState(false);
   const dispatch = useDispatch();
    
   const [form ,setform]= useState({
    fullName:"",
    email:"",
    password:"",
    role:"user",
    phone:""
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
     
      const res= await axios.post("http://localhost:5000/api/auth/signup",form,
        { 
          withCredentials:true,
          headers:{
            "Content-Type":"application/json"
          }
        });
          console.log("Signup success:", res.data);
          setform({
            fullName:"",
            email:"",
            password:"",
            role:"user",
            phone:""
          })
          dispatch(setuserData(res.data))
         seterror("");
         setloader(false);
          
    } catch (error) {
      console.log( "handlebutton error ",error)
      setloader(false);
      if(error.response){
        seterror(error.response.data.message)
        console.log("Server error:", error.response.data);
      }
    }
   }

  //  Googleauth
   const GoogleAuth= async()=>{
    if(!form.phone){
      return alert("please enter mobile number and select role")
    }
    const provider= new GoogleAuthProvider();
    const result= await signInWithPopup(auth,provider);
      
      console.log( result)
      try {
        
        const res= await axios.post("http://localhost:5000/api/auth/googleauth",{
          fullName:result.user.displayName,
          email:result.user.email,
          phone:form.phone,
          role:form.role
          

        },
      {
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }


      }
    )
     console.log("Google auth success:", res.data);
         dispatch(setuserData(res.data))
       

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
      <p className='text-gray-800 mb-8'>Create your account to get started with delicious food and deliveries</p>
      <div className='mb-4'>
        <label htmlFor="fullname" className='font-medium text-gray-800 block mb-1'>Full Name</label>
       <input
       type="text"
       name='fullName'
        value={form.userName}
        onChange={manageForm}
        required

       placeholder="enter your name"
       className="focus:outline-none focus:border-orange-500 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />

       <label htmlFor="email" className='font-medium text-gray-800 block mb-1'>Email</label>
       <input
       type="email"
       name='email'
       value={form.email}
       required
       onChange={manageForm}
       placeholder="enter your email"
       className="focus:outline-none focus:border-orange-500 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />

       <label htmlFor="mobileNumber" className='font-medium text-gray-800 block mb-1'>Mobile Number</label>
       <input
       type="text"
       value={form.phone}
       name='phone'
       onChange={manageForm}
       required
       placeholder="enter your mobile number"
       className="focus:outline-none focus:border-orange-500 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />

       <label htmlFor="password" className='font-medium text-gray-800 block mb-1'>Password</label>
       <div className='relative'>
       <input
       name='password'
       value={form.password}
       onChange={manageForm}
       required
       type={showpassword ? "password":"text"}
       placeholder="enter your password"
       className="focus:outline-none focus:border-orange-500 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />
       <button className='absolute left-[92%] top-2/6 text-gray-700 cursor-pointer' onClick={()=>{
        setShowpassword(!showpassword)
       }}>{
         !showpassword ?<FaRegEye /> :<FaRegEyeSlash />
        }</button>
       </div>


       <label htmlFor="role" className='font-medium text-gray-800 block mb-1'>Role</label>
       <div className='flex gap-2'>
       {
        ["user","owner","delivery Boy"].map((r,index)=>(
          <button key={index} name='role'   value={form.role} className={`flex-1 text-center border font-medium transition-colors rounded-lg  py-2 px-3 cursor-pointer  ${
            role==r ? "bg-[#ff4d2d] text-white": "bg-[#fff9f6] border-[1px solid #ff4d2d] text-[#e64323] "
          }`} onClick={()=>{
            setRole(r)
            setform({...form,role:r})
          }}>{r
          }</button>
        ))
       }
        
       </div>


      </div>


      <button  onClick={Handlebutton} type='submit' className='w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white cursor-pointer hover:bg-[#e64323]' disabled={loader}>{loader?<ClipLoader/>:"Sign Up"}</button>
      <p className='text-center text-red-500 mt-1'>{error}</p>

      <button onClick={GoogleAuth} className='mt-4 flex justify-center cursor-pointer items-center border rounded-lg transition duration-200 gap-2 px-4 py-2 w-full border-gray-400 hover:bg-gray-100'><FcGoogle className='text-2xl' />
      <span>Sign Up with google</span></button>
      <p className='text-center mt-6 cursor-pointer'>Alredy have an account ? <Link to="/signin"><span className='text-[#ff4d2d]'>Sign In</span></Link></p>
      </div>
    </div>
  )
}

export default Signup