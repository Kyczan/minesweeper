import config from './config';
import Game from './game';

const removeGameTiles = () => {
  const grid = document.querySelector('.grid');
  grid.innerHTML = '';
};

const restartGame = () => {
  removeGameTiles();
  const game = new Game(config);
  game.start();
};

const handleRestart = () => {
  const restartBtn = document.querySelector('.restart');
  restartBtn.addEventListener('click', restartGame);
};

export default handleRestart;
