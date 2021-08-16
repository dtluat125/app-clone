import { Picker } from "emoji-mart";
import React from "react";

function ActionButton({ emoji, title, action, onSelect }) {
  return (
    <div
      onClick={() => action(emoji)}
      className="c-button-unstyled message-action__button"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title={title}
    >
      {emoji}
    </div>
  );
}

export default ActionButton;
