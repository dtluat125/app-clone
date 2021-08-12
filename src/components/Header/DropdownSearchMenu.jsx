import React, { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import DropdownItem from "./DropdownItem";
import LockIcon from '@material-ui/icons/Lock';
import { useSelector } from "react-redux";
import { selectUser } from "../../features/appSlice";

function DropdownSearchMenu() {
  const [channels, loading, error] = useCollection(db.collection("room"));
  const [users] = useCollection(db.collection("users"));
  const [onChannels, setOnChannels] = useState(false);
  const [onUsers, setOnUsers] = useState(false);
  const [filterText, setFilterTex] = useState("");
  const filterTextChangeHanler = (e) => {
    setFilterTex(e.target.value);
  };
  const findChannel = () => {
    setFilterTex("Channel: ");
  };

  const findUser = () => {
    setFilterTex("User: ");
  };

  useEffect(() => {
    let isChannel = /^Channel:/.test(filterText);
    let isUser = /^User:/.test(filterText);
    if (isChannel) {
      setOnChannels(true);
    }
    if (isUser) {
      setOnUsers(true);
    }
    return () => {
      setOnUsers(false);
      setOnChannels(false);
    }
  }, [filterText]);
  const user = useSelector(selectUser);
  const uid = user?.uid;

  return (
    <div className="dropdown-menu"  aria-labelledby="dropdownMenuSearchHeader">
      <div
        className="dropdown-item search-bar"
        disabled
        style={{ padding: "4px 0px 4px 0px" }}
      >
        <div className="form-group">
          <SearchIcon className="search-icon" />
          <input
            value={filterText}
            onChange={filterTextChangeHanler}
            type="text"
            className="form-control"
          />
        </div>
        <div className="badges-group">
          <div role="button" onClick={findChannel} className="badge bg-primary">
            Channel
          </div>
          <div role="button" onClick={findUser} className="badge bg-primary">
            User
          </div>
        </div>
      </div>
      {onChannels && (
        <>
          {channels?.docs.map((doc) => {
            let isPrivate = doc.data().isPrivate;
            let members = doc.data().members;
            if((members?.includes(uid)&&isPrivate)||!isPrivate)
            return <DropdownItem 
            name = {doc.data().name}
            icon = {isPrivate?<LockIcon/>:"#"}
            id = {doc.id}
            filterText = {filterText}
            />;
          })}
        </>
      )}
      {
        onUsers&& (
          <>
            {
              users?.docs.map((doc) => {
                return(
                  <DropdownItem
                  name = {doc.data().displayName?doc.data().displayName:doc.data().email}
                  photoURL = {doc.data().photoURL?doc.data().photoURL:"default-avatar.jpg"}
                  uid = {doc.data().uid}
                  filterText = {filterText}
                  />
                )
              })
            }
          </>
        )
      }
    </div>
  );
}

export default DropdownSearchMenu;
