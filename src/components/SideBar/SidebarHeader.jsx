import React from "react";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
function SidebarHeader() {
  return (
    <div>
      <div className="dropdown general-dropdown">
        <div className="side-bar__header ">
          <div
            className="side-bar__header__button dropdown-toggle"
            id="fetchGeneralInfo"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className="side-bar__header__info ">
              <button className="side-bar__header__team-name c-button-unstyled">
                <span>Fetch</span>
                <KeyboardArrowDownIcon />
              </button>
            </div>
          </div>
          <button className="c-button-unstyled send-button">
            <SendRoundedIcon style={{ height: 16 }} />
          </button>
          <ul className="dropdown-menu" aria-labelledby="fetchGeneralInfo">
            <div aria-hidden="true" className="c-menu_item__header">
              <div className="server-logo">
                <big>
                  <strong>F</strong>
                </big>
              </div>
              <span>Fetch</span>
            </div>
            <div
              className="dropdown-item"
              role="button"
              data-bs-toggle="modal"
              data-bs-target="#createChannel"
            >
              Create channel
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SidebarHeader;
