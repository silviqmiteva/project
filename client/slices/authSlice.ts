import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  userId: 0,
  username: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { updateAccessToken, setUserId, setUsername } =
  authSlice.actions;
export default authSlice.reducer;
