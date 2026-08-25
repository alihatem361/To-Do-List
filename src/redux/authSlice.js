import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';
import { setAuthToken } from '../services/authToken';

// Different backends nest the token differently. Accept the common shapes so a
// successful auth call always flips the navigator over to the tasks stack.
const extractToken = (payload) =>
  payload?.token ||
  payload?.accessToken ||
  payload?.access_token ||
  payload?.data?.token ||
  payload?.data?.accessToken ||
  payload?.user?.token ||
  null;

const extractUser = (payload) =>
  payload?.user || payload?.data?.user || payload?.data || payload || null;

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.signUp(userData);
      setAuthToken(extractToken(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      setAuthToken(extractToken(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      setAuthToken(null);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const fulfilled = (state, action) => {
      state.loading = false;
      state.user = extractUser(action.payload);
      state.token = extractToken(action.payload);
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(signUp.pending, pending)
      .addCase(signUp.fulfilled, fulfilled)
      .addCase(signUp.rejected, rejected)
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilled)
      .addCase(login.rejected, rejected);
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
