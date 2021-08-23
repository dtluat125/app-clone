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
        moves: [],
        savedItemsToggle: false,
        savedItemId: null,
        onSendingReaction: false,
        onReplyInThread: null,
        threadMessageId: null,
        threadMessageRoomId: null,
        threadMessageDirectId: null,
        onOpenProfile: null,
        onSave: null,
        onMainSave: null,
    },
    reducers: {
        setOnMainSave: (state, action) => {
            state.onMainSave = action.payload.onMainSave
        },
        setOnSave: (state, action) => {
            state.onSave = action.payload.onSave
        },
        setOnOpenProfile: (state, action) => {
            state.onOpenProfile = action.payload.onOpenProfile;
        },
        setThreadMessageRoomId: (state, action) => {
            state.threadMessageRoomId = action.payload.threadMessageRoomId
        },
        setThreadMessageDirectId: (state, action) => {
            state.threadMessageDirectId = action.payload.threadMessageDirectId
        },
        setThreadMessageId: (state, action) => {
            state.threadMessageId = action.payload.threadMessageId
        },
        setOnReplyInThread: (state, action) => {
            state.onReplyInThread = action.payload.onReplyInThread
        },
        setOnSendingReaction: (state, action) => {
            state.onSendingReaction = action.payload.onSendingReaction
        },
        setSavedItemId: (state, action) => {
            state.savedItemId = action.payload.savedItemId
        },
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
            state.savedItemsToggle = false;
            state.isOnline = false

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
        },
        setSavedItemsToggle: (state, action) => {
            state.savedItemsToggle = action.payload.savedItemsToggle;
        }
     }
});

export const {setOnMainSave, setOnSave, setOnOpenProfile,setThreadMessageRoomId, setThreadMessageDirectId,setThreadMessageId, setOnReplyInThread,setOnSendingReaction,setSavedItemId,setSavedItemsToggle,setMoves, setIsModalOpen, setDirectUser, setRoomDetails, setTime, sendMessage, setSelectedUser, showSecondaryWorkspace,enterRoom, saveUserInfo, docUserId, reset, getDataState, enterDirectMessage, setUserProfileUid} = appSlice.actions;

export const selectOnMainSave = state => state.app.onMainSave;

export const selectOnSave = state => state.app.onSave;

export const selectOnOpenProfile = state => state.app.onOpenProfile;

export const selectThreadMessageRoomId = state => state.app.threadMessageRoomId;

export const selectThreadMessageDirectId = state => state.app.threadMessageDirectId;

export const selectThreadMessageId = state => state.app.threadMessageId;

export const selectOnReplyInThread = state => state.app.onReplyInThread;

export const selectSavedItemsToggle = state => state.app.savedItemsToggle;

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

export const selectSavedItemId = state => state.app.savedItemId

export const selectOnSendingReaction = state => state.app.savedItemId
export default appSlice.reducer;