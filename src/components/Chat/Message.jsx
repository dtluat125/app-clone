import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  enterDirectMessage,
  selectDirectMessageRoom,
  selectRoomId,
  selectSecondaryWorkspaceStatus,
  selectUser,
  selectUserProfileUid,
  setSelectedUser,
  setUserProfileUid,
  showSecondaryWorkspace,
} from "../../features/appSlice";
import { db } from "../../firebase";
import ActionButton from "./ActionButton";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import ReplyIcon from "@material-ui/icons/Reply";
import ForwardOutlinedIcon from "@material-ui/icons/ForwardOutlined";
import TurnedInNotOutlinedIcon from "@material-ui/icons/TurnedInNotOutlined";
import TurnedInIcon from "@material-ui/icons/TurnedIn";
import Reaction from "./Reaction";
import firebase from "firebase";
function Message({
  id,
  userName,
  userImage,
  message,
  timestamp,
  uid,
  description,
  reactions,
  onClick,
  emojiMartPosition,
  emojiReact,
  reactToggle,
  isSaved,
}) {
  const userInf = useSelector(selectUser);
  const displayName = userInf?.uid === uid ? "You" : userName;
  const [onHover, setOnHover] = useState(false);
  const roomId = useSelector(selectRoomId);
  const directId = useSelector(selectDirectMessageRoom);
  // Save selected user Info

  const [users, loading] = useCollection(db.collection("users"));
  const userUid = useSelector(selectUserProfileUid);
  const user = users?.docs.find((elem) => elem.data().uid === userUid);
  const photoURL = user?.data().photoURL
    ? user.data().photoURL
    : "default-avatar.jpg";
  const isOnline = user?.data().isOnline;
  const time = new Date(timestamp?.toDate());
  var date = time.getDate();
  var month = time.getMonth();
  var hours = time.getHours();
  var minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var localTime = hours + ":" + minutes + " ";
  const [onSendingUid, setOnSendingUid] = useState(false);
  //
  // Open emojimart for each message

  const [position, setPosition] = useState(null);

  const openMovingEmojiMart = () => {
    const chatMessage = document.querySelector("#a" + id);
    const positionInfo = chatMessage.getBoundingClientRect();
    setPosition(positionInfo);
    onClick({ positionInfo, id });
  };
  // Hover message handle
  const hoverHandler = () => {
    if (description || (emojiMartPosition && emojiMartPosition.id !== id)) {
      setOnHover(false);
    } else setOnHover(true);
  };
  const notHoverHandler = () => {
    if (emojiMartPosition && emojiMartPosition.id === id) {
      setOnHover(true);
    } else setOnHover(false);
  };

  useEffect(() => {
    if (!emojiMartPosition) {
      setOnHover(false);
    }
  }, [emojiMartPosition]);

  const dispatch = useDispatch();
  const sendUserUid = () => {
    if (!loading) {
      dispatch(
        setUserProfileUid({
          userUid: uid,
        })
      );
      // Save selected User Inf
      setOnSendingUid(true);
      console.log("dispatched");
    }
  };
  console.log("...");
  const isOpen = useSelector(selectSecondaryWorkspaceStatus);
  useEffect(() => {
    if (onSendingUid)
      dispatch(
        setSelectedUser({
          selectedUser: {
            displayName: user?.data().displayName,
            email: user?.data().email,
            uid: userUid,
            photoURL: photoURL,
            isOnline: isOnline,
            whatIDo: user?.data().whatIDo,
          },
        })
      );
    return () => {
      setOnSendingUid(false);
    };
  }, [onSendingUid, userUid, isOpen]);
  const doNothing = () => {};

  // Handle message actions

  // Create reaction
  const [emoji, setEmoji] = useState("");
  const addReaction = (e) => {
    let emoji = e.native;
    setEmoji(emoji);
  };
  const replyInThread = () => {};
  const shareMessage = () => {};
  // Save item
  const saveItem = async () => {
    if (!isSaved) {
      db.collection("savedItems").add({
        messageId: id ? id : null,
        roomId: roomId ? roomId : null,
        roomDirectId: directId ? directId : null,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      if (roomId) {
        db.collection("room")
          .doc(roomId)
          .collection("messages")
          .doc(id)
          .update({
            isSaved: true,
          });
      } else if (directId) {
        db.collection("directRooms")
          .doc(directId)
          .collection("messages")
          .doc(id)
          .update({
            isSaved: true,
          });
      }
    } else {
      const snapshot = await db
        .collection("savedItems")
        .where("messageId", "==", id)
        .get();
      let itemId = null;
      snapshot.forEach((doc) => (itemId = doc.id));
      console.log(itemId);
      db.collection("savedItems")
        .doc(itemId)
        .delete()
        .then(() => console.log("Delete!"))
        .catch((err) => console.log(err.message));
      if (roomId) {
        db.collection("room")
          .doc(roomId)
          .collection("messages")
          .doc(id)
          .update({
            isSaved: false,
          });
      } else if (directId) {
        db.collection("directRooms")
          .doc(directId)
          .collection("messages")
          .doc(id)
          .update({
            isSaved: false,
          });
      }
    }
  };
  // Send reaction to db
  const sendReaction = (emoji) => {
    let reactionsArr = reactions ? reactions.slice() : [];
    const findEmoji = reactionsArr.findIndex((reaction, index) => {
      if (reaction.title === emoji) {
        return true;
      }
    });

    if (findEmoji > -1) {
      let count = reactionsArr[findEmoji].count;
      let reactUser = userInf.displayName;
      let senders = reactionsArr[findEmoji].senders;
      if (senders.includes(userInf?.displayName)) {
        let userIndex = senders.indexOf(reactUser);
        senders.splice(userIndex, 1);
        count = count - 1;
      } else {
        count = count + 1;
        senders.push(reactUser);
      }
      reactionsArr[findEmoji].senders = senders;
      reactionsArr[findEmoji].count = count;
    } else if (findEmoji === -1) {
      let count = 0;
      let reactUser = userInf.displayName;
      let senders = [];
      senders.push(reactUser);
      reactionsArr.push({
        title: emoji,
        senders: senders,
        count: count + 1,
      });
    }
    if (directId) {
      db.collection("directRooms")
        .doc(directId)
        .collection("messages")
        .doc(id)
        .update({
          reactions: reactionsArr,
        });
    } else if (roomId) {
      db.collection("room").doc(roomId).collection("messages").doc(id).update({
        reactions: reactionsArr,
      });
    }
  };

  useEffect(() => {
    if (
      emojiReact &&
      emojiReact !== "" &&
      emojiMartPosition &&
      id === emojiMartPosition?.id
    ) {
      console.log(emojiReact);
      sendReaction(emojiReact);
    }
  }, [reactToggle]);
  return (
    <div
      className={
        onHover
          ? isSaved
            ? "message-container active saved"
            : "message-container active"
          : isSaved
          ? "message-container saved"
          : "message-container"
      }
      onMouseOver={hoverHandler}
      onMouseOut={notHoverHandler}
      id={"a" + id}
    >
      
      {isSaved && (
        <div className="message__label">
          <div className="message__label__icon">{<TurnedInIcon />}</div>
          <div role="button" className="message__label__content">
            Added to your saved items
          </div>
        </div>
      )}
      <div className={"message-container__inner"}>
        {(timestamp || description) && (
          <>
            <div
              style={{ backgroundImage: `url(${userImage})` }}
              alt=""
              role="button"
              onClick={uid ? sendUserUid : doNothing}
              data-bs-toggle={uid ? "modal" : "false"}
              data-bs-target="#profileModal"
              className="message__avatar"
            />

            <div className="message__info">
              <div className="status">
                <a
                  role="button"
                  onClick={uid ? sendUserUid : doNothing}
                  data-bs-toggle={uid ? "modal" : "false"}
                  data-bs-target="#profileModal"
                >
                  {description ? userName : displayName}
                </a>{" "}
                <span>{description ? "" : localTime}</span>
              </div>
              <p className="message">{message}</p>
              <div className="message__reaction-bar">
                {reactions
                  ? reactions.map((reaction) => {
                      if (reaction.count > 0)
                        return (
                          <Reaction
                            emoji={reaction.title}
                            count={reaction.count}
                            senders={reaction.senders}
                            key={reaction.title}
                            onClick={sendReaction}
                          />
                        );
                    })
                  : ""}
              </div>
            </div>
          </>
        )}
        {
          <div
            className={
              onHover ? "c-message__action" : "c-message__action collapse"
            }
          >
            <div className="c-message__action__group">
              <ActionButton
                action={sendReaction}
                emoji={"✅"}
                title="Completed"
              />
              <ActionButton
                action={sendReaction}
                emoji={"👀"}
                title="Taking a look..."
              />
              <ActionButton
                action={sendReaction}
                emoji={"🙌"}
                title="Nicely done"
              />
              <ActionButton
                onSelect={addReaction}
                action={openMovingEmojiMart}
                emoji={<InsertEmoticonIcon />}
                title="Find a reaction"
              />
              <ActionButton
                action={replyInThread}
                emoji={<ReplyIcon />}
                title="Reply in thread"
              />
              <ActionButton
                action={shareMessage}
                emoji={<ForwardOutlinedIcon />}
                title="Share message"
              />
              <ActionButton
                action={saveItem}
                emoji={
                  !isSaved ? (
                    <TurnedInNotOutlinedIcon />
                  ) : (
                    <TurnedInIcon style={{ color: "red" }} />
                  )
                }
                title="Add to saved items"
              />
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default Message;
