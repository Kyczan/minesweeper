import config from './config';
import Game from './game';
import handleRestart from './restart';

document.addEventListener('DOMContentLoaded', () => {
  handleRestart();
  const game = new Game(config);
  game.start();
});
