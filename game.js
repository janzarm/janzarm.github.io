const gameContainer = document.querySelector('.game-container');
const wormHead = document.getElementById('worm-head');
const scoreDisplay = document.getElementById('score');

let wormSegments = [{ element: wormHead, x: 200, y: 200 }];
let segmentDistance = 20;
let letters = [];
let score = 0;

let lastTouch = { x: 200, y: 200 };
let touchSpeed = 0;
let targetX = 200;
let targetY = 200;
let isTouching = false;

function initializeWorm() {
    for (let i = 1; i < 10; i++) {
        const segment = document.createElement('div');
        segment.classList.add('worm-segment');
        gameContainer.appendChild(segment);
        wormSegments.push({ element: segment, x: 200, y: 200 + i * segmentDistance });
    }
}
initializeWorm();

function updateWormPosition() {
    const head = wormSegments[0];

    if (isTouching) {
        const dx = targetX - lastTouch.x;
        const dy = targetY - lastTouch.y;
        touchSpeed = Math.sqrt(dx * dx + dy * dy);

        const angle = Math.atan2(targetY - head.y, targetX - head.x);
        head.x += Math.cos(angle) * touchSpeed;
        head.y += Math.sin(angle) * touchSpeed;

        lastTouch.x = targetX;
        lastTouch.y = targetY;
    }

    head.element.style.left = `${head.x}px`;
    head.element.style.top = `${head.y}px`;

    for (let i = 1; i < wormSegments.length; i++) {
        const prevSegment = wormSegments[i - 1];
        const segment = wormSegments[i];

        let angle = Math.atan2(prevSegment.y - segment.y, prevSegment.x - segment.x);
        segment.x = prevSegment.x - Math.cos(angle) * segmentDistance;
        segment.y = prevSegment.y - Math.sin(angle) * segmentDistance;

        segment.element.style.left = `${segment.x}px`;
        segment.element.style.top = `${segment.y}px`;
    }

    checkCollisionWithLetters();

    requestAnimationFrame(updateWormPosition);
}

function onUserTouchMove(event) {
    const touch = event.touches[0];
    targetX = touch.clientX;
    targetY = touch.clientY;
    isTouching = true;
}

function onUserTouchEnd() {
    isTouching = false;
}

function generateLetter() {
    const letter = document.createElement('div');
    letter.classList.add('letter');
    letter.innerText = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    letter.style.left = `${Math.random() * (gameContainer.offsetWidth - 30)}px`;
    letter.style.top = `${Math.random() * (gameContainer.offsetHeight - 30)}px`;
    gameContainer.appendChild(letter);
    letters.push(letter);
}

function checkCollisionWithLetters() {
    letters.forEach((letter, index) => {
        const letterRect = letter.getBoundingClientRect();
        const headRect = wormSegments[0].element.getBoundingClientRect();

        if (
            headRect.left < letterRect.right &&
            headRect.right > letterRect.left &&
            headRect.top < letterRect.bottom &&
            headRect.bottom > letterRect.top
        ) {
            letter.remove();
            letters.splice(index, 1);
            score += 10; // Tambahkan skor
            scoreDisplay.textContent = `Score: ${score}`;
            generateLetter();
        }
    });
}

gameContainer.addEventListener('touchmove', onUserTouchMove);
gameContainer.addEventListener('touchend', onUserTouchEnd);
gameContainer.addEventListener('touchstart', onUserTouchMove);

generateLetter();
requestAnimationFrame(updateWormPosition);