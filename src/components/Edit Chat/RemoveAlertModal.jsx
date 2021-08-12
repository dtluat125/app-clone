import React, { useState } from "react";
import { useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import {
  selectChosenUser,
  selectRoomDetails,
  selectRoomId,
  selectUser,
} from "../../features/appSlice";
import { db } from "../../firebase";
import firebase from "firebase";
import { data } from "jquery";
function RemoveAlertModal({ uid }) {
  const userInf = useSelector(selectUser);
  const roomDetails = useSelector(selectRoomDetails);
  const selectedUser = useSelector(selectChosenUser);
  const roomId = useSelector(selectRoomId);
  let members = roomDetails?.members;
  let membersArr = members?.slice();
  const [users, loading] = useCollection(db.collection("users"));
  const user = users?.docs.find((doc) => doc.data().uid === uid);
  const title = user?.data().displayName
    ? user?.data().displayName
    : user?.data().email;
  const [successLoaded, setSuccessLoaded] = useState(true);
  const removeMember = () => {
    let index = members.indexOf(selectedUser.uid);
    if (index !== -1) {
      membersArr?.splice(index, 1);
      db.collection("room")
        .doc(roomId)
        .update({
          members: membersArr,
        })
        .then(() => {
          setSuccessLoaded(true);
          let input = `was removed by ${userInf?.displayName}.`;
          db.collection("room").doc(roomId).collection("messages").add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user?.data().displayName,
            userImage: user?.data().photoURL,
            uid: user?.data().uid,
          });
        });
    }
  };
  useEffect(() => {
    return () => {
      setSuccessLoaded(true);
    };
  }, [successLoaded]);
  return (
    <div
      className="modal fade"
      id="removeAlertModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content remove-alert-modal">
          <div className="c-modal__header">
            <h1>Remove member</h1>
          </div>
          <div className="c-modal__content">
            Are you sure you want to remove {title} from #{roomDetails?.name}
          </div>
          <div className="c-modal__footer">
            <div className="footer__buttons">
              <button
                className="c-button-unstyled c-button--medium"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="c-button-unstyled c-button--medium danger"
                data-bs-dismiss="modal"
                onClick={removeMember}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemoveAlertModal;
