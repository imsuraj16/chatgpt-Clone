import { get } from "react-hook-form";
import axios from "../../api/axiosconfig";
import { loadUser, logout } from "../reducers/userSlice";
import { getChats } from "./chatActions";
import { clearChats } from "../reducers/chatsSlice";

export const registerUser = (userData) => async (dispatch) => {
    try {
        const { data } = await axios.post('/api/auth/signup', userData);
        dispatch(loadUser(data.user));
    } catch (error) {
        console.error("Registration failed", error.response.data);
        // You might want to dispatch an error action here
        // to show an error message in the UI.
    }
};

export const loginUser = (credentials) => async (dispatch) => {
    try {
        const { data } = await axios.post('/api/auth/login', credentials);
        dispatch(loadUser(data.user));
        dispatch(getChats())
    } catch (error) {
        console.error("Login failed", error.response.data);
        // You might want to dispatch an error action here.
    }
};

export const getUser = () => async (dispatch) => {
    try {
        const { data } = await axios.get('/api/auth/me');
        dispatch(loadUser(data.user));
    } catch (error) {
        // This can fail if the cookie/token is invalid or expired.
        // It's often not considered a critical error to show to the user
        // unless you want to force a re-login.
        console.error("Failed to get user", error.response?.data);
    }
};


export const logoutUser = () => async (dispatch) => {

    await axios.get('/api/auth/logout');
    dispatch(logout());
    dispatch(clearChats());
};
