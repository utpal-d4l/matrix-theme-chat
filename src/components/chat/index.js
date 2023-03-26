import { onSnapshot } from "firebase/firestore";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { classNames, copyRoomId, showApiError } from "../../utils/common";
import {
  addMessage,
  getMessageQuery,
  getUser,
} from "../../utils/firebaseUtils";
import Button from "../button";
import styles from "./styles.module.css";

const ListItem = memo(({ user, message, timestamp, isSelf }) => {
  const date = new Date(timestamp);
  const todayStartTimestamp = new Date(
    new Date(Date.now()).toLocaleDateString()
  ).getTime();

  return (
    <li
      className={classNames([styles.chatItem, isSelf && styles.chatItemSelf])}
    >
      <div>{user}</div>
      <div>
        {timestamp >= todayStartTimestamp
          ? date.toLocaleTimeString()
          : date.toLocaleDateString()}
      </div>
      <div>{message}</div>
    </li>
  );
});

function Chat({ roomName, roomId, setRoomDetails }) {
  const [message, setMessage] = useState("");
  const [state, setState] = useState({ data: [] });
  const [inputHeight, setInputHeight] = useState("2.5rem");
  const user = useMemo(() => getUser(), []);
  const listRef = useRef();

  useEffect(() => {
    const query = getMessageQuery(roomId);
    const unsub = onSnapshot(
      query,
      (snapshot) => {
        setState((prevState) => ({
          ...prevState,
          data: prevState.data.concat(
            snapshot.docChanges().map((x) => x.doc.data())
          ),
        }));
      },
      showApiError
    );

    return () => unsub();
  }, [roomId]);

  useEffect(() => {
    if (state.data.length > 0) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [state.data.length]);

  const list = useMemo(() => {
    return (
      <div className={styles.messagesContainer} ref={listRef}>
        <ul>
          {state.data.map(
            (
              { userId = "", timestamp = 0, message = "", userName = "" } = {},
              index
            ) => (
              <ListItem
                key={index}
                user={userName}
                message={message}
                isSelf={userId === user.userId}
                timestamp={timestamp}
              />
            )
          )}
        </ul>
      </div>
    );
  }, [state.data, user.userId]);

  const form = useMemo(() => {
    const onSubmit = (e) => {
      e.preventDefault();
      addMessage(roomId, {
        message,
        userId: user.userId,
        timestamp: Date.now(),
        userName: user.displayName || user.email || user.userId,
      });
      setMessage("");
      setInputHeight("2.5rem");
    };

    const onChange = (e) => {
      setMessage(e.target.value);
      setInputHeight((height) => {
        if (!e.target.value) return "2.5rem";
        else if (height !== e.target.scrollHeight) {
          return `${e.target.scrollHeight}px`;
        }
        return height;
      });
    };

    return (
      <form onSubmit={onSubmit} className={styles.messageInput}>
        <textarea
          value={message}
          onChange={onChange}
          style={{ height: inputHeight }}
        />
        <Button
          buttonText="Send"
          buttonType={Button.TYPES.SUBMIT}
          disabled={!message}
        />
      </form>
    );
  }, [message, user, roomId, inputHeight]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div>{roomName}</div>
          <div>
            <span
              className={styles.roomIdText}
              onClick={() => copyRoomId(roomId)}
            >
              {roomId}
            </span>{" "}
            <em>(You can share this code with others to join the module)</em>
          </div>
        </div>
        <Button
          buttonText="Leave Module"
          onClick={() => {
            setRoomDetails(null);
            try {
              localStorage.removeItem("roomDetails");
            } catch (error) {}
          }}
        />
      </div>
      {list}
      {form}
    </div>
  );
}

export default Chat;
