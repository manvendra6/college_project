import React, { useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { ClipLoader } from 'react-spinners';
 

const Forgotpassword = () => {


  const [page , setpage]=useState(1)
  const [showpass,setshowpass]=useState(false)
  const [showpass2,setshowpass2]=useState(false)
  const [loader,setloader]=useState(false);
  const navigate= useNavigate();

  const [email,setemail]=useState({
    email:""
  })
  const [otp, setotp]=useState({
    otp:""
  })

 const [passwordchange,setpasswordchange]=useState({
    newPassword:"",
    confirmPassword:""
 })

  const SendOtp= async(e)=>{
    e.preventDefault();
     setloader(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/resetotp",email,{
        
        headers:{
          "Content-Type":"application/json"
        }
      })
      console.log("OTP sent:", res.data);
       setloader(false);
      setpage(2)

    } catch (error) {
      console.log("server error",error)
      setloader(false);
      if(error.response){
         console.error("Server error:", error.response.data);
      }
    }
  }
  const VairifyedOtp=async(e)=>{
     e.preventDefault();
     setloader(true);
       
      try {
        const res= await axios.post("http://localhost:5000/api/auth/verifyotp",{email: email.email,otp:otp.otp},
          {
           
            headers:{
              "Content-Type":"application/json"
            }
          }

        )
        console.log("OTP verified:", res.data);
        setloader(false);
        setpage(3)
      } catch (error) {
        console.log( error)
        setloader(false);
        if(error.response){
          console.error("verifyOtp error:", error); 
          console.error("Server error:", error.response.data);
        }
      }

  }

  const ChangePassword= async(e)=>{
    setloader(true);
    e.preventDefault();
     if(passwordchange.newPassword !== passwordchange.confirmPassword){
        alert("Password do not match")
        return;
     }
     try {
      const res= await axios.post("http://localhost:5000/api/auth/resetpass",{email:email.email,
        newPassword: passwordchange.newPassword
      },
        {
           
         headers:{
            "Content-Type":"application/json"
           }        }
      )
      console.log("Password reset successful:", res.data);
      setpasswordchange({
        newPassword:"",
        confirmPassword:""
      })
      setloader(false);
      navigate("/signin");
      
     } catch (error) {
      console.log("error",error)
      setloader(false);
      if(error.response){
        console.error("Server error:", error.response.data)
      }
     }
     
  }

  return (
    <div className='min-h-screen w-full p-4 bg-[#fff9f6] flex justify-center items-center'>
      <div className='rounded-lg shadow-lg bg-white w-full max-w-md p-8'>
       <div className='flex items-center gap-4 mb-4'>
        <Link to="/signin">
        <IoArrowBack className='cursor-pointer text-2xl  transition-transform duration-300 text-[#ff4d2d] hover:-translate-x-1'/></Link>
        <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
       </div>


       {
        page===1 &&(
          <div>
            <div className='mb-6'>
        <label htmlFor="email" className='font-medium cursor-pointer text-gray-800 block mb-1'>Email</label>
      <input
  name="email"
  value={email.email}
  required
  type="email"
  onChange={(e) => {
    const { name, value } = e.target;
    setemail((prev) => ({
      ...prev,
      [name]: value,
    }));
  }}
  placeholder="Enter your email"
  className="focus:outline-none focus:border-gray-300 w-full my-2 p-2 border rounded-lg border-[#ddd]"
/>


       
     

       <button type='submit' onClick={SendOtp} className='w-full mb-3 font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white cursor-pointer hover:bg-[#e64323] mt-2' disabled={loader}>{loader?<ClipLoader/>:"Send OTP"}</button>
        </div>
        </div>
        )
       }
        
        {/* //second page */}

        {
        page===2 &&(
          <div>
            <div className='mb-6'>
       <label htmlFor="opt" className='font-medium cursor-pointer text-gray-800 block mb-1'>OTP</label>
       <input
       name='otp'
       value={otp.otp}
        type="text"
        required
        onChange={(e)=>{
          const {name,value}=e.target;
          setotp((prev)=>({
            ...prev,[name]:value
          }))
        }}
       placeholder="Enter OTP"
       className="focus:outline-none mb-5 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />
      

       <button type='submit' onClick={VairifyedOtp} className='w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white cursor-pointer hover:bg-[#e64323]' disabled={loader}>{loader?<ClipLoader/>:"Verify OTP"}</button>
        </div>
        </div>
        )
       }
        
        {/* third page */}

         {
        page===3 &&(
          <div>
            <div className='mb-6 relative'>
       <label htmlFor="newPassword" className='font-medium cursor-pointer text-gray-800 block mb-1'>New Password</label>
       <input
       name='newPassword'
       required
       value={passwordchange.newPassword}
        onChange={(e)=>{
          const {name,value}=e.target;
          setpasswordchange((prev)=>({
            ...prev,[name]:value
          }))
        }}
        type={showpass ? "password":"text"}
       placeholder="Enter new password"
       className="focus:outline-none mb-5 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />

       <label htmlFor="confirmPassword" className='font-medium cursor-pointer text-gray-800 block mb-1' disabled={loader}>{loader?<ClipLoader/>:"Confirm Password"}</label>
       <input
       name='confirmPassword'
       required
       value={passwordchange.confirmPassword}
        onChange={(e)=>{
          const {name,value}=e.target;
           setpasswordchange((prev)=>({
            ...prev,[name]:value
          }))
        }}
        type={showpass2 ? "password":"text"}
       placeholder="Enter confirm password"
       className="focus:outline-none mb-5 w-full my-2 p-2 border rounded-lg border-[#ddd]"
       />
        <button className='absolute left-[92%] top-[48px] text-gray-700 cursor-pointer' onClick={()=>{
          setshowpass(!showpass)
               }}>{
                 !showpass ?<FaRegEye /> :<FaRegEyeSlash />
                }</button>
                <button className='absolute left-[92%] bottom-[76px] text-gray-700 cursor-pointer' onClick={()=>{
          setshowpass2(!showpass2)
               }}>{
                 !showpass2 ?<FaRegEye /> :<FaRegEyeSlash />
                }</button>

       <button type='submit' onClick={ChangePassword} className='w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white cursor-pointer hover:bg-[#e64323]'>Reset Password</button>
        </div>
        </div>
        )
       } 


      </div>
      </div>
  )
}

export default Forgotpassword