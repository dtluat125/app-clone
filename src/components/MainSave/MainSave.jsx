import React, { useEffect, useRef, useState } from "react";
import InputIcon from "@material-ui/icons/Input";
import { useDispatch, useSelector } from "react-redux";
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
} from "../../features/appSlice";
import DehazeIcon from "@material-ui/icons/Dehaze";
import { db } from "../../firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Message from "../Chat/Message";
import SmallLoader from "../SmallLoader";
import "../../css/mainsave.css";
function MainSave() {
  const selectedUser = useSelector(selectChosenUser);
  const photoURL = selectedUser?.photoURL;
  const title = selectedUser?.displayName;
  const isOnline = selectedUser?.isOnline;
  const isOpen = useSelector(selectSecondaryWorkspaceStatus);
  const currentRoomId = useSelector(selectRoomId);
  const currentDirectId = useSelector(selectDirectMessageRoom);
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
  const dispatch = useDispatch();
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
  const gotoSavedItems = () => {
    dispatch(
      showSecondaryWorkspace({
        isShowingSecondaryWorkspace: true,
      })
    );
    dispatch(
      setOnSave({
        onSave: true,
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
  };

  const changeMode = () => {
    dispatch(
      setOnMainSave({
        onMainSave: null,
      })
    );
    gotoSavedItems();
  };
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
      dispatch(
        setOnMainSave({
          onMainSave: null,
        })
      );
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

  const onMainSave = useSelector(selectOnMainSave);
  //   responsive
  const isSecondaryWorkspaceOpen = useSelector(selectSecondaryWorkspaceStatus);
  const [collapse, setCollapse] = useState(true);
  useEffect(() => {
    console.log("On load");
    const chatContainer = document.querySelector(".main-save-container");
    const sidebarContainer = document.querySelector(".side-bar-container");
    const sidebarToggler = document.querySelector(
      ".sidebar-toggle-button.c-button-unstyled"
    );

    const secondaryWorkspace = document.querySelector(
      ".secondary-view-container"
    );

    const reportWindowSize = () => {
      const windowWidth = window.innerWidth;
      const chatWidth = chatContainer?.offsetWidth;
      if (
        chatWidth < 400 &&
        !sidebarContainer?.classList.contains("sidebar-collapse")
      ) {
        sidebarContainer?.classList.add("sidebar-collapse");
        setCollapse(false);
        console.log("3");

        if (windowWidth < 706) {
          sidebarContainer?.classList.add("sidebar-collapse");
          setCollapse(false);
          chatContainer?.classList.remove("collapse");
          console.log("1");
          if (windowWidth <= 576 && isSecondaryWorkspaceOpen) {
            chatContainer?.classList.add("collapse");
            secondaryWorkspace?.classList.add("fill");
            console.log("2");
          }
          if (!isSecondaryWorkspaceOpen) {
            chatContainer?.classList.remove("collapse");
            console.log("3");
          }
        }
      } else if (
        chatWidth >= 600 &&
        sidebarContainer?.classList.contains("sidebar-collapse")
      ) {
        sidebarContainer?.classList.remove("sidebar-collapse");
        console.log(sidebarToggler);
        setCollapse(true);
        console.log("4");
      }

      // Collapse handler
      const sidebarCollapse = document.querySelector(".sidebar-collapse");
      const closeSidebar = () => {
        sidebarCollapse?.classList.remove("sidebar-float");
      };
      chatContainer?.addEventListener("click", closeSidebar);
      secondaryWorkspace?.addEventListener("click", closeSidebar);
    };

    reportWindowSize();
    window.addEventListener("resize", reportWindowSize);
  });
  const openSidebar = () => {
    let sidebarContainer = document.querySelector(".side-bar-container");
    sidebarContainer?.classList.add("sidebar-float");
  };
  return (
    <div className="main-save-container">
      <div className="main-save__header">
        <div className="main-save__header__text">
          <div className="main-save__header__title">
            <div
              onClick={openSidebar}
              className={
                collapse
                  ? "sidebar-toggle-button c-button-unstyled chat__header__left__button collapse"
                  : "sidebar-toggle-button c-button-unstyled chat__header__left__button "
              }
            >
              <span>
                <DehazeIcon />
              </span>
            </div>
            <span>Saved items</span>
          </div>
          <div
            role="button"
            className="main-save__header__change-mode"
            onClick={changeMode}
          >
            <InputIcon />
          </div>
        </div>
      </div>
      <div className="main-save__body">
        {itemsLoading ? (
          <SmallLoader />
        ) : (
          <>

            {savedMessages?.map((doc) => {
              let savedMessageInfo = savedItemsInfo?.docs.find((docc) => {
                if (docc.data().replyTo) return docc.data().replyTo === doc.id;
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
                  <div className="main-save__item-container">
                    <div
                      className="main-save__item__inner"
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
                        id={doc.id}
                        reactions={reactions}
                        inMainSave={true}
                      />
                    </div>
                  </div>
                );
              }
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default MainSave;
