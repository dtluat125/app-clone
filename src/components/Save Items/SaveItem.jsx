import React from "react";

function SaveItem({
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
  isSaved,
}) {
  return (
    <div className="message-container" id={"a" + id}>
      <div className="message__label"></div>
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
              <ActionButton
                onSelect={addReaction}
                action={openMovingEmojiMart}
                emoji={<InsertEmoticonIcon />}
                title="Find a reaction"
              />
              <ActionButton
                action={replyInThread}
                emoji={<ReplyIcon />}
                title="Reply in thread"
              />
              <ActionButton
                action={shareMessage}
                emoji={<ForwardOutlinedIcon />}
                title="Share message"
              />
              <ActionButton
                action={saveItem}
                emoji={
                  !isSaved ? (
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

export default SaveItem;
