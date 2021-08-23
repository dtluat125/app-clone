import React, { useEffect, useRef, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import "../css/secondaryview.css";
import {
  enterDirectMessage,
  enterRoom,
  selectChosenUser,
  selectDirectMessageRoom,
  selectDocId,
  selectLocalTime,
  selectOnMainSave,
  selectOnOpenProfile,
  selectOnReplyInThread,
  selectOnSave,
  selectOnSendingReaction,
  selectRoomId,
  selectSavedItemsToggle,
  selectSecondaryWorkspaceStatus,
  selectThreadMessageDirectId,
  selectThreadMessageId,
  selectThreadMessageRoomId,
  selectUser,
  selectUserProfileUid,
  setOnMainSave,
  setOnOpenProfile,
  setOnReplyInThread,
  setOnSave,
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
import ChatInput from "./Chat/ChatInput";
import AspectRatioRoundedIcon from "@material-ui/icons/AspectRatioRounded";
function SecondaryView({ width, resize }) {
  const selectedUser = useSelector(selectChosenUser);
  const photoURL = selectedUser?.photoURL;
  const title = selectedUser?.displayName;
  const isOnline = selectedUser?.isOnline;
  const isOpen = useSelector(selectSecondaryWorkspaceStatus);
  const currentRoomId = useSelector(selectRoomId);
  const currentDirectId = useSelector(selectDirectMessageRoom);
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

  const [roomMessages] = useCollection(
    currentRoomId &&
      db.collection("room").doc(currentRoomId).collection("messages")
  );
  const [directRooms] = useCollection(db.collection("directRooms"));
  const [directMessages] = useCollection(
    currentDirectId &&
      db.collection("directRooms").doc(currentDirectId).collection("messages")
  );
  console.log(currentDirectId);
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
      setOnOpenProfile({
        onOpenProfile: null,
      })
    );
    dispatch(
      setOnReplyInThread({
        onReplyInThread: null,
      })
    );
    dispatch(
      setOnSave({
        onSave: null,
      })
    );
    console.log("close");
    const chatContainer = document.querySelector(".chat-container");
    chatContainer?.classList.remove("collapse");
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
  const onSendingReaction = useSelector(selectOnSendingReaction);
  let savedItemsArr = [];

  const getSavedMessages = () => {
    let arr = savedItemsInfo?.docs.map(async (doc) => {
      const messageId = doc.data().messageId;
      const roomId = doc.data().roomId;
      const roomDirectId = doc.data().roomDirectId;
      const replyTo = doc.data().replyTo;
      let messageRef = null;
      if (replyTo) {
        console.log("REPLY TO");
        if (roomId)
          messageRef = db
            .collection("room")
            .doc(roomId)
            .collection("messages")
            .doc(replyTo)
            .get();
        else if (roomDirectId)
          messageRef = db
            .collection("directRooms")
            .doc(roomDirectId)
            .collection("messages")
            .doc(replyTo)
            .get();
      } else if (roomId) {
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
  }, [savedItemsToggle, savedItemsInfo, roomMessages, directMessages]);

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
        let usersHaveRead = rooms?.docs
          .find((doc) => doc.id === infoRoomId)
          .data().usersHaveRead;
        if (!usersHaveRead) usersHaveRead = [];
        if (!usersHaveRead.includes(userInf.uid))
          usersHaveRead.push(userInf.uid);
        dispatch(
          enterDirectMessage({
            directMessageRoomId: null,
            directMessageUid: null,
          })
        );
        dispatch(
          enterRoom({
            roomId: infoRoomId,
          })
        );
        db.collection("room").doc(infoRoomId).update({
          usersHaveRead: usersHaveRead,
        });
      } else if (infoRoomDirectId) {
        console.log("DIrect");
        let usersHaveRead = directRooms?.docs
          .find((doc) => doc.id === infoRoomDirectId)
          .data().usersHaveRead;
        if (!usersHaveRead) usersHaveRead = [];
        if (!usersHaveRead.includes(userInf.uid))
          usersHaveRead.push(userInf.uid);
        dispatch(
          enterRoom({
            roomId: null,
          })
        );
        dispatch(
          enterDirectMessage({
            directMessageRoomId: infoRoomDirectId,
            directMessageUid: info.uid,
          })
        );
        db.collection("directRooms").doc(infoRoomDirectId).update({
          usersHaveRead: usersHaveRead,
        });
      }

      dispatch(setSavedItemId({ savedItemId: info.id }));
    }
  };
  console.log(currentRoomId);
  // Thread handle
  const onReplyInThread = useSelector(selectOnReplyInThread);
  const threadMessageId = useSelector(selectThreadMessageId);
  const threadMessageRoomId = useSelector(selectThreadMessageRoomId);
  const threadMessageDirectId = useSelector(selectThreadMessageDirectId);
  const [threadMessage, threadLoading] = useDocument(
    threadMessageId &&
      (threadMessageRoomId
        ? db
            .collection("room")
            .doc(threadMessageRoomId)
            .collection("messages")
            .doc(threadMessageId)
        : threadMessageDirectId
        ? db
            .collection("directRooms")
            .doc(threadMessageDirectId)
            .collection("messages")
            .doc(threadMessageId)
        : undefined)
  );

  const [subMessages] = useCollection(
    threadMessageId &&
      (threadMessageRoomId
        ? db
            .collection("room")
            .doc(threadMessageRoomId)
            .collection("messages")
            .doc(threadMessageId)
            .collection("subMessages")
            .orderBy("timestamp", "asc")
        : threadMessageDirectId
        ? db
            .collection("directRooms")
            .doc(threadMessageDirectId)
            .collection("messages")
            .doc(threadMessageId)
            .collection("subMessages")
            .orderBy("timestamp", "asc")
        : undefined)
  );
  const openProfile = useSelector(selectOnOpenProfile);
  const onSave = useSelector(selectOnSave);
  const [replyRoom] = useDocument(
    threadMessageId &&
      (threadMessageRoomId
        ? db.collection("room").doc(threadMessageRoomId)
        : threadMessageDirectId
        ? db.collection("directRooms").doc(threadMessageDirectId)
        : undefined)
  );
  const threadName =
    threadMessageId &&
    (threadMessageRoomId
      ? replyRoom?.data().name
      : threadMessageDirectId
      ? replyRoom?.data().users?.find((user) => {
          if (users[0] === users[1]) return user.uid === userInf.uid;
          else return userInf.uid !== user.uid;
        })?.displayName
      : undefined);
// Open main save page
const openSavePage = () => {
  dispatch(setOnMainSave({
    onMainSave: true
  }))
  closeWorkspace()
  dispatch(enterRoom({
    roomId: null
  }))
  dispatch(enterDirectMessage({
    directMessageRoomId: null,
    directMessageUid: null
  }))

  
}
const onMainSave = useSelector(selectOnMainSave)
  return (
    <div
      className={
        (isOpen&&!(onSave&&onMainSave)) ? "secondary-view-container active" : "secondary-view-container"
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
            top:
              position.positionInfo.y - 442 > 33
                ? position.positionInfo.y - 442
                : 33,
            zIndex: 99,
          }}
        >
          <Picker onSelect={addEmoji} />
        </span>
      )}
      <div className="secondary-view__header">
        <div className="secondary-view__header__left">
          <div className="secondary-view__header__left__inner">
            <span className="secondary-view__mode-name">
              {openProfile
                ? "Profile"
                : onReplyInThread
                ? "Thread"
                : "Saved items"}
            </span>
            {onReplyInThread && (
              <span className="thread-name">{threadName}</span>
            )}
          </div>
        </div>
        <div className="secondary-view__header__right">
          {onSave && (
            <button className="c-button-unstyled close-button" title="Move to main page" onClick={openSavePage}>
              <AspectRatioRoundedIcon />
            </button>
          )}
          <button
            className="c-button-unstyled close-button"
            onClick={closeWorkspace}
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {openProfile && (
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

      {onSave && (
        <div className="secondary-view__body saved-mode">
          {itemsLoading ? (
            <SmallLoader />
          ) : (
            <>
              {savedMessages?.map((doc) => {
                let savedMessageInfo = savedItemsInfo?.docs.find((docc) => {
                  if (docc.data().replyTo)
                    return docc.data().replyTo === doc.id;
                  else return docc.data().messageId === doc.id;
                });
                let name = "";
                let info = {};

                if (savedMessageInfo?.data().roomId) {
                  name = rooms?.docs
                    .find((doc) => doc.id === savedMessageInfo.data().roomId)
                    .data().name;
                  info.savedMessageInfo = savedMessageInfo.data();
                }
                if (savedMessageInfo?.data().roomDirectId) {
                  name = "Direct message";
                  info.savedMessageInfo = savedMessageInfo.data();
                }
                if (savedMessageInfo?.data().replyTo) {
                  console.log("ALOOO ", name);
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
                      <div className="saved-message__header">{name}</div>
                      <Message
                        moveToItem={() => moveToMessage(info)}
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

      {onReplyInThread && (
        <div className="secondary-view__body">
          {threadLoading || !threadMessage ? (
            <SmallLoader />
          ) : (
            <>
              <div className="thread-message__container">
                {threadMessage && (
                  <div className="c-thread-message">
                    <Message
                      emojiMartPosition={position}
                      onClick={openEmojiMart}
                      key={threadMessageId}
                      message={threadMessage.data()?.message}
                      timestamp={threadMessage.data()?.timestamp}
                      userName={threadMessage.data()?.user}
                      userImage={threadMessage.data()?.userImage}
                      uid={threadMessage.data()?.uid}
                      savedBy={threadMessage.data()?.savedBy}
                      emojiReact={emojiReact}
                      reactToggle={reactToggle}
                      label=""
                      width={width}
                      id={threadMessageId}
                      reactions={threadMessage.data()?.reactions}
                      inThread={true}
                    />
                  </div>
                )}
                {subMessages?.docs.length > 0 && (
                  <div className="c-thread__seperator">
                    <div className="c-thread__seperator__inner">
                      <span className="c-thread__seperator__count">
                        {subMessages?.docs.length > 1
                          ? subMessages?.docs.length + " replies"
                          : subMessages?.docs.length + " reply"}
                      </span>
                      <hr className="c-thread__seperator__line" />
                    </div>
                  </div>
                )}
                {subMessages?.docs.map((subMessage) => {
                  const {
                    message,
                    timestamp,
                    user,
                    userImage,
                    uid,
                    savedBy,
                    reactions,
                  } = subMessage.data();
                  return (
                    <Message
                      emojiMartPosition={position}
                      onClick={openEmojiMart}
                      key={subMessage.id}
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
                      id={subMessage.id}
                      reactions={reactions}
                      replyTo={threadMessageId}
                    />
                  );
                })}
                <ChatInput inThread={true} threadMessageId={threadMessageId} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SecondaryView;
