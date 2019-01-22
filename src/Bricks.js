import React from "react";
import classNames from "classnames";
import styles from "./Bricks.module.scss";

const Bricks = ({ bricks, brickLeft = () => {}, brickTop = () => {} }) => {
  return bricks.map((e, index) => {
    const left = brickLeft(index);
    const top = brickTop(index);
    const { durability } = e;
    return (
      <div
        className={classNames(styles.brick, `${styles.brick}-${index}`)}
        key={index}
      >
        <style>
          {`
          .${styles.brick}-${index}{
            --top: ${top}vw;
            --left: ${left}vw;
            --durability: ${durability};
          }
        `}
        </style>
      </div>
    );
  });
};
export default Bricks;
