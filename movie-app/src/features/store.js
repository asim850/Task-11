import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import movieReducer from './movieSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    movie: movieReducer,
  },
});