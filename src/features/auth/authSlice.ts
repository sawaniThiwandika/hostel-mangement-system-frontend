import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { login, registerOwner } from './authAPI'
import type { AuthResponse, LoginRequest, OwnerCreateRequest } from './authTypes'

interface AuthState {
  user: AuthResponse | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response &&
      typeof response.data === 'object' &&
      response.data !== null &&
      'message' in response.data &&
      typeof response.data.message === 'string'
    ) {
      return response.data.message
    }
  }

  return 'Unable to connect to the server. Please try again.'
}

export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (request, { rejectWithValue }) => {
    try {
      return await login(request)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const registerOwnerUser = createAsyncThunk<
  AuthResponse,
  OwnerCreateRequest,
  { rejectValue: string }
>('auth/registerOwner', async (request, { rejectWithValue }) => {
  try {
    return await registerOwner(request)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.error = null
      sessionStorage.removeItem('hostel-access-token')
      sessionStorage.removeItem('hostel-refresh-token')
    },
    clearAuthError(state) {
      state.error = null
    },
    restoreSession(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        sessionStorage.setItem('hostel-access-token', action.payload.token)
        sessionStorage.setItem('hostel-refresh-token', action.payload.refreshToken)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Login failed.'
      })
      .addCase(registerOwnerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerOwnerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        sessionStorage.setItem('hostel-access-token', action.payload.token)
        sessionStorage.setItem('hostel-refresh-token', action.payload.refreshToken)
      })
      .addCase(registerOwnerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Registration failed.'
      })
  },
})

export const { clearAuthError, logout, restoreSession } = authSlice.actions
export default authSlice.reducer
