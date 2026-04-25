import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import { MdOutlineReceiptLong } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import LiveTracking from '../Components/LiveTracking';
import io from 'socket.io-client';

const Orderpage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    if (userData?._id) {
      newSocket.emit("join-room", userData._id);
    }

    newSocket.on("order-status-updated", (data) => {
      console.log("Status update received:", data);
      setOrders(prevOrders => prevOrders.map(order => {
        if (order._id === data.orderId) {
          const updatedShopOrders = order.shopOrders.map(so => {
            if (so._id === data.shopOrderId) {
              return { ...so, status: data.status };
            }
            return so;
          });
          return { ...order, shopOrders: updatedShopOrders };
        }
        return order;
      }));
    });

    return () => newSocket.close();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/order/my-orders", {
        withCredentials: true
      });
      console.log("Orders:", res.data.orders);
      // Sort orders by newest first
      const ordersArray = Array.isArray(res.data.orders) ? res.data.orders : [];
      const sortedOrders = ordersArray.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500';
      case 'Confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500';
      case 'Preparing': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-500';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500';
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-500';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-gray-950 transition-colors duration-300 flex flex-col items-center pt-28 pb-10 relative'>
      <Nav />
      
      {/* Decorative Background Elements */}
      <div className="fixed top-40 left-[-10%] w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className='w-full max-w-4xl px-4 sm:px-6 z-10'>
        
        {/* Header */}
        <div className='flex items-center mb-8 relative'>
          <button 
            onClick={() => navigate("/")}
            className="absolute left-0 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md hover:bg-orange-50 dark:hover:bg-gray-700 text-orange-500 hover:text-orange-600 transition-all duration-300 group hidden sm:block"
          >
            <IoIosArrowRoundBack className="text-3xl group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className='w-full text-center'>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex justify-center items-center gap-3'>
              <MdOutlineReceiptLong className="text-orange-500" />
              My Orders
            </h1>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <SyncLoader color="#ff4d2d" />
          </div>
        ) : orders && orders.length === 0 ? (
          /* Empty State */
          <div className='w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center p-10 shadow-lg dark:shadow-none mt-10'>
            <div className='w-24 h-24 bg-orange-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner'>
              <MdOutlineReceiptLong className="text-5xl text-orange-500" />
            </div>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>No orders found</h2>
            <p className='text-gray-500 dark:text-gray-400 mt-2 mb-6 text-center'>You haven't placed any orders yet. Let's fix that!</p>
            <button 
              onClick={() => navigate("/")}
              className='px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:-translate-y-1 transition-all'
            >
              Start Exploring
            </button>
          </div>
        ) : (
          /* Order List */
          <div className='flex flex-col gap-6'>
            {orders?.map((order) => (
              <div key={order?._id} className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md dark:shadow-none transition-shadow duration-300'>
                
                {/* Order Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4'>
                  <div>
                    <p className='text-xs font-bold text-orange-500 uppercase tracking-wider mb-1'>Order ID: {order?._id ? order._id.substring(order._id.length - 8) : 'N/A'}</p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm font-medium'>{order?.createdAt ? formatDate(order.createdAt) : 'Unknown Date'}</p>
                  </div>
                  <div className='flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl'>
                    <span className='text-sm font-semibold text-gray-500 dark:text-gray-400'>Total:</span>
                    <span className='text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500'>₹{order?.totalAmount || 0}</span>
                  </div>
                </div>

                {/* Shop Orders */}
                <div className='space-y-6'>
                  {order?.shopOrders?.map((shopOrder, idx) => (
                    <div key={idx} className='bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl p-4 border border-gray-50 dark:border-gray-700/50'>
                      <div className='flex items-center gap-3 mb-3'>
                        {shopOrder?.shop?.image && (
                          <img src={shopOrder.shop.image} alt="Shop" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                        )}
                        <div className='flex-1 flex justify-between items-center'>
                          <h3 className='font-bold text-gray-800 dark:text-gray-100 text-lg'>
                            {shopOrder?.shop?.name || "Unknown Shop"}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(shopOrder.status)}`}>
                            {shopOrder.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className='pl-2 sm:pl-12 space-y-2'>
                        {shopOrder?.shopOrderItems?.map((item, itemIdx) => (
                          <div key={itemIdx} className='flex justify-between items-center text-sm sm:text-base'>
                            <span className='text-gray-700 dark:text-gray-300 font-medium'>
                              {item?.quantity || 1} × {item?.name || item?.item?.name || "Item"}
                            </span>
                            <span className='text-gray-900 dark:text-gray-200 font-semibold'>₹{(item?.price || 0) * (item?.quantity || 1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Tracking Map */}
                {order.shopOrders.some(so => so.status === 'Out for Delivery') && (
                  <div className='mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                    <p className='text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2'>
                       <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                       Live Tracking
                    </p>
                    <LiveTracking 
                      orderId={order._id} 
                      customerCoords={order.deliveryAddress?.latitude ? [order.deliveryAddress.latitude, order.deliveryAddress.longitude] : null} 
                    />
                  </div>
                )}

                {/* Footer / Delivery Details */}
                <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4 text-sm'>
                  <div className='flex items-start gap-2 max-w-sm'>
                    <div className='p-1.5 bg-green-100 dark:bg-green-500/10 text-green-600 rounded-lg mt-0.5'>
                      <IoLocation />
                    </div>
                    <div>
                      <p className='font-semibold text-gray-800 dark:text-gray-200'>Delivery Address</p>
                      <p className='text-gray-500 dark:text-gray-400 line-clamp-2'>{order?.deliveryAddress?.text || 'No address provided'}</p>
                    </div>
                  </div>
                  
                  <div className='flex items-start gap-2'>
                    <div className='p-1.5 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-lg mt-0.5'>
                      <MdOutlineReceiptLong />
                    </div>
                    <div>
                      <p className='font-semibold text-gray-800 dark:text-gray-200'>Payment Method</p>
                      <p className='text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2'>
                        {order?.paymentMethod || 'N/A'}
                        {order?.isPaid && (
                          <span className='bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold'>PAID</span>
                        )}
                        {!order?.isPaid && order?.paymentMethod === 'online' && (
                          <span className='bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-bold'>FAILED</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {order?.otp && (
                    <div className='flex items-start gap-2 bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-100 dark:border-orange-500/20'>
                      <div className='p-1.5 text-orange-500 rounded-lg mt-0.5'>
                        <span className='font-bold text-xs uppercase'>OTP</span>
                      </div>
                      <div>
                        <p className='font-semibold text-gray-800 dark:text-gray-200'>Delivery OTP</p>
                        <p className='text-orange-600 dark:text-orange-400 font-black text-lg tracking-widest'>{order.otp}</p>
                        <p className='text-[10px] text-gray-400 italic'>Share this with your delivery partner only</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Orderpage;