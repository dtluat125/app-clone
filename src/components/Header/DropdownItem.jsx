import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  enterDirectMessage,
  enterRoom,
  selectUser,
  setSelectedUser,
} from "../../features/appSlice";
import { db } from "../../firebase";

function DropdownItem({ icon, name, photoURL, id, uid, filterText }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [directRooms, loading] = useCollection(db.collection("directRooms"));
  const userUid = user?.uid;
  const directRoom = directRooms?.docs.find((doc) => {
    if (uid === userUid)
      return (
        doc.data().uids[0] === doc.data().uids[1] &&
        doc.data().uids.includes(userUid)
      );
    return doc.data().uids.includes(userUid) && doc.data().uids.includes(uid);
  });

  const selectChannel = () => {
    if (id) {
      dispatch(
        enterDirectMessage({
          directMessageUid: null,
        })
      );
      dispatch(
        enterRoom({
          roomId: id,
        })
      );
    }
  };

  const enterDirect = () => {
    dispatch(
      enterRoom({
        roomId: null,
      })
    );

    if (!directRoom && loading==false) {
      db.collection("directRooms").add({
        uids: [userUid, uid],
      });
      console.log("added!");
    }

    if (directRoom?.id) {
      dispatch(
        enterDirectMessage({
          directMessageUid: uid,
          directMessageRoomId: directRoom?.id,
        })
      );
      dispatch(setSelectedUser({ selectedUser: null }));
    }
  };
//   filter handle
  const filterName = !photoURL?filterText.slice(9):filterText.slice(6);
  if(name?.indexOf(filterName)!=-1)
  return (
    <div
      className="dropdown-item list-item"
      onClick={!photoURL ? selectChannel : enterDirect}
    >
      <div
        style={photoURL ? { backgroundImage: `url(${photoURL})` } : {}}
        className="list-item__icon"
      >
        {icon ? icon : ""}
      </div>
      <div className="list-item__name">{name}</div>
    </div>
  );
  else return("");
}

export default DropdownItem;
