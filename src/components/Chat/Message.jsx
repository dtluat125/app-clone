import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  enterDirectMessage,
  selectDirectMessageRoom,
  selectDocId,
  selectRoomId,
  selectSavedItemId,
  selectSavedItemsToggle,
  selectSecondaryWorkspaceStatus,
  selectThreadMessageDirectId,
  selectThreadMessageRoomId,
  selectUser,
  selectUserProfileUid,
  setOnOpenProfile,
  setOnReplyInThread,
  setOnSave,
  setOnSendingReaction,
  setSavedItemId,
  setSavedItemsToggle,
  setSelectedUser,
  setThreadMessageDirectId,
  setThreadMessageId,
  setThreadMessageRoomId,
  setTime,
  setUserProfileUid,
  showSecondaryWorkspace,
} from "../../features/appSlice";
import { db } from "../../firebase";
import ActionButton from "./ActionButton";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import ReplyIcon from "@material-ui/icons/Reply";
import ForwardOutlinedIcon from "@material-ui/icons/ForwardOutlined";
import TurnedInNotOutlinedIcon from "@material-ui/icons/TurnedInNotOutlined";
import TurnedInIcon from "@material-ui/icons/TurnedIn";
import Reaction from "./Reaction";
import firebase from "firebase";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import { useRef } from "react";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
const Message = React.forwardRef(
  (
    {
      id,
      userName,
      userImage,
      message,
      timestamp,
      uid,
      description,
      reactions,
      onClick,
      emojiMartPosition,
      emojiReact,
      reactToggle,
      savedBy,
      isSaved,
      moveToItem,
      inThread,
      messageRoomId,
      messageRoomDirectId,
      replyTo,
      inMainSave
    },
    ref
  ) => {
    const userInf = useSelector(selectUser);
    const displayName = userInf?.uid === uid ? "You" : userName;
    const [onHover, setOnHover] = useState(false);
    const roomId = useSelector(selectRoomId);
    const directId = useSelector(selectDirectMessageRoom);
    const [subMessages] = useCollection(
      id &&
        (roomId
          ? db
              .collection("room")
              .doc(roomId)
              .collection("messages")
              .doc(id)
              .collection("subMessages")
              .orderBy("timestamp", "asc")
          : directId
          ? db
              .collection("directRooms")
              .doc(directId)
              .collection("messages")
              .doc(id)
              .collection("subMessages")
              .orderBy("timestamp", "asc")
          : undefined)
    );
    // Save selected user Info
    const [users, loading] = useCollection(db.collection("users"));
    const userUid = useSelector(selectUserProfileUid);
    const user = users?.docs.find((elem) => elem.data().uid === userUid);
    const photoURL = user?.data().photoURL
      ? user.data().photoURL
      : "default-avatar.jpg";
    const isOnline = user?.data().isOnline;
    const time = new Date(timestamp?.toDate());
    var date = time.getDate();
    var month = time.getMonth();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var localTime = hours + ":" + minutes + " ";
    var timeWithDate = "";
    console.log(date + month);
    const [onSendingUid, setOnSendingUid] = useState(false);
    //
    // Open emojimart for each message
    const [position, setPosition] = useState(null);
    const elementId = isSaved ? "aa" + id : inThread ? "aaa" + id : "a" + id;
    const openMovingEmojiMart = () => {
      const chatMessage = document.querySelector("#" + elementId);

      const positionInfo = chatMessage.getBoundingClientRect();
      setPosition(positionInfo);
      onClick({ positionInfo, id });
    };
    // Hover message handle
    const hoverHandler = () => {
      if (description || (emojiMartPosition && emojiMartPosition.id !== id)) {
        setOnHover(false);
      } else setOnHover(true);
    };
    const notHoverHandler = () => {
      if (emojiMartPosition && emojiMartPosition.id === id) {
        setOnHover(true);
      } else setOnHover(false);
    };

    useEffect(() => {
      if (!emojiMartPosition) {
        setOnHover(false);
      }
    }, [emojiMartPosition]);

    const dispatch = useDispatch();
    const sendUserUid = () => {
      if (!loading) {
        dispatch(
          setUserProfileUid({
            userUid: uid,
          })
        );
        // Save selected User Inf
        setOnSendingUid(true);
        console.log("dispatched");
      }
    };
    console.log("...");
    const isOpen = useSelector(selectSecondaryWorkspaceStatus);
    useEffect(() => {
      if (onSendingUid)
        dispatch(
          setSelectedUser({
            selectedUser: {
              displayName: user?.data().displayName,
              email: user?.data().email,
              uid: userUid,
              photoURL: photoURL,
              isOnline: isOnline,
              whatIDo: user?.data().whatIDo,
            },
          })
        );
      return () => {
        setOnSendingUid(false);
      };
    }, [onSendingUid, userUid, isOpen]);
    const doNothing = () => {};
    const docUserId = useSelector(selectDocId);
    // Handle message actions

    // Create reaction
    const [emoji, setEmoji] = useState("");
    const addReaction = (e) => {
      let emoji = e.native;
      setEmoji(emoji);
    };
    // Reply in thread
    const replyInThread = () => {
      dispatch(
        showSecondaryWorkspace({
          isShowingSecondaryWorkspace: true,
        })
      );
      dispatch(
        setOnSave({
          onSave: null,
        })
      );

      dispatch(
        setOnOpenProfile({
          onOpenProfile: null,
        })
      );
      dispatch(
        setOnReplyInThread({
          onReplyInThread: true,
        })
      );
      dispatch(
        setThreadMessageId({
          threadMessageId: id,
        })
      );
      dispatch(
        setThreadMessageRoomId({
          threadMessageRoomId: roomId,
        })
      );
      dispatch(
        setThreadMessageDirectId({
          threadMessageDirectId: directId,
        })
      );
    };
    const shareMessage = () => {};
    const threadMessageRoomId = useSelector(selectThreadMessageRoomId);
    const threadMessageDirectId = useSelector(selectThreadMessageDirectId);
    // Save item
    const savedItemsToggle = useSelector(selectSavedItemsToggle);
    const saveItem = async () => {
      dispatch(
        setSavedItemsToggle({
          savedItemsToggle: !savedItemsToggle,
        })
      );
      let savedByArr = savedBy ? savedBy : [];
      if (id) {
        if (!savedBy || !savedBy.includes(docUserId)) {
          savedByArr.push(docUserId);
          if (replyTo) {
            db.collection("users")
              .doc(docUserId)
              .collection("savedItems")
              .add({
                messageId: id ? id : null,
                roomId: threadMessageRoomId ? threadMessageRoomId : null,
                roomDirectId: threadMessageDirectId
                  ? threadMessageDirectId
                  : null,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                replyTo: replyTo,
              });
            if (threadMessageRoomId) {
              db.collection("room")
                .doc(threadMessageRoomId)
                .collection("messages")
                .doc(replyTo)
                .collection("subMessages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            } else if (threadMessageDirectId) {
              db.collection("directRooms")
                .doc(threadMessageDirectId)
                .collection("messages")
                .doc(replyTo)
                .collection("subMessages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            }
          } else if (inThread) {
            db.collection("users")
              .doc(docUserId)
              .collection("savedItems")
              .add({
                messageId: id ? id : null,
                roomId: threadMessageRoomId ? threadMessageRoomId : null,
                roomDirectId: threadMessageDirectId ? directId : null,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });

            if (threadMessageRoomId) {
              db.collection("room")
                .doc(threadMessageRoomId)
                .collection("messages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            } else if (threadMessageDirectId) {
              db.collection("directRooms")
                .doc(threadMessageDirectId)
                .collection("messages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            }
          } else {
            db.collection("users")
              .doc(docUserId)
              .collection("savedItems")
              .add({
                messageId: id ? id : null,
                roomId: roomId ? roomId : null,
                roomDirectId: directId ? directId : null,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });

            if (roomId) {
              db.collection("room")
                .doc(roomId)
                .collection("messages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            } else if (directId) {
              db.collection("directRooms")
                .doc(directId)
                .collection("messages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            }
          }
        } else {
          let i = savedByArr.indexOf(docUserId);
          savedByArr.splice(i, 1);
          const snapshot = await db
            .collection("users")
            .doc(docUserId)
            .collection("savedItems")
            .where("messageId", "==", id)
            .get();
          let itemId = null;
          console.log(snapshot);
          snapshot.forEach((doc) => (itemId = doc.id));
          itemId &&
            db
              .collection("users")
              .doc(docUserId)
              .collection("savedItems")
              .doc(itemId)
              .delete()
              .then(() => console.log("Delete!"))
              .catch((err) => console.log(err.message));

          if (replyTo) {
            if (threadMessageRoomId) {
              db.collection("room")
                .doc(threadMessageRoomId)
                .collection("messages")
                .doc(replyTo)
                .collection("subMessages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            } else if (threadMessageDirectId) {
              db.collection("directRooms")
                .doc(threadMessageDirectId)
                .collection("messages")
                .doc(replyTo)
                .collection("subMessages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            }
          } else if (inThread) {
            if (threadMessageRoomId) {
              db.collection("room")
                .doc(threadMessageRoomId)
                .collection("messages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            } else if (threadMessageDirectId) {
              db.collection("directRooms")
                .doc(threadMessageDirectId)
                .collection("messages")
                .doc(id)
                .update({
                  savedBy: savedByArr,
                });
            }
          } else if (roomId) {
            db.collection("room")
              .doc(roomId)
              .collection("messages")
              .doc(id)
              .update({
                savedBy: savedByArr,
              });
          } else if (directId) {
            db.collection("directRooms")
              .doc(directId)
              .collection("messages")
              .doc(id)
              .update({
                savedBy: savedByArr,
              });
          }
        }
      } else return;
    };
    // Send reaction to db

    const sendReaction = (emoji) => {
      dispatch(
        setOnSendingReaction({
          onSendingReaction: true,
        })
      );
      setTimeout(() => {
        dispatch(
          setOnSendingReaction({
            onSendingReaction: false,
          }),
          500
        );
      });
      if (id) {
        if (isSaved)
          dispatch(
            setSavedItemsToggle({ savedItemsToggle: !savedItemsToggle })
          );
        let reactionsArr = reactions ? reactions.slice() : [];
        const findEmoji = reactionsArr.findIndex((reaction, index) => {
          if (reaction.title === emoji) {
            return true;
          }
        });

        if (findEmoji > -1) {
          let count = reactionsArr[findEmoji].count;
          let reactUser = userInf.displayName;
          let senders = reactionsArr[findEmoji].senders;
          if (senders.includes(userInf?.displayName)) {
            let userIndex = senders.indexOf(reactUser);
            senders.splice(userIndex, 1);
            count = count - 1;
          } else {
            count = count + 1;
            senders.push(reactUser);
          }
          reactionsArr[findEmoji].senders = senders;
          reactionsArr[findEmoji].count = count;
        } else if (findEmoji === -1) {
          let count = 0;
          let reactUser = userInf.displayName;
          let senders = [];
          senders.push(reactUser);
          reactionsArr.push({
            title: emoji,
            senders: senders,
            count: count + 1,
          });
        }
        if (inThread) {
          if (threadMessageDirectId)
            db.collection("directRooms")
              .doc(threadMessageDirectId)
              .collection("messages")
              .doc(id)
              .update({
                reactions: reactionsArr,
              });
          else if (threadMessageRoomId) {
            db.collection("room")
              .doc(threadMessageRoomId)
              .collection("messages")
              .doc(id)
              .update({
                reactions: reactionsArr,
              });
          }
        } else if (replyTo) {
          if (threadMessageDirectId)
            db.collection("directRooms")
              .doc(threadMessageDirectId)
              .collection("messages")
              .doc(replyTo)
              .collection("subMessages")
              .doc(id)
              .update({
                reactions: reactionsArr,
              });
          else if (threadMessageRoomId) {
            db.collection("room")
              .doc(threadMessageRoomId)
              .collection("messages")
              .doc(replyTo)
              .collection("subMessages")
              .doc(id)
              .update({
                reactions: reactionsArr,
              });
          }
        } else if (directId) {
          console.log(id);
          db.collection("directRooms")
            .doc(directId)
            .collection("messages")
            .doc(id)
            .update({
              reactions: reactionsArr,
            });
        } else if (roomId) {
          db.collection("room")
            .doc(roomId)
            .collection("messages")
            .doc(id)
            .update({
              reactions: reactionsArr,
            });
        }
      } else return;
    };

    useEffect(() => {
      if (
        emojiReact &&
        emojiReact !== "" &&
        emojiMartPosition &&
        id === emojiMartPosition?.id
      ) {
        console.log(emojiReact);
        sendReaction(emojiReact);
      }
    }, [reactToggle]);

    // Scroll
    const savedItemId = useSelector(selectSavedItemId);
    useEffect(() => {
      if (savedItemId) {
        ref?.current?.scrollIntoView({});
      }

      return () => {
        setTimeout(() => {
          dispatch(setSavedItemId({ savedItemId: null }));
        }, 1000);
      };
    }, [roomId, directId, savedItemId]);
    // Ref
    const actionRef = useRef(null);

    // Move to channel button
    const moveToChannel = () => {};
    // Thread hover
    const [onThreadHover, setOnThreadHover] = useState(false);
    const onThreadHoverHandler = () => {
      setOnThreadHover(true);
    };
    const notOnThreadHoverHandler = () => {
      setOnThreadHover(false);
    };
    return (
      <div
        ref={ref}
        className={
          (onHover&&!inMainSave)
            ? savedBy?.includes(docUserId)
              ? "message-container active saved"
              : "message-container active"
            : (savedBy?.includes(docUserId)&&!inMainSave)
            ? "message-container saved"
            : "message-container"
        }
        onMouseOver={hoverHandler}
        onMouseOut={notHoverHandler}
        id={elementId}
      >
        {(savedBy?.includes(docUserId)&&!inMainSave) && (
          <div className="message__label">
            <div className="message__label__icon">{<TurnedInIcon />}</div>
            <div role="button" className="message__label__content">
              Added to your saved items
            </div>
          </div>
        )}
        <div className={"message-container__inner"}>
          {(timestamp || description) && (
            <>
              <div
                style={{ backgroundImage: `url(${userImage})` }}
                alt=""
                role="button"
                onClick={uid ? sendUserUid : doNothing}
                data-bs-toggle={uid ? "modal" : "false"}
                data-bs-target="#profileModal"
                className="message__avatar"
              />

              <div className="message__info">
                <div className="status">
                  <a
                    role="button"
                    onClick={uid ? sendUserUid : doNothing}
                    data-bs-toggle={uid ? "modal" : "false"}
                    data-bs-target="#profileModal"
                  >
                    {description ? userName : displayName}
                  </a>{" "}
                  <span>{description ? "" : localTime}</span>
                </div>
                <p className="message">{message}</p>
                <div className="message__reaction-bar">
                  {reactions
                    ? reactions.map((reaction) => {
                        if (reaction.count > 0)
                          return (
                            <Reaction
                              emoji={reaction.title}
                              count={reaction.count}
                              senders={reaction.senders}
                              key={reaction.title}
                              onClick={sendReaction}
                            />
                          );
                      })
                    : ""}
                </div>
                {subMessages?.docs.length > 0 && !inThread &&!inMainSave&& (
                  <div
                    className="message__thread-button"
                    onMouseOver={onThreadHoverHandler}
                    onMouseOut={notOnThreadHoverHandler}
                  >
                    <div
                      className="message__thread-avatar"
                      style={{
                        backgroundImage: `url(${
                          subMessages.docs[subMessages.docs.length - 1].data()
                            .userImage
                        })`,
                      }}
                      alt=""
                      role="button"
                      onClick={
                        subMessages.docs[subMessages.docs.length - 1].data().uid
                          ? sendUserUid
                          : doNothing
                      }
                      data-bs-toggle={uid ? "modal" : "false"}
                      data-bs-target="#profileModal"
                    ></div>
                    <div
                      className="message__thread-count"
                      onClick={replyInThread}
                    >
                      {subMessages?.docs.length > 1
                        ? subMessages?.docs.length + " replies"
                        : subMessages?.docs.length + " reply"}
                    </div>
                    <div
                      className="message__thread-description"
                      onClick={replyInThread}
                    >
                      {!onThreadHover ? (
                        <span className="message__thread-description__content">
                          Last reply
                        </span>
                      ) : (
                        <>
                          <span className="message__thread-description__content">
                            View thread
                          </span>
                          <ArrowForwardIosRoundedIcon className="message__bar-arrow" />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {
            <div
              className={
                onHover ? "c-message__action" : "c-message__action collapse"
              }
            >
              <div className="c-message__action__group">
                {!isSaved && !replyTo && !inThread && (
                  <>
                    <ActionButton
                      action={sendReaction}
                      emoji={"✅"}
                      title="Completed"
                    />
                    <ActionButton
                      action={sendReaction}
                      emoji={"👀"}
                      title="Taking a look..."
                    />
                    <ActionButton
                      action={sendReaction}
                      emoji={"🙌"}
                      title="Nicely done"
                    />
                  </>
                )}
                <ActionButton
                  onSelect={addReaction}
                  action={openMovingEmojiMart}
                  emoji={<InsertEmoticonIcon />}
                  title="Find a reaction"
                />
                {inThread && (
                  <ActionButton
                    action={moveToChannel}
                    emoji={<KeyboardReturnIcon />}
                    title="View in channel"
                  />
                )}
                {!replyTo && !inThread && (
                  <ActionButton
                    action={replyInThread}
                    emoji={<ReplyIcon />}
                    title="Reply in thread"
                  />
                )}
                {/* <ActionButton
                  action={shareMessage}
                  emoji={<ForwardOutlinedIcon />}
                  title="Share message"
                /> */}
                <ActionButton
                  action={saveItem}
                  emoji={
                    !savedBy?.includes(docUserId) ? (
                      <TurnedInNotOutlinedIcon />
                    ) : (
                      <TurnedInIcon style={{ color: "red" }} />
                    )
                  }
                  title="Add to saved items"
                />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
);

export default Message;
