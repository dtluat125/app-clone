import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState:{
        roomId: null,
        user: null,
        docUserId: null
    },
    reducers: {
        enterRoom: (state, action) =>{
            state.roomId = action.payload.roomId;
        },

        saveUserInfo: (state, action) => {
            state.user = action.payload.user;
        },

        docUserId: (state, action) => {
            state.docUserId = action.payload.docUserId
        },

        reset: (state, action) => {
            state.roomId = action.payload.initState;
            state.user = action.payload.initState;
        }
     }
});

export const {enterRoom, saveUserInfo, docUserId, reset} = appSlice.actions;

export const selectRoomId = state => state.app.roomId;

export const selectUser = state => state.app.user;

export const selectDocId = state => state.app.docUserId;

export default appSlice.reducer;