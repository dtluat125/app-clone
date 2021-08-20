import React, { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import DropdownItem from "./DropdownItem";
import LockIcon from "@material-ui/icons/Lock";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/appSlice";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import AutoSearchButton from "./AutoSearchButton";
import SearchMode from "./SearchMode";
import SuggestionList from "./SuggestionList";
import CloseIcon from "@material-ui/icons/Close";
function DropdownSearchMenu() {
  
  const [onChannels, setOnChannels] = useState(false);
  const [onUsers, setOnUsers] = useState(false);
  const [filterText, setFilterTex] = useState("");
  const [actualText, setActualText] = useState("");
  const actualTextChangeHanler = (e) => {
    setActualText(e.target.value);
  };
  const findChannel = () => {
    setFilterTex("Channel: ");
  };

  const findUser = () => {
    setFilterTex("User: ");
  };

  useEffect(() => {
    let isChannel = /^Channel:/.test(filterText + actualText);
    let isUser = /^User:/.test(filterText + actualText);
    if (isChannel) {
      setOnChannels(true);
    }
    if (isUser) {
      setOnUsers(true);
    }
    return () => {
      setOnUsers(false);
      setOnChannels(false);
    };
  }, [filterText]);
  const user = useSelector(selectUser);
  const uid = user?.uid;
  // closeMode
  const closeMode = () => {
    setFilterTex("");
  };
  // close Search
  const closeSearch = () => {
    document.querySelector("#dropdownMenuSearchHeader").click();
  }
  return (
    <div
      className="dropdown-menu"
      style={{ paddingTop: 0 }}
      aria-labelledby="dropdownMenuSearchHeader"
    >
      <div className="search-bar" disabled style={{ padding: "0" }}>
        <div className="header__search__input-and-close">
          <div className="form-group c-search__input-box">
            {filterText === "" ? (
              <SearchIcon className="search-icon" />
            ) : (
              <SearchMode
                close={closeMode}
                mode={onUsers ? "Users" : onChannels ? "Channels" : ""}
              />
            )}
            <input
              value={actualText}
              onChange={actualTextChangeHanler}
              type="text"
              className="c-search-input"
              style={{ borderBottomColor: "none" }}
              placeholder="Search because it's faster than scrolling"
            />
          </div>
          <div role="button" className="c-search__close-button" onClick = {closeSearch}>
              <CloseIcon/>
          </div>
        </div>
        {!onChannels && !onUsers && (
          <div className="search__content">
            <div className="c-search__content__header">I'm looking for...</div>
            <div className="buttons-list">
              <AutoSearchButton
                icon={<ListAltRoundedIcon />}
                action={findChannel}
                name="Channels"
              />
              <AutoSearchButton
                icon={<PeopleAltOutlinedIcon />}
                action={findUser}
                name="People"
              />
            </div>
          </div>
        )}
        {onChannels && (
          <SuggestionList filterText={filterText} actualText={actualText} mode = "channels"/>
        )}
        {onUsers && (
          <SuggestionList filterText={filterText} actualText={actualText} mode = "users"/>
        )}
      </div>
      <div className="search__footer">
        <span>Not the result you expected?</span>
      </div>
    </div>
  );
}

export default DropdownSearchMenu;
