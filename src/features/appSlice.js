import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState:{
        roomId: null,
        user: null,
        docUserId: null,
        dataUpdated: null,
        userUid: null,
        directMessageUid: null,
        isShowingSecondaryWorkspace: null,
        directMessageRoomId: null,
        selectedUser: null,
        messageSend: false,
        localTime: null,
        roomDetails: null,
        directUser: null,
        isModalOpen: null,
        moves: []
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
            state.dataUpdated = action.payload.initState;
            state.userUid = action.payload.initState;
            state.directMessageUid= action.payload.initState;
            state.isShowingSecondaryWorkspace = action.payload.initState;
            state.docUserId = action.payload.initState;
            state.directMessageRoomId = action.payload.initState;
            state.selectedUser = null;
            state.localTime = null;
            state.roomDetails = null;
            state.directUser = null;
            state.isModalOpen = null;
            state.moves = [];

        },
        getDataState: (state, action) => {
            state.dataUpdated = action.payload.dataUpdated;
        },
        enterDirectMessage: (state, action) => {
            state.directMessageUid = action.payload.directMessageUid;
            state.directMessageRoomId = action.payload.directMessageRoomId;
        },
        setUserProfileUid:(state, action) => {
            state.userUid = action.payload.userUid;
        },
        showSecondaryWorkspace:(state, action) => {
            state.isShowingSecondaryWorkspace = action.payload.isShowingSecondaryWorkspace;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload.selectedUser
        },
        sendMessage :(state, action) => {
            state.messageSend = action.payload.messageSend;
        },
        setTime: (state, action) => {
            state.localTime = action.payload.localTime;
        },
        setRoomDetails: (state, action) => {
            state.roomDetails = action.payload.roomDetails;
        },
        setDirectUser: (state, action) => {
            state.directUser = action.payload.directUser
        },
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload.isModalOpen
        },
        setMoves: (state, action) => {
            state.moves = action.payload.moves
        }
     }
});

export const {setMoves, setIsModalOpen, setDirectUser, setRoomDetails, setTime, sendMessage, setSelectedUser, showSecondaryWorkspace,enterRoom, saveUserInfo, docUserId, reset, getDataState, enterDirectMessage, setUserProfileUid} = appSlice.actions;

export const selectRoomId = state => state.app.roomId;

export const selectUser = state => state.app.user;

export const selectDocId = state => state.app.docUserId;

export const selectDataState = state => state.app.dataUpdated;

export const selectUserDirect = state => state.app.directMessageUid;

export const selectUserProfileUid = state => state.app.userUid; 

export const selectSecondaryWorkspaceStatus = state => state.app.isShowingSecondaryWorkspace;

export const selectDirectMessageRoom = state => state.app.directMessageRoomId

export const selectChosenUser = state => state.app.selectedUser

export const selectMessageSend = state => state.app.messageSend

export const selectLocalTime = state => state.app.localTime

export const selectRoomDetails = state => state.app.roomDetails

export const selectDirectUser = state => state.app.directUser

export const selectModalState = state => state.app.isModalOpen

export const selectMoves = state => state.app.moves
export default appSlice.reducer;