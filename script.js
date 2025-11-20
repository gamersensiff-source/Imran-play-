const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const retryButton = document.getElementById('retryButton');

// गाने और आवाज़ें
const playMusic = new Audio('music/play_music.mp3');
playMusic.loop = true;

const gameOverSound = new Audio('music/game_over_new.mp3');

// तस्वीरें
const birdImg = new Image();
// <<<-- बदलाव 1: URL की जगह लोकल फ़ाइल का उपयोग करें
birdImg.src = 'images/my_bird.jpg'; 

const bgImg = new Image();
bgImg.src = 'images/background.png';

const fgImg = new Image();
fgImg.src = 'images/foreground.png';

const pipeNorthImg = new Image();
pipeNorthImg.src = 'images/pipeNorth.png';

const pipeSouthImg = new Image();
pipeSouthImg.src = 'images/pipeSouth.png';

// <<<-- बदलाव 2: बर्ड का आकार (चौड़ाई, ऊंचाई) सेट करें
const birdWidth = 40;
const birdHeight = 40;

// कुछ ज़रूरी वैरिएबल
let gap = 90;
let constant;
let bX = 10;
let bY = 150;
let gravity = 1.5;
let score = 0;
let gameStarted = false;
let isGameOver = false;

// पाइप के कोऑर्डिनेट्स
let pipe = [];
pipe[0] = {
    x: canvas.width,
    y: 0
};

// इवेंट्स
document.addEventListener('keydown', moveUp);
document.addEventListener('click', moveUp);
retryButton.addEventListener('click', () => {
    location.reload();
});

function moveUp() {
    if (isGameOver) return;
    bY -= 30; // थोड़ा ज़्यादा उछाल
    if (!gameStarted) {
        playMusic.play().catch(e => console.log("Audio play was prevented by browser."));
        gameStarted = true;
    }
}

gameOverSound.onended = function() {
    gameOverScreen.classList.remove('hidden');
};

function draw() {
    ctx.drawImage(bgImg, 0, 0);

    for (let i = 0; i < pipe.length; i++) {
        constant = pipeNorthImg.height + gap;
        ctx.drawImage(pipeNorthImg, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouthImg, pipe[i].x, pipe[i].y + constant);

        if (!isGameOver) {
            pipe[i].x--;
        }

        if (pipe[i].x == 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeNorthImg.height) - pipeNorthImg.height
            });
        }

        // <<<-- बदलाव 3: टक्कर का पता लगाने के लिए नए आकार का उपयोग करें
        if ((bX + birdWidth >= pipe[i].x && bX <= pipe[i].x + pipeNorthImg.width && (bY <= pipe[i].y + pipeNorthImg.height || bY + birdHeight >= pipe[i].y + constant) || bY + birdHeight >= canvas.height - fgImg.height) && !isGameOver) {
            isGameOver = true;
            playMusic.pause();
            gameOverSound.play();
        }

        if (pipe[i].x == 5) {
            score++;
        }
    }

    ctx.drawImage(fgImg, 0, canvas.height - fgImg.height);
    // <<<-- बदलाव 4: बर्ड को बनाते समय उसका आकार सेट करें
    ctx.drawImage(birdImg, bX, bY, birdWidth, birdHeight);

    if (!isGameOver) {
        bY += gravity;
    }

    ctx.fillStyle = '#000';
    ctx.font = '20px Verdana';
    ctx.fillText('Score : ' + score, 10, canvas.height - 20);

    requestAnimationFrame(draw);
}

draw();