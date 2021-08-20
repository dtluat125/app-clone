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
import SecondaryView from "../SecondaryView";
function ChatInput({ channelName, channelId, chatRef, isDirect, inThread, threadMessageId }) {
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
  const [position, setPosition] = useState(null);
  const openEmojisList = () => {
    let positionInf = document
      .querySelector("#replyToThreadInput")
      .getBoundingClientRect();
    setPosition(positionInf);
  };

  useEffect(() => {
    const emojisContainer = document.querySelector(".emojis-container");
    const divs = document.querySelectorAll("div:not(.emoji-trigger-button)");
    const chatMessages = document.querySelector(".chat-messages");
    const chatHeader = document.querySelector(".chat__header");
    const header = document.querySelector(".header-container");
    const sidebarContainer = document.querySelector(".side-bar-container");
    const inputContainer = document.querySelector("form>input");
    const button = document.querySelector("form>button");
    const emojiTriggerButton = document.querySelector(".emoji-trigger-button");
    const secondaryWorkspace = document.querySelector(
      ".secondary-view-container"
    );

    const openList = () => {
      emojisContainer.classList.remove("collapse");
    };
    const closeList = () => {
      emojisContainer.classList.add("collapse");
    };
    if (!inThread) {
      emojiTriggerButton.addEventListener("click", openList);
      sidebarContainer.addEventListener("click", closeList);
      inputContainer.addEventListener("click", closeList);
      button.addEventListener("click", closeList);
      chatMessages.addEventListener("click", closeList);
      chatHeader.addEventListener("click", closeList);
      header.addEventListener("click", closeList);
      secondaryWorkspace.addEventListener("click", closeList);
    }
    return () => {
      if (!inThread) {
        const removeEventListener = () => {
          emojiTriggerButton.removeEventListener("click", openList);
        };
        removeEventListener();
      }
    };
  }, [emojisOpen]);
  // Send message to thread
  const sendMessageToThread = (e) => {
    e.preventDefault();
    if(input!==""){

    }
  }
  return (
    <div className="chat-input-container" id="replyToThreadInput">
      {inThread ? (
        position && (
          <span className="thread-emojis-container">
            <Picker onSelect={addEmoji} />
          </span>
        )
      ) : (
        <span className="emojis-container collapse">
          <Picker onSelect={addEmoji} />
        </span>
      )}

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
          placeholder={inThread ? "Reply..." : `Message #${channelName}`}
        />
        <button
          onClick={inThread?sendMessageToThread:(e) => sendMessage(e)}
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
