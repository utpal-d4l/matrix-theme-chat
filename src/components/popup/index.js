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

  const onButtonClickSecondary = () => {
    close();
    content.current?.onClickSecondary();
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
        <div className={styles.buttonContainer}>
          {!!content.current.buttonTextSecondary && (
            <Button
              buttonText={content.current.buttonTextSecondary}
              onClick={onButtonClickSecondary}
              className={styles.buttonSecondary}
            />
          )}
          <Button
            buttonText={content.current.buttonText}
            onClick={onButtonClick}
          />
        </div>
      </div>
    </>
  );
}

export default Popup;
