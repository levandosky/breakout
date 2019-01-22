import React, { Component } from "react";
import styles from "./Breakout.module.scss";
import Bricks from "./Bricks";
import Bullet from "./Bullet";
import Platform from "./Platform";
import produce from "immer";

export default class Breakout extends Component {
  platformWidth = 10;
  bulletSize = 1;
  keyCodeLeft = 37;
  keyCodeRight = 39;
  keyCodeSpace = 32;
  minPlatformPositionX = -50 + this.platformWidth / 2;
  maxPlatformPositionX = 50 - this.platformWidth / 2;
  maxBulletPositionY = (100 * 9) / 16 - 9 / 16 - 1;
  maxBulletPositionX = 50 - this.bulletSize / 2;
  minBulletPositionX = -50 + this.bulletSize / 2;
  minBulletPositionY = -1;
  bulletVelocity = 0.4;
  platformVelocity = 0.2;
  fps = 100;
  brickWidth = 20;
  brickHeight = 2;

  bricks = [
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 },
    { durability: 3 }
  ];

  state = {
    bulletVelocityX: 0,
    bulletVelocityY: 0,
    bulletDirectionX: 1,
    bulletDirectionY: 1,
    bulletPositionX: 0,
    bulletPositionY: 0,
    platformMovingLeft: false,
    platformMovingRight: false,
    platformPositionX: 0,
    platformVelocity: this.platformVelocity,
    bricks: [...this.bricks]
  };

  componentDidMount = () => {
    this.setCssVariable("--platformWidth", this.platformWidth, "vw");
    this.setCssVariable("--bulletSize", this.bulletSize, "vw");
    this.setCssVariable("--brickWidth", this.brickWidth, "vw");
    this.setCssVariable("--brickHeight", this.brickHeight, "vw");
    setInterval(this.gameLoop, 1000 / this.fps);
  };

  gameLoop = () => {
    this.updateState();
    this.setCssVariables();
    this.collisionCheck();
  };

  updateState = () =>
    this.setState(
      produce(draft => {
        const {
          bulletVelocityX,
          bulletVelocityY,
          bulletDirectionX,
          bulletDirectionY,
          platformMovingLeft,
          platformMovingRight,
          platformPositionX,
          platformVelocity
        } = draft;
        // platform
        if (this.isPlatformMovingLeft(platformMovingLeft, platformPositionX)) {
          draft.platformPositionX = this.getPlatformPositionXMovedLeft(
            platformPositionX,
            platformVelocity
          );
        } else if (
          this.isPlatformMovingRight(platformMovingRight, platformPositionX)
        ) {
          draft.platformPositionX = this.getPlatformPositionXMovedRight(
            platformPositionX,
            platformVelocity
          );
        }
        // bullet
        if (bulletVelocityY) {
          draft.bulletPositionY += bulletDirectionY * bulletVelocityY;
          draft.bulletPositionX += bulletDirectionX * bulletVelocityX;
        } else {
          if (
            this.isPlatformMovingLeft(platformMovingLeft, platformPositionX)
          ) {
            draft.bulletPositionX -= platformVelocity;
          } else if (
            this.isPlatformMovingRight(platformMovingRight, platformPositionX)
          ) {
            draft.bulletPositionX += platformVelocity;
          }
        }
      })
    );

  // isPlatformMovingDirection quite redundant
  isPlatformMovingLeft = (platformMovingLeft, platformPositionX) =>
    platformMovingLeft && platformPositionX > this.minPlatformPositionX;

  isPlatformMovingRight = (platformMovingRight, platformPositionX) =>
    platformMovingRight && platformPositionX < this.maxPlatformPositionX;

  getPlatformPositionXMovedLeft = (platformPositionX, platformVelocity) =>
    platformPositionX - platformVelocity <= this.minPlatformPositionX
      ? this.minPlatformPositionX
      : (platformPositionX -= platformVelocity);

  getPlatformPositionXMovedRight = (platformPositionX, platformVelocity) =>
    platformPositionX + platformVelocity >= this.maxPlatformPositionX
      ? this.maxPlatformPositionX
      : (platformPositionX += platformVelocity);

  setCssVariables = () => {
    this.setPlatformPosition();
    this.setBulletPosition();
  };

  setPlatformPosition = () => {
    const { platformPositionX } = this.state;
    this.setCssVariable("--platformPositionX", platformPositionX, "vw");
  };

  setBulletPosition = () => {
    const { bulletPositionX, bulletPositionY } = this.state;
    this.setCssVariable("--bulletPositionX", bulletPositionX, "vw");
    this.setCssVariable("--bulletPositionY", bulletPositionY, "vw");
  };

  setCssVariable = (propertyName, value, unit) =>
    document.documentElement.style.setProperty(propertyName, `${value}${unit}`);

  keyDownHandler = e => {
    if (e.repeat) return;
    if (e.keyCode === this.keyCodeLeft) {
      this.onKeyDownLeft();
    } else if (e.keyCode === this.keyCodeRight) {
      this.onKeyDownRight();
    } else if (
      e.keyCode === this.keyCodeSpace &&
      this.state.bulletVelocityY === 0
    ) {
      this.setState({ bulletVelocityY: this.bulletVelocity });
    }
  };

  onKeyDownLeft = () =>
    this.setState(
      produce(draft => {
        draft.platformMovingLeft = true;
        draft.platformMovingRight = false;
      })
    );

  onKeyDownRight = () =>
    this.setState(
      produce(draft => {
        draft.platformMovingLeft = false;
        draft.platformMovingRight = true;
      })
    );

  keyUpHandler = e => {
    if (e.repeat) return;
    if (e.keyCode === this.keyCodeLeft) {
      this.onKeyUpLeft();
    } else if (e.keyCode === this.keyCodeRight) {
      this.onKeyUpRight();
    }
  };

  onKeyUpLeft = () =>
    this.setState(
      produce(draft => {
        draft.platformMovingLeft = false;
      })
    );

  onKeyUpRight = () =>
    this.setState(
      produce(draft => {
        draft.platformMovingRight = false;
      })
    );

  collisionCheck = () => {
    this.setState(
      produce(draft => {
        const {
          bulletVelocityY,
          bulletPositionX,
          bulletPositionY,
          platformPositionX
        } = draft;
        if (bulletPositionY >= this.maxBulletPositionY) {
          draft.bulletDirectionY *= -1;
        } else if (bulletPositionY <= this.minBulletPositionY) {
          draft.platformPositionX = 0;
          draft.bulletPositionX = 0;
          draft.bulletPositionY = 0;
          draft.bulletDirectionY = 1;
          draft.bulletVelocityX = 0;
          draft.bulletVelocityY = 0;
        } else if (
          bulletPositionX >= this.maxBulletPositionX ||
          bulletPositionX <= this.minBulletPositionX
        ) {
          draft.bulletVelocityX *= -1;
        } else if (
          bulletVelocityY &&
          bulletPositionY <= 0 &&
          (bulletPositionX <= platformPositionX + this.platformWidth / 2 &&
            bulletPositionX >= platformPositionX - this.platformWidth / 2)
        ) {
          draft.bulletDirectionY *= -1;
          draft.bulletVelocityX =
            this.bulletVelocity *
            ((bulletPositionX - platformPositionX) / this.platformWidth);
        }

        draft.bricks.some((e, index) => {
          if (e.durability === 0) {
            return false;
          }
          const brickLeft = this.brickLeft(index);
          const brickTop = this.brickTop(index);
          if (
            brickLeft - 50 <= bulletPositionX &&
            brickLeft - 50 + this.brickWidth >= bulletPositionX &&
            bulletPositionY >=
              this.maxBulletPositionY - brickTop - this.brickHeight
          ) {
            e.durability -= 1;
            draft.bulletDirectionY *= -1;
            return true;
          }
          return false;
        });
      })
    );
  };

  brickLeft = index => (index * this.brickWidth) % 100;
  brickTop = index =>
    Math.floor((index * this.brickWidth) / 100) * this.brickHeight;

  render = () => {
    return (
      <div
        className={styles.root}
        onKeyDownCapture={this.keyDownHandler}
        onKeyUp={this.keyUpHandler}
        tabIndex="-1"
      >
        <Bricks
          bricks={this.state.bricks}
          brickLeft={index => this.brickLeft(index)}
          brickTop={index => this.brickTop(index)}
        />
        <Bullet />
        <Platform />
      </div>
    );
  };
}
