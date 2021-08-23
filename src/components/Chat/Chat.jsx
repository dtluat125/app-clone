import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/chat.css";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import {
  enterDirectMessage,
  enterRoom,
  selectChosenUser,
  selectDirectMessageRoom,
  selectOnMainSave,
  selectOnSendingReaction,
  selectRoomId,
  selectSavedItemId,
  selectSecondaryWorkspaceStatus,
  selectUser,
  selectUserDirect,
  setDirectUser,
  setRoomDetails,
  setSavedItemId,
  setUserProfileUid,
  showSecondaryWorkspace,
} from "../../features/appSlice";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import ChatInput from "./ChatInput";
import Message from "./Message";
import SmallLoader from "../SmallLoader";
import DayBlockMessages from "./DayBlockMessages";
import firebase from "firebase";
import DehazeIcon from "@material-ui/icons/Dehaze";
import Emojify from "react-emojione";
import { Picker } from "emoji-mart";

function Chat(props) {
  const dispatch = useDispatch();
  const chatRef = useRef(null);
  const user = useSelector(selectUser);
  const defaultRoomId = "A86N0fmTCy8fTd4NS0Ne";
  // Room message
  const roomId = useSelector(selectRoomId);
  const directMessageUid = useSelector(selectUserDirect);
  const [emojiReact, setEmojiReact] = useState("");
  const [reactToggle, setReactToggle] = useState(false);
  if (!roomId && !directMessageUid) {
    dispatch(
      enterRoom({
        roomId: defaultRoomId,
      })
    );
  }
  const [roomDetails, roomLoading] = useCollection(
    roomId && db.collection("room").doc(roomId)
  );

  const [roomMessages, loading] = useCollection(
    roomId &&
      db
        .collection("room")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
  );

  // Open emoji mart
  const [position, setPosition] = useState(null);
  const openEmojiMart = (position) => {
    setPosition(position);
    console.log(position);
  };
  //Close emoji mart
  const ref = useRef(null);
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
  // Add react

  const addEmoji = (e) => {
    let emoji = e.native;
    setEmojiReact(emoji);
    setReactToggle(!reactToggle);
  };
  // Direct message
  const roomDirectId = useSelector(selectDirectMessageRoom);
  const [users, usersLoading] = useCollection(db.collection("users"));
  const directUser = users?.docs.find(
    (doc) => doc.data().uid === directMessageUid
  );
  const [roomDirectMessages, directLoading] = useCollection(
    roomDirectId &&
      db
        .collection("directRooms")
        .doc(roomDirectId)
        .collection("messages")
        .orderBy("timestamp", "asc")
  );
  const directTitle = directUser?.data()?.displayName
    ? directUser?.data().displayName
    : directUser?.data().email;
  const directImg = directUser?.data()?.photoURL;
  const directStatus = directUser?.data()?.isOnline;
  //
  // Open profile
  // Scroll to saved message
  const savedRef = useRef(null);
  const savedItemId = useSelector(selectSavedItemId);
  const onSendingReaction = useSelector(selectOnSendingReaction);
  // Scroll

  useEffect(() => {
    console.log(savedItemId);
    if (
      (roomMessages || roomDirectMessages) &&
      !savedItemId &&
      !onSendingReaction
    ) {
      console.log("SCROLLL");
      chatRef?.current?.scrollIntoView({
        behavior: "smooth",
      });
      setTimeout(() => {
        chatRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 500);
    }
  }, [
    roomMessages?.docs.length,
    roomDirectMessages?.docs.length,
    roomLoading,
    directLoading,
  ]);
  //   Create block message
  const blocksMessage = {};
  roomId
    ? roomMessages?.docs.map((doc) => {
        const { message, timestamp, user, userImage, uid, savedBy } =
          doc.data();
        const time = new Date(timestamp?.toDate());
        var date = time.getDate();
        var year = time.getFullYear();
        var month = time.getMonth();
        var config = date + ":" + month + ":" + year;
        var hours = time.getHours();
        var minutes = time.getMinutes();
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (!blocksMessage[config]) blocksMessage[config] = [];
        if (!blocksMessage[config].time)
          blocksMessage[config]["time"] = {
            date: date,
            year: year,
            month: month,
          };
        blocksMessage[config]["timestamp"] = timestamp;
        blocksMessage[config].push(
          <Message
            ref={doc.id === savedItemId ? savedRef : null}
            emojiMartPosition={position}
            onClick={openEmojiMart}
            key={doc.id}
            id={doc.id}
            message={message}
            timestamp={timestamp}
            userName={user}
            userImage={userImage}
            uid={uid}
            reactions={doc.data().reactions}
            isDirect={false}
            emojiReact={emojiReact}
            reactToggle={reactToggle}
            savedBy={savedBy}
            messageRoomId = {roomId}
          />
        );
      })
    : roomDirectMessages?.docs.map((doc) => {
        const { message, timestamp, user, userImage, uid, savedBy } =
          doc.data();
        const time = new Date(timestamp?.toDate());
        var date = time.getDate();
        var year = time.getFullYear();
        var month = time.getMonth();
        var config = date + ":" + month + ":" + year;
        var hours = time.getHours();
        var minutes = time.getMinutes();
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (!blocksMessage[config]) blocksMessage[config] = [];
        if (!blocksMessage[config].time) {
          blocksMessage[config]["time"] = {
            date: date,
            year: year,
            month: month,
          };
        }
        blocksMessage[config]["timestamp"] = timestamp;
        blocksMessage[config].push(
          <Message
            ref={doc.id === savedItemId ? savedRef : null}
            emojiMartPosition={position}
            onClick={openEmojiMart}
            key={doc.id}
            message={message}
            timestamp={timestamp}
            userName={user}
            userImage={userImage}
            uid={uid}
            isDirect={true}
            emojiReact={emojiReact}
            reactToggle={reactToggle}
            savedBy={savedBy}
            reactions={doc.data().reactions}
            id={doc.id}
            messageRoomDirectId = {roomDirectId}
          />
        );
      });
  const blocksMessageArr = Object.entries(blocksMessage);
  // Save room info
  useEffect(() => {
    if (!roomLoading) {
      dispatch(setRoomDetails({ roomDetails: roomDetails?.data() }));
    }
  }, [roomId, roomDetails]);
  // Save user direct info
  useEffect(() => {
    if (!usersLoading) {
      dispatch(
        setDirectUser({
          directUser: directUser?.data(),
        })
      );
    }
  }, [roomDirectId]);
  // Input preveiew
  const members = roomDetails?.data()?.members;
  const membersArr = members?.slice();
  const [join, setJoin] = useState(false);
  const joinChat = () => {
    setJoin(true);
  };

  useEffect(() => {
    if (join && !roomLoading) {
      let membersArr = members?.slice();
      if (!membersArr) membersArr = [];
      membersArr.push(user.uid);
      console.log(membersArr);
      db.collection("room")
        .doc(roomId)
        .update({
          members: membersArr,
        })
        .then(() => {
          let input = `joined #${roomDetails.data().name}.`;
          db.collection("room").doc(roomId).collection("messages").add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user.displayName,
            userImage: user.photoURL,
            uid: user.uid,
          });
        });
    }
    return () => {
      setJoin(false);
    };
  }, [join, roomLoading]);
  // Toggler for sidebar
  const openSidebar = () => {
    let sidebarContainer = document.querySelector(".side-bar-container");
    sidebarContainer?.classList.add("sidebar-float");
  };

  // Handle mobile view
  let windowWidth;
  let chatWidth;
  const isSecondaryWorkspaceOpen = useSelector(selectSecondaryWorkspaceStatus);
  const [collapse, setCollapse] = useState("false");
  useEffect(() => {
    console.log("On load");
    const chatContainer = document.querySelector(".chat-container");
    const sidebarContainer = document.querySelector(".side-bar-container");
    const sidebarToggler = document.querySelector(
      ".sidebar-toggle-button.c-button-unstyled"
    );

    const secondaryWorkspace = document.querySelector(
      ".secondary-view-container"
    );

    const reportWindowSize = () => {
      windowWidth = window.innerWidth;
      chatWidth = chatContainer.offsetWidth;
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
            secondaryWorkspace?.classList.add("fill")
            console.log("2");
          }
          if (!isSecondaryWorkspaceOpen) {
            chatContainer?.classList.remove("collapse");
            console.log(3);
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
      chatContainer.addEventListener("click", closeSidebar);
      secondaryWorkspace.addEventListener("click", closeSidebar);
    };

    reportWindowSize();
    window.addEventListener("resize", reportWindowSize);
  },);

  //
  console.log(position);
