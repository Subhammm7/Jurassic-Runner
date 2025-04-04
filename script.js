const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 200;

const dinos = [
    { name: "T-Rex", ability: "Balanced" },
    { name: "Velociraptor", ability: "Higher Jumps" },
    { name: "Triceratops", ability: "Shield (Breaks 1 obstacle)" },
    { name: "Pterodactyl", ability: "Glide Ability" },
    { name: "Robot Dino", ability: "Speed Boost" }
];

let dino = dinos[Math.floor(Math.random() * dinos.length)];
let level = 1;
let isNightMode = false;

// Start Game
document.getElementById("start-game").addEventListener("click", () => {
    dino = dinos[Math.floor(Math.random() * dinos.length)];
    document.getElementById("dino-selection").innerHTML = <p>You got: <b>${dino.name}</b> - ${dino.ability}</p>;
    startGame();
});

function startGame() {
    let player = { x: 50, y: 150, width: 30, height: 30, jumping: false, jumpStrength: 10 };
    let obstacles = [];
    let gameSpeed = 3;
    
    function drawPlayer() {
        ctx.fillStyle = "green";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawObstacles() {
        ctx.fillStyle = "red";
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function updateObstacles() {
        if (Math.random() < 0.02) {
            obstacles.push({ x: canvas.width, y: 170, width: 20, height: 30 });
        }
        obstacles.forEach(obstacle => obstacle.x -= gameSpeed);
        obstacles = obstacles.filter(obstacle => obstacle.x > -20);
    }

    function checkCollision() {
        for (let obs of obstacles) {
            if (player.x < obs.x + obs.width && player.x + player.width > obs.x &&
                player.y < obs.y + obs.height && player.y + player.height > obs.y) {
                alert("Game Over! Restarting...");
                level = 1;
                updateLevel();
                startGame();
            }
        }
    }

    function updateLevel() {
        level++;
        document.getElementById("level-display").innerText = Level: ${level};
        gameSpeed += 0.5;

        if (level % 3 === 0) {
            isNightMode = !isNightMode;
            document.body.classList.toggle("night-mode", isNightMode);
            document.getElementById("mode-display").innerText = isNightMode ? "🌙 Night Mode" : "🌞 Day Mode";
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawObstacles();
        updateObstacles();
        checkCollision();

        if (Math.random() < 0.005 * level) {
            updateLevel();
        }

        requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && !player.jumping) {
            player.jumping = true;
            let jumpInterval = setInterval(() => {
                if (player.y > 100) {
                    player.y -= player.jumpStrength;
                } else {
                    clearInterval(jumpInterval);
                    let fallInterval = setInterval(() => {
                        if (player.y < 150) {
                            player.y += player.jumpStrength;
                        } else {
                            clearInterval(fallInterval);
                            player.jumping = false;
                        }
                    }, 30);
                }
            }, 30);
        }
    });

    gameLoop();
}