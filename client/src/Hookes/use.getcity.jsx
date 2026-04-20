import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setcity, setState } from '../Redux/userSlice';
import { setAddress } from '../redux/mapSlice';
import { setLocation } from '../redux/mapSlice';


function  userGetcity() {
 
  const dispatch= useDispatch()
  
  useEffect(()=>{
   navigator.geolocation.getCurrentPosition(async(position)=>{
      
    //  const latitute=position.coords.latitude;
    //  const longitute= position.coords.longitude;

     const latitute=26.4499;
     const longitute=80.3319;
      dispatch(setLocation({latitute:latitute,longitute:longitute}))
      const res= await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitute}&lon=${longitute}&format=json&apiKey=162c92936ee841bc9f34bd42a1c36e62`,)
   
         dispatch(setcity(res.data.results[0].city))
          
         dispatch(setState(res.data.results[0].state))
          console.log(res.data)
         dispatch(setAddress(res.data.results[0].address_line1
))
   },
   
  )
  },[])
}

export default  userGetcity