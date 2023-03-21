import eventEmitter from "../helpers/eventEmitter";

export const classNames = (names = []) => names.filter(Boolean).join(" ");

export const openPopup = ({
  title = "",
  buttonText = "",
  onClick = () => {},
}) => {
  eventEmitter.emit("SET_POPUP", {
    title,
    buttonText,
    onClick,
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
