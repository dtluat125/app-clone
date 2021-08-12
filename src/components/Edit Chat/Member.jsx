import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setSelectedUser, setUserProfileUid } from '../../features/appSlice';

function Member({user, roomOwner, addUser, dropdownItem, filterText}) {
    const dispatch = useDispatch()
    const loginUser = useSelector(selectUser)
    const photoURL = user?.photoURL?user.photoURL:"default-avatar.jpg";
    const name = user?.displayName?user.displayName:user.email;
    const status = user?.isOnline;
    const sendUserUid = () => {
        dispatch(setSelectedUser({
            selectedUser: user
        }))
    }
    if((name.toLowerCase().indexOf(filterText)!==-1||filterText===""))
    return (
        <div className="member" role="button" data-bs-toggle={!dropdownItem?"modal":"false"}
        data-bs-target="#profileModal" onClick={!dropdownItem?sendUserUid:() => {}}>{(<>
            <div className = "member__info">
                <div className="member__avatar" style={{backgroundImage: `url(${photoURL})`}}></div>
                <div className="member__name"><strong>{name} {user?.uid===loginUser.uid?"(You)":""}</strong></div>
                <div className="member__status"><FiberManualRecord className = {status?"status active":"status"}/></div>
            </div>
            {(loginUser?.uid === roomOwner?.uid)&&
            <div className="interact-button">
                <span role="button" data-bs-toggle="modal" data-bs-target = "#removeAlertModal"><strong>Remove</strong></span>

            </div>}
            {dropdownItem&&
            <div className="interact-button">
                <span role="button" onClick = {addUser}><strong>Add</strong></span>
            </div>
            }</>)}
        </div>
    )
    else return (<div></div>)
}

export default Member
