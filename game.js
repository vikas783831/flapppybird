const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

let birdY = 300; // Initial bird position
let velocity = 0; // Bird's vertical velocity
let gravity = 0.5 * 1.17; // Increased gravity by 17%
let isGameOver = false;
let isGameStarted = false;
let score = 0;
let gameLoop;
let pipeCreationLoop;
let lastJumpTime = 0; // Track the last time the bird jumped

function jump() {
    if (!isGameStarted || isGameOver) return;

    const currentTime = Date.now();
    if (currentTime - lastJumpTime < 200) return; // Prevent multiple jumps within 200ms

    velocity = -8 * 1.17; // Increased upward force by 17%
    bird.style.transform = 'rotate(-30deg)';
    setTimeout(() => bird.style.transform = 'rotate(0deg)', 200);
    lastJumpTime = currentTime; // Update the last jump time
}

function updateGame() {
    if (!isGameStarted || isGameOver) return;

    velocity += gravity; // Apply gravity
    birdY += velocity; // Update bird's position
    bird.style.top = `${birdY}px`;

    // Boundary check (top and bottom of the game container)
    if (birdY < 0 || birdY > gameContainer.clientHeight - bird.clientHeight) {
        gameOver();
    }

    // Pipe collision detection
    const pipes = document.getElementsByClassName('pipe');
    Array.from(pipes).forEach(pipe => {
        const pipeRect = pipe.getBoundingClientRect();
        const birdRect = bird.getBoundingClientRect();
       
        if (
            birdRect.right > pipeRect.left &&
            birdRect.left < pipeRect.right &&
            birdRect.bottom > pipeRect.top &&
            birdRect.top < pipeRect.bottom
        ) {
            gameOver();
        }

        // Score update
        if (pipeRect.right < birdRect.left && !pipe.passed) {
            pipe.passed = true; // Mark the pipe as passed
            if (pipe.classList.contains('upper-pipe')) {
                score++; // Increment score only once per pair of pipes
                scoreElement.textContent = score;
            }
        }
    });
}

function createPipe() {
    if (!isGameStarted || isGameOver) return;

    const gap = 150 * 1.20; // Increased gap between pipes by 20%
    const minHeight = 50;
    const maxHeight = gameContainer.clientHeight - gap - minHeight;
    const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
   
    // Upper pipe
    const upperPipe = document.createElement('div');
    upperPipe.className = 'pipe upper-pipe'; // Add a class to identify upper pipe
    upperPipe.style.height = `${pipeHeight}px`;
    upperPipe.style.top = '0';
    upperPipe.style.left = '100%';
    upperPipe.style.transform = 'rotate(180deg)';

    // Lower pipe
    const lowerPipe = document.createElement('div');
    lowerPipe.className = 'pipe lower-pipe'; // Add a class to identify lower pipe
    lowerPipe.style.height = `${gameContainer.clientHeight - pipeHeight - gap}px`;
    lowerPipe.style.bottom = '0';
    lowerPipe.style.left = '100%';

    gameContainer.append(upperPipe, lowerPipe);

    // Pipe animation
    let pipeX = 100;
    const pipeMove = setInterval(() => {
        if (isGameOver) {
            clearInterval(pipeMove);
            return;
        }
        pipeX -= 2; // Move pipes to the left
        upperPipe.style.left = `${pipeX}%`;
        lowerPipe.style.left = `${pipeX}%`;

        if (pipeX < -15) { // Remove pipes when they go off-screen
            upperPipe.remove();
            lowerPipe.remove();
            clearInterval(pipeMove);
        }
    }, 20);
}

function gameOver() {
    isGameOver = true;
    isGameStarted = false;
    clearInterval(gameLoop);
    clearInterval(pipeCreationLoop);
    restartBtn.style.display = 'block';
}

function startGame() {
    // Reset game state
    isGameOver = false;
    isGameStarted = true;
    score = 0;
    birdY = 300;
    velocity = 0;
    scoreElement.textContent = '0';
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
   
    // Remove existing pipes
    document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());
   
    // Reset bird position
    bird.style.top = `${birdY}px`;
   
    // Start game loops
    gameLoop = setInterval(updateGame, 20);
    pipeCreationLoop = setInterval(createPipe, 1500);
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump();
    }
});

// Handle mouse clicks (for desktop)
document.addEventListener('mousedown', () => {
    if (isGameStarted) jump(); // Only jump if the game has started
});

// Handle touch events (for mobile)
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    // Add touchstart listener for touch devices
    document.addEventListener('touchstart', (e) => {
        if (isGameStarted) {
            e.preventDefault(); // Prevent default touch behavior
            jump();
        }
    }, { passive: false }); // Ensure preventDefault works
}

// Start button click event
startBtn.addEventListener('click', startGame);

// Restart button click event
restartBtn.addEventListener('click', startGame);
