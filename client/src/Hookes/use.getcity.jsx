import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setcity, setState } from '../Redux/userSlice';
import { setAddress, setLocation } from '../Redux/mapSlice';

function userGetcity() {
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // const { latitude, longitude } = position.coords;
        const latitude = 26.4499; // Example latitude
        const longitude = 80.3319; // Example longitude

        dispatch(setLocation({ lat: latitude, long: longitude }));
        
        try {
          const res = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=162c92936ee841bc9f34bd42a1c36e62`
          );

          if (res.data.results && res.data.results[0]) {
            const result = res.data.results[0];
            dispatch(setcity(result.city || result.village || result.town || ""));
            dispatch(setState(result.state || ""));
            dispatch(setAddress(result.address_line1 || ""));
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, [dispatch]);
}

export default userGetcity;