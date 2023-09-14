const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const BLOCK_SIZE = 70;
const PHRASES = [
    "We", "design", "and", "develop", "applications",
    "that", "run", "the", "world", "and", "showcase", "the", "future"
];

const fallingBlocks = [];
let score = 0;
let gameOver = false;
let gameStartTime = 0;
let gameTime = 5 * 60 * 1000; // 5 minutes in milliseconds
let totalPhrasesFormed = 0;

// Add event listeners for keyboard input
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Variables to track horizontal movement
let leftPressed = false;
let rightPressed = false;
const horizontalSpeed = 1; // Adjust the speed as needed

// Event handler for keydown
function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    } else if (event.key === "ArrowRight") {
        rightPressed = true;
    }
}

// Event handler for keyup
function handleKeyUp(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    } else if (event.key === "ArrowRight") {
        rightPressed = false;
    }
}

// Generate a random word block
function generateBlock() {
    const word = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    return {
        word: word,
        color: color,
        x: Math.floor(Math.random() * (canvas.width - BLOCK_SIZE)),
        y: 0
    };
}

// Check if a block collides with the bottom
function checkCollision(block) {
    return block.y + BLOCK_SIZE > canvas.height;
}

// Check for collisions with phrases and remove matching blocks
function checkPhraseCollisions() {
    for (let i = 0; i < PHRASES.length; i++) {
        if (PHRASES[i] === "") continue;

        const phraseRect = {
            x: i * BLOCK_SIZE,
            y: canvas.height - BLOCK_SIZE,
            width: PHRASES[i].length * BLOCK_SIZE,
            height: BLOCK_SIZE
        };

        for (let j = fallingBlocks.length - 1; j >= 0; j--) {
            const block = fallingBlocks[j];

            // Horizontal movement based on player input
            if (leftPressed && block.x > 0) {
                block.x -= horizontalSpeed;
            }
            if (rightPressed && block.x + BLOCK_SIZE < canvas.width) {
                block.x += horizontalSpeed;
            }

            block.y += 0.1;

            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, BLOCK_SIZE, BLOCK_SIZE);

            ctx.fillStyle = "black";
            ctx.fillText(block.word, block.x + 10, block.y + 20);

            // Check for collisions with the bottom
            if (checkCollision(block)) {
                gameOver = true;
                return;
            }

            // Check for collisions with phrases and remove matching blocks
            if (block.x < phraseRect.x + phraseRect.width &&
                block.x + BLOCK_SIZE > phraseRect.x &&
                block.y < phraseRect.y + phraseRect.height &&
                block.y + BLOCK_SIZE > phraseRect.y) {
                if (block.word === PHRASES[i]) {
                    PHRASES[i] = "";
                    fallingBlocks.splice(j, 1);
                    score++;
                    totalPhrasesFormed++;
                }
            }
        }
    }
}

// Game loop
function gameLoop(timestamp) {
    if (!gameStartTime) {
        gameStartTime = timestamp;
    }

    const elapsedTime = timestamp - gameStartTime;

    if (elapsedTime >= gameTime || gameOver) {
        // Game over
        gameOver = true;
        displayGameOver();
        return;
    }

    // Generate new blocks
    if (fallingBlocks.length < 1) {
        fallingBlocks.push(generateBlock());
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move and draw the falling blocks
    for (let i = 0; i < fallingBlocks.length; i++) {
        const block = fallingBlocks[i];

        // Horizontal movement based on player input
        if (leftPressed && block.x > 0) {
            block.x -= horizontalSpeed;
        }
        if (rightPressed && block.x + BLOCK_SIZE < canvas.width) {
            block.x += horizontalSpeed;
        }

        block.y += 1;

        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, BLOCK_SIZE, BLOCK_SIZE);

        ctx.fillStyle = "black";
        ctx.fillText(block.word, block.x + 10, block.y + 20);

        // Check for collisions with the bottom
        if (checkCollision(block)) {
            gameOver = true;
            return;
        }
    }

    // Draw the phrases
    for (let i = 0; i < PHRASES.length; i++) {
        if (PHRASES[i] !== "") {
            ctx.strokeRect(i * BLOCK_SIZE, canvas.height - BLOCK_SIZE, PHRASES[i].length * BLOCK_SIZE, BLOCK_SIZE);
            ctx.fillStyle = "black";
            ctx.fillText(PHRASES[i], i * BLOCK_SIZE + 10, canvas.height - 10);
        }
    }

    // Check for collisions with phrases and remove matching blocks
    checkPhraseCollisions();

    // Display score
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 40);
    ctx.fillText("Phrases Formed: " + totalPhrasesFormed, 20, 70);

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Display game over screen
function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "36px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2);
    ctx.fillText("Phrases Formed: " + totalPhrasesFormed, canvas.width / 2 - 100, canvas.height / 2 + 50);
}

// Start the game loop
requestAnimationFrame(gameLoop);










