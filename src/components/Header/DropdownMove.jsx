import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  enterDirectMessage,
  enterRoom,
  selectUser,
} from "../../features/appSlice";
import { db } from "../../firebase";

function DropdownMove({ id }) {
  console.log(id)
  const [roomDetails] = useCollection(id&&db.collection("room").doc(id));
  const [directDetails] = useCollection(id&&db.collection("directRooms").doc(id));
  const details = roomDetails ? roomDetails : directDetails;
  const name = details?.data()?.name;
  const userInf = useSelector(selectUser);
  let uids = directDetails?.data()?.uids;
  let uid = uids?.filter((uid) => {
    return uid !== userInf.uid;
  });
  const directUser = directDetails?.data()?.users
    ? directDetails?.data()?.users[1]
    : undefined;
  const photoURL = directUser?.photoURL
    ? directUser?.photoURL
    : "default-avatar.jpg";
  //   Enter room
  const dispatch = useDispatch();
  const enterRoomHandle = () => {
    if (!uid) {
      dispatch(
        enterDirectMessage({
          directMessageUid: null,
          directMessageRoomId: null,
        })
      );
      dispatch(
        enterRoom({
          roomId: id,
        })
      );
    } else if(directDetails) {
      dispatch(
        enterRoom({
          roomId: null,
        })
      );
      dispatch(
        enterDirectMessage({
          directMessageRoomId: id,
          directMessageUid: uids[1],
        })
      );
    }
  };
  return (
    <div className="dropdown-item moves-item" role="button" onClick={enterRoomHandle}>
      <div
        className="move__symbol"
        style={uid ? { backgroundImage: `url(${photoURL})` } : {}}
      >
        {uid ? "" : "#"}
      </div>
      <span className="move__name">{uid ? directUser?.displayName : name}</span>
    </div>
  );
}

export default DropdownMove;
