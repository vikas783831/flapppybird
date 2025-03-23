const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

let birdY = 300;
let velocity = 0;
let gravity = 0.5;
let isGameOver = false;
let isGameStarted = false;
let score = 0;
let gameLoop;
let pipeCreationLoop;

function jump() {
    if (!isGameStarted || isGameOver) return;
    velocity = -8;
    bird.style.transform = 'rotate(-30deg)';
    setTimeout(() => bird.style.transform = 'rotate(0deg)', 200);
}

function updateGame() {
    if (!isGameStarted || isGameOver) return;

    velocity += gravity;
    birdY += velocity;
    bird.style.top = `${birdY}px`;

    // Boundary check
    if (birdY < 0 || birdY > gameContainer.clientHeight - 40) {
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

    const gap = 150;
    const minHeight = 50;
    const maxHeight = gameContainer.clientHeight - gap - minHeight;
    const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
   
    // Upper pipe
    const upperPipe = document.createElement('div');
    upperPipe.className = 'pipe';
    upperPipe.style.height = `${pipeHeight}px`;
    upperPipe.style.top = '0';
    upperPipe.style.left = '400px';
    upperPipe.style.transform = 'rotate(180deg)';

    // Lower pipe
    const lowerPipe = document.createElement('div');
    lowerPipe.className = 'pipe';
    lowerPipe.style.height = `${gameContainer.clientHeight - pipeHeight - gap}px`;
    lowerPipe.style.bottom = '0';
    lowerPipe.style.left = '400px';

    gameContainer.append(upperPipe, lowerPipe);

    // Pipe animation
    let pipeX = 400;
    const pipeMove = setInterval(() => {
        if (isGameOver) {
            clearInterval(pipeMove);
            return;
        }
        pipeX -= 2;
        upperPipe.style.left = `${pipeX}px`;
        lowerPipe.style.left = `${pipeX}px`;

        if (pipeX < -60) {
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

document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

On Sun, 23 Mar 2025 at 13:10, Aditya Pandat <pandataditya616@gmail.com> wrote:
body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #2c3e50;
    touch-action: manipulation;
}

#game-container {
    position: relative;
    width: 400px;
    height: 600px;
    overflow: hidden;
    background: url('https://iili.io/2mORBt9.md.jpg');
    background-size: cover;
}

#bird {
    position: absolute;
    width: 40px;
    height: 40px;
    left: 50px;
    background-image: url('https://iili.io/2mONmdl.md.png');
    background-size: contain;
    transition: transform 0.1s;
    z-index: 2;
}

.pipe {
    position: absolute;
    width: 60px;
    background-image: url('https://i.postimg.cc/pdBBVgZs/Pipe.png');
    background-size: cover;
    background-position: center;
    z-index: 1;
}

#score {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32px;
    font-family: Arial;
    color: white;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    z-index: 100;
}

.game-btn {
    position: absolute;
    padding: 12px 24px;
    font-size: 18px;
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 200;
    transform: translateX(-50%);
}

#start-btn {
    left: 50%;
    top: 50%;
}

#restart-btn {
    left: 50%;
    top: 60%;
    display: none;
}
