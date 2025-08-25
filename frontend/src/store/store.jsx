import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./reducers/userSlice"
import chatsSlice from "./reducers/chatsSlice"
import messageSlice from "./reducers/messageSlice"


export const store = configureStore({

    reducer : {
        user : userSlice,
        chat : chatsSlice,
        message : messageSlice
    }
})