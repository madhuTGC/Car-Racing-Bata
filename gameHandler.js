const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const level = document.querySelector('.level');


let gameStart = new Audio();
let gameOver = new Audio();

gameStart.src = "./assets_audio_game_theme.mp3";
gameOver.src = "./assets_audio_gameOver_theme.mp3";


const levelSpeed = {easy: 7, moderate: 10, difficult: 14};

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}
let player = { speed: 7, score: 0 };
level.addEventListener('click', (e)=> {
    player.speed = levelSpeed[e.target.id];
});

startScreen.addEventListener('click', () => {
    // gameArea.classList.remove('hide');
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";

    player.start = true;
    gameStart.play();
    gameStart.loop = true;
    player.score = 0;
    window.requestAnimationFrame(gamePlay);

    for(let i=0; i<5; i++){
        let roadLineElement = document.createElement('div');
        roadLineElement.setAttribute('class', 'roadLines');
        roadLineElement.y = (i*150);
        roadLineElement.style.top = roadLineElement.y + "px";
        gameArea.appendChild(roadLineElement);
    }

    let carElement = document.createElement('div');
    carElement.setAttribute('class', 'car');
    gameArea.appendChild(carElement);

    player.x = carElement.offsetLeft;
    player.y = carElement.offsetTop  ;

    for(let i=0; i<3; i++){
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemyCar');
        enemyCar.y = ((i+1) * 350) * - 1;
        enemyCar.style.top = enemyCar.y + "px";
        // enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);
    }
});

function randomColor(){
    function c(){
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0"+ String(hex)).substr(-2);
    }
    return "#"+c()+c()+c();
}

function onCollision(a,b){
    aRect = a.getBoundingClientRect();
    bRect = b.getBoundingClientRect();

    return !((aRect.top >  bRect.bottom) || (aRect.bottom <  bRect.top) ||
        (aRect.right <  bRect.left) || (aRect.left >  bRect.right)); 
}

function onGameOver() {
    player.start = false;
    gameStart.pause();
    gameOver.play();
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game Over <br> Your final score is " + player.score + "<br> Press here to restart the game.";
}

function moveRoadLines(){
    let roadLines = document.querySelectorAll('.roadLines');
    roadLines.forEach((item)=> {
        if(item.y >= 700){
            item.y -= 750;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function moveEnemyCars(carElement) {
    let enemyCars = document.querySelectorAll('.enemyCar');
    enemyCars.forEach((item) => {
        if (onCollision(carElement, item)) {
            // Pause the game temporarily when the car hits an enemy
            player.start = false;
            gameStart.pause();

            // Show a message indicating the hit
            startScreen.classList.remove('hide');
            startScreen.innerHTML = "You hit an enemy car!<br>Game Paused<br>Press here to resume.";

            // Resume the game after the message is clicked
            document.addEventListener('click', () => {
                startScreen.classList.add('hide');
                player.start = true;
                gameStart.play();
                window.requestAnimationFrame(gamePlay);
            }, { once: true });
        }

        if (item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + "px";
        }

        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}





// ... (Previous code remains unchanged)

function onGameOver() {
    player.start = false;
    gameStart.pause();

    if (flagCounter <= 10) {
        // If 10 flags hit, show a congratulations message
        startScreen.classList.remove('hide');
        startScreen.innerHTML = `Congratulations! You hit 10 flags!<br>Game Over<br>Your final score is ${player.score}<br>Press here to restart the game.`;
    } else {
        // Otherwise, show a regular game over message
        startScreen.classList.remove('hide');
        startScreen.innerHTML = `Game Over<br>Your final score is ${player.score}<br>Press here to restart the game.`;
    }
}

// ... (The rest of the code remains unchanged)

function gamePlay() {
    let carElement = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();

    if(player.start){
        moveRoadLines();
        moveEnemyCars(carElement);
            
        if(keys.ArrowUp && player.y > (road.top + 70)) player.y -= player.speed;
        if(keys.ArrowDown && player.y < (road.bottom - 85)) player.y += player.speed;
        if(keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if(keys.ArrowRight && player.x < (road.width - 70)) player.x += player.speed;

        carElement.style.top = player.y + "px";
        carElement.style.left = player.x + "px";

        window.requestAnimationFrame(gamePlay);

        player.score++;
        const ps = player.score - 1;
        score.innerHTML = 'Score: ' + ps;          
    }
}
document.addEventListener('keydown', (e)=>{
    e.preventDefault();
    keys[e.key] = true;
});

document.addEventListener('keyup', (e)=>{
    e.preventDefault();
    keys[e.key] = false;
});





let touchStartX;
let raceCarStartX;

document.addEventListener("touchstart", function (e) {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    raceCarStartX = player.x;
});

document.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (touchStartX !== undefined && raceCarStartX !== undefined) {
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - touchStartX;
        player.x = raceCarStartX + deltaX;

        const road = gameArea.getBoundingClientRect();
        player.x = Math.min(Math.max(player.x, 0), road.width - carElement.offsetWidth);
    }
});

document.addEventListener("touchend", function (e) {
    touchStartX = undefined;
    raceCarStartX = undefined;
});














