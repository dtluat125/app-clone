import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/appSlice";

function Reaction({ emoji, count, senders, onClick }) {
  const user = useSelector(selectUser);
  const [isSender, setIsSender] = useState(false);
  useEffect(() => {
      if(senders?.includes(user?.displayName)){
        setIsSender(true);
      }
      else (setIsSender(false))
  }, )

  return (
    <button className={isSender?"c-button-unstyled c-reaction active":"c-button-unstyled c-reaction"} onClick={() => onClick(emoji)}>
      <div className="c-reaction__emoji">{emoji}</div>
      <span className="c-reaction__count">{count}</span>
    </button>
  );
}

export default Reaction;
