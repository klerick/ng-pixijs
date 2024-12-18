import {
  DirectionSnake,
  SnakeConfig,
  SnakeItem
} from '../providers/config-snake';

export function moveFirst(
  snakeItem: SnakeItem,
  snakeConfig: SnakeConfig,
  size: number
) {
  const currentDirection = snakeItem.direction;
  const globalDirection = snakeConfig.direction;
  const { positionX, positionY, direction } = changePosition(
    snakeItem.positionX,
    snakeItem.positionY,
    snakeItem.direction,
    snakeConfig.speed
  );

  snakeItem.positionX = positionX;
  snakeItem.positionY = positionY;
  snakeItem.direction = direction;

  if (currentDirection !== globalDirection) {
    const { positionX, positionY, direction } = changeDirectionSnake(
      snakeItem,
      snakeConfig.direction,
      size
    );
    snakeItem.positionX = positionX;
    snakeItem.positionY = positionY;
    snakeItem.direction = direction;
  }
  snakeItem.positionX = parseFloat(snakeItem.positionX.toFixed(1));
  snakeItem.positionY = parseFloat(snakeItem.positionY.toFixed(1));
  return snakeItem;
}

const reset = (snakeItem: SnakeItem) => {
  snakeItem.positionXRight = undefined;
  snakeItem.positionXLeft = undefined;
  snakeItem.positionYUp = undefined;
  snakeItem.positionYDown = undefined;

  return snakeItem;
};

function changeDirectionSnake(
  snakeItem: SnakeItem,
  direction: DirectionSnake,
  size: number
) {
  snakeItem.positionXRight =
    snakeItem.positionXRight || findNextMultiple(snakeItem.positionX, size);
  snakeItem.positionXLeft =
    snakeItem.positionXLeft ||
    findNextMultiple(snakeItem.positionX, size, false);
  snakeItem.positionYUp =
    snakeItem.positionYUp || findNextMultiple(snakeItem.positionY, size, false);
  snakeItem.positionYDown =
    snakeItem.positionYDown || findNextMultiple(snakeItem.positionY, size);

  const { positionXRight, positionXLeft, positionYUp, positionYDown } =
    snakeItem;

  if (
    snakeItem.direction === 'up' &&
    direction === 'right' &&
    positionYUp >= snakeItem.positionY
  ) {
    snakeItem.direction = 'right';
    snakeItem.positionY = positionYUp;
    reset(snakeItem);
  }

  if (
    snakeItem.direction === 'down' &&
    direction === 'right' &&
    positionYDown <= snakeItem.positionY
  ) {
    snakeItem.direction = 'right';
    snakeItem.positionY = positionYDown;
    reset(snakeItem);
  }

  if (
    snakeItem.direction === 'down' &&
    direction === 'left' &&
    positionYDown <= snakeItem.positionY
  ) {
    snakeItem.direction = 'left';
    snakeItem.positionY = positionYDown;
    reset(snakeItem);
  }

  if (
    snakeItem.direction === 'up' &&
    direction === 'left' &&
    positionYUp <= snakeItem.positionY
  ) {
    snakeItem.direction = 'left';
    snakeItem.positionY = positionYDown;
    reset(snakeItem);
  }

  if (
    snakeItem.direction === 'right' &&
    direction === 'up' &&
    positionXRight <= snakeItem.positionX
  ) {
    snakeItem.direction = 'up';
    snakeItem.positionX = positionXRight;
    reset(snakeItem);
  }

  if (
    snakeItem.direction === 'left' &&
    direction === 'up' &&
    positionXLeft >= snakeItem.positionX
  ) {
    snakeItem.direction = 'up';
    snakeItem.positionX = positionXLeft;
    reset(snakeItem);
  }

  if (
    snakeItem.direction === 'right' &&
    direction === 'down' &&
    positionXRight <= snakeItem.positionX
  ) {
    snakeItem.direction = 'down';
    snakeItem.positionX = positionXRight;
    reset(snakeItem);
  }

  if (
    snakeItem.direction === 'left' &&
    direction === 'down' &&
    positionXLeft >= snakeItem.positionX
  ) {
    snakeItem.direction = 'down';
    snakeItem.positionX = positionXLeft;
    reset(snakeItem);
  }

  return snakeItem;
}

function changePosition(
  positionX: number,
  positionY: number,
  direction: DirectionSnake,
  speed: number
): Omit<SnakeItem, 'id'> {
  const resultItem: Omit<SnakeItem, 'id'> = {
    positionX,
    positionY,
    direction
  };

  if (direction === 'right') {
    resultItem.positionX = parseFloat((positionX + speed).toFixed(1));
  }

  if (direction === 'left') {
    resultItem.positionX = parseFloat((positionX - speed).toFixed(1));
  }

  if (direction === 'up') {
    resultItem.positionY = parseFloat((positionY - speed).toFixed(1));
  }

  if (direction === 'down') {
    resultItem.positionY = parseFloat((positionY + speed).toFixed(1));
  }

  return resultItem;
}


