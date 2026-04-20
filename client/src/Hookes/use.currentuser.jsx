  import axios from "axios"
  import { useEffect } from "react"
import { setuserData } from "../Redux/userSlice"
import {useDispatch} from "react-redux";


   function useCurrentuser(){
const dispatch = useDispatch();

    useEffect(()=>{
    const Fetchuser=async()=>{
      try {
        const res= await axios.get("http://localhost:5000/api/user/current",{withCredentials:true,
          
        })
         console.log(res)
         dispatch(setuserData(res.data))
       
      } catch (error) {
        console.log("server error",error)
      
        if(error.response){
          console.error("Server error:", error.response.data);
        }
      }
      
    }
    Fetchuser();
      },[dispatch])
      
  }

  export default useCurrentuser;