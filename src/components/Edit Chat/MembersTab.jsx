import React, { useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import Member from "./Member";
import SearchIcon from "@material-ui/icons/Search";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useState } from "react";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/appSlice";
function MembersTab({ roomMembers, roomOwner, id }) {
  const [users, loading] = useCollection(db.collection("users"));
  let userInf = useSelector(selectUser)
  let membersList = [];
  users?.docs.map((doc) => {
    if (roomMembers?.includes(doc.data().uid)) {
      membersList.push(doc.data());
    }
  });

  // Handle Add people
  const [isAdded, setIsAdded] = useState(false);
  let membersArr = roomMembers?.slice();
  const addUser = (user) => {
    if (user && roomMembers&& !membersArr.includes(user?.uid)) {
      membersArr.push(user.uid);
      db.collection("room")
        .doc(id)
        .update({
          members: membersArr,
        })
        .then((data) => {
          let input = `is added by ${userInf?.displayName}.`;
          db.collection("room").doc(id).collection("messages").add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user.displayName,
            userImage: user.photoURL,
            uid: user.uid,
          });
          setIsAdded(true);
        });
    }
  };

  const addAllUser = () => {
    if (users && roomMembers) {
      users?.docs.map((doc) => {
        addUser(doc.data())
      });
    }
  };

  // Handle Search Member
  const [searchMemberInput, setSearchMemberInput] = useState("");
  const [searchAddInput, setSearchAddInput] = useState("");
  const searchMemberInputHandler = (e) => {
    setSearchMemberInput(e.target.value);
  };
  const searchAddInputHandler = (e) => {
    setSearchAddInput(e.target.value);
  };
  return (
    <div
      class="tab-pane fade channel-details__members"
      id="members"
      role="tabpanel"
      aria-labelledby="members-tab"
    >
      <div className="channel-details__members__header">
        <div className="form-group">
          <SearchIcon className="search-icon" />
          <input
            onChange={searchMemberInputHandler}
            type="text"
            className="form-control"
            placeholder="Find members"
            value={searchMemberInput}
          />
        </div>
      </div>

      <div className="channel-details__members__list">
        <div className="dropdown">
          <div
            className="member dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
            id="addUsers"
          >
            <div className="member__info">
              <div className="member__avatar">
                <PersonAddIcon />
              </div>
              <div className="member__name">
                <strong>Add people</strong>
              </div>
            </div>
          </div>
          <div
            className="dropdown-menu"
            aria-labelledby="addUsers"
            style={{ maxHeight: 300, maxWidth: 100 + "%", width: "100%" }}
          >
            <div className="form-group" style={{ padding: "10px 25px" }}>
              <label htmlFor="" className="form-label">
                Find user
              </label>
              <input
                onChange={searchAddInputHandler}
                type="text"
                className="form-control"
              />
            </div>
            <button
              className="c-button-unstyled c-button--medium c-button"
              style={{ marginLeft: 25 }}
              onClick={() => addAllUser()}
              role="button"
            >
              <strong>Add all user</strong>
            </button>
            {users?.docs.map((doc) => {
              let user = doc.data();
              let checked = membersList.find((elem) => elem.uid === user.uid);
              if (!checked)
                return (
                  <Member
                    filterText={searchAddInput.toLowerCase()}
                    user={user}
                    className="dropdown-item"
                    dropdownItem={true}
                    addUser={() => addUser(user)}
                  />
                );
            })}
          </div>
        </div>
        {membersList.map((user) => {
          return (
            <Member
              filterText={searchMemberInput.toLowerCase()}
              user={user}
              roomOwner={roomOwner}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MembersTab;
