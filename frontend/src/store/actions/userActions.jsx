import axios from "../../api/axiosconfig";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const registerUser = createAsyncThunk("user/registerUser",async(credentials,{rejectWithValue})=>{
    try {
        const {data} = await axios.post("/api/auth/signup",credentials);
        
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})


export const loginUser = createAsyncThunk('user/loginUser',async(credentials,{rejectWithValue})=>{

    try {
        const{data} = await axios.post('/api/auth/login',credentials)
        return data
        
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})


export const fetchUser = createAsyncThunk('user/fetchUser',async(_,{rejectWithValue})=>{
    try {
      const {data} = await axios.get('api/auth/me') 
      return(data.user);
      
    } catch (error) {
       return rejectWithValue(error.response?.data?.message)
    }
})