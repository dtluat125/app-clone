import React from 'react'
import {useDispatch, useSelector} from "react-redux"
import { enterRoom, selectRoomId } from '../../features/appSlice'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';



function SidebarOption({icon, title, photoURL, id, email, isOnline}) {
    const dispatch = useDispatch();
    const seeAllDm = () => {}
    const selectChannel = () => {
        if(id){
           dispatch(
               enterRoom({
                   roomId: id
               })
           )
        }
    }

    const selectPerson = () => {
        if(id){
            return
        }
    }

    const roomId = useSelector(selectRoomId)
    return(
        (<div className={roomId === id?"sidebar__option-container active":"sidebar__option-container"} tabIndex="1" role="button" onClick={(id&&!photoURL)?selectChannel:(photoURL)?selectPerson:seeAllDm}>
            {icon&&
            <div className="sidebar__icon">
                {icon}
            </div>}
            {icon?
            <div className="sidebar__option__title">
                {title}
            </div> : <div className="sidebar__option__channel">
                {(!photoURL) ?<span>#</span>:<img src={photoURL} alt="avatar"/>}
                  <FiberManualRecordIcon className={photoURL?isOnline?"status online":"status offline":"no-status"}/>
                  {title?title:email}
            </div>          
        } 
        
            
        </div>)
    )
}

export default SidebarOption

