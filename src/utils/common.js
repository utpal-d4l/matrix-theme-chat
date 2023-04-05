import eventEmitter from "../helpers/eventEmitter";

export const classNames = (names = []) => names.filter(Boolean).join(" ");

export const openPopup = ({
  title = "",
  buttonText = "",
  onClick = () => {},
  buttonTextSecondary = "",
  onClickSecondary = () => {},
}) => {
  eventEmitter.emit("SET_POPUP", {
    title,
    buttonText,
    onClick,
    buttonTextSecondary,
    onClickSecondary,
  });
};

export const showApiError = (error) => {
  openPopup({
    title:
      process.env.NODE_ENV === "development"
        ? JSON.stringify(error)
        : "Oops! Something went wrong. Please try again later.",
    buttonText: "OK",
  });
};

export const copyRoomId = (roomId = "") => {
  navigator.clipboard.writeText(roomId).then(() => {
    openPopup({
      title:
        "Module name has been copied to clipboard. You can share it with others to join the module.",
      buttonText: "Close",
    });
  });
};
