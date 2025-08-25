import axios from "../../api/axiosconfig";
import { loadChats } from "../reducers/chatsSlice";

export const addChat = (chatName) => async (dispatch) => {
  const { data } = await axios.post("/api/chat",{title:chatName});
 dispatch(getChats())
};

export const getChats = () => async (dispatch) => {
  const { data } = await axios.get("/api/chat");
  dispatch(loadChats(data));
};
