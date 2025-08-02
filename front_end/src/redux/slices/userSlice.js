import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const initialState = {
  users: [],
  roles: [],
  status: 'idle',
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getAllUserSuccess: (state, action) => {
      state.users = action.payload;
    },
    addUserSuccess: (state, action) => {
      state.users.push(action.payload);
    },
    getRolesSuccess: (state, action) => {
      state.roles = action.payload;
    },
    deleteUserSuccess: (state, action) => {
      state.users = state.users.filter(user => user._id !== action.payload);
    },
    updateUserSuccess: (state, action) => {
      const index = state.users.findIndex(user => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    }
  },
});

export const addUser = createAsyncThunk('user/addUser', async (addUserdata, { dispatch, rejectWithValue }) => {
  const token = Cookies.get('token');

  if (!token) {
    return rejectWithValue('Unauthorized: Token not found.');
  }

  const decodedToken = jwtDecode(token);
  const userRoleId = decodedToken.role;

  try {
    const roleResponse = await axios.get(`http://localhost:4000/api/role/get_roles_byId?_id=${userRoleId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    const userRole = roleResponse.data.data.role;

    if (!['Admin'].includes(userRole)) {
      return rejectWithValue('Unauthorized: Only admins can create users.');
    }

    const response = await axios.post('http://localhost:4000/api/user/create_user', addUserdata, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

    if (response.data.status === true) {
      dispatch(addUserSuccess(response.data.data));
    } else {
      throw new Error('User creation failed');
    }
  } catch (error) {
    if (error.response && (error.response.status === 404 || error.response.status === 400)) {
      return rejectWithValue('Username already exists');
    } else {
      return rejectWithValue(error.message);
    }
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (_id, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/user/delete_user?_id=${_id}`, {
      withCredentials: true
    });

    if (response.data.status === true) {
      dispatch(deleteUserSuccess(_id));
    } else {
      throw new Error('User deletion failed');
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const getAllUser = createAsyncThunk('user/getAllUser', async () => {
  const token = Cookies.get('token');

  const response = await axios.get('http://localhost:4000/api/user/getalluser', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
});

export const getRoles = createAsyncThunk('user/getRoles', async () => {

  const token = Cookies.get('token');
  const response = await axios.get('http://localhost:4000/api/role/get_roles', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
});

export const updateUser = createAsyncThunk('user/updateUser', async (updatedUserData, { dispatch, rejectWithValue }) => {

  const token = Cookies.get('token');
  if (!token) {
    return rejectWithValue('Unauthorized: Token not found.');
  }

  const decodedToken = jwtDecode(token);
  const userRoleId = decodedToken.role;

  try {
    // Check if the user is an admin
    const roleResponse = await axios.get(`http://localhost:4000/api/role/get_roles_byId?_id=${userRoleId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    const userRole = roleResponse.data.data.role;

    if (!['Admin'].includes(userRole)) {
      return rejectWithValue('Unauthorized: Only admins can update users.');
    }

    const response = await axios.patch(`http://localhost:4000/api/user/update_user?_id=${updatedUserData._id}`, updatedUserData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.status === true) {
      dispatch(updateUserSuccess(response.data.data));
    } else {
      throw new Error('User update failed');
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const { getAllUserSuccess, addUserSuccess, getRolesSuccess, deleteUserSuccess, updateUserSuccess } = userSlice.actions;
export default userSlice.reducer;