// Save main page
const onMainSave = useSelector(selectOnMainSave);
 
  return (
    <div className="chat-container">
      {loading || directLoading || usersLoading ? (
        <SmallLoader />
      ) : (
        <>
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
          <div className="chat__header">
            <div className="chat__header__left">
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
              {roomId ? (
                <div
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target={"#" + "a" + roomId}
                  className="chat__header__left__button"
                >
                  <span className="chat__header__icon">#</span>
                  <span>{roomDetails?.data()?.name}</span>
                </div>
              ) : (
                <div
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target={"#" + "a" + roomDirectId}
                  className="chat__header__left__button"
                >
                  <div
                    className="chat__header__avatar"
                    style={{ backgroundImage: `url(${directImg})` }}
                  >
                    <FiberManualRecordIcon
                      className={directStatus ? "status active" : "status"}
                    />
                  </div>
                  <span>{directTitle}</span>
                </div>
              )}
            </div>
            <div
              className="chat__header__right"
              data-bs-toggle={roomId || roomDirectId ? "modal" : ""}
              data-bs-target={
                roomId || roomDirectId
                  ? "#" + "a" + (roomId ? roomId : roomDirectId)
                  : ""
              }
            >
              <span role="button">Details</span>
            </div>
          </div>

          <div className="chat-messages">
            <Message
              userImage="https://icon-library.com/images/comment-bubble-icon-png/comment-bubble-icon-png-3.jpg"
              userName={
                roomId
                  ? (roomDetails?.data()?.roomOwner
                      ? roomDetails?.data()?.roomOwner.displayName
                      : "...") +
                    ` founded the #${roomDetails?.data()?.name} channel,`
                  : "This conversation is just between the two of you"
              }
              message={
                roomId
                  ? roomDetails?.data()?.des
                    ? roomDetails?.data()?.des
                    : ""
                  : `Here you can send messages and share files with @${
                      directUser?.data().displayName
                    }.`
              }
              description={true}
            />
            {blocksMessageArr?.map((doc) => {
              var time = doc[1].time;
              var timestamp = doc[1].timestamp;
              var randomUid = doc[1][0]?.props.uid;
              return (
                <DayBlockMessages
                  uid={randomUid}
                  loading={directLoading || loading}
                  key={time.date + time.month + time.year}
                  time={time}
                  messages={doc[1]}
                  timestamp={timestamp}
                />
              );
            })}
            <div className="chat-bottom" ref={chatRef}></div>
          </div>
          <div className="chat__footer">
            {(members?.includes(user.uid) && roomId) || !roomId ? (
              <ChatInput
                channelId={roomId ? roomId : roomDirectId}
                channelName={roomId ? roomDetails?.data()?.name : directTitle}
                isDirect={roomId ? false : true}
              />
            ) : (
              <div className="chat__input-preview">
                <div className="text--normal">
                  You are viewing <strong>#{roomDetails?.data()?.name}</strong>
                </div>

                <div className="buttons-group">
                  <button className="btn btn-primary" onClick={joinChat}>
                    Join chat
                  </button>
                  <button
                    className="btn btn-secondary"
                    data-bs-toggle="modal"
                    data-bs-target={"#a" + roomId}
                  >
                    See more details
                  </button>
                </div>
              </div>
            )}
            <div className="space"></div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
