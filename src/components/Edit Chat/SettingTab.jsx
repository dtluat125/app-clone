import React, { useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import LockIcon from "@material-ui/icons/Lock";
import { useDispatch, useSelector } from "react-redux";
import { enterRoom, selectRoomDetails, selectRoomId, setIsModalOpen } from "../../features/appSlice";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
function SettingTab() {
  const roomId = useSelector(selectRoomId);
  const [roomDetails, loading] = useCollection(roomId&&db.collection('room').doc(roomId))
  const [isChange, setIsChange] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const isPrivate = roomDetails?.data()?.isPrivate;
  const [noti, setNoti] = useState("");
  const defaultRoomId = "CcfrQCURBPLWpn6lj0k8";
  const changeType = () => {
    setIsChange(true);
  };
  const deleteChannel = () => {
    setIsDelete(true);
  };
  const dispatch = useDispatch()
  useEffect(() => {
    if(isChange)
    db.collection("room")
      .doc(roomId)
      .update({
        isPrivate: !isPrivate,
      })
      .then(() => {
        setNoti(
          "Room changed to " + isPrivate
            ? "<strong>public</strong>"
            : "<strong>private</strong>"
        );
      })
      .catch((err) => alert(err.message));
      return () => {
        setIsChange(false)
      }
  }, [isChange]);

  console.log("Delete channel: "+ isDelete);

  useEffect(() => {
    if(isDelete)
    db.collection('room').doc(roomId).delete().then(() => {
      dispatch(setIsModalOpen({
        isModalOpen: false
      }))
      dispatch(enterRoom({
        roomId: defaultRoomId
      }))
    }).catch((err) => alert(err.message));
    return () => {
      setIsDelete(false)
    }
  }, [isDelete])

  if(roomId !== defaultRoomId)
  return (
    <div
      class="tab-pane fade channel-details__setting"
      id="setting"
      role="tabpanel"
      aria-labelledby="setting-tab"
    >
      <div className="c-tab-group" role="button" onClick={changeType}>
        {!roomDetails?.data()?.isPrivate ? (
          <>
            <LockIcon className="type-icon" />
            <span>Change to private channel</span>
          </>
        ) : (
          <>
            <LockOpenIcon />
            <span>Change to public channel</span>
          </>
        )}
      </div>
      <hr />

      {<div
        className="c-tab-group button-delete"
        data-bs-dismiss = "modal"
        data-bs-target = "#removeAlertModal"
        role="button"
        onClick={deleteChannel}
      >
        <DeleteIcon className="type-icon" />
        <span>Delete this channel</span>
      </div>}
    </div>
  );
  else return (<div
    class="tab-pane fade channel-details__setting"
    id="setting"
    role="tabpanel"
    aria-labelledby="setting-tab"
  >
    <div className="c-tab-group">
      This is the general room of the server so it cannot be modified
    </div>
   </div>)
}

export default SettingTab;
