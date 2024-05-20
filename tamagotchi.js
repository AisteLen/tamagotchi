"use strict";
// game start lobby variables
const gameStartLobby = document.getElementById("gameStartLobby");
const startGameBtn = document.getElementById("startGame");
const animalIcons = document.querySelectorAll(".animal");
const spriteDiv = document.querySelector(".sprite");
// game zone variables
const gameZone = document.getElementById("gameZone");
const hpBar = document.getElementById("hpBar");
const hungerBar = document.getElementById("hungerBar");
const funBar = document.getElementById("funBar");
const lvl = document.getElementById("lvl");
const myPet = document.getElementById("myPet");
const feed = document.getElementById("feed");
const play = document.getElementById("play");
const animalChillZone = document.getElementById("animalChillZone");
let hp = 100;
let hungry = 100;
let fun = 100;
let lvlResult = 1;
lvl.innerText = "Level: " + lvlResult;
let spriteInterval;
animalIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        animalIcons.forEach(icon => icon.classList.remove("active"));
        icon.classList.add("active");
        if (icon.classList.contains('sprite')) {
            myPet.innerHTML = '';
            myPet.className = 'sprite';
            myPet.style.backgroundImage = icon.style.backgroundImage;
            myPet.style.backgroundSize = '580px';
            myPet.style.backgroundPosition = '-10px 30px';
            myPet.style.display = 'block';
            if (spriteInterval)
                clearInterval(spriteInterval);
            let posIndex = 0;
            const positions = ['-10px 30px', '-195px 30px', '-400px 30px'];
            spriteInterval = window.setInterval(() => {
                myPet.style.backgroundPosition = positions[posIndex];
                posIndex = (posIndex + 1) % positions.length;
            }, 100);
        }
        else {
            if (spriteInterval) {
                clearInterval(spriteInterval);
                spriteInterval = undefined;
            }
            myPet.className = '';
            myPet.style.backgroundImage = '';
            myPet.style.backgroundSize = '';
            myPet.style.backgroundPosition = '';
            myPet.style.display = 'block';
            myPet.innerHTML = icon.innerHTML;
        }
    });
});
function updateBars() {
    hpBar.style.width = hp + "%";
    hpBar.innerText = `${hp}%`;
    hungerBar.style.width = hungry + "%";
    hungerBar.innerText = `${hungry}%`;
    funBar.style.width = fun + "%";
    funBar.innerText = `${fun}%`;
}
let gameLoopInterval;
let levelUpInterval;
let gameRunning = false;
function startGame() {
    gameStartLobby.style.display = "none";
    gameZone.style.display = "block";
    updateBars();
    if (gameLoopInterval)
        clearInterval(gameLoopInterval);
    if (levelUpInterval)
        clearInterval(levelUpInterval);
    gameRunning = true;
    gameLoopInterval = setInterval(gameLoop, 500);
    levelUpInterval = setInterval(levelUp, 15000);
}
function goToStart() {
    if (gameLoopInterval)
        clearInterval(gameLoopInterval);
    if (levelUpInterval)
        clearInterval(levelUpInterval);
    gameRunning = false;
    gameStartLobby.style.display = "flex";
    gameZone.style.display = "none";
    hp = 100;
    hungry = 100;
    fun = 100;
    lvlResult = 1;
    lvl.innerText = "Level: " + lvlResult;
    myPet.style.fontSize = "25px";
    myPet.style.backgroundImage = '';
    myPet.style.backgroundSize = '';
    myPet.innerHTML = '';
}
function levelUp() {
    lvlResult += 1;
    lvl.innerText = "Level: " + lvlResult;
    let currentFontSize = parseInt(window.getComputedStyle(myPet).fontSize);
    if (currentFontSize < 300) {
        myPet.style.fontSize = (currentFontSize + 20) + "px";
    }
}
function gameLoop() {
    if (!gameRunning)
        return;
    if (hp <= 0) {
        gameRunning = false;
        clearInterval(gameLoopInterval);
        clearInterval(levelUpInterval);
        alert("Your pet died :(");
        goToStart();
        return;
    }
    if (hungry > 0)
        hungry -= 1;
    if (fun > 0)
        fun -= 1;
    if (hungry < 30) {
        hungerBar.style.backgroundColor = "red";
        if (hp > 0)
            hp -= 1;
    }
    else {
        hungerBar.style.backgroundColor = "rgba(130, 88, 236, 0.79)";
    }
    if (fun < 30) {
        funBar.style.backgroundColor = "red";
        if (hp > 0)
            hp -= 1;
    }
    else {
        funBar.style.backgroundColor = "rgba(130, 88, 236, 0.79)";
    }
    if (fun > 79 && hungry > 79) {
        if (hp < 100)
            hp += 1;
    }
    updateBars();
}
feed.onclick = () => {
    if (hungry < 100) {
        hungry += 1;
        updateBars();
    }
};
play.onclick = () => {
    if (fun < 100) {
        const balls = document.querySelectorAll(".ball");
        if (balls.length === 0) {
            for (let i = 0; i < 5; i++) {
                const ball = document.createElement("div");
                ball.className = "ball";
                ball.innerHTML = `<img src="https://clipart-library.com/images/BcaKKaXLi.png" alt="ball image">`;
                const randomX = Math.floor(Math.random() * (animalChillZone.offsetWidth - 30)); // -ball size
                const randomY = Math.floor(Math.random() * (animalChillZone.offsetHeight - 30));
                ball.style.position = "absolute";
                ball.style.left = `${randomX}px`;
                ball.style.top = `${randomY}px`;
                animalChillZone.appendChild(ball);
                ball.onclick = () => {
                    ball.remove();
                    fun += 5;
                    if (fun > 100) {
                        fun = 100;
                    }
                    updateBars();
                };
            }
        }
    }
};
startGameBtn.addEventListener("click", startGame);
