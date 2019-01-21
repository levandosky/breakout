import produce from "immer";

export default produce(draft => {
  const {
    bulletVelocityX,
    bulletVelocityY,
    bulletDirectionX,
    bulletDirectionY,
    bulletPositionX,
    bulletPositionY,
    platformMovingLeft,
    platformMovingRight,
    platformPositionX,
    platformVelocity
  } = draft;
  // platform
  if (isPlatformMovingLeft(platformMovingLeft, platformPositionX)) {
    draft.platformPositionX = this.getPlatformPositionXMovedLeft(
      platformPositionX,
      platformVelocity
    );
  } else if (isPlatformMovingRight(platformMovingRight, platformPositionX)) {
    draft.platformPositionX = this.getPlatformPositionXMovedRight(
      platformPositionX,
      platformVelocity
    );
  }
  // bullet
  if (bulletVelocityY) {
    draft.bulletPositionY += bulletDirectionY * bulletVelocityY;
  } else {
    if (platformMovingLeft) {
      draft.bulletPositionX += platformVelocity;
    } else if (platformMovingRight) {
      draft.bulletPositionX -= platformVelocity;
    }
  }
});

const isPlatformMovingLeft = (platformMovingLeft, platformPositionX) =>
  platformMovingLeft && platformPositionX >= this.minPlatformPositionX;

const isPlatformMovingRight = (platformMovingRight, platformPositionX) =>
  platformMovingRight && platformPositionX <= this.maxPlatformPositionX;
