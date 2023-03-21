import React from "react";
import styles from "./styles.module.css";

const getRandomNumber = () => (Math.random() > 0.5 ? 1 : 0);

function Background() {
  const totalDivisionsWidth = Math.floor(window.innerWidth / 16);
  const totalDivisionsHeight = Math.floor(window.innerHeight / 16);

  return (
    <div className={styles.container}>
      {Array(totalDivisionsWidth)
        .fill()
        .map((_, index1) => {
          return (
            <div
              key={index1}
              className={styles.binaryText}
              style={{
                left: `${(100 / totalDivisionsWidth) * index1}%`,
                "--scale": `${(Math.floor(Math.random() * 6) + 5) * 0.1}`,
                animationDuration: `${Math.floor(Math.random() * 11) + 5}s`,
              }}
            >
              {Array(totalDivisionsHeight)
                .fill()
                .map(() => getRandomNumber())
                .map((number, index2) => {
                  return (
                    <React.Fragment key={index2}>
                      {number}
                      <br />
                    </React.Fragment>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
}

export default Background;
