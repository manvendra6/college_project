import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MdDeliveryDining, MdHome } from 'react-icons/md';
import io from 'socket.io-client';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const deliveryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const homeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const RecenterMap = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView(coords, map.getZoom());
        }
    }, [coords]);
    return null;
};

const LiveTracking = ({ orderId, customerCoords }) => {
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("join-room", orderId);

    newSocket.on("location-updated", (coords) => {
      console.log("New delivery location:", coords);
      setDeliveryCoords([coords.latitude, coords.longitude]);
    });

    return () => newSocket.close();
  }, [orderId]);

  const center = deliveryCoords || customerCoords || [20.5937, 78.9629]; // Default to India center

  return (
    <div className='w-full h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 relative group'>
      <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {customerCoords && (
          <Marker position={customerCoords} icon={homeIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {deliveryCoords && (
          <Marker position={deliveryCoords} icon={deliveryIcon}>
            <Popup>Delivery Partner is here</Popup>
          </Marker>
        )}

        <RecenterMap coords={deliveryCoords} />
      </MapContainer>

      {!deliveryCoords && (
        <div className='absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-[1000] text-white p-6 text-center'>
          <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='font-bold text-lg'>Waiting for delivery partner to start...</p>
          <p className='text-sm text-gray-300'>Live tracking will begin once the order is out for delivery</p>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;
