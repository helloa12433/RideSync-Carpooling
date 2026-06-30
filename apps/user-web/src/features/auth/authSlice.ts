import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, userApi } from '../../services/api';

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone_number?: string;
  countryCode?: string;
  profilePicture?: string;
  phoneNumber?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

export const loginWithGoogle = createAsyncThunk(
  'auth/googleLogin',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await authApi.post('/google', { idToken });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.post('/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // User Web fetches from user-service — NEVER from driver-service
      const response = await userApi.get('/profile');
      return response.data;
    } catch (err: any) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: { first_name?: string; last_name?: string; phone_number?: string; country_code?: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.put('/profile', userData);
      return response.data; // { message, user: ProfileDto }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateProfilePicture: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.profilePicture = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        
        const rawUser = action.payload.user;
        state.user = {
          userId: rawUser.id || rawUser.userId,
          email: rawUser.email,
          firstName: rawUser.first_name,
          lastName: rawUser.last_name,
          profilePicture: rawUser.profile_picture,
          phoneNumber: rawUser.phone_number,
          countryCode: rawUser.country_code,
          role: rawUser.role
        };
        state.token = action.payload.accessToken;
      })
      .addCase(loginWithGoogle.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
        console.log('Frontend Response Received');
        console.log('↓');
        console.log('Loading State Cleared');
        console.log('↓');
        console.log('Profile Updated Successfully');
        
        state.loading = false;
        
        const rawUser = action.payload.data || action.payload.user;
        if (!rawUser) {
          console.error('Invalid response format: Missing user data', action.payload);
          return;
        }

        state.user = {
          ...state.user,
          ...rawUser,
          firstName: rawUser.first_name || rawUser.firstName || state.user?.firstName || '',
          lastName: rawUser.last_name || rawUser.lastName || state.user?.lastName || '',
          profilePicture: rawUser.profile_picture || rawUser.profilePicture || state.user?.profilePicture,
          phoneNumber: rawUser.phone_number || rawUser.phoneNumber || state.user?.phoneNumber,
          countryCode: rawUser.country_code || rawUser.countryCode || state.user?.countryCode,
          userId: rawUser.id || rawUser.userId || state.user?.userId || '',
        };
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        
        // user-service returns { success, message, data: ProfileDto }
        const rawUser = action.payload.data || action.payload.user;
        if (!rawUser) return;
        state.user = {
          userId: rawUser.id || rawUser.userId,
          email: rawUser.email,
          firstName: rawUser.first_name || rawUser.firstName || '',
          lastName: rawUser.last_name   || rawUser.lastName  || '',
          profilePicture: rawUser.profile_picture || rawUser.profilePicture,
          phoneNumber: rawUser.phone_number || rawUser.phoneNumber,
          countryCode: rawUser.country_code || rawUser.countryCode,
          role: rawUser.role
        };
      })
      .addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateProfilePicture } = authSlice.actions;
export default authSlice.reducer;
