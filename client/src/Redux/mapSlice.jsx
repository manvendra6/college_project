import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    location: {
      lat: null,
      long: null
    },
    address: " "
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = {
        lat: action.payload.lat,
        long: action.payload.long
      };
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    }
  }
});

export const { setLocation, setAddress } = mapSlice.actions;
export default mapSlice.reducer;