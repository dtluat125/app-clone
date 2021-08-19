import React from "react";

function AutoSearchButton({ icon, name, action }) {
  return (
    <div className="buttons-list__item">
      <button
        onClick={action}
        className="c-button-unstyled c-search-autocomplete__search-item"
      >
        {icon}
        <span className="c-search-autocomplete__search-item__title">{name}</span>
      </button>
    </div>
  );
}

export default AutoSearchButton;
