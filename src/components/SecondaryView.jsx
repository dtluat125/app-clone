import React, { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import "../css/secondaryview.css";
import {
  selectChosenUser,
  selectDocId,
  selectLocalTime,
  selectSecondaryWorkspaceStatus,
  selectUser,
  selectUserProfileUid,
  setSelectedUser,
  setUserProfileUid,
  showSecondaryWorkspace,
} from "../features/appSlice";
import { db } from "../firebase";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CloseIcon from "@material-ui/icons/Close";
import Message from "./Chat/Message";
import { Picker } from "emoji-mart";
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
  const user = useSelector(selectUser);
  const [emojiReact, setEmojiReact] = useState("");
  const [reactToggle, setReactToggle] = useState(false);
  const [position, setPosition] = useState(null);
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
  // Get saved Items
  const [savedItemsInfo] = useCollection(
    db.collection("savedItems").orderBy("timestamp", "desc")
  );

  const savedMessagesArr = [];
  savedItemsInfo?.docs?.map(async (doc) => {
    const messageId = doc.data().messageId;
    const roomId = doc.data().roomId;
    const roomDirectId = doc.data().roomDirectId;
    let messageRef = null;
    if (roomId) {
      messageRef = await db
        .collection("room")
        .doc(roomId)
        .collection("messages")
        .doc(messageId)
        .get();
    } else if (roomDirectId) {
      messageRef = await db
        .collection("directRooms")
        .doc(roomId)
        .collection("messages")
        .doc(messageId)
        .get();
    }
    const { message, timestamp, user, userImage, uid, isSaved } =
      messageRef.data();
    const time = new Date(timestamp?.toDate());
    var date = time.getDate();
    var year = time.getFullYear();
    var month = time.getMonth();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    savedMessagesArr.push(messageRef.data());
  });

  const addEmoji = (e) => {
    let emoji = e.native;
    setEmojiReact(emoji);
    setReactToggle(!reactToggle);
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
            right: position.positionInfo.x - 174,
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
              <div className="member-profile__field__label">Email address</div>
              <div className="member-profile__field__value">
                {selectedUser?.email}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="secondary-view__body">
          {console.log(savedMessagesArr)}
          {savedMessagesArr.map((doc) => {
            console.log("AAAAAAAAAAAAAA");
            const { message, timestamp, user, userImage, uid, isSaved } = doc;
            return (
              <>
                <Message
                  emojiMartPosition={position}
                  onClick={openEmojiMart}
                  key={doc.id}
                  message={message}
                  timestamp={timestamp}
                  userName={user}
                  userImage={userImage}
                  uid={uid}
                  isSaved={true}
                  emojiReact={emojiReact}
                  reactToggle={reactToggle}
                  isSaved={isSaved}
                />
                <div>ALOALO</div>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SecondaryView;
