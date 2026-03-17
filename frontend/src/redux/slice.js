import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    text:"",
};

export const userSlice =createSlice({
  name: 'user',
  initialState,
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
  }
});

export const {setText} = userSlice.actions;
export default userSlice.reducer;