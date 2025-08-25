import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
};

const chatsSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadChats: (state, action) => {
      state.chats = action.payload;
    },
    clearChats: (state) => {
      state.chats = [];
    },
  },
});

export default chatsSlice.reducer;
export const { loadChats, clearChats } = chatsSlice.actions;
