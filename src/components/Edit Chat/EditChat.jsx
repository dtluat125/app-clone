import React from "react";
import { useSelector } from "react-redux";
import "../../css/editchat.css";
import {
  selectChosenUser,
  selectRoomId,
  selectUserDirect,
} from "../../features/appSlice";
import ProfileModal from "../Chat/ProfileModal";
import AboutTab from "./AboutTab";
import InputField from "./InputField";
import MembersTab from "./MembersTab";
import RemoveAlertModal from "./RemoveAlertModal";
import SettingTab from "./SettingTab";
function EditChat({ id, roomDetails, directUser, onClick }) {
  const userDirectId = useSelector(selectUserDirect);
  const roomId = useSelector(selectRoomId);
  const roomName = roomDetails?.name;
  const roomMembers = roomDetails?.members;
  const roomDes = roomDetails?.des;
  const roomOwnerName = roomDetails?.roomOwner?.displayName;
  const roomOwner = roomDetails?.roomOwner;
  const isPrivate = roomDetails?.isPrivate;
  const userName = directUser?.displayName
    ? directUser.displayName
    : directUser?.email;
  const photoURL = directUser?.photoURL
    ? directUser.photoURL
    : "default-avatar.jpg";
  return (
    <div className="modal fade editChat" id={"a" + id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content chat-details-modal">
          <div className="modal-header chat-details-modal__header c-modal__header">
            <div className="user-display">
              {!roomId && (
                <div
                  className="user__avatar"
                  style={{ backgroundImage: `url(${photoURL})` }}
                ></div>
              )}
              <h1>{roomId ? roomName : userName}</h1>
            </div>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <span
                  class="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#about"
                  type="button"
                  role="tab"
                  aria-controls="about"
                  aria-selected="true"
                >
                  About
                </span>
              </li>
              {!userDirectId && (
                <li class="nav-item" role="presentation">
                  <span
                    class="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#members"
                    type="button"
                    role="tab"
                    aria-controls="members"
                    aria-selected="false"
                  >
                    Members
                  </span>
                </li>
              )}
              {!userDirectId && (
                <li class="nav-item" role="presentation">
                  <span
                    class="nav-link"
                    id="contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#setting"
                    type="button"
                    role="tab"
                    aria-controls="setting"
                    aria-selected="false"
                  >
                    Setting
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="modal-body chat-details-modal__tabs c-modal__content">
            <div className="c-modal__content__inner">
              <div class="tab-content" id="myTabContent">
                <AboutTab
                  roomName={roomName}
                  roomDes={roomDes}
                  roomOwner={roomOwnerName}
                  id={id}
                  isPrivate={isPrivate}
                  roomMembers={roomMembers}
                />
                {!userDirectId && (
                  <MembersTab
                    onClick={onClick}
                    roomMembers={roomDetails?.members}
                    roomOwner={roomOwner}
                    id={id}
                  />
                )}
                {!userDirectId && <SettingTab />}
              </div>
            </div>
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
}

export default EditChat;
