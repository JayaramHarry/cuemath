const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 700,
  parent: 'game-container',
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let gameOver = false;
let currentPlayer = 1;
let playerID = 1;
let rookSelected = false;
let timerText;
let turnTime = 30;
let timerEvent;
let timerCircle;
let rookMoved = false;
let playerActive = [true, true]; // Both players are active now
let highlightGraphics = [];

function preload() {
  this.load.image('chessboard', 'images/chessboard.png');
  this.load.image('rook', 'images/rook.png');
  this.load.image('target', 'images/target.png');
  this.load.image('avatar1', 'images/player-one.png');
  this.load.image('avatar2', 'images/player-two.png');
}

function create() {
  this.add.image(250, 350, 'chessboard');
  const rook = this.add.sprite(375, 175, 'rook');
  const target = this.add.sprite(40, 490, 'target').setOrigin(0);
  const avatar1 = this.add.sprite(250, 50, 'avatar1').setScale(0.1);
  const avatar2 = this.add.sprite(250, 650, 'avatar2').setScale(0.1);

  timerCircle = this.add.graphics();
  timerCircle.fillStyle(0x00FF00, 1);
  timerCircle.fillCircle(avatar1.x + avatar1.width * 0.6, avatar1.y + avatar1.height * 0.5, 30);
  timerCircle.visible = false;

  rook.setInteractive();
  this.input.on('pointerdown', () => {
    if (!gameOver && playerActive[currentPlayer - 1]) {
      rookSelected = true;
      rook.setTint(0xff0000);
      console.log('Rook selected');
    }
  });
  
  this.input.on('pointerup', () => {
    if (rookSelected && playerActive[currentPlayer - 1]) {
      rookSelected = false;
      rook.clearTint();
      rookMoved = true;
      endTurn();
      console.log('Rook deselected');
    }
  });

  timerText = this.add.text(10, 10, 'Time left: ' + turnTime, { fontSize: '16px', fill: '#ffffff' });
  startTurnTime(this);
}

function update() {
  timerText.setText('Time left: ' + turnTime);

  if (!gameOver) {
    const rook = this.children.list.find(child => child.texture.key === 'rook');
    const target = this.children.list.find(child => child.texture.key === 'target');

    if (rookSelected && this.input.activePointer.isDown) {
      const minX = 75, maxX = 650, minY = 100, maxY = 525;
      const newX = Phaser.Math.Clamp(this.input.activePointer.x, minX, maxX);
      const newY = Phaser.Math.Clamp(this.input.activePointer.y, minY, maxY);

      if (newX <= rook.x && newY >= rook.y) {
        rook.x = newX;
        rook.y = newY;
        console.log('Rook position updated:', newX, newY);

        // Check if the rook reaches the target position
        if (rook.x === target.x && rook.y === target.y) {
          gameOver = true;
          showPopup("Player " + currentPlayer + " wins by reaching the target!");
          restartGame();
        }
      }
    }

    // Highlight valid moves for the rook
    highlightValidMoves(rook, target);

    timerCircle.visible = playerActive[currentPlayer - 1];
    if (playerActive[currentPlayer - 1]) {
      const avatar = this.children.list.find(child => child.texture.key === `avatar${currentPlayer}`);
      timerCircle.x = avatar.x + avatar.width * 0.6;
      timerCircle.y = avatar.y + avatar.height * 0.5;
    }
  } else {
    timerCircle.visible = false;
  }
}

function highlightValidMoves(rook, target) {
  // Highlight moves to the left and down
  const minX = 75, minY = 100;
  const boxWidth = 78, boxHeight = 79;

  const targetX = target.x;
  const targetY = target.y;

  // Calculate number of moves to the left
  const leftMoves = Math.floor((rook.x - targetX) / boxWidth);
  // Calculate number of moves down
  const downMoves = Math.floor((targetY - rook.y) / boxHeight);

  // Clear any previous highlights
  clearHighlights.call(this); // Call clearHighlights with the correct context

  // Highlight the left moves
  for (let i = 1; i <= leftMoves; i++) {
    const x = rook.x - i * boxWidth;
    const y = rook.y;
    highlightMove.call(this, x, y, boxWidth, boxHeight); // Call highlightMove with the correct context
  }

  // Highlight the down moves
  for (let i = 1; i <= downMoves; i++) {
    const x = rook.x;
    const y = rook.y + i * boxHeight;
    highlightMove.call(this, x, y, boxWidth, boxHeight); // Call highlightMove with the correct context
  }

  // Check if rook's position matches target's position
  if (rook.x <= targetX + target.width && rook.y >= targetY) {
    // Display popup message
    showPopup.call(this, "Player " + currentPlayer + " wins!");
  }
}

function highlightMove(x, y, width, height) {
  if (!this.add) {
    console.error("this.add is not defined");
    return;
  }

  const decreaseFactor = 0.5; // Adjust this factor as needed
  const newWidth = width * decreaseFactor;

  const graphics = this.add.graphics();
  graphics.fillStyle(0xff0000, 0.5);
  graphics.fillRect(x + (width - newWidth) / 2, y + height / 4, newWidth, height / 2);
  highlightGraphics.push(graphics);
}



function clearHighlights() {
  highlightGraphics.forEach(graphics => {
    graphics.destroy();
  });
  highlightGraphics = [];
}

function startTurnTime(scene) {
  timerEvent = scene.time.addEvent({ delay: 1000, callback: updateTurnTime, callbackScope: scene, loop: true });
}

function updateTurnTime() {
  if (currentPlayer === playerID && !gameOver) {
    turnTime--;
    if (turnTime === 0) {
      if (!rookMoved) {
        endTurn();
        showPopup("Player " + (currentPlayer === 1 ? 2 : 1) + " wins! Player " + currentPlayer + " ran out of time.");
      } else {
        turnTime = 30;
        rookMoved = false;
        endTurn();
        startTurnTime(this);
      }
    }
  }
}


function endTurn() {
  currentPlayer === 1 ? 2 : 1;
  turnTime = 30;
  console.log("Player " + currentPlayer + "'s move now.");
}

function showPopup(message) {
  alert(message);
}

function restartGame() {
  gameOver = false;
  currentPlayer = 1;
  turnTime = 30;
  rookMoved = false;
  clearHighlights();
  console.log("Game restarted.");
}
