import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoLocation } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";
import "leaflet/dist/leaflet.css"; 
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, Popup, Marker, TileLayer, useMap } from "react-leaflet";
import { setAddress, setLocation } from "../redux/mapSlice";
import { MdDeliveryDining } from "react-icons/md";
import axios from 'axios';
import { FaMobileAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa6";

 
function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.long) {
      map.setView([location.lat, location.long], 16, {
        animate: true,
      });
    }
  }, [location, map]);

  return null;
}

const Chackoutpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { location,address } = useSelector((state) => state.map);
  const {cartItem,totalAmount}=useSelector((state)=>state.user);
   console.log( "today location", location);

  const DeliveryFree= totalAmount>500?0:40;
  const AmountwithDeliveryFree= totalAmount+DeliveryFree; 

  
  const [addressinput, setaddressinput] = useState("");
  const [paymentmathed,setpaymentmathed]= useState("cod");

  useEffect(()=>{
     getCurrentLocation();
  },[]);

  
  useEffect(() => {
    if (address) {
      setaddressinput(address);
    }
  }, [address]);

 
  useEffect(() => {
    if (location?.lat && location?.long) {
      getAddressBylatlong(location.lat, location.long);
    }
  }, [location]);

   
  const position = location?.lat
    ? [location.lat, location.long]
    : [26.4499, 80.3319];

  //  Drag marker
  const onDragend = (e) => {
    const { lat, lng } = e.target.getLatLng();

    dispatch(setLocation({
      lat: lat,
      long: lng
    }));

    getAddressBylatlong(lat, lng);  
  };

  //  Current location
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {

      const lat = position.coords.latitude;
      const long = position.coords.longitude;
           

      dispatch(setLocation({ lat, long }));
      getAddressBylatlong(lat, long);  

    });
  };

  
  const getAddressBylatlong = async(lat, lng) => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=162c92936ee841bc9f34bd42a1c36e62`
      );

      dispatch(setAddress(res?.data?.results[0]?.address_line2 || ""));
    } catch (error) {
      console.log(error);
    }
  };
  

  const getLatLngByAddress = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressinput)}&apiKey=162c92936ee841bc9f34bd42a1c36e62`
      );

      const { lat, lon } = res.data.features[0].properties;

      dispatch(setLocation({
        lat: lat,
        long: lon
      }));

      getAddressBylatlong(lat, lon);

    } catch (error) {
      console.log(error);
    }
  };

     const orderPlace = async () => {
    
  try {
    
    const res = await axios.post(
      "http://localhost:5000/api/order/place-order",
      {
        paymentMethod: paymentmathed, 
        deliveryAddress: {
          text:addressinput,
          latitude: location?.lat,
          longitude: location?.long,
        },
        totalAmount:totalAmount,
        cartItems: cartItem,
      },
      {
        withCredentials:true,
      }
    );

    console.log(res.data);
    alert("Order placed successfully");

  } catch (error) {
    console.log(error);
    alert("Order failed");
  }
};

  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>

      {/* Back Button */}
      <div className='absolute left-10 top-10' onClick={() => navigate("/cart")}>
        <IoIosArrowRoundBack className="text-5xl text-[#ff4d2d] cursor-pointer" />
      </div>

      <div className='w-full max-w-[900px] shadow-xl rounded-2xl bg-white space-y-5 p-4'>

        <h1 className='text-2xl font-semibold text-gray-800'>Checkout</h1>

        {/* Location Section */}
        <section>
          <h2 className='flex items-center text-lg font-semibold mb-2 gap-2'>
            <IoLocation className='text-[#ff4d2d]' />
            Delivery Location
          </h2>

          <div className='flex gap-2'>
            <input
              type="text"
              className='flex-1 border p-2 rounded-lg'
              placeholder='Enter your Delivery Address...'
              value={addressinput}
              onChange={(e) => setaddressinput(e.target.value)} // typing works
            />

            <button
              className='bg-red-500 text-white p-3 rounded-lg'
              onClick={getLatLngByAddress}
            >
              <FaSearch/>
            </button>

            <button
              className='bg-blue-500 text-white p-3 rounded-lg'
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation />
            </button>
          </div>

          {/* Show Address */}
          <p className='text-sm text-gray-600 mt-2'>
            Selected Address: {address}
          </p>
        </section>

   
        <div className='border rounded-md w-full h-[400px] overflow-hidden'>
          <MapContainer className='h-full w-full' center={position} zoom={16}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <RecenterMap location={location} />

            <Marker
              position={position}
              draggable
              eventHandlers={{ dragend: onDragend }}
            >
              <Popup>Your delivery location</Popup>
            </Marker>

          </MapContainer>
        </div>

        <section>
          <h2 className='font-semibold text-lg mb-3 text-gray-800'>Pyment Method</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className={`flex items-center gap-3 rounded-xl border p-4 transition ${paymentmathed=="cod" ? "border-[#ff4d2d] bg-orange-50 ":"border-gray-200 hover:border-gray-300"} `} onClick={()=>{
              setpaymentmathed("cod")
            }} >
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-300 '>
                <MdDeliveryDining  className='text-xl text-green-600'/>
              </span>
              <div>
                <p className='font-medium text-gray-800'>Cash On Delivery</p>
                <p className='text-sm text-gray-500'>Pay when your food arrives</p>
              </div>

            </div>
            <div className={`flex items-center gap-3 rounded-xl border p-4 transition ${paymentmathed=="online" ? "border-[#ff4d2d] bg-orange-50 ":"border-gray-200 hover:border-gray-300"} `}onClick={()=>{
              setpaymentmathed("online")
            }}>
             <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
             <FaMobileAlt className='text-purple-700 text-lg' />
             </span>
             <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100' >
              <FaCreditCard className='text-lg text-blue-700' />
             </span>
             <div>
              <p className='font-medium text-gray-800'>UPI / Credit / Debit</p>
             <p className='text-sx text-gray-500'>Pay Securely Online</p>
             </div>
             
            </div>


          </div>
        </section>

        <section>
          <h2 className='text-lg font-semibold text-gray-800 mb-3'>Order Summary</h2>
          <div className='border bg-gray-50 p-4 rounded-xl space-y-2'>
            {
              cartItem.map((item,index)=>{
             return (
                <div className='flex text-gray-700 justify-between text-sm'key={index}>
                 <span>{item.name}x{item.quantity}</span>
                 <span>{item.price*item.quantity}</span>
                </div>
             )
              })
            }
            <hr  className='border-gray-200 my-2'/>
            <div className='flex justify-between  font-semibold text-gray-800 '> 
              <span>
                Subtotal
              </span>
              <span>
                {totalAmount}
              </span>
            </div>
            <div>
              <div className='flex justify-between text-gray-700'>
                <span>Delivery Fee</span>
                <span>{`${totalAmount>500?"free":40}`}</span>
              </div>
              <hr  className='text-gray-200 my-2'/>
              <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
                <span>Total</span>
                <span>{AmountwithDeliveryFree}</span>
              </div>

            </div>
           
          </div>
        </section>

         <section>
              <button className='w-full bg-[#ff4d2d] text-white py-3 rounded-xl hover:bg-[#e04426]' onClick={orderPlace}>
                {paymentmathed=="cod"?"Place Order":"Pay & Place Order"}
              </button>
            </section>

      </div>
    </div>
  );
};

export default Chackoutpage;