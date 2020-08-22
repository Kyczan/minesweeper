import config from './config';

const { bombs, width, height } = config;
const size = width * height;

export const determineSurroundingIds = (index) => {
  const ids = [];
  const isLeftEdge = index % width === 0;
  const isRightEdge = (index + 1) % width === 0;
  const isTopEdge = index < width;
  const isBottomEdge = index >= (size - width);

  if (!isLeftEdge) ids.push(index - 1); // check West
  if (!isRightEdge) ids.push(index + 1); // check East
  if (!isTopEdge) ids.push(index - width); // check North
  if (!isBottomEdge) ids.push(index + width); // check South
  if (!isLeftEdge && !isTopEdge) ids.push(index - width - 1); // check NW
  if (!isRightEdge && !isTopEdge) ids.push(index - width + 1); // check NE
  if (!isLeftEdge && !isBottomEdge) ids.push(index + width - 1); // check SW
  if (!isRightEdge && !isBottomEdge) ids.push(index + width + 1); // check SE

  return ids;
};

const shuffle = (a) => {
  // eslint-disable-next-line no-plusplus
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const calculateHints = (gameArray) => {
  const mappedArray = gameArray.map((tile, index, array) => {
    if (tile === -1) {
      return -1;
    }

    const ids = determineSurroundingIds(index);
    const counter = ids.reduce((acc, currIndex) => {
      const newValue = array[currIndex] === -1 ? 1 : 0;
      return acc + newValue;
    }, 0);

    return counter;
  });

  return mappedArray;
};

const createGameArray = () => {
  const gameArray = new Array(size);
  gameArray.fill(-1, 0, bombs); // -1 represents bomb
  gameArray.fill(0, bombs, size); // 0 represents clean area
  shuffle(gameArray); // randomly set bombs
  const gameArrayWithHints = calculateHints(gameArray);

  return gameArrayWithHints;
};

export default createGameArray;
