import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/editprofile.css'
import { saveUserInfo, selectDataState, selectDocId, selectUser } from '../../features/appSlice';
import { auth, db } from '../../firebase';
import InputSection from './InputSection'
function EditProfile() {
    const saveChange = true;
    const userInf = useSelector(selectUser);
    const [notification, setNotification] = useState(false)
    const dataUpdated = useSelector(selectDataState)
    const [toggle, setToggle] = useState(false)
    const [users, loading] = useCollection(db.collection('users'));
    const user = users?.docs.find(elem => elem.data().uid === userInf?.uid);
    const userData = user?.data();
    const handleSaveChange = (e) => {
        e.preventDefault();
        setToggle(!toggle);
        setNotification(true);
        setTimeout(() => {
            setNotification(false);
        }, 1000);  
    }
    const dispatch = useDispatch();
    const saveUserToRedux = async () => {
        
        if(userData){
            dispatch(saveUserInfo({user: userData}));
            console.log("dispatched "+ userData.whatIDo)
        }
        else
        console.log("No dispatch")
    }
    
    useEffect(() => {
        if(dataUpdated){
            saveUserToRedux()
        }
        
    }, [dataUpdated])
   


    return(
        <div className="modal fade" id="editProfile" tabIndex="-1" aria-labelledby="editProfile" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable c-modal-dialog modal-dialog-centered">
                <div className="modal-content c-modal-content">
                    <div className="c-modal__header">
                        <div className="c-modal__header__title">
                            <h1><div className="text">Edit your propfile</div></h1>
                        </div>{
                        (notification===true&&<div className="notification badge bg-success">
                            Your info was successfully updated!
                        </div>)}
                    </div>

                    <div className="c-modal__body">
                        <div className="c-modal__body__section" style={{width: 700}}>
                            <div className="c-modal__body__columns">
                                <div className="col-sm-8 c-input-field">

                                    <InputSection
                                    label = "Display name"
                                    name = "displayName"
                                    type = "text"
                                    saveChange = {saveChange}
                                    toggle = {toggle}
                                    />
                                    <InputSection
                                    label = "What I do"
                                    name = "whatIDo"
                                    type = "text"
                                    saveChange = {saveChange}
                                    toggle = {toggle}
                                    />
                                    
                                </div>

                                <div className="col-sm-4 c-profile-photo-field">
                                    <InputSection
                                    label = "Profile photo"
                                    type = "photo"
                                    saveChange = {saveChange}  
                                    toggle = {toggle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="c-modal__footer">
                        <button className="btn btn-light cancel-button c-button--medium" data-bs-dismiss="modal">
                            Cancel
                        </button>

                        <button className="btn btn-success save-button c-button--medium" onClick={handleSaveChange}>
                            Save Changes
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
