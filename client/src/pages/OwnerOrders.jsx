import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import { MdOutlineReceiptLong, MdDeliveryDining, MdCheckCircle, MdTimer, MdClose, MdDelete } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedBoy, setSelectedBoy] = useState({});
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  console.log("user data ",userData);

  useEffect(() => {
    fetchOwnerOrders();
    fetchDeliveryBoys();

    const socket = io("http://localhost:5000");
    if (userData?._id) {
      socket.emit("join-room", userData._id);
    }

    socket.on("order-status-updated", (data) => {
      if (data.type === "NEW_ORDER") {
        toast.success("New Order Received!");
        fetchOwnerOrders();
      }
    });

    return () => socket.close();
  }, [userData]);

  const fetchOwnerOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/order/owner-orders", {
        withCredentials: true
      });
       console.log("orders",res.data.orders);
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch owner orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/delivery-boys", {
        withCredentials: true
      });
      console.log("Fetched delivery boys response:", res.data);
      setDeliveryBoys(res.data.deliveryBoys || []);
    } catch (error) {
      console.error("Failed to fetch delivery boys:", error);
      toast.error("Could not load delivery partners list");
    }
  };

  const updateStatus = async (orderId, shopOrderId, newStatus) => {
    try {
      const deliveryBoyId = selectedBoy[shopOrderId];
      console.log(`Updating order ${orderId} shopOrder ${shopOrderId} to status ${newStatus} with deliveryBoy ${deliveryBoyId}`);
      
      await axios.put("http://localhost:5000/api/order/update-status", {
        orderId,
        shopOrderId,
        status: newStatus,
        deliveryBoyId: newStatus === 'Out for Delivery' ? deliveryBoyId : undefined
      }, { withCredentials: true });
      
      toast.success(`Order marked as ${newStatus}`);
      fetchOwnerOrders(); // Refresh
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/order/delete-order/${orderId}`, {
        withCredentials: true
      });
      toast.success("Order deleted permanently");
      fetchOwnerOrders();
    } catch (error) {
      console.error("Delete order error:", error);
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
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

  return (
    <div className='min-h-screen bg-[#fff9f6] dark:bg-gray-950 transition-colors duration-300 pt-28 pb-10 flex flex-col items-center'>
      <Nav />
      
      <div className='w-full max-w-5xl px-4 sm:px-6 z-10'>
        <div className='flex items-center mb-8 relative'>
          <button 
            onClick={() => navigate("/")}
            className="absolute left-0 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md text-orange-500 transition-all hidden sm:block"
          >
            <IoIosArrowRoundBack className="text-3xl" />
          </button>
          <div className='w-full text-center'>
            <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white flex justify-center items-center gap-3'>
              <MdOutlineReceiptLong className="text-orange-500" />
              Manage Orders
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <SyncLoader color="#ff4d2d" />
          </div>
        ) : orders.length === 0 ? (
          <div className='w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-10 text-center shadow-lg'>
             <h2 className='text-xl font-bold text-gray-800 dark:text-white'>No orders to manage</h2>
             <p className='text-gray-500 mt-2'>When customers order from your shop, they will appear here.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {orders.map((order) => (
              <div key={order._id} className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm'>
                {order.shopOrders.map((so, idx) => (
                  <div key={idx} className='space-y-4'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b dark:border-gray-800 pb-4'>
                      <div>
                        <div className='flex items-center gap-2 mb-1'>
                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(so.status)}`}>
                             {so.status}
                           </span>
                           <span className='text-xs font-bold text-gray-400'>#{order._id.substring(order._id.length - 6)}</span>
                           {order.isPaid ? (
                             <span className='bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold'>PAID</span>
                           ) : (
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.paymentMethod === 'cod' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                               {order.paymentMethod === 'cod' ? 'COD' : 'UNPAID'}
                             </span>
                           )}
                        </div>
                        <h3 className='text-lg font-bold text-gray-800 dark:text-white'>{order.user?.fullName}</h3>
                        <p className='text-sm text-gray-500'>{order.user?.phone}</p>
                      </div>
                      <div className='flex flex-col gap-3'>
                        {/* Show assignment option for Confirmed or Preparing orders */}
                        {(so.status === 'Confirmed' || so.status === 'Preparing') && (
                          <div className='bg-blue-50 dark:bg-blue-500/5 p-3 rounded-2xl border border-blue-100 dark:border-blue-500/10 space-y-2'>
                            <p className='text-xs font-bold text-blue-600 dark:text-blue-400 uppercase'>Assign Delivery Partner</p>
                            <div className='flex flex-col sm:flex-row gap-2'>
                              <select 
                                className='flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-orange-500 shadow-sm'
                                onChange={(e) => setSelectedBoy(prev => ({ ...prev, [so._id]: e.target.value }))}
                                value={selectedBoy[so._id] || ""}
                              >
                                <option value="">Select Delivery Boy</option>
                                {deliveryBoys.length === 0 && <option disabled>No delivery partners found</option>}
                                {deliveryBoys.map(boy => (
                                  <option key={boy._id} value={boy._id}>
                                    {boy.fullName} ({boy.role}) - {boy.phone}
                                  </option>
                                ))}
                              </select>
                              <button 
                                onClick={() => {
                                  if (!selectedBoy[so._id]) return toast.error("Please select a delivery boy first");
                                  updateStatus(order._id, so._id, 'Out for Delivery');
                                }} 
                                className='px-4 py-2 bg-purple-500 text-white text-sm font-bold rounded-xl hover:bg-purple-600 transition-all shadow-md active:scale-95'
                              >
                                Assign & Ship
                              </button>
                            </div>
                          </div>
                        )}

                        <div className='flex flex-wrap gap-2 justify-end'>
                          {so.status !== 'Delivered' && so.status !== 'Cancelled' && (
                            <>
                              {so.status === 'Pending' && (
                                <button onClick={() => updateStatus(order._id, so._id, 'Confirmed')} className='px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm'>Confirm Order</button>
                              )}
                              {so.status === 'Confirmed' && (
                                <button onClick={() => updateStatus(order._id, so._id, 'Preparing')} className='px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-sm'>Start Preparing</button>
                              )}
                              <button 
                                onClick={() => {
                                  if(window.confirm("Are you sure you want to cancel this order?")) {
                                    updateStatus(order._id, so._id, 'Cancelled');
                                  }
                                }} 
                                className='px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-500/20 shadow-sm'
                              >
                                Cancel Order
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => {
                              if(window.confirm("Are you sure you want to PERMANENTLY DELETE this order? This cannot be undone.")) {
                                deleteOrder(order._id);
                              }
                            }} 
                            className='px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-2'
                          >
                            <MdDelete className="text-lg" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='py-2'>
                      <p className='text-sm font-bold text-gray-400 uppercase mb-2'>Items</p>
                      {so.shopOrderItems.map((item, i) => (
                        <div key={i} className='flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800/50 last:border-0'>
                          <span className='text-gray-700 dark:text-gray-300'>{item.quantity} × {item.name}</span>
                          <span className='font-bold text-gray-900 dark:text-gray-100'>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between gap-4'>
                      <div className='flex items-start gap-2 text-sm'>
                         <MdDeliveryDining className='text-xl text-orange-500' />
                         <div>
                            <p className='font-bold text-gray-800 dark:text-gray-200'>Delivery Address</p>
                            <p className='text-gray-500 dark:text-gray-400'>{order.deliveryAddress?.text}</p>
                         </div>
                      </div>
                      <div className='text-right'>
                         <p className='text-xs text-gray-400 font-bold uppercase'>Ordered At</p>
                         <p className='text-sm text-gray-700 dark:text-gray-300'>{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
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

export default OwnerOrders;
