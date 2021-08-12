import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  enterDirectMessage,
  selectRoomId,
  selectUser,
  selectUserProfileUid,
  setSelectedUser,
  setUserProfileUid,
  showSecondaryWorkspace,
} from "../../features/appSlice";
import { db } from "../../firebase";
import ProfileModal from "./ProfileModal";

function Message({ userName, userImage, message, timestamp, uid, description }) {
  const userInf = useSelector(selectUser);
  const displayName = userInf?.uid === uid ? "You" : userName;
  const [onHover, setOnHover] = useState(false);
  const roomId = useSelector(selectRoomId)

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
  //

  const hoverHandler = () => {
    setOnHover(true);
  };
  const notHoverHandler = () => {
    setOnHover(false);
  };
  const dispatch = useDispatch();
  const sendUserUid = () => {
    if (!loading) {
      dispatch(
        setUserProfileUid({
          userUid: uid,
        })
      );
      // Save selected User Inf

      console.log("dispatched");
    }
  };

  useEffect(() => {
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
  }, [loading, userUid, userInf]);
  const doNothing = () => {}
  return (
    <div
      className={onHover ? "message-container active" : "message-container"}
      onMouseOver={hoverHandler}
      onMouseOut={notHoverHandler}
    >
      {(timestamp||(description)) && (
        <>
          <div
            style={{ backgroundImage: `url(${userImage})` }}
            alt=""
            role="button"
            onClick={uid?sendUserUid:doNothing}
            data-bs-toggle={uid?"modal":"false"}
            data-bs-target="#profileModal"
            className="message__avatar"
          />

          <div className="message__info">
            <div className="status">
              <a
                role="button"
                onClick={uid?sendUserUid:doNothing}
                data-bs-toggle={uid?"modal":"false"}
                data-bs-target="#profileModal"
              >
                {description?userName:displayName}
              </a>{" "}
              <span>{description?"":localTime}</span>
            </div>
            <p className="message">{message}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Message;
