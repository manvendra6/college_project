import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoLocation } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";
import "leaflet/dist/leaflet.css"; 
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, Popup, Marker, TileLayer, useMap } from "react-leaflet";
import { setAddress, setLocation } from "../Redux/mapSlice";
import { MdDeliveryDining } from "react-icons/md";
import axios from 'axios';


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

  const { location, address } = useSelector((state) => state.map);
  const { cartItem, totalAmount } = useSelector((state) => state.user);

  const DeliveryFree = totalAmount > 500 ? 0 : 40;
  const AmountwithDeliveryFree = totalAmount + DeliveryFree; 

  const [addressinput, setaddressinput] = useState("");
  const [paymentmathed, setpaymentmathed] = useState("cod");

  useEffect(() => {
     getCurrentLocation();
  }, []);

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

  // Drag marker
  const onDragend = (e) => {
    const { lat, lng } = e.target.getLatLng();

    dispatch(setLocation({
      lat: lat,
      long: lng
    }));

    getAddressBylatlong(lat, lng);  
  };

  // Current location
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
            text: addressinput,
            latitude: location?.lat,
            longitude: location?.long,
          },
          totalAmount: AmountwithDeliveryFree,
          cartItems: cartItem,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/order-placed");
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-gray-950 flex justify-center p-4 sm:p-6 transition-colors duration-300 relative'>
      
      {/* Decorative Background Elements */}
      <div className="fixed top-20 left-[-10%] w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className='w-full max-w-[900px] z-10'>
        
        {/* Header */}
        <div className='flex items-center mb-6 relative'>
          <button 
            onClick={() => navigate("/cart")}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md hover:bg-orange-50 dark:hover:bg-gray-700 text-orange-500 hover:text-orange-600 transition-all duration-300 group"
          >
            <IoIosArrowRoundBack className="text-3xl group-hover:-translate-x-1 transition-transform" />
          </button>
          <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white ml-4'>Secure Checkout</h1>
        </div>

        <div className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-8'>
          
          {/* Location Section */}
          <section className="space-y-4">
            <h2 className='flex items-center text-xl font-bold text-gray-800 dark:text-gray-100 gap-2 border-b border-gray-100 dark:border-gray-800 pb-3'>
              <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-xl text-red-500">
                <IoLocation className='text-xl' />
              </div>
              Delivery Address
            </h2>

            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                type="text"
                className='flex-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500'
                placeholder='Enter your full delivery address...'
                value={addressinput}
                onChange={(e) => setaddressinput(e.target.value)} 
              />
              <div className="flex gap-2">
                <button
                  className='bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all'
                  onClick={getLatLngByAddress}
                  title="Search Address"
                >
                  <FaSearch/>
                </button>
                <button
                  className='bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2'
                  onClick={getCurrentLocation}
                  title="Use Current Location"
                >
                  <TbCurrentLocation className="text-xl" />
                  <span className="hidden sm:inline font-semibold">Locate Me</span>
                </button>
              </div>
            </div>

            <div className='bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 p-4 rounded-xl'>
              <p className='text-sm font-semibold text-orange-800 dark:text-orange-400 mb-1 uppercase tracking-wider'>Selected Address</p>
              <p className='text-base text-gray-800 dark:text-gray-200 font-medium'>{address || "Please select an address"}</p>
            </div>
          </section>

          {/* Map Display */}
          <div className='border-2 border-gray-100 dark:border-gray-700 rounded-3xl w-full h-[350px] overflow-hidden shadow-inner'>
            <MapContainer className='h-full w-full z-0' center={position} zoom={16}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <RecenterMap location={location} />
              <Marker position={position} draggable eventHandlers={{ dragend: onDragend }}>
                <Popup>Your delivery location</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Method */}
            <section className="space-y-4">
              <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-3'>Payment Method</h2>
              <div className='grid grid-cols-1 gap-4'>
                <div 
                  className={`flex items-center gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 ${paymentmathed === "cod" ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 shadow-md" : "border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"}`} 
                  onClick={() => setpaymentmathed("cod")} 
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors ${paymentmathed === "cod" ? "bg-orange-100 dark:bg-orange-500/20" : "bg-gray-100 dark:bg-gray-700"}`}>
                    <MdDeliveryDining className={`text-2xl ${paymentmathed === "cod" ? "text-orange-600 dark:text-orange-400" : "text-gray-400 dark:text-gray-500"}`}/>
                  </span>
                  <div>
                    <p className={`font-bold text-lg ${paymentmathed === "cod" ? "text-orange-600 dark:text-orange-400" : "text-gray-800 dark:text-gray-200"}`}>Cash On Delivery</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Pay when your food arrives</p>
                  </div>
                  
                </div>


              </div>
            </section>

            {/* Order Summary */}
            <section className="space-y-4 flex flex-col">
              <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-3'>Order Summary</h2>
              
              <div className='flex-1 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl flex flex-col justify-between'>
                <div className="space-y-3 mb-6">
                  {cartItem.map((item, index) => (
                    <div className='flex text-gray-700 dark:text-gray-300 justify-between text-sm sm:text-base font-medium' key={index}>
                      <span className="flex-1 truncate pr-4">{item.quantity} × {item.name}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className='flex justify-between font-semibold text-gray-600 dark:text-gray-400 text-sm'> 
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className='flex justify-between font-semibold text-gray-600 dark:text-gray-400 text-sm'>
                    <span>Delivery Fee</span>
                    <span className={DeliveryFree === 0 ? "text-green-500 dark:text-green-400 font-bold" : ""}>
                      {DeliveryFree === 0 ? "Free" : `₹${DeliveryFree}`}
                    </span>
                  </div>
                  
                  <div className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-2'>
                    <div className='flex justify-between items-center'>
                      <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Total</span>
                      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                        ₹{AmountwithDeliveryFree}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Place Order Action */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              className='w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xl py-4 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2' 
              onClick={orderPlace}
            >
              Place Order
              <IoIosArrowRoundBack className="text-3xl rotate-180" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chackoutpage;