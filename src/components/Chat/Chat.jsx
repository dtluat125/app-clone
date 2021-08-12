import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/chat.css";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import {
  enterDirectMessage,
  enterRoom,
  selectChosenUser,
  selectDirectMessageRoom,
  selectRoomId,
  selectUser,
  selectUserDirect,
  setDirectUser,
  setRoomDetails,
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

function Chat() {
  const dispatch = useDispatch();
  const chatRef = useRef(null);
  const user = useSelector(selectUser);
  const defaultRoomId = "CcfrQCURBPLWpn6lj0k8";
  // Room message
  const roomId = useSelector(selectRoomId);
  const directMessageUid = useSelector(selectUserDirect);

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
  //
  useEffect(() => {
    chatRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [roomId, loading, directLoading]);
  //   Create block message
  const blocksMessage = {};
  roomId
    ? roomMessages?.docs.map((doc) => {
        const { message, timestamp, user, userImage, uid } = doc.data();
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
            key={doc.id}
            message={message}
            timestamp={timestamp}
            userName={user}
            userImage={userImage}
            uid={uid}
            isDirect={false}
          />
        );
      })
    : roomDirectMessages?.docs.map((doc) => {
        const { message, timestamp, user, userImage, uid } = doc.data();
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
            key={doc.id}
            message={message}
            timestamp={timestamp}
            userName={user}
            userImage={userImage}
            uid={uid}
            isDirect={true}
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
  return (
    <div className="chat-container">
      {loading || directLoading || usersLoading ? (
        <SmallLoader />
      ) : (
        <>
          <div className="chat__header">
            <div className="chat__header__left">
              <div
                onClick={openSidebar}
                className="sidebar-toggle-button c-button-unstyled chat__header__left__button"
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
                  <span>#{roomDetails?.data()?.name}</span>
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
              data-bs-toggle={roomId ? "modal" : ""}
              data-bs-target={roomId ? "#" + "a" + roomId : ""}
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
                chatRef={chatRef}
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
