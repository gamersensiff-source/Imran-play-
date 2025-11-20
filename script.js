const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const retryButton = document.getElementById('retryButton');

// गाने और आवाज़ें
const playMusic = new Audio('music/play_music.mp3'); 
playMusic.loop = true;

// <<<-- यह आपकी नई 'आउट' होने वाली आवाज़ है
const gameOverSound = new Audio('music/game_over_new.mp3'); 

// तस्वीरें
const birdImg = new Image();
// <<<-- यह आपकी नई बर्ड की तस्वीर का URL है
birdImg.src = 'https://i.ibb.co/9DrHK6q/IMG-20251121-011536.jpg';

const bgImg = new Image();
bgImg.src = 'images/background.png';

const fgImg = new Image();
fgImg.src = 'images/foreground.png';

const pipeNorthImg = new Image();
pipeNorthImg.src = 'images/pipeNorth.png';

const pipeSouthImg = new Image();
pipeSouthImg.src = 'images/pipeSouth.png';

// कुछ ज़रूरी वैरिएबल
let gap = 85;
let constant;
let bX = 10;
let bY = 150;
let gravity = 1.5;
let score = 0;
let gameStarted = false;
let isGameOver = false; // <<<-- गेम की स्थिति को ट्रैक करने के लिए

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
    location.reload(); // Retry बटन क्लिक करने पर गेम रीलोड करें
});

function moveUp() {
    if (isGameOver) return; // अगर गेम खत्म हो गया है तो कुछ न करें
    bY -= 25;
    if (!gameStarted) {
        playMusic.play();
        gameStarted = true;
    }
}

// <<<-- जब गेम ओवर साउंड खत्म हो जाए, तो Retry स्क्रीन दिखाओ
gameOverSound.onended = function() {
    gameOverScreen.classList.remove('hidden');
};

function draw() {
    ctx.drawImage(bgImg, 0, 0);

    for (let i = 0; i < pipe.length; i++) {
        constant = pipeNorthImg.height + gap;
        ctx.drawImage(pipeNorthImg, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouthImg, pipe[i].x, pipe[i].y + constant);

        if (!isGameOver) { // <<<-- अगर गेम चल रहा है तभी पाइप को हिलाओ
            pipe[i].x--;
        }

        if (pipe[i].x == 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeNorthImg.height) - pipeNorthImg.height
            });
        }

        // टक्कर का पता लगाना
        if ((bX + birdImg.width >= pipe[i].x && bX <= pipe[i].x + pipeNorthImg.width && (bY <= pipe[i].y + pipeNorthImg.height || bY + birdImg.height >= pipe[i].y + constant) || bY + birdImg.height >= canvas.height - fgImg.height) && !isGameOver) {
            isGameOver = true; // <<<-- गेम को 'ओवर' पर सेट करें
            playMusic.pause();
            gameOverSound.play();
        }

        if (pipe[i].x == 5) {
            score++;
        }
    }

    ctx.drawImage(fgImg, 0, canvas.height - fgImg.height);
    ctx.drawImage(birdImg, bX, bY);

    if (!isGameOver) { // <<<-- अगर गेम चल रहा है तभी बर्ड को नीचे गिराओ
        bY += gravity;
    }

    ctx.fillStyle = '#000';
    ctx.font = '20px Verdana';
    ctx.fillText('Score : ' + score, 10, canvas.height - 20);

    requestAnimationFrame(draw);
}

draw();