const gameArea = document.getElementById('game-area');
const inputBox = document.getElementById('input-box');
const scoreCounter = document.getElementById('scorecounter');

//todo: read from a file
const words = ["apple", "banana", "grapefruit", "cherry", "mango", "blueberry", "strawberry"];
let activeWords = [];
//todo: settings
let score = 0;
let speed = 2; //pixels per frame
let difficulty = {frequency: 5, speedchange: 0, intervalchange: 200, minInterval: 500};
//frequency is how many points need to be scored for each difficulty increase
//speed is an increase to speed applied when the frequency is hit
//interval is a decrease to wordInterval applied when the frequency is hit
//minInterval is the minimum value allowed for wordInterval
let wordInterval = 2000; //ms between words

function spawnWord() {
    const wordText = words[Math.floor(Math.random() * words.length)];
    const wordElement = document.createElement('div');
    wordElement.classList.add('word');
    wordElement.textContent = wordText;
    //todo scale with game-area width
    wordElement.style.left = `${Math.random() * 550}px`;
    wordElement.style.top = '0px;'
    gameArea.appendChild(wordElement);

    activeWords.push({element: wordElement, text: wordText, y: 0});
}

function moveWords() {
    console.log("moveWords running", activeWords.length);

    activeWords.forEach(word => {
        word.y += speed;
        console.log(`word.y=${word.y}, speed=${speed}`);
        word.element.style.transform = `translateY(${word.y}px)`;
    });

    for (let i = activeWords.length - 1; i >= 0; i--) {
        // Remove it once it reaches the end of the game area
        if (activeWords[i].y >= gameArea.offsetHeight) {
            gameArea.removeChild(activeWords[i].element);
            activeWords.splice(i, 1);

            //todo: adjust lives
        }
    }
}

function checkInput() {
    const typed = inputBox.value.trim();
    const index = activeWords.findIndex(word => word.text === typed);
    if (index !== -1) {
        gameArea.removeChild(activeWords[index].element);
        activeWords.splice(index, 1);
        score++;
        scoreCounter.innerHTML = `Score: ${score}`;
        inputBox.value = '';

        if (score % difficulty.frequency === 0) {
            speed += difficulty.speedchange;
            if (wordInterval > (difficulty.intervalchange + difficulty.minInterval)) {
                wordInterval -= difficulty.intervalchange;
            }
            spawnTimer = setInterval(spawnWord, wordInterval);
        }
    }
}

inputBox.addEventListener('input', checkInput);

let spawnTimer = setInterval(spawnWord, wordInterval);

function gameLoop() {
    moveWords();
    requestAnimationFrame(gameLoop);
}

gameLoop();