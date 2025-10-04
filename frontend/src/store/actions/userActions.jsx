import axios from "../../api/axiosconfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

// NOTE: We standardize all auth thunks to return ONLY the user object (not wrapper objects)
// so reducers & components can rely on a single shape.

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/signup", credentials);
      // Expect backend to respond with { user: {...} } or the user directly.
      return data.user || data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials);
      return data.user || data; // normalize
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      // Missing leading slash previously; add it.
      const { data } = await axios.get("/api/auth/me");
      return data.user || data; // normalize
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unable to fetch user");
    }
  }
);

export const logOut = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/api/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);
