const GAME_SPEED = 100;
const CANVAS_BORDER_COLOUR = '#00ff99';
const CANVAS_BACKGROUND_COLOUR = "#1a1a1a";
const SNAKE_COLOUR = '#00ff99';
const SNAKE_BORDER_COLOUR = '#007755';
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'darkred';

let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 }
];

let score = 0;
let changingDirection = false;
let foodX;
let foodY;
let dx = 10;
let dy = 0;
let gameWon = false;

window.onload = () => {
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");

    // Assign these globally so other functions can use them
    window.ctx = ctx;
    window.gameCanvas = gameCanvas;

    document.addEventListener("keydown", changeDirection);
    createFood();
    main();
};


// Start the game loop
function main() {
    if (didGameEnd()) {
        displayGameOver();
        return;
    }
    if (gameWon) {
        return;
    }

    setTimeout(() => {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, GAME_SPEED);
}

// Clear canvas and draw border
function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Draw the food square
function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokestyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

// Move the snake and check for food
function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 10;

        if (score >= 500) {
            displayWin();
            gameWon = true;
            return;
        }

        document.getElementById('score').innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }
}

// Check if the game is over
function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const left = snake[0].x < 0;
    const right = snake[0].x > gameCanvas.width - 10;
    const top = snake[0].y < 0;
    const bottom = snake[0].y > gameCanvas.height - 10;

    return left || right || top || bottom;
}

// Get random position (multiple of 10)
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

// Place food on random location
function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(part => {
        if (part.x === foodX && part.y === foodY) createFood();
    });
}

// Draw all parts of the snake
function drawSnake() {
    snake.forEach(drawSnakePart);
}

// Draw a single part of the snake
function drawSnakePart(part) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokestyle = SNAKE_BORDER_COLOUR;
    ctx.fillRect(part.x, part.y, 10, 10);
    ctx.strokeRect(part.x, part.y, 10, 10);
}

// Handle key presses to change direction
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const key = event.keyCode;
    const up = dy === -10;
    const down = dy === 10;
    const right = dx === 10;
    const left = dx === -10;

    if (key === LEFT_KEY && !right) {
        dx = -10;
        dy = 0;
    }
    if (key === UP_KEY && !down) {
        dx = 0;
        dy = -10;
    }
    if (key === RIGHT_KEY && !left) {
        dx = 10;
        dy = 0;
    }
    if (key === DOWN_KEY && !up) {
        dx = 0;
        dy = 10;
    }
}

function displayGameOver() {
    const scoreEl = document.getElementById('score');
    scoreEl.innerHTML = "Game Over";
    scoreEl.style.color = "red";
}

function displayWin() {
    const scoreEl = document.getElementById('score');
    scoreEl.innerHTML = "You Win!";
    scoreEl.style.color = "#00ff99";
}
