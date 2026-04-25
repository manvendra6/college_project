  import axios from "axios"
  import { useEffect } from "react"
 
  import {useDispatch, useSelector} from "react-redux";
  import { setmyshopData, setMyShops } from "../Redux/shopSlice";

   function useShopdata(){
          
      const dispatch = useDispatch();
      const { userData } = useSelector(state => state.user);
     

    useEffect(()=>{
    const Fetchshopdata=async()=>{
      if (userData?.role !== "owner") return;
      try {
         const res = await axios.get("http://localhost:5000/api/shop/get-myshopData", { withCredentials: true })
         console.log("daata get ", res.data)
         dispatch(setMyShops(res.data.shops))
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