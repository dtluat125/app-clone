import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/appSlice";
import { db } from "../../firebase";
import DropdownItem from "./DropdownItem";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
function SuggestionList({ mode, filterText, actualText }) {
  const [channels, loading, error] = useCollection(db.collection("room"));
  const [users] = useCollection(db.collection("users"));
  const user = useSelector(selectUser);
  const uid = user?.uid;

  return (
    <div className="c-search__suggestion-list">
      <div className="c-search__content__header">
        {mode === "channels" && <span>Recent channels</span>}
        {mode === "users" && <span>Recent users</span>}
      </div>
      {mode === "channels" && (
        <>
          {channels?.docs.map((doc) => {
            let isPrivate = doc.data().isPrivate;
            let members = doc.data().members;
            if ((members?.includes(uid) && isPrivate) || !isPrivate)
              return (
                <DropdownItem
                  name={doc.data().name}
                  icon={isPrivate ? <LockRoundedIcon /> : "#"}
                  id={doc.id}
                  filterText={filterText + actualText}
                />
              );
          })}
        </>
      )}
      {mode === "users" && (
        <>
          {users?.docs.map((doc) => {
            return (
              <DropdownItem
                name={
                  doc.data().displayName
                    ? doc.data().displayName
                    : doc.data().email
                }
                photoURL={
                  doc.data().photoURL
                    ? doc.data().photoURL
                    : "default-avatar.jpg"
                }
                uid={doc.data().uid}
                filterText={filterText + actualText}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default SuggestionList;
