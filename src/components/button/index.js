import React from "react";
import { classNames } from "../../utils/common";
import styles from "./styles.module.css";

function Button({
  buttonText = "",
  onClick = () => {},
  className = "",
  style = {},
  disabled = false,
  buttonType = Button.TYPES.BUTTON,
}) {
  return (
    <button
      onClick={onClick}
      type={buttonType}
      className={classNames([...className.split(" "), styles.button])}
      style={style}
      disabled={disabled}
      aria-label={buttonText}
    >
      {buttonText}
    </button>
  );
}

Button.TYPES = Object.freeze({
  BUTTON: "button",
  SUBMIT: "submit",
  RESET: "reset",
});

export default Button;
