// Returns an empty matrix
function createMat(SIZE) {
  var mat = [];
  for (var i = 0; i < SIZE; i++) {
    var row = [];
    for (var j = 0; j < SIZE; j++) {
      row.push("");
    }
    mat.push(row);
  }
  return mat;
}
// sets Mines at random positions on the board
function setMinesRandomly() {
  var min = 0;
  var max = gGame.difficulty.SIZE;
  for (var idx = 0; idx < gGame.difficulty.MINES; idx++) {
    var i = Math.floor(Math.random() * (max - min) + min);
    var j = Math.floor(Math.random() * (max - min) + min);
    while (gBoard[i][j].isMine) {
      i = Math.floor(Math.random() * (max - min) + min);
      j = Math.floor(Math.random() * (max - min) + min);
    }
    gBoard[i][j].isMine = true;
    gGame.minesCoords.push({ i: i, j: j });
  }
}

// puts the amount of negs with mines in each cell's obj
function setMinesNegsCount(board) {
  // run all over the board cell by cell
  for (i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      if (currCell.isMine) continue;
      // check negs
      var count = getMinesNegsCountOfCell({ i: i, j: j });
      currCell.minesAroundCount = count;
    }
  }
}

// returns the amount of negs with mines of a given cell
function getMinesNegsCountOfCell(cellCoord) {
  var count = 0;
  for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue;
      if (gBoard[i][j].isMine) count++;
    }
  }
  return count;
}

// reveals negs of given cell
function expandShown(cellCoord) {
  for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue;
      if (
        !gBoard[i][j].isMine &&
        !gBoard[i][j].isShown &&
        !gBoard[i][j].isMarked
      ) {
        gGame.shownCount++;
        gBoard[i][j].isShown = true;
        var elCell = document.querySelector(`.cell-${i}-${j}`);
        elCell.classList.add("shown");
        elCell.innerHTML =
          gBoard[i][j].minesAroundCount === 0
            ? ""
            : gBoard[i][j].minesAroundCount;
      }
    }
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = "cell-" + location.i + "-" + location.j;
  return cellClass;
}

function startGamefirstClick() {
  gGame.isOn = true;
  gTimer = setInterval(function () {
    gGame.secsPassed++;

    // get hours,minutes,seconds in 2 digits
    var date = new Date(gGame.secsPassed * 1000);
    var hours =
      date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
    var minutes =
      date.getUTCMinutes() < 10
        ? `0${date.getUTCMinutes()}`
        : date.getUTCMinutes();
    var seconds =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;

    var timerStr = `${hours}:${minutes}:${seconds}`;
    var elTimer = document.querySelector(".timer");
    elTimer.innerHTML = timerStr;
  }, 1000);
}

function handLives() {
  // reduce a life and alert to user if still playing
  gGame.lives--;
  var elLives = document.querySelector(".lives");
  elLives.innerHTML = gGame.lives;
  if (gGame.lives)
    alert(`You've clicked a mine! \nYou only have ${gGame.lives} lives left.`);
}

function showAllMines() {
  for (var idx = 0; idx < gGame.minesCoords.length; idx++) {
    var currCoord = gGame.minesCoords[idx];
    var i = currCoord.i;
    var j = currCoord.j;
    gBoard[i][j].isShown = true;
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerHTML = MINE_IMG;
    elCell.classList.add("shown");
    elCell.classList.add("mine");
  }
}
