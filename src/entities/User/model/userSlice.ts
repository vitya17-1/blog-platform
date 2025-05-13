import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentUser } from '@entities/User/model/types';

interface UserState {
  currentUser: CurrentUser | null;
  isAuth: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuth: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<CurrentUser>) => {
      state.currentUser = action.payload;
      state.isAuth = true;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuth = false;
    },
  },
});

export const { setCurrentUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
