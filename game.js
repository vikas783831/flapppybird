const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

let birdY = 300; // Initial bird position
let velocity = 0; // Bird's vertical velocity
let gravity = 0.5; // Gravity effect
let isGameOver = false;
let isGameStarted = false;
let score = 0;
let gameLoop;
let pipeCreationLoop;

function jump() {
    if (!isGameStarted || isGameOver) return;
    velocity = -8; // Apply upward force
    bird.style.transform = 'rotate(-30deg)';
    setTimeout(() => bird.style.transform = 'rotate(0deg)', 200);
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
            score++;
            scoreElement.textContent = score;
            pipe.passed = true;
        }
    });
}

function createPipe() {
    if (!isGameStarted || isGameOver) return;

    const gap = 150; // Gap between upper and lower pipes
    const minHeight = 50;
    const maxHeight = gameContainer.clientHeight - gap - minHeight;
    const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
   
    // Upper pipe
    const upperPipe = document.createElement('div');
    upperPipe.className = 'pipe';
    upperPipe.style.height = `${pipeHeight}px`;
    upperPipe.style.top = '0';
    upperPipe.style.left = '100%';
    upperPipe.style.transform = 'rotate(180deg)';

    // Lower pipe
    const lowerPipe = document.createElement('div');
    lowerPipe.className = 'pipe';
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

document.addEventListener('mousedown', () => {
    jump();
});

document.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    jump();
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
