"use strict";
// Global Variables:
var gBoard;
var gTimer;
var elGameStatus = document.querySelector(".game-status");

var gDifficulty = {
  beginner: { SIZE: 4, MINES: 2 },
  medium: { SIZE: 8, MINES: 12 },
  expert: { SIZE: 12, MINES: 30 },
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3,
  difficulty: gDifficulty.beginner,
  minesCoords: [],
};

// Images:
var MINE_IMG = '<img src="img/mine.png" />';
var VICTORY_IMG = '<img src="img/victory.png" />';
var DEFEAT_IMG = '<img src="img/defeat.png" />';
var PLAYING_IMG = '<img src="img/playing.png" />';
var MARK_IMG = '<img src="img/mark.png" />';

// Functions:

function initGame(difficulty = "beginner") {
  resetGameSettings(difficulty);
  gBoard = buildBoard();
  setMinesRandomly();
  setMinesNegsCount(gBoard);
  renderBoard(gBoard);
}

// resets the game to default settings
function resetGameSettings(difficulty) {
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    difficulty: gDifficulty[difficulty],
    minesCoords: [],
  };
  elGameStatus.innerHTML = PLAYING_IMG;
}

function buildBoard() {
  var board = createMat(gGame.difficulty.SIZE);

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }
  return board;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      var className = getClassName({ i: i, j: j });
      strHTML += `\t<td class="cell ${className}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j});return false;">`;
      strHTML += `\t</td>\n`;
    }
    strHTML += "</tr>\n";
  }
  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
  // check if this is the first click
  if (!gGame.isOn && !gGame.secsPassed) startGamefirstClick();
  if (gGame.isOn) {
    var currCell = gBoard[i][j];
    if (!currCell.isMarked && !currCell.isShown) {
      if (currCell.isMine) {
        handLives();
        checkGameOver();
      } else {
        if (currCell.minesAroundCount > 0) {
          // its a cell with mine negs - reveal only this cell
          currCell.isShown = true;
          elCell.classList.add("shown");
          elCell.innerHTML = currCell.minesAroundCount;
          gGame.shownCount++;
        } else {
          // its a cell without mine negs - reveal this cell and its negs
          expandShown({ i: i, j: j });
        }
        checkGameOver();
      }
    }
  }
}

function cellMarked(elCell, i, j) {
  if (!gGame.isOn && !gGame.secsPassed) startGamefirstClick();
  if (gGame.isOn) {
    var currCell = gBoard[i][j];
    if (currCell.isMarked) {
      currCell.isMarked = false;
      elCell.classList.remove("marked");
      elCell.innerHTML = "";
      gGame.markedCount--;
    } else if (gGame.markedCount < gGame.difficulty.MINES) {
      if (!currCell.isShown) {
        currCell.isMarked = true;
        elCell.innerHTML = MARK_IMG;
        elCell.classList.add("marked");
        elCell.classList.remove("shown");
        gGame.markedCount++;
        checkGameOver();
      }
    }
  }
}

function checkGameOver() {
  // if all cells are shown and bombs are marked ==> victory
  var maxMarked = gGame.difficulty.MINES;
  var maxShown = gGame.difficulty.SIZE * gGame.difficulty.SIZE - maxMarked;
  if (gGame.markedCount === maxMarked && gGame.shownCount === maxShown) {
    //victory
    elGameStatus.innerHTML = VICTORY_IMG;
    clearInterval(gTimer);
    gGame.isOn = false;
  } else if (!gGame.lives) {
    // if all 3 lives are out ==> defeat
    elGameStatus.innerHTML = DEFEAT_IMG;
    showAllMines();
    clearInterval(gTimer);
    gGame.isOn = false;
  } // else - still playing
}
