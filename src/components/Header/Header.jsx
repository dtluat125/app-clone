import React, { useEffect, useState } from "react";
import "../../css/header.css";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SearchIcon from "@material-ui/icons/Search";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { Dropdown } from "react-bootstrap";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { auth, db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  reset,
  saveUserInfo,
  selectDocId,
  selectMoves,
  selectUser,
  setOnOpenProfile,
  setOnReplyInThread,
  setOnSave,
  setSelectedUser,
  setUserProfileUid,
  showSecondaryWorkspace,
} from "../../features/appSlice";
import DropdownSearchMenu from "./DropdownSearchMenu";
import DropdownMove from "./DropdownMove";

function Header() {
  const userInf = useSelector(selectUser);
  const [users, loading] = useCollection(db.collection("users"));
  const user = users?.docs.find((elem) => elem.data().uid === userInf?.uid);
  const [onViewing, setOnViewing] = useState(false);
  const dispatch = useDispatch();
  const logOut = async () => {
    await auth
      .signOut()
      .then(() => {
        db.collection("users").doc(user?.id).update({
          isOnline: false,
        });
      })
      .catch((error) => alert(error.message));
    dispatch(
      reset({
        initState: null,
      })
    );
  };

  const email = user?.data().email;
  const displayName = user?.data().displayName;
  const photoURL = user?.data().photoURL;
  // Open profile
  const openProfile = () => {
    setOnViewing(true);
    dispatch(
      setUserProfileUid({
        userUid: userInf?.uid,
      })
    );
    dispatch(
      showSecondaryWorkspace({
        isShowingSecondaryWorkspace: true,
      })
    );
    dispatch(
      showSecondaryWorkspace({
        isShowingSecondaryWorkspace: true,
      })
    );

    dispatch(
      setOnReplyInThread({
        onReplyInThread: null,
      })
    );
    dispatch(
      setOnSave({
        onSave: null,
      })
    );
    dispatch(
      setOnOpenProfile({
        onOpenProfile: true,
      })
    );
  };

  useEffect(() => {
    if (onViewing) {
      dispatch(
        setSelectedUser({
          selectedUser: {
            displayName: user?.data().displayName,
            email: user?.data().email,
            uid: userInf?.uid,
            photoURL: photoURL,
            isOnline: userInf?.isOnline,
            whatIDo: user?.data().whatIDo,
          },
        })
      );
    }
    return () => {
      setOnViewing(false);
    };
  }, [onViewing]);

  // Get Moves
  const moves = useSelector(selectMoves);
  return (
    <div className="header-container">
      {/* Header Left */}
      <div className="header__left">
        <Dropdown className="history-dropdown dropdown">
          <Dropdown.Toggle
            className="c-button-unstyled dropdown-toggle"
            id="historyDropdown"
            variant="success"
          >
            <AccessTimeIcon className="access-time-icon" />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu"
            aria-labelledby="historyDropdown"
            style={{ width: 360 }}
          >
            <div aria-hidden="true" className="c-menu_item__header">
              Recent
            </div>
            {moves?.map((id) => {
              return <DropdownMove key={id} id={id} />;
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* Header Search */}

      <div className="dropdown header__search">
        <div
          className="header__search--inner"
          id="dropdownMenuSearchHeader"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          data-bs-auto-close="outside"
        >
          <SearchIcon />

          <span>Search fetch</span>
        </div>

        <DropdownSearchMenu />
      </div>

      {/* Header Right */}
      <div className="header__right">
        <Dropdown className="history-dropdown dropdown">
          <Dropdown.Toggle
            className="c-button-unstyled dropdown-toggle"
            id="historyDropdown"
            variant="success"
          >
            <HelpOutlineIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu"
            aria-labelledby="historyDropdown"
          >
            <div aria-hidden="true" className="c-menu_item__header">
              This functionality is currently unavailable
            </div>
          </Dropdown.Menu>
        </Dropdown>
        <div className="header__avatar">
          <Dropdown className="user-dropdown dropdown">
            <Dropdown.Toggle
              className="c-button-unstyled dropdown-toggle"
              id="historyDropdown"
              variant="success"
            >
              <div
                className="user-avatar"
                style={{
                  backgroundImage: `url(${
                    photoURL ? photoURL : "default-avatar.jpg"
                  })`,
                }}
              ></div>
            </Dropdown.Toggle>
            <Dropdown.Menu
              className="dropdown-menu"
              aria-labelledby="historyDropdown"
            >
              <div className="dropdown-item main-menu__user">
                <div
                  className="main-menu__user__avatar"
                  style={{
                    backgroundImage: `url(${
                      photoURL ? photoURL : "default-avatar.jpg"
                    })`,
                  }}
                ></div>
                <div className="main-menu__user__details">
                  <div className="main-menu__user__name">
                    {displayName ? displayName : email}
                  </div>
                  <span className="main-menu__user__status">
                    <FiberManualRecordIcon style={{ fontSize: "small" }} />
                    Active
                  </span>
                </div>
              </div>
              <div className="c-menu__separator">
                <hr className="c-menu__separator__line" />
              </div>
              <div
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target="#editProfile"
              >
                Edit profile
              </div>
              <div className="dropdown-item" onClick={openProfile}>
                View profile
              </div>
              <div className="c-menu__separator">
                <hr className="c-menu__separator__line" />
              </div>
              <div className="dropdown-item" onClick={logOut}>
                Sign out
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Header;
