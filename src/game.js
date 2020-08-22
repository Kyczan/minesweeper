import createGameArray, { determineSurroundingIds } from './createGameArray';
import createGameTiles from './createGameTiles';

class Game {
  constructor({ bombs }) {
    this.bombs = bombs;
    this.bombsLeft = bombs;
    this.gameArray = [];
    this.gameTiles = [];
    this.message = document.querySelector('.message');
    this.bombsCounter = document.querySelector('.bombs-counter');
    this.bombsCounter.innerText = this.bombsLeft;
  }

  isBomb = (tile) => {
    const { id } = tile.dataset;
    return this.gameArray[id] === -1;
  };

  gameOver = () => {
    this.gameTiles.forEach((tile) => {
      tile.removeEventListener('click', this.clickTile);
      tile.removeEventListener('contextmenu', this.toggleFlag);
      if (this.isBomb(tile)) {
        tile.innerText = '💣';
        tile.style.fontSize = '12px';
      }
    });
    this.message.innerText = 'Game Over!';
  }

  checkWin = () => {
    let win = true;
    this.gameTiles.forEach((tile) => {
      if (this.isBomb(tile) && !tile.dataset.flagged) {
        win = false;
      }
      if (!this.isBomb(tile) && tile.dataset.flagged) {
        win = false;
      }
    });
    if (win) {
      this.message.innerText = 'You Won!';
    }
  }

  revealTile = (tile) => {
    const id = +tile.dataset.id;
    const hint = this.gameArray[id];
    if (tile.dataset.clicked) {
      return;
    }
    if (tile.dataset.flagged && this.isBomb(tile)) {
      return;
    }
    if (this.isBomb(tile) || (tile.dataset.flagged && !this.isBomb(tile))) {
      this.gameOver();
      return;
    }

    tile.classList.add('tile-uncovered');
    tile.removeEventListener('click', this.clickTile);
    tile.dataset.clicked = true;

    if (hint > 0) {
      tile.innerText = hint;
      tile.classList.add(`tile-hint-${hint}`);
      tile.addEventListener('click', this.clickUncoveredTile);
    }

    if (hint === 0) {
      // reveal all gameArray around this one
      const ids = determineSurroundingIds(id);
      ids.forEach((i) => {
        const newEl = document.querySelector(`[data-id="${i}"]`);
        setTimeout(() => {
          this.revealTile(newEl);
        }, 20);
      });
    }
  }

  clickTile = (e) => {
    const tile = e.target;

    if (this.isBomb(tile)) {
      this.gameOver();
    } else {
      this.revealTile(tile);
    }
  }

  clickUncoveredTile = (e) => {
    const tile = e.target;
    const id = +tile.dataset.id;

    // reveal all gameArray around this one
    const ids = determineSurroundingIds(id);
    ids.forEach((i) => {
      const newEl = document.querySelector(`[data-id="${i}"]`);
      setTimeout(() => {
        this.revealTile(newEl);
      }, 20);
    });
    tile.removeEventListener('click', this.clickUncoveredTile);
  }

  toggleFlag = (e) => {
    e.preventDefault();
    const tile = e.target;

    if (tile.dataset.clicked) {
      return;
    }

    if (tile.dataset.flagged) {
      // remove flag
      tile.innerText = '';
      tile.style.fontSize = '16px';
      tile.removeAttribute('data-flagged');
      tile.addEventListener('click', this.clickTile);
      this.bombsLeft += 1;
    } else {
      // set flag
      tile.innerText = '🚩';
      tile.style.fontSize = '12px';
      tile.dataset.flagged = true;
      tile.removeEventListener('click', this.clickTile);
      this.bombsLeft -= 1;
    }
    this.bombsCounter.innerText = this.bombsLeft;

    if (this.bombsLeft === 0) {
      this.checkWin();
    }
  }

  start() {
    this.gameArray = createGameArray();
    this.gameTiles = createGameTiles(this.gameArray, this.clickTile, this.toggleFlag);
  }
}

export default Game;
