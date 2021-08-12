import React, { useEffect, useState } from "react";
import "../../css/sidebar.css";
import SidebarOption from "./SidebarOption";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ForumIcon from "@material-ui/icons/Forum";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import AddIcon from "@material-ui/icons/Add";
import { db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import SidebarCollapse from "./SidebarCollapse";
import SidebarHeader from "./SidebarHeader";
import { useSelector } from "react-redux";
import {
  selectDirectMessageRoom,
  selectSecondaryWorkspaceStatus,
  selectUser,
} from "../../features/appSlice";
import SmallLoader from "../SmallLoader";
function SideBar({ width }) {
  const [channels, loading, error] = useCollection(db.collection("room"));
  const user = useSelector(selectUser);
  const [users, usersLoading, usersError] = useCollection(
    db.collection("users")
  );
  const [directRooms] = useCollection(db.collection("directRooms"));
  const channelList = [];

  channels?.docs.map((doc) =>
    channelList.push(
      <SidebarOption
        title={doc.data().name}
        key={doc.id}
        id={doc.id}
        isPrivate={doc.data().isPrivate}
        usersHaveReadRoom={doc.data().usersHaveRead}
        members={doc.data().members}
      />
    )
  );
  const usersList = [];
  users?.docs.map((doc) =>
    usersList.push(
      <SidebarOption
        title={doc.data().displayName}
        email={doc.data().email}
        key={doc.id}
        uid={doc.data().uid}
        photoURL={doc.data().photoURL}
        isOnline={doc.data().isOnline}
        isUser={true}
      />
    )
  );
  // Collapse sidebar handle
  let windowWidth;
  let chatWidth;
  const isSecondaryWorkspaceOpen = useSelector(selectSecondaryWorkspaceStatus);
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    const sidebarContainer = document.querySelector(".side-bar-container");
    const sidebarToggler = document.querySelector(
      ".sidebar-toggle-button.c-button-unstyled"
    );

    const reportWindowSize = () => {
      windowWidth = window.innerWidth;
      chatWidth = chatContainer.offsetWidth;
      if ((windowWidth < 706&&windowWidth>=576)) {
        sidebarContainer?.classList.add("sidebar-collapse");
        sidebarToggler?.classList.remove("collapse");
        console.log("first condition");
        chatContainer?.classList.remove("collapse");
      } 
      else if(windowWidth < 576&&isSecondaryWorkspaceOpen){
        chatContainer?.classList.add("collapse")
      }
      else if(windowWidth < 576|| chatWidth < 400){
        sidebarContainer?.classList.add("sidebar-collapse");
        sidebarToggler?.classList.remove("collapse");
        chatContainer?.classList.remove("collapse")
      }
      else {
        chatContainer?.classList.remove("collapse")
        sidebarToggler?.classList.add("collapse");
        sidebarContainer?.classList.remove("sidebar-collapse");
        sidebarContainer?.classList.remove("sidebar-float");
      }
    };
    reportWindowSize();
    window.addEventListener("resize", reportWindowSize);
  },);

  useEffect(() => {
    const sidebarCollapse = document.querySelector(".sidebar-collapse");
    const chatContainer = document.querySelector(".chat-container");
    const secondaryWorkspace = document.querySelector(
      ".secondary-view-container"
    );
    const closeSidebar = () => {
      sidebarCollapse?.classList.remove("sidebar-float");
    };

    chatContainer?.addEventListener("click", closeSidebar);
    secondaryWorkspace?.addEventListener("click", closeSidebar);
  });

  return (
    <div className="side-bar-container" style={{ width: width }}>
      {loading && usersLoading ? (
        <SmallLoader />
      ) : (
        <>
          <SidebarHeader />
          <SidebarCollapse
            options={[
              <SidebarOption
                title="All Unreads"
                icon={<ForumIcon />}
                isDropdown={true}
              />,
              <SidebarOption
                title="Mentions & reactions"
                icon={<AlternateEmailIcon />}
                isDropdown={true}
              />,
            ]}
            id={"browseslack"}
            title="Browse Slack"
            icon={<MoreVertIcon />}
          />

          <SidebarCollapse
            title="Channels"
            icon={<ArrowRightIcon />}
            id={"channels"}
            addIcon={<AddIcon />}
            options={channelList}
          />

          <SidebarCollapse
            title="Direct Message"
            icon={<ArrowRightIcon />}
            id="directmessage"
            options={usersList}
          />
        </>
      )}
    </div>
  );
}

export default SideBar;
