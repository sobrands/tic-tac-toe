function createPlayer(playerName, playerSymbol, playerTurns) {
  const name = playerName;
  const symbol = playerSymbol;
  let turns = playerTurns;

  function getTurns() {
    return turns;
  }

  function played() {
    turns++;
  }

  function reset() {
    turns = 0;
  }

  return {
    name, 
    symbol,
    getTurns,
    played,
    reset,
  };
}

const gameBoard = (function() {
  let board = [...Array(3)].map(e => Array(3));

  function getBoard() { return board; };

  function editBoard(grid, symbol) {
    const row = grid.dataset.row;
    const col = grid.dataset.column;
    board[row][col] = symbol;
  }

  function resetBoard() {
    board = [...Array(3)].map(e => Array(3));
  }

  return {
    getBoard,
    editBoard,
    resetBoard,
  }
})();

const displayController = (function () {
  
  const startGameBtn = document.querySelector(".start-game");
  const controlBtns = document.querySelector(".control-buttons");
  const playerTurn = document.querySelector(".player-turn");
  const gameArena = document.querySelector(".game-board");
  const results = document.querySelector(".results");
  
  let gameOn = false;
  let currentPlayer;

  function displayBoard() {
    const ttcBoard = document.querySelector(".game-board");
    ttcBoard.textContent = "";
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

  function createResetButton() {
    const resetGameBtn = document.createElement("button");
    resetGameBtn.classList.add("reset-game");
    resetGameBtn.textContent = "PLAY AGAIN?";
    controlBtns.appendChild(resetGameBtn);
    resetGameBtn.addEventListener('click', resetGame);
  }

  function registerInput(grid) {
    if (!gameOn) { return; }
    if (grid.hasAttribute("data-pressed")) { return; }
    
    grid.setAttribute("data-pressed", "");
    grid.textContent = currentPlayer.symbol;
    
    gameController.input(grid);
    const winner = gameController.getWinner();

    if (winner !== undefined) {
      if (winner === "tie") results.innerHTML = "Game tied!";
      else results.innerHTML = `Winner is ${currentPlayer.name}!`;
    }
    else displayPlayerTurn();
  }

  function beginGame() {
    gameOn = true;
    controlBtns.removeChild(startGameBtn);
    gameController.rollStartPlayer();
    displayPlayerTurn();
    gameArena.addEventListener('click', (e) => {
      if (e.target.matches('button')) {
        registerInput(e.target);
      }
    });
  }

  function endGame() {
    gameOn = false;
    createResetButton();
  }

  function initGame() {
    displayBoard();
    startGameBtn.addEventListener('click', beginGame);
  }

  function resetGame() {
    gameController.resetGame();
    displayBoard();
    const resetBtn = controlBtns.querySelector(".reset-game");
    controlBtns.removeChild(resetBtn);
    controlBtns.appendChild(startGameBtn);
    playerTurn.textContent = "";
    results.innerHTML = "";
  }

  return {
    initGame,
    endGame,
  };
})();

const gameController = (function () {
  const player1 = createPlayer("Player1", "X", 0);
  const player2 = createPlayer("Player2", "O", 0);
  let activePlayer;
  let result;
  let winner;

  function initGame() {
    displayController.initGame();
  }

  function resetGame() {
    gameBoard.resetBoard();
    result = undefined;
    winner = undefined;
    player1.reset();
    player2.reset();
    activePlayer = player1;
  }

  function getCurrentPlayer() {
    return activePlayer;
  }

  function changePlayer() {
    activePlayer = (activePlayer === player1) ? player2 : player1;
  }

  function randomizePlayer(players) {
    const idx = Math.floor(Math.random() * 2);
    return players[idx];
  }

  function rollStartPlayer() {
    activePlayer = randomizePlayer([player1, player2]);
  }

  function checkWinner() {
    const board = gameBoard.getBoard();
    const grids = document.querySelectorAll(".game-board button");

    for (let i=0; i<3; i++)
    {
      // Check row
      if ((board[i][0] === board[i][1] && board[i][1] === board[i][2]) &&
           board[i][0] !== undefined) return "win";
      // Check column
      else if ((board[0][i] === board[1][i] && board[1][i] === board[2][i])
                && board[0][i] !== undefined) return "win";
    }
    // Check diagonal
    if ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
        (board[2][0] === board[1][1] && board[1][1] === board[0][2]) &&
        board[1][1] !== undefined) return "win";
    
    // Check draw
    let visited = 0;
    grids.forEach(grid => {
      if (grid.hasAttribute("data-pressed")) visited++;
    })
    if (visited === 9) return "tie";
  }

  function input(grid) {
    gameBoard.editBoard(grid, activePlayer.symbol);
    activePlayer.played();
    if (activePlayer.getTurns() >= 3) result = checkWinner();
    if (result === "win") {
      winner = activePlayer.name;
      displayController.endGame();
      return;
    }
    else if (result === "tie") {
      winner = "tie";
      displayController.endGame();
      return;
    }
    changePlayer();
  }

  function getWinner() { return winner; };

  return {
    initGame,
    getCurrentPlayer,
    rollStartPlayer,
    input,
    getWinner,
    resetGame,
  };
})();

gameController.initGame();