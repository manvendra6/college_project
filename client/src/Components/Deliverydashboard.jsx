import React, { useEffect, useState } from 'react';
import Nav from '../pages/Nav';
import axios from 'axios';
import { MdOutlineReceiptLong, MdDeliveryDining, MdCheckCircle, MdPin, MdMyLocation } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    fetchDeliveryOrders();
    return () => newSocket.close();
  }, []);

  // Location tracking logic
  useEffect(() => {
    let watchId;
    const activeOrder = orders.find(o => o.shopOrders.some(so => so.status === 'Out for Delivery'));
    
    if (activeOrder && socket) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("update-location", { 
              orderId: activeOrder._id, 
              latitude, 
              longitude 
            });
          },
          (error) => console.error("Location error:", error),
          { enableHighAccuracy: true, distanceFilter: 10 }
        );
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [orders, socket]);

  const fetchDeliveryOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/order/delivery-orders", {
        withCredentials: true
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch delivery orders:", error);
      toast.error("Failed to load assigned deliveries");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (shopOrderId, value) => {
    setOtpInputs(prev => ({ ...prev, [shopOrderId]: value }));
  };

  const verifyOTP = async (orderId, shopOrderId) => {
    const otp = otpInputs[shopOrderId];
    if (!otp || otp.length !== 4) {
      return toast.error("Please enter a valid 4-digit OTP");
    }

    try {
      await axios.post("http://localhost:5000/api/order/verify-otp", {
        orderId,
        shopOrderId,
        otp
      }, { withCredentials: true });
      
      toast.success("Delivery verified successfully!");
      setOtpInputs(prev => {
        const next = { ...prev };
        delete next[shopOrderId];
        return next;
      });
      fetchDeliveryOrders(); // Refresh
    } catch (error) {
      console.error("OTP Verification error:", error);
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500';
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500';
    }
  };

  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-gray-950 transition-colors duration-300 pt-28 pb-10 flex flex-col items-center'>
      <Nav />
      
      <div className='w-full max-w-4xl px-4 sm:px-6 z-10'>
        <div className='flex items-center mb-8 relative'>
          <button 
            onClick={() => navigate("/")}
            className="absolute left-0 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md text-orange-500 transition-all hidden sm:block"
          >
            <IoIosArrowRoundBack className="text-3xl" />
          </button>
          <div className='w-full text-center'>
            <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white flex justify-center items-center gap-3'>
              <MdDeliveryDining className="text-orange-500 text-4xl" />
              Delivery Partner Dashboard
            </h1>
          </div>
        </div>

        {/* Metrics Section */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white/80 dark:bg-gray-900/80 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm'>
            <p className='text-xs font-bold text-gray-400 uppercase'>Today's Earnings</p>
            <p className='text-2xl font-black text-orange-500'>₹{(orders?.filter(o => o.shopOrders?.some(so => so.status === 'Delivered')).length * 40).toFixed(2)}</p>
          </div>
          <div className='bg-white/80 dark:bg-gray-900/80 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm'>
            <p className='text-xs font-bold text-gray-400 uppercase'>Deliveries</p>
            <p className='text-2xl font-black text-gray-800 dark:text-white'>{orders?.filter(o => o.shopOrders?.some(so => so.status === 'Delivered')).length}</p>
          </div>
          <div className='bg-white/80 dark:bg-gray-900/80 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm'>
            <p className='text-xs font-bold text-gray-400 uppercase'>Active</p>
            <p className='text-2xl font-black text-blue-500'>{orders?.filter(o => o.shopOrders?.some(so => so.status !== 'Delivered')).length}</p>
          </div>
          <div className='bg-white/80 dark:bg-gray-900/80 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm'>
            <p className='text-xs font-bold text-gray-400 uppercase'>Rating</p>
            <p className='text-2xl font-black text-yellow-500'>4.9 ★</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <SyncLoader color="#ff4d2d" />
          </div>
        ) : orders && orders.length === 0 ? (
          <div className='w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-10 text-center shadow-lg border border-gray-100 dark:border-gray-800'>
             <h2 className='text-xl font-bold text-gray-800 dark:text-white'>No assigned deliveries</h2>
             <p className='text-gray-500 mt-2'>You'll see orders here once they are assigned to you.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {orders?.map((order) => (
              <div key={order._id} className='bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl'>
                {order.shopOrders?.map((so, idx) => (
                  <div key={idx} className='space-y-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-gray-800 pb-4'>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(so.status)} mb-2 inline-block`}>
                          {so.status}
                        </span>
                        <h3 className='text-xl font-black text-gray-800 dark:text-white'>{so.shop?.name}</h3>
                        <p className='text-xs text-gray-400 font-bold'>ORDER ID: #{order._id?.substring(order._id.length - 8)}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs text-gray-400 font-bold uppercase'>Customer</p>
                        <p className='font-bold text-gray-800 dark:text-gray-200'>{order.user?.fullName}</p>
                        <p className='text-sm text-orange-500 font-bold'>{order.user?.phone}</p>
                      </div>
                    </div>

                    <div className='bg-orange-50 dark:bg-orange-500/5 p-4 rounded-2xl border border-orange-100 dark:border-orange-500/10'>
                      <div className='flex items-start gap-3'>
                        <div className='p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/30'>
                           <MdDeliveryDining className='text-xl' />
                        </div>
                        <div>
                          <p className='text-xs text-gray-400 font-bold uppercase'>Delivery Location</p>
                          <p className='text-gray-800 dark:text-gray-200 font-medium mt-1'>{order.deliveryAddress?.text}</p>
                        </div>
                      </div>
                    </div>

                    {so.status !== 'Delivered' && (
                      <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl flex flex-col items-center gap-4 border border-gray-100 dark:border-gray-700'>
                        <div className='flex flex-col items-center text-center mb-2'>
                          <h4 className='text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2'>
                            <MdPin className='text-orange-500' />
                            Verify with OTP
                          </h4>
                          <p className='text-sm text-gray-500'>Ask customer for the 4-digit code</p>
                        </div>
                        
                        <div className='flex items-center gap-4 w-full max-w-xs'>
                          <input 
                            type="text" 
                            maxLength="4"
                            placeholder="0 0 0 0"
                            value={otpInputs[so._id] || ''}
                            onChange={(e) => handleOtpChange(so._id, e.target.value)}
                            className='w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-center text-2xl font-black tracking-[1em] focus:border-orange-500 outline-none transition-all dark:text-white'
                          />
                          <button 
                            onClick={() => verifyOTP(order._id, so._id)}
                            className='bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-lg shadow-orange-500/30 hover:-translate-y-1 transition-all'
                          >
                            <MdCheckCircle className='text-2xl' />
                          </button>
                        </div>
                      </div>
                    )}

                    {so.status === 'Delivered' && (
                      <div className='flex items-center justify-center gap-2 text-green-500 font-bold py-4'>
                        <MdCheckCircle className='text-2xl' />
                        <span>Delivery Completed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;