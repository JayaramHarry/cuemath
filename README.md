Chess Rook Game
Welcome to Chess Rook Game! This is a simple browser-based game where players control a rook piece on a chessboard to reach a target position before the opponent does. The game is built using the Phaser framework.

Setup and Run
To set up and run the game locally, follow these steps:

Clone this repository to your local machine.
Make sure you have Node.js and npm installed.
Navigate to the project directory in your terminal.
Run npm install to install the dependencies.
Once the installation is complete, run npm start to start the development server.
Open your web browser and go to http://localhost:8080 to play the game.
How to Play
Player 1 starts the game, controlling the rook with a red tint.
Click on the rook to select it.
Click and drag to move the rook within the chessboard.
The objective is to reach the target position (marked by a green square) before your opponent.
Each player has 30 seconds per turn to make a move.
If the rook reaches the target, the player wins the game.
Code Structure and Design Decisions
The game is structured as follows:

index.html: The HTML file containing the basic structure of the game page.
game.js: The main JavaScript file where the game logic is implemented using Phaser.
assets/: Contains the images used in the game, including the chessboard, rook, target, and player avatars.
Design decisions:

Used Phaser framework for game development due to its simplicity and ease of use.
Implemented a turn-based system where players take turns moving the rook.
Incorporated a timer to limit each player's turn to 30 seconds.
Designed the game with a clean and intuitive user interface for a better gaming experience.
