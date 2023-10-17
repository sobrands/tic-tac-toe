const gameBoard = (function() {
  let board = [...Array(3)].map(e => Array(3));

  function getBoard() { return board; };

  return {
    getBoard,
  }
})();

const displayController = (function () {
  
  function displayBoard() {
    const ttcBoard = document.querySelector(".game-board");
    const currentBoard = gameBoard.getBoard();
    for (let i=0; i < 3; i++) {
      for (let j=0; j < 3; j++) {
        const grid = document.createElement("button");
        grid.classList.add("grid");
        grid.dataset.row = i;
        grid.dataset.column = j;
        if (currentBoard[i][j] !== undefined) {
          grid.textContent = currentBoard[i][j];
        }
        ttcBoard.appendChild(grid);
      }
    }
  }

  return {
    displayBoard,
  };
})();

const gameController = (function () {

  function initGame() {
    displayController.displayBoard();
  }

  return {
    initGame,
  };
})();

gameController.initGame();