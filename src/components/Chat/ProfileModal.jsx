import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enterDirectMessage, selectChosenUser, selectLocalTime, selectMessageSend, selectUser, sendMessage, setTime, showSecondaryWorkspace } from '../../features/appSlice'
import SmallLoader from '../SmallLoader'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

function ProfileModal({loading}) {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const selectedUser = useSelector(selectChosenUser);
    const photoURL = selectedUser?.photoURL;
    const displayName  = selectedUser?.displayName;
    const uid = selectedUser?.uid;
    const email = selectedUser?.email;
    const isOnline = selectedUser?.isOnline
    const openSecondView = () => {
        dispatch(showSecondaryWorkspace({
            isShowingSecondaryWorkspace: true
        }))
    }
    // Handle sending message
    const sendMessage = () => {
        console.log("?")
        dispatch(enterDirectMessage({
            directMessageUid: uid
        }))
        
        
       
    }

    // Set up local time
    const localTime = useSelector(selectLocalTime);
    const updateTime = () => {
        var currentTime = new Date()
        var hours = currentTime.getHours()
        var minutes = currentTime.getMinutes()
        if (minutes < 10){
        minutes = "0" + minutes
        }
        var localTime = hours + ":" + minutes + " ";
       
        dispatch(setTime({
            localTime: localTime
        }))
    }

    useEffect(() => {
        setInterval(updateTime, 1000)
       
    }, [localTime])
    return (
        <div id = "profileModal"  className="modal"  aria-hidden="true" tabIndex="-1" aria-labelledby="profileModal">
            <div className="modal-dialog modal-dialog-centered">
            
                <div className="modal-content profile-card">
                {loading?<SmallLoader/>:
                <>
                    <div className="profile-card__header">
                        <div role="button" data-bs-dismiss="modal" onClick={openSecondView} className="profile-card__picture" style = {{backgroundImage: `url(${photoURL})`}}>

                        </div>
                    </div>
                    <div className="profile-card__name">
                        <div className="profile-card__name__title" role="button" onClick={openSecondView} data-bs-dismiss="modal">
                            {displayName}
                        </div>
                        <div className={isOnline?"profile-card__name__status online": "profile-card__name__status"}>
                            <FiberManualRecordIcon className="status"/>
                        </div>
                    </div>

                    <div className="profile-card__link" role="button" onClick={openSecondView} data-bs-dismiss="modal" data-bs-target=".editChat">
                        View full profile
                    </div>

                    <div className="profile-card__time-field">
                        <div className="profile-card__time-field__label">
                        Local time
                        </div>
                        <div className="profile-card__time-field__value">
                            {localTime}
                        </div>
                    </div>

                    <div className="profile-card__buttons">
                        <button className="c-button--medium c-button" onClick={sendMessage} data-bs-dismiss="modal">Message</button>
                        {user?.uid === uid&&<button className="c-button--medium c-button" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#editProfile">Edit Profile</button>}
                    </div>


                </>
                }
                </div>
            </div>
        </div>
    )
}

export default ProfileModal
