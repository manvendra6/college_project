  import axios from "axios"
  import { useEffect } from "react"
 
  import {useDispatch} from "react-redux";
import { setshopcity } from "../Redux/userSlice";
import { useSelector } from "react-redux";
  

   function useGetshopcity(){
          
      const dispatch = useDispatch();
      const {city}=useSelector((state)=>state.user);
      console.log( "city",city)

    useEffect(()=>{
    const Fetchshopcity=async()=>{
      try {
        const res= await axios.get(`http://localhost:5000/api/shop/get-city/${city}`,{withCredentials:true,
          
        })
         console.log("shopcity ",res.data)
         dispatch(setshopcity(res.data.shops))
       
      } catch (error) {
        console.log("server error",error)
      
        if(error.response){
          console.error("Server error:", error.response.data);
        }
      }
      
    }
    Fetchshopcity();
      },[dispatch,city])
      return null;
  }

  export default useGetshopcity;