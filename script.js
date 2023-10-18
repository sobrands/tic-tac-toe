function createPlayer(playerName, playerSymbol) {
  const name = playerName;
  const symbol = playerSymbol;

  return {
    name, 
    symbol
  };
}

const gameBoard = (function() {
  let board = [...Array(3)].map(e => Array(3));

  function getBoard() { return board; };

  function editBoard(grid, symbol) {
    const row = grid.dataset.row;
    const col = grid.dataset.col;
    board[row][col] = symbol;
  }

  return {
    getBoard,
    editBoard,
  }
})();

const displayController = (function () {
  
  const startGameBtn = document.querySelector(".start-game");
  const playerTurn = document.querySelector(".player-turn");
  const gameArena = document.querySelector(".game-board");
  
  let currentPlayer;

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

  function displayPlayerTurn() {
    currentPlayer = gameController.getCurrentPlayer();
    playerTurn.textContent = `${currentPlayer.name}'s Turn Now`;
  }

  function registerInput(event) {
    gameBoard.editBoard(event.target, currentPlayer.symbol);
    event.target.textContent = currentPlayer.symbol;
    gameController.changePlayer();
    displayPlayerTurn();
  }

  function beginGame() {
    displayPlayerTurn();
    gameArena.addEventListener('click', (e) => {
      if (e.target.matches('button')) {
        registerInput(e);
      }
    })
  }

  function initGame() {
    displayBoard();
    startGameBtn.addEventListener('click', beginGame);
  }

  return {
    initGame,
  };
})();

const gameController = (function () {
  const player1 = createPlayer("Player1", "X");
  const player2 = createPlayer("Player2", "O");
  let activePlayer = player1;

  function initGame() {
    displayController.initGame();
  }

  function getCurrentPlayer() {
    return activePlayer;
  }

  function changePlayer() {
    activePlayer = (activePlayer === player1) ? player2 : player1;
  }

  return {
    initGame,
    getCurrentPlayer,
    changePlayer
  };
})();

gameController.initGame();