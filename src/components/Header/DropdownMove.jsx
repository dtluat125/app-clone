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
  console.log(id);
  const [roomDetails] = useCollection(id && db.collection("room").doc(id));
  const [directDetails] = useCollection(
    id && db.collection("directRooms").doc(id)
  );
  const details = roomDetails ? roomDetails : directDetails;
  const name = roomDetails?.data()?.name;
  const userInf = useSelector(selectUser);
  let uids = directDetails?.data()?.uids;

  let directUser = directDetails?.data()?.users.find((user) => {
    return user.uid !== userInf.uid;
  });
  if (uids && uids[0] === uids[1]) directUser = directDetails?.data()?.users[0];
  console.log(directUser);
  const photoURL = directUser?.photoURL
    ? directUser?.photoURL
    : "default-avatar.jpg";
  //   Enter room
  const dispatch = useDispatch();
  const enterRoomHandle = () => {
    if (!uids) {
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
    } else if (directDetails) {
      dispatch(
        enterRoom({
          roomId: null,
        })
      );
      let searchUid = uids.find((uid) => uid != userInf.uid);
      dispatch(
        enterDirectMessage({
          directMessageRoomId: id,
          directMessageUid: searchUid,
        })
      );
    }
    document.querySelector("#historyDropdown").click()
  };
  return (
    <div className="moves-item" role="button" onClick={enterRoomHandle}>
      <div className="moves-item__inner">
        <div
          className="move__symbol"
          style={uids ? { backgroundImage: `url(${photoURL})` } : {}}
        >
          {uids ? "" : "#"}
        </div>
        <span className="move__name">
          {uids ? directUser?.displayName : name}
        </span>
      </div>
    </div>
  );
}

export default DropdownMove;
