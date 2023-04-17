class Game{
  constructor(){
    this.WIDTH = 7;
    this.HEIGHT = 6;
    this.currPlayer = 1;
    this.players = getPlayerInfo();
    this.board = [];
    this.gameOver = false;

    
    this.findSpotForCol = this.findSpotForCol.bind(this);
    this.placeInTable = this.placeInTable.bind(this);
    this.endGame = this.endGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.findSpotForCol = this.findSpotForCol.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this._win = this._win.bind(this);

    this.makeBoard();
    this.makeHtmlBoard();
  }

  

  makeBoard(){
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  };

  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  };

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    //piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.players[this.currPlayer - 1].color;
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {

    if(this.gameOver) return;
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver = true;
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  _win(cells) {
    //   // Check four cells to see if they're all color of current player
    //   //  - cells: list of four (y, x) cells
    //   //  - returns true if all are legal coordinates & all match currPlayer
      const returnCells = function([y, x]){
        return y >= 0 &&
         y < this.HEIGHT &&
         x >= 0 &&
         x < this.WIDTH &&
         this.board[y][x] === this.currPlayer
       }
       return cells.every(returnCells.bind(this));
  }

  checkForWin() {
    // function _win(cells) {
    // //   // Check four cells to see if they're all color of current player
    // //   //  - cells: list of four (y, x) cells
    // //   //  - returns true if all are legal coordinates & all match currPlayer
  
    //   return cells.every(
    //     function([y, x]){
    //      return y >= 0 &&
    //       y < this.HEIGHT &&
    //       x >= 0 &&
    //       x < this.WIDTH &&
    //       this.board[y][x] === this.currPlayer
    //     }
    //   );
    // }
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player{
  constructor(color){
    this.color = color;
  }
}

const gameBtn = document.querySelector('#game-btn');
gameBtn.addEventListener('click', function(){

//removes current board (even if empty)
  const board = document.getElementById('board');
  board.remove();

//adds new board
  const gameDiv = document.querySelector('#game');
  const newBoard = document.createElement('table');
  newBoard.setAttribute('id','board');
  gameDiv.append(newBoard);
  
  new Game();
})

// gets input values for player colors
function getPlayerInfo(){
  const p1 = document.querySelector('#p1');
  const p2 = document.querySelector('#p2');

  const player1 = new Player(p1.value);
  const player2 = new Player(p2.value);
  return [player1, player2]
}


