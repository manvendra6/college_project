import { createSlice } from "@reduxjs/toolkit";


const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myshopData: null,
    myShops: [],
  },
  reducers: {
    setmyshopData: (state, action) => {
      state.myshopData = action.payload;
    },
    setMyShops: (state, action) => {
      state.myShops = action.payload;
    },
  },
});

export const { setmyshopData, setMyShops } = ownerSlice.actions;

export default ownerSlice.reducer