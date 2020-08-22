import config from './config';

const createGameTiles = (gameArray, clickTile, toggleFlag) => {
  const { width, height } = config;
  const tileSize = 20;

  const grid = document.querySelector('.grid');
  grid.style.width = `${width * tileSize}px`;
  grid.style.height = `${height * tileSize}px`;

  const gameTiles = gameArray.map((tile, index) => {
    const div = document.createElement('div');
    const el = grid.appendChild(div);
    el.classList.add('tile');
    el.style.width = `${tileSize}px`;
    el.style.height = `${tileSize}px`;
    el.dataset.id = index;

    el.addEventListener('click', clickTile);
    el.addEventListener('contextmenu', toggleFlag);

    return el;
  });

  return gameTiles;
};

export default createGameTiles;
