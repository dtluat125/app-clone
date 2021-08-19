import React, { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import "../css/secondaryview.css";
import {
  enterDirectMessage,
  enterRoom,
  selectChosenUser,
  selectDocId,
  selectLocalTime,
  selectSavedItemsToggle,
  selectSecondaryWorkspaceStatus,
  selectUser,
  selectUserProfileUid,
  setSavedItemId,
  setSelectedUser,
  setUserProfileUid,
  showSecondaryWorkspace,
} from "../features/appSlice";
import { db } from "../firebase";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CloseIcon from "@material-ui/icons/Close";
import Message from "./Chat/Message";
import { Picker } from "emoji-mart";
import SmallLoader from "./SmallLoader";
function SecondaryView({ width, resize }) {
  const selectedUser = useSelector(selectChosenUser);
  const photoURL = selectedUser?.photoURL;
  const title = selectedUser?.displayName;
  const isOnline = selectedUser?.isOnline;
  const isOpen = useSelector(selectSecondaryWorkspaceStatus);
  const dispatch = useDispatch();
  const userInf = useSelector(selectUser);
  const job = selectedUser?.whatIDo;
  const localTime = useSelector(selectLocalTime);
  const ref = useRef(null);
  const docUserId = useSelector(selectDocId);
  const [emojiReact, setEmojiReact] = useState("");
  const [reactToggle, setReactToggle] = useState(false);
  const [position, setPosition] = useState(null);
  const [users, usersLoading] = useCollection(db.collection("users"));
  const savedItemsToggle = useSelector(selectSavedItemsToggle);
  const [rooms] = useCollection(db.collection("room"));
  const [directRooms] = useCollection(db.collection("directRooms"))
  const [savedItemsInfo, itemsLoading] = useCollection(
    docUserId &&
      db
        .collection("users")
        .doc(docUserId)
        .collection("savedItems")
        .orderBy("timestamp", "desc")
  );
  const closeWorkspace = () => {
    dispatch(
      showSecondaryWorkspace({
        isShowingSecondaryWorkspace: false,
      })
    );
    dispatch(
      setUserProfileUid({
        userUid: null,
      })
    );

    console.log("close");
  };
  // Get toggle state
  console.log(savedItemsToggle);
  //Close emoji mart
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setPosition(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  // Open emoji mart
  const openEmojiMart = (position) => {
    setPosition(position);
    console.log(position);
  };
  const [savedMessages, setSavedMessages] = useState(null);

  const [savedMessageLoading, setSaveMessageLoading] = useState(false);
  // Get saved Items
  let savedItemsArr = [];
  const getSavedMessages = () => {
    let arr = savedItemsInfo?.docs.map(async (doc) => {
      const messageId = doc.data().messageId;
      const roomId = doc.data().roomId;
      const roomDirectId = doc.data().roomDirectId;
      let messageRef = null;
      if (roomId) {
        messageRef = db
          .collection("room")
          .doc(roomId)
          .collection("messages")
          .doc(messageId)
          .get();
      } else if (roomDirectId && messageId) {
        messageRef = db
          .collection("directRooms")
          .doc(roomDirectId)
          .collection("messages")
          .doc(messageId)
          .get();
      }
      // const { message, timestamp, user, userImage, uid, savedBy } =
      //   messageRef.data();
      // const time = new Date(timestamp?.toDate());
      // var date = time.getDate();
      // var year = time.getFullYear();
      // var month = time.getMonth();
      // var hours = time.getHours();
      // var minutes = time.getMinutes();
      // if (minutes < 10) {
      //   minutes = "0" + minutes;
      // }
      return messageRef;
    });
    return arr;
  };
  useEffect(async () => {
    console.log("Toggle");
    let arr = getSavedMessages();
    console.log(arr);
    let newArr = [];
    if (arr) {
      newArr = Promise.all(arr);
      newArr.then((values) => setSavedMessages(values));
      console.log(savedMessages);
    }
  }, [savedItemsToggle, savedItemsInfo]);

  // useEffect(() => {
  //   if (savedItemsInfo && !itemsLoading) {
  //     getSavedMessages();
  //     console.log(savedMessages)
  //   }
  // }, [isOpen]);

  const addEmoji = (e) => {
    let emoji = e.native;
    setEmojiReact(emoji);
    setReactToggle(!reactToggle);
  };


  // Move to message
  
  const moveToMessage = (info) => {
    if (info.savedMessageInfo) {
      
      let infoRoomId = info.savedMessageInfo.roomId;
      let infoRoomDirectId = info.savedMessageInfo.roomDirectId;
      if (infoRoomId) {
        let usersHaveRead = rooms?.docs.find(doc => doc.id === infoRoomId).data().usersHaveRead;
        if(!usersHaveRead) usersHaveRead = [];
        if(!usersHaveRead.includes(userInf.uid)) usersHaveRead.push(userInf.uid);
        dispatch(
          enterDirectMessage({
            directMessageRoomId: null,
            directMessageUid: null
          })
        );
        dispatch(
          enterRoom({
            roomId: infoRoomId,
          })
        );
        db.collection("room")
        .doc(infoRoomId)
        .update({
          usersHaveRead: usersHaveRead 
        });
      } else if (infoRoomDirectId) {
        console.log("DIrect")
        let usersHaveRead = directRooms?.docs.find(doc => doc.id === infoRoomDirectId).data().usersHaveRead;
        if(!usersHaveRead) usersHaveRead = [];
        if(!usersHaveRead.includes(userInf.uid)) usersHaveRead.push(userInf.uid);
        dispatch(
          enterRoom({
            roomId: null,
          })
        );
        dispatch(
          enterDirectMessage({
            directMessageRoomId: infoRoomDirectId,
            directMessageUid: info.uid
          })
        );
        db.collection("directRooms")
        .doc(infoRoomDirectId)
        .update({
          usersHaveRead: usersHaveRead 
        });
      }
      
      dispatch(setSavedItemId({savedItemId: info.id}))
    }
  };
  return (
    <div
      className={
        isOpen ? "secondary-view-container active" : "secondary-view-container"
      }
      style={{ width: width }}
    >
      {position && (
        <span
          ref={ref}
          className="emojis-container-moving"
          style={{
            position: "fixed",
            right: window.innerWidth - position.positionInfo.right + 18,
            top: (position.positionInfo.y-442)>33?(position.positionInfo.y-442):33,
            zIndex: 99,
          }}
        >
          <Picker onSelect={addEmoji} />
        </span>
      )}
      <div className="secondary-view__header">
        <div className="secondary-view__header__left">
          <span>{selectedUser ? "Profile" : "Saved items"}</span>
        </div>
        <div className="secondary-view__header__right">
          <button
            className="c-button-unstyled close-button"
            onClick={closeWorkspace}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {selectedUser && (
        <div className="secondary-view__body">
          <div className="secondary-view__body__inner">
            <div className="member-profile__avatar-container">
              <img src={photoURL} alt="" />
            </div>
            <div className="member-profile__name">
              <div className="member-profile__name-title">{title}</div>
              <div className="member-profile__status">
                <FiberManualRecordIcon
                  className={!isOnline ? "status offline" : "status online"}
                />
              </div>
            </div>

            <button
              data-bs-toggle={
                userInf?.uid === selectedUser?.uid ? "modal" : "false"
              }
              data-bs-target="#editProfile"
              className="c-button-unstyled link-button"
              style={{ color: `rgba(18,100,163,1)`, fontWeight: "700" }}
            >
              {job ? job : "Add a job"}
            </button>

            <div className="member-profile__fields">
              <div className="member-profile__field">
                <div className="member-profile__field__label">Display name</div>
                <div className="member-profile__field__value">
                  {selectedUser?.displayName}
                </div>
              </div>
              <div className="member-profile__field">
                <div className="member-profile__field__label">What I do</div>
                <div className="member-profile__field__value">
                  {selectedUser?.whatIDo}
                </div>
              </div>
              <div className="member-profile__field">
                <div className="member-profile__field__label">Local time</div>
                <div className="member-profile__field__value">{localTime}</div>
              </div>
              <div className="member-profile__field">
                <div className="member-profile__field__label">
                  Email address
                </div>
                <div className="member-profile__field__value">
                  {selectedUser?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="secondary-view__body">
          {itemsLoading ? (
            <SmallLoader />
          ) : (
            <>
              {savedMessages?.map((doc) => {
                let savedMessageInfo = savedItemsInfo?.docs.find((docc) => {
                  return docc.data().messageId === doc.id;
                });
                let name = "";
                let info = {}
                if (savedMessageInfo?.data().roomId) {
                  name = rooms?.docs
                    .find((doc) => doc.id === savedMessageInfo.data().roomId)
                    .data().name;
                    info.savedMessageInfo = savedMessageInfo.data()
                }
                if (savedMessageInfo?.data().roomDirectId) {
                  name = "Direct message";
                  info.savedMessageInfo = savedMessageInfo.data()
                } 
                if (doc.data()) {
                  const {
                    message,
                    timestamp,
                    user,
                    userImage,
                    uid,
                    savedBy,
                    reactions,
                  } = doc.data();
                  console.log("Alo");
                  info.uid = uid;
                  info.id = doc.id;
                  return (
                    <div
                      className="saved-message-button"
                      role="button"
                      onClick={() => moveToMessage(info)}
                      
                    >
                      <div className="saved-message__header" >{name}</div>
                      <Message
                        moveToItem = {() => moveToMessage(info)}
                        emojiMartPosition={position}
                        onClick={openEmojiMart}
                        key={doc.id}
                        message={message}
                        timestamp={timestamp}
                        userName={user}
                        userImage={userImage}
                        uid={uid}
                        savedBy={savedBy}
                        emojiReact={emojiReact}
                        reactToggle={reactToggle}
                        label=""
                        width={width}
                        id={doc.id}
                        reactions={reactions}
                        isSaved={true}
                      />
                    </div>
                  );
                }
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SecondaryView;