export function setPositionFromPrev(
  direction: DirectionSnake,
  x: number,
  y: number,
  prevX: number,
  prevY: number,
  size: number,
  speed: number
) {

  const position = {
    positionX: x,
    positionY: y,
    direction: direction
  };

  if (direction === 'right') {
    position.positionX = prevX - x < size ? x : parseFloat((prevX - size).toFixed(1));
    position.positionY = y;

    if (position.positionY < prevY || position.positionY > prevY) {
      // position.positionX = prevX < parseFloat((x + speed).toFixed(1)) ? parseFloat((x + speed).toFixed(1)) : prevX
      position.positionX = prevX//prevX < parseFloat((x + speed).toFixed(1)) ? parseFloat((x + speed).toFixed(1)) : prevX
      position.positionY = y;

      if (position.positionY < prevY && position.positionX === prevX) {
        position.direction = 'down'
      }
      if (position.positionY > prevY && position.positionX === prevX) {
        position.direction = 'up'
      }
    }

    return position
  }

  if (direction === 'down') {

    position.positionX = x;

    position.positionY = prevY - y < size ? y : parseFloat((prevY - size).toFixed(1));

    if (position.positionX > prevX || position.positionX < prevX) {
      position.positionX = x;
      // position.positionY = prevY < parseFloat((y + speed).toFixed(1)) ? parseFloat((y + speed).toFixed(1)) : prevY
      position.positionY = prevY
    }

    if (position.positionX > prevX && position.positionY === prevY) {
      position.direction = 'left'
    }

    if (position.positionX < prevX && position.positionY === prevY) {
      position.direction = 'right'
    }
    return position
  }

  if (direction === 'left') {

    position.positionX =  x - prevX < size ? x : parseFloat((prevX + size).toFixed(1));
    position.positionY = y

    if (position.positionY > prevY || position.positionY < prevY) {
      // position.positionX = prevX < parseFloat((x - speed).toFixed(1)) ? parseFloat((x - speed).toFixed(1)) : prevX
      position.positionX = prevX
      position.positionY = y;
    }

    if (position.positionY > prevY && position.positionX === prevX) {
      position.direction = 'up'
    }

    if (position.positionY < prevY && position.positionX === prevX) {
      position.direction = 'down'
    }

    return position
  }

  if (direction === 'up') {
    position.positionX = x;

    if (y > prevY) {
      position.positionY = y - prevY < size ? y : parseFloat((prevY + size).toFixed(1));
    } else {
      position.positionY = prevY + y < size ? y : parseFloat((prevY + size).toFixed(1));
    }

    if (position.positionX < prevX ||  position.positionX > prevX) {
      position.positionX = x;
      // position.positionY = prevY < parseFloat((y - speed).toFixed(1)) ? parseFloat((y - speed).toFixed(1)) : prevY
      position.positionY = prevY

      if (position.positionX < prevX && position.positionY === prevY) {
        position.direction = 'right'
      }
      if (position.positionX > prevX && position.positionY === prevY) {
        position.direction = 'left'
      }
    }

    return position
  }

  return position
}

export function checkIsSnakeInsideWall(
  snakePosition: {
    x: number;
    y: number;
  },
  screeWidth: number,
  screenHeight: number,
  size = 10
) {
  return (
    snakePosition.x < 0 ||
    snakePosition.x > screeWidth - size ||
    snakePosition.y < 0 ||
    snakePosition.y > screenHeight - size
  );
}

export function checkIsSnakeInsideFood(
  snakePosition: { x: number; y: number },
  foodPosition: { x: number; y: number },
  size = 10
) {
  return isSquareIntersectingRectangle(
    foodPosition.x,
    foodPosition.y,
    size,
    snakePosition.x,
    snakePosition.y,
    size,
    size
  );
}

function isSquareIntersectingRectangle(
  x1: number,
  y1: number,
  s = 10,
  x2: number,
  y2: number,
  w = 10,
  h = 10
) {
  const horizontalOverlap = x1 < x2 + w && x1 + s > x2;
  const verticalOverlap = y1 < y2 + h && y1 + s > y2;

  return horizontalOverlap && verticalOverlap;
}

export function getRandomSquareCoordinates(n: number, s: number) {
  const rowIndex = Math.floor(Math.random() * n);
  const colIndex = Math.floor(Math.random() * n);

  const x = colIndex * s;
  const y = rowIndex * s;

  return { x, y };
}

export function checkSelfCollision(snake: SnakeItem[], size: number){
  const [head, second, ...other] = snake;

  return other.some((i) => isSquareIntersectingRectangle(
    head.positionX,
    head.positionY,
    size,
    i.positionX,
    i.positionY,
    size,
    size
  ))
}

export function findNextMultiple(n: number, p: number, max = true) {
  const remainder = n % p;

  if (remainder === 0) {
    return n;
  }
  if (max) {
    return parseFloat((n + p - remainder).toFixed(1));
  }
  return parseFloat((n - remainder).toFixed(1));
}
