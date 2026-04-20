  import axios from "axios"
  import { useEffect } from "react"
 
  import {useDispatch, useSelector} from "react-redux";
  import { setmyshopData } from "../Redux/shopSlice";

   function useShopdata(){
          
      const dispatch = useDispatch();
     

    useEffect(()=>{
    const Fetchshopdata=async()=>{
      try {
        const res= await axios.get("http://localhost:5000/api/shop/get-myshopData",{withCredentials:true,
          
        })
         console.log("daata get ",res.data)
         dispatch(setmyshopData(res.data.shop))
       
      } catch (error) {
        console.log("server error",error)
      
        if(error.response){
          console.error("Server error:", error.response.data);
        }
      }
      
    }
    Fetchshopdata();
      },[dispatch])
      return null;
  }

  export default useShopdata;