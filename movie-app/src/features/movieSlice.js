import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (page = 1) => {
  const response = await axios.get(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  return { 
    results: response.data.results, 
    page: response.data.page 
  };
});

export const searchMovies = createAsyncThunk('movies/searchMovies', async (query) => {
  const response = await axios.get(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );
  return response.data.results;
});

const movieSlice = createSlice({
  name: 'movie',
  initialState: { 
    items: [], 
    status: 'idle', 
    page: 1,
    searchTerm: '',
    error: null 
  },
  reducers: {
    // Optional: Add a reducer to clear search and reset to popular
    clearSearch: (state) => {
      state.searchTerm = '';
      state.items = [];
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- Fetch Movies Cases --- */
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchTerm = ''; // Reset search term when fetching popular
        if (action.payload.page === 1) {
          state.items = action.payload.results;
        } else {
          // Append for infinite scroll if you use it later
          state.items = [...state.items, ...action.payload.results];
        }
        state.page = action.payload.page;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      /* --- Search Movies Cases --- */
      .addCase(searchMovies.pending, (state, action) => {
        state.status = 'loading';
        state.searchTerm = action.meta.arg; // Store the query being searched
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Overwrite items with search results
        state.page = 1; // Reset page count for search results
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearSearch } = movieSlice.actions;
export default movieSlice.reducer;