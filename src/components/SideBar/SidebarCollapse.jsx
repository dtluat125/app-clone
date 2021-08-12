import React from 'react'
import { db } from '../../firebase';

function SidebarCollapse(props){
    let isShowing = false;
    
    const showHandler = () => {
        isShowing = !isShowing
    }
    return(
        <div className="collapse-container">
            <div className="sidebar__option-container"
            type="button" data-bs-toggle="collapse" data-bs-target={`#${props.id}`} aria-expanded="true" aria-controls={`${props.id}`}
            onClick={showHandler}
            >
                <div className={isShowing? props.title==="Channels"?"item-icon arrow-rotate":"item-icon":"item-icon"}>
                    {props.icon}
                </div>
                <div className="item-title">
                    {props.title}
                </div>
                
            </div>
            {
            props.addIcon && <div className= "add-channel-button" role="button" data-bs-toggle="modal" data-bs-target="#createChannel">
                {props.addIcon}
            </div>        
            }
        
            <div className="collapse" id={`${props.id}`}>
                {props.options && props.options.map((option) =>{return option})}
            </div>
        

        </div>
    )
}

export default SidebarCollapse
