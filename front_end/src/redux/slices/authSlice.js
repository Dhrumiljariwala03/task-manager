import { Password } from "@mui/icons-material";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"

const initialState = {
  user: null,
  otp: null,
  password: null
};

const authSlices = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUserSuccess: (state, action) => {
      state.user = action.payload;
    },
    verifyEmailSuccess: (state, action) => {
      state.user = action.payload;
    },
    verifyOtpsuccess: (state, action) => {
      state.otp = action.payload;

    },
    resetPasswordsuccess: (state, action) => {
      state.password = action.payload;
    },
    changePasswordsuccess: (state, action) => {
      state.password = action.payload;
    },
    setPasswordSuccess: (state, action) => {
      state.password = action.payload;

    }
  },
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { dispatch }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login_user', loginData);
      if (response.data.status === true) {
        const token = response.data.token;
        Cookies.set("token", token);
        dispatch(loginUserSuccess(response.data.user));
        return response.data.data._id;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      if (error.response && error.response.status === 404 || error.response.status === 400) {
        throw new Error('username or password invalid');
      } else {
        throw new Error(error.message);
      }
    }
  }
);

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (verifyEmail, { dispatch }) => {
  try {
    const response = await axios.post('http://localhost:4000/api/auth/verify_email', verifyEmail);
    console.log(response.data)
    if (response.data.status === true) {
      dispatch(verifyEmailSuccess(response.data.user));
    } else {
      throw new Error('Email verification failed');
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Email not Found');
    } else {
      throw new Error('Email verification failed');
    }
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ userId, otp, token }, { dispatch }) => {
  try {
    const response = await axios.post(`http://localhost:4000/api/auth/verify_otp/${userId}/${token}`, { otp });
    if (response.data.status === true) {
      dispatch(verifyOtpsuccess(response.data.otp));
      return response.data.otp;
    } else {
      throw new Error('Invalid or expired OTP');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ userId, newPassword, confirmNewPassword }, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(`http://localhost:4000/api/auth/reset_password/${userId}`, { newPassword, confirmNewPassword });
    if (response.data.status === true) {
      dispatch(resetPasswordsuccess(response.data.message));
      return response.data.message;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});


export const changePassword = createAsyncThunk('auth/changePassword', async ({ currentPassword, newPassword, confirmNewPassword }, { dispatch, rejectWithValue }) => {
  try {
    const token = Cookies.get("token");
    let userId;
    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken._id;
    }

    const response = await axios.post(`http://localhost:4000/api/auth/change_password/${userId}`, { currentPassword, newPassword, confirmNewPassword });
    if (response.data.status === true) {
      dispatch(changePasswordsuccess(response.data.message));
      return response.data.message;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const setPassword = createAsyncThunk(
  'auth/setPassword',
  async ({ token, password, confirmPassword }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/auth/createNewUser-password?token=${token}`, {
        password,
        confirmPassword,
      });
      dispatch(setPasswordSuccess(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const { loginUserSuccess, verifyEmailSuccess, verifyOtpsuccess, resetPasswordsuccess, changePasswordsuccess, setPasswordSuccess } = authSlices.actions;
export default authSlices.reducer;
