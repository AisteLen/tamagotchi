// game start lobby variables
const gameStartLobby = document.getElementById("gameStartLobby") as HTMLElement;
const startGameBtn = document.getElementById("startGame") as HTMLElement;
const animalIcons = document.querySelectorAll(".animal") as NodeListOf<HTMLElement>;

// game zone variables
const gameZone = document.getElementById("gameZone") as HTMLElement;
const hpBar = document.getElementById("hpBar") as HTMLElement;
const hungerBar = document.getElementById("hungerBar") as HTMLElement;
const funBar = document.getElementById("funBar") as HTMLElement;
const lvl = document.getElementById("lvl") as HTMLElement;
const myPet = document.getElementById("myPet") as HTMLElement;
const feed = document.getElementById("feed") as HTMLElement;
const play = document.getElementById("play") as HTMLElement;
const animalChillZone = document.getElementById("animalChillZone") as HTMLElement;

let hp: number = 100;
let hungry: number = 100;
let fun: number = 100;
let lvlResult: number = 1;
lvl.innerText = "Level: " + lvlResult;

animalIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        animalIcons.forEach(icon => icon.classList.remove("active"));
        icon.classList.add("active");
        myPet.innerHTML = icon.innerHTML;
    });
});

function updateBars(): void {
    hpBar.style.width = hp + "%";
    hpBar.innerText = `${hp}%`;
    hungerBar.style.width = hungry + "%";
    hungerBar.innerText = `${hungry}%`;
    funBar.style.width = fun + "%";
    funBar.innerText = `${fun}%`;
}

let gameLoopInterval: number | undefined;
let levelUpInterval: number | undefined;
let gameRunning: boolean = false;

function startGame(): void {
    gameStartLobby.style.display = "none";
    gameZone.style.display = "block";
    updateBars();

    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (levelUpInterval) clearInterval(levelUpInterval);
    gameRunning = true;
    gameLoopInterval = setInterval(gameLoop, 500);
    levelUpInterval = setInterval(levelUp, 15000);
}

function goToStart(): void {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (levelUpInterval) clearInterval(levelUpInterval);
    gameRunning = false;
    gameStartLobby.style.display = "flex";
    gameZone.style.display = "none";
    hp = 100;
    hungry = 100;
    fun = 100;
    lvlResult = 1;
    lvl.innerText = "Level: " + lvlResult;
    myPet.style.fontSize = "25px";
}

function levelUp(): void {
    lvlResult += 1;
    lvl.innerText = "Level: " + lvlResult;
    let currentFontSize = parseInt(window.getComputedStyle(myPet).fontSize);
    if (currentFontSize < 300){
        myPet.style.fontSize = (currentFontSize + 20) + "px";
    }
}

function gameLoop(): void {
    if (!gameRunning) return;

    if (hp <= 0) {
        gameRunning = false;
        clearInterval(gameLoopInterval);
        clearInterval(levelUpInterval);
        alert("Your pet died :(");
        goToStart();
        return;
    }

    if (hungry > 0) hungry -= 1;
    if (fun > 0) fun -= 1;
    if (hungry < 30) {
        hungerBar.style.backgroundColor = "red";
        if (hp > 0) hp -= 1;
    } else {
        hungerBar.style.backgroundColor = "rgba(130, 88, 236, 0.79)";
    }
    if (fun < 30) {
        funBar.style.backgroundColor = "red";
        if (hp > 0) hp -= 1;
    } else {
        funBar.style.backgroundColor = "rgba(130, 88, 236, 0.79)";
    }
    if (fun > 79 && hungry > 79){
        if (hp < 100) hp += 1;
    }
    updateBars();
}

feed.onclick = (): void => {
    if (hungry < 100) {
        hungry += 1;
        updateBars();
    }
}

play.onclick = (): void => {
    if (fun < 100) {
        const balls = document.querySelectorAll(".ball");
        if (balls.length === 0) {
            for (let i = 0; i < 5; i++) {
                const ball = document.createElement("div");
                ball.className = "ball"
                ball.innerHTML = `<img src="https://clipart-library.com/images/BcaKKaXLi.png" alt="ball image">`;

                const randomX = Math.floor(Math.random() * (animalChillZone.offsetWidth - 30)); // -ball size
                const randomY = Math.floor(Math.random() * (animalChillZone.offsetHeight - 30));
                ball.style.position = "absolute";
                ball.style.left = `${randomX}px`;
                ball.style.top = `${randomY}px`;

                animalChillZone.appendChild(ball)

                ball.onclick = (): void => {
                    ball.remove()
                    fun += 5;
                    if (fun > 100) {
                        fun = 100;
                    }
                    updateBars();
                }
            }
        }
    }
}
startGameBtn.addEventListener("click", startGame);

