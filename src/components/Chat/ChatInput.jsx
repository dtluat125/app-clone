import React, { useState } from 'react'
import { db } from '../../firebase';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/appSlice';
import SendIcon from '@material-ui/icons/Send';
function ChatInput({channelName, channelId, chatRef, isDirect}) {
    const user = useSelector(selectUser);
    const [input, setInput] = useState("");
    const sendMessage = (e) => {
        e.preventDefault();
        if(input!=""){
       
        if(!channelId) return false;
        if(!isDirect){
        db.collection("room").doc(channelId).collection("messages").add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user.displayName,
            userImage: user.photoURL,
            uid: user.uid
        });
        db.collection("room").doc(channelId).update({
            usersHaveRead: [user.uid]
        })
        }
        else {db.collection("directRooms").doc(channelId).collection("messages").add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user.displayName,
            userImage: user.photoURL,
            uid: user.uid
            });
            db.collection("directRooms").doc(channelId).update({
                usersHaveRead: [user.uid]
            })
        }
        setInput("")}
    }
    chatRef?.current?.scrollIntoView({
        behavior:"smooth"
    });

    const inputChangeHandler = (e) => {
        setInput(e.target.value)
    }
    return (
        <div className="chat-input-container">
            <form >
                <input value={input} type="text" onChange={inputChangeHandler} placeholder={`Message #${channelName}`} />
                <button onClick={(e) => sendMessage(e)} type="submit" className="c-button-unstyled send-button"><SendIcon/></button>
            </form>
        </div>
    )
}

export default ChatInput
