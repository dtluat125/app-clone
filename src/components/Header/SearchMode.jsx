import React from 'react'
import CloseIcon from "@material-ui/icons/Close";
function SearchMode({mode, close}) {
    return (
        <div className="c-search__input-mode">
            <span className="c-search__input-mode__text">
                {mode}
            </span>
            <div className="c-search__input-mode__close-button" onClick={close} role="button">
            <CloseIcon/>
            </div>
            
        </div>
    )
}

export default SearchMode
