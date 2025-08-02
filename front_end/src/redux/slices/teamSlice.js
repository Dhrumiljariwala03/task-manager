import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  team: [],
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    getAllteamDataSuccess: (state, action) => {
      state.team = action.payload;
    }
  }
});

export const getAllTeams = createAsyncThunk(
  "team/getAllTeams",
  async () => {
    const response = await axios.get("http://localhost:4000/api/team/getallteams");
    return response.data.data;
  }
);

export const { getAllteamDataSuccess } = teamSlice.actions;
export default teamSlice.reducer;
