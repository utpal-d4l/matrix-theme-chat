import React, { useEffect, useRef, useState } from "react";
import eventEmitter from "../../helpers/eventEmitter";
import { classNames } from "../../utils/common";
import Button from "../button";
import styles from "./styles.module.css";

function Popup() {
  const [show, setShow] = useState(false);
  const content = useRef({});

  const close = () => {
    setShow(false);
  };

  const onButtonClick = () => {
    close();
    content.current?.onClick();
  };

  useEffect(() => {
    const unsub = eventEmitter.addEventListener("SET_POPUP", (data) => {
      content.current = data;
      setShow(true);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!show) content.current = {};
  }, [show]);

  return (
    <>
      <div
        className={classNames([styles.overlay, show && styles.overlayVisible])}
        onClick={close}
      />
      <div className={classNames([styles.popup, show && styles.popupVisible])}>
        <button
          type="button"
          onClick={close}
          className={styles.closeButton}
          aria-label="close"
        >
          ✖
        </button>
        {content.current.title}
        <Button
          buttonText={content.current.buttonText}
          onClick={onButtonClick}
          className={styles.button}
        />
      </div>
    </>
  );
}

export default Popup;
