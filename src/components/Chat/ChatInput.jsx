import React, { useState } from "react";
import { db } from "../../firebase";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/appSlice";
import SendIcon from "@material-ui/icons/Send";
import { Emojify, emojify } from "react-emojione";
import { useEffect } from "react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
function ChatInput({ channelName, channelId, chatRef, isDirect }) {
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();
    if (input != "") {
      if (!channelId) return false;
      if (!isDirect) {
        db.collection("room").doc(channelId).collection("messages").add({
          message: input,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: user.displayName,
          userImage: user.photoURL,
          uid: user.uid,
        });
        db.collection("room")
          .doc(channelId)
          .update({
            usersHaveRead: [user.uid],
          });
      } else {
        db.collection("directRooms").doc(channelId).collection("messages").add({
          message: input,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: user.displayName,
          userImage: user.photoURL,
          uid: user.uid,
        });
        db.collection("directRooms")
          .doc(channelId)
          .update({
            usersHaveRead: [user.uid],
          });
      }
      setInput("");
    }
  };
  chatRef?.current?.scrollIntoView({
    behavior: "smooth",
  });
  // Emoji handler
  const inputChangeHandler = (e) => {
    const newInput = emojify(e.target.value, { output: "unicode" });
    setInput(newInput);
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input + emoji);
  };

  const [emojisOpen, setEmojisOpen] = useState(false);

  const openEmojisList = () => {
    setEmojisOpen(true);
  };

  useEffect(() => {
    const emojisContainer = document.querySelector(".emojis-container");
    const divs = document.querySelectorAll("div:not(.emoji-trigger-button)");
    const chatContainer = document.querySelector(".chat-container");
    const sidebarContainer = document.querySelector(".side-bar-container");
    const inputContainer = document.querySelector("form");
    const emojiTriggerButton = document.querySelector(".emoji-trigger-button");
    const openList = () => {
      emojisContainer.classList.remove("collapse");
    };
    const closeList = () => {
      emojisContainer.classList.add("collapse");
    };

    
    emojiTriggerButton.addEventListener("click", openList);
    // chatContainer.addEventListener("click", closeList);
    // sidebarContainer.addEventListener("click", closeList);
    // inputContainer.addEventListener("click", closeList);
    return () => {
        const removeEventListener = () => {
            emojiTriggerButton.removeEventListener("click", openList)
        }
        removeEventListener();
    }
  });
  console.log(emojisOpen);
  return (
    <div className="chat-input-container">
      <span className="emojis-container collapse">
        <Picker onSelect={addEmoji} />
      </span>
      <form>
        <div
          className="emoji-trigger-button"
          role="button"
          onClick={openEmojisList}
        >
          <InsertEmoticonIcon />
        </div>
        <input
          value={input}
          type="text"
          onChange={inputChangeHandler}
          placeholder={`Message #${channelName}`}
        />
        <button
          onClick={(e) => sendMessage(e)}
          type="submit"
          className="c-button-unstyled send-button"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
