import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    loadMessage: (state, action) => {
      state.message = action.payload;
    },
    addUserMessage: (state, action) => {
      state.message.push(action.payload);
    },

    addAiMessage: (state, action) => {
      state.message.push(action.payload);
    },
    clearMessages: (state) => {
      state.message = [];
    }
  },
});

export const { loadMessage, addUserMessage,addAiMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
