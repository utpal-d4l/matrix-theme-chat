import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import { firebaseAuth } from "../../appInit";
import { openPopup, showApiError } from "../../utils/common";
import {
  addRoom,
  findRoom,
  initiateAnonymousLogin,
  initiateLogin,
  isUserAuthenticated,
  logout,
} from "../../utils/firebaseUtils";
import Button from "../button";
import styles from "./styles.module.css";

const text =
  "Hello World! Welcome to the matrix. It's time to get off the grid and into the matrix. Please create a new module or enter an exisiting module shared by your friends:".split(
    ""
  );

const LETTER_DELAY = 0.05;

function Home({ setRoomDetails }) {
  const [module, setModule] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(isUserAuthenticated());

  const label = useMemo(() => {
    return text.map((char, index) => {
      return (
        <span
          key={index}
          className={styles.homeText}
          style={{ animationDelay: `${0.05 * index}s` }}
        >
          {char}
        </span>
      );
    });
  }, []);

  const onPressEnterRoom = () => {
    findRoom(module)
      .then((room) => {
        if (room.exists()) {
          const roomDetails = { name: room.data().name, id: room.id };
          setRoomDetails(roomDetails);
          try {
            localStorage.setItem("roomDetails", JSON.stringify(roomDetails));
          } catch (error) {}
        } else {
          openPopup({
            title:
              "This module does not exist. Please enter a correct name or create a new module instead.",
            buttonText: "Close",
          });
        }
      })
      .catch(showApiError);
  };

  const onPressCreateRoom = () => {
    addRoom(module)
      .then((room) => {
        const roomDetails = { name: module, id: room.id };
        setRoomDetails(roomDetails);
        try {
          localStorage.setItem("roomDetails", JSON.stringify(roomDetails));
        } catch (error) {}
      })
      .catch(showApiError);
  };

  const handleRoomInput = (roomInputType) => {
    // room input type 1 means enter existing room and 2 means create new room
    const handleCallback =
      roomInputType === 1 ? onPressEnterRoom : onPressCreateRoom;

    if (!isUserAuthenticated()) {
      openPopup({
        title:
          "Looks like you are not plugged into the matrix. Please plug in to continue",
        buttonText: "Plug in",
        buttonTextSecondary: "Anonymous",
        onClickSecondary: () =>
          initiateAnonymousLogin().then(handleCallback).catch(showApiError),
        onClick: () => initiateLogin().then(handleCallback).catch(showApiError),
      });
    } else {
      handleCallback();
    }
  };

  useEffect(() => {
    const totalDelay = LETTER_DELAY * text.length * 1000;
    setTimeout(() => {
      setShowInput(true);
    }, totalDelay);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        let localRoomDetails;
        try {
          localRoomDetails = JSON.parse(localStorage.getItem("roomDetails"));
        } catch (error) {}
        if (localRoomDetails) setRoomDetails(localRoomDetails);
      } else setIsAuthenticated(false);
    });

    return () => unsub();
  }, [setRoomDetails]);

  return (
    <>
      {isAuthenticated && (
        <div className={styles.logoutButton}>
          <Button
            buttonText="Plug out"
            onClick={() =>
              logout()
                .catch(showApiError)
                .finally(() => {
                  try {
                    localStorage.removeItem("roomDetails");
                  } catch (error) {}
                })
            }
          />
        </div>
      )}
      <form
        className={styles.homeContainer}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>
          {label}
          {showInput && (
            <div>
              <input
                type="text"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                required
                className={styles.homeInput}
                autoFocus
              />
              <div className={styles.buttonContainer}>
                <Button
                  buttonText="Enter existing"
                  className={styles.button}
                  disabled={!module}
                  onClick={() => handleRoomInput(1)}
                />
                <Button
                  buttonText="Create new"
                  className={styles.button}
                  disabled={!module}
                  onClick={() => handleRoomInput(2)}
                />
              </div>
            </div>
          )}
        </label>
      </form>
    </>
  );
}

export default Home;
