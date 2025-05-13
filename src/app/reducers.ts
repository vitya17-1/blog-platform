import { combineReducers } from '@reduxjs/toolkit';
import { userSlice } from '@entities/User/model/userSlice';

export const rootReducer = combineReducers({
  // Reducers
  currentUser: userSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
