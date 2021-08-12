import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  enterDirectMessage,
  enterRoom,
  selectDirectMessageRoom,
  selectMoves,
  selectRoomId,
  selectUser,
  selectUserDirect,
  setMoves,
  setSelectedUser,
} from "../../features/appSlice";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import LockIcon from "@material-ui/icons/Lock";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import firebase from "firebase";

function SidebarOption({
  icon,
  title,
  photoURL,
  uid,
  id,
  email,
  isOnline,
  isUser,
  usersHaveReadRoom,
  isPrivate,
  members,
}) {
  const dispatch = useDispatch();
  const seeAllDm = () => {};
  const directMessageUid = useSelector(selectUserDirect);
  const directMessageRoomId = useSelector(selectDirectMessageRoom);
  const user = useSelector(selectUser);
  const userUid = user?.uid;
  const [directRooms, loading] = useCollection(db.collection("directRooms"));
  const [users] = useCollection(db.collection("users"));
  const [toggle, setToggle] = useState(false);
  const directRoom = directRooms?.docs.find((doc) => {
    if (uid === userUid)
      return (
        doc.data().uids[0] === doc.data().uids[1] &&
        doc.data().uids.includes(userUid)
      );
    return doc.data().uids.includes(userUid) && doc.data().uids.includes(uid);
  });

  const usersHaveRead = directRoom?.data().usersHaveRead;
  const addNewDirect = async () => {
    if (!directRoom && uid && !loading) {
      await db
        .collection("directRooms")
        .add({
          uids: [userUid, uid],
        })
        .then((doc) => {
          db.collection("directRooms")
            .doc(doc.id)
            .update({
              users: [
                users?.docs.find((doc) => doc.data().uid === userUid)?.data(),
                users?.docs.find((doc) => doc.data().uid === uid)?.data(),
              ],
            });
        });
      console.log("added!");
    }
  };
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
      db.collection("room")
        .doc(id)
        .update({
          usersHaveRead: usersHaveReadRoom
            ? usersHaveReadRoom.concat(user.uid)
            : [userUid],
        });
    }
  };
  const selectPerson = () => {
    setToggle(true);
    dispatch(
      enterRoom({
        roomId: null,
      })
    );

    if (directRoom?.id) {
      dispatch(
        enterDirectMessage({
          directMessageUid: uid,
          directMessageRoomId: directRoom?.id,
        })
      );
  
      db.collection("directRooms")
        .doc(directRoom.id)
        .update({
          usersHaveRead: usersHaveRead
            ? usersHaveRead.concat(user.uid)
            : [userUid],
        });
    }
  };
  // Handle send message button

  useEffect(() => {
    addNewDirect();
    return () => {
      setToggle(false);
    };
  }, [directMessageUid, directMessageRoomId, loading]);

  const defaultRoomId = "CcfrQCURBPLWpn6lj0k8";

  const roomId = useSelector(selectRoomId);
  // Save moves
  let moves = useSelector(selectMoves);
  const addMoves = (id) => {
    let newMoves = moves?.filter((a) => {
      return a != id;
    });
    newMoves.unshift(id);
    dispatch(
      setMoves({
        moves: newMoves,
      })
    );
  };
  useEffect(() => {
    addMoves(roomId ? roomId : directMessageRoomId);
  }, [roomId, directMessageUid]);

  //
  if (members?.includes(user.uid) || isUser || id === defaultRoomId)
    return (
      <div
        className={
          roomId === id || directMessageUid === uid
            ? "sidebar__option-container active"
            : "sidebar__option-container"
        }
        tabIndex="1"
        role="button"
        onClick={
          id && !isUser ? selectChannel : isUser ? selectPerson : seeAllDm
        }
      >
        {icon && <div className="sidebar__icon">{icon}</div>}
        {icon ? (
          <div className="sidebar__option__title">{title}</div>
        ) : (
          <div className="sidebar__option__channel">
            {!isUser ? (
              !isPrivate ? (
                <span>#</span>
              ) : (
                <LockIcon />
              )
            ) : photoURL ? (
              <img src={photoURL} alt="avatar" />
            ) : (
              <img src="default-avatar.jpg" alt="avatar" />
            )}
            <FiberManualRecordIcon
              className={
                isUser
                  ? isOnline
                    ? "status online"
                    : "status offline"
                  : "no-status"
              }
            />
            {title ? title : email}
          </div>
        )}
        {!(
          usersHaveRead?.includes(userUid) ||
          usersHaveReadRoom?.includes(userUid)
        ) &&
          !icon && (
            <span class="position-absolute  translate-middle p-1 bg-danger border border-light rounded-circle unread-notification">
              <span class="visually-hidden">New alerts</span>
            </span>
          )}
      </div>
    );
  else return <div />;
}

export default SidebarOption;
