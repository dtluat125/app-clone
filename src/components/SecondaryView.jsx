import React, { useState } from "react";
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
  showSecondaryWorkspace,
} from "../features/appSlice";
import { db } from "../firebase";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CloseIcon from "@material-ui/icons/Close";
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


  const closeWorkspace = () => {
    dispatch(
      showSecondaryWorkspace({
        isShowingSecondaryWorkspace: false,
      })
    );
    console.log("close");
  };
  return (
    <div
      className={
        isOpen ? "secondary-view-container active" : "secondary-view-container"
      }
      style={{ width: width }}
    >
      <div className="secondary-view__header">
        <div className="secondary-view__header__left">
          <span>Profile</span>
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
          data-bs-toggle={userInf?.uid===selectedUser?.uid?"modal":"false"}
          data-bs-target="#editProfile"
          className="c-button-unstyled link-button"
          style = {{color: `rgba(18,100,163,1)`,
            fontWeight: "700"}}
        >
          {job?job:"Add a job"}
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
    </div>
  );
}

export default SecondaryView;
