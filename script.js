// script.js

// Elements HTML
const intro = document.getElementById('intro');
const startButton = document.getElementById('start-game');
const introSound = document.getElementById('intro-sound');
const scarySound = document.getElementById('scary-sound');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');

// Ajuster la taille du canvas
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

// Joueur
let player = { x: gameCanvas.width / 2, y: gameCanvas.height / 2, size: 20, color: 'white' };
let bullets = [];
let zombies = [];
let gameOver = false;

// Fonction pour démarrer le jeu
function startGame() {
    intro.style.display = 'none';
    gameCanvas.style.display = 'block';
    introSound.play();
    introSound.addEventListener('ended', () => scarySound.play());

    spawnZombies();
    gameLoop();
}

// Gestion des événements
startButton.addEventListener('click', startGame);

// Créer un zombie
function createZombie() {
    const side = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const position = side === 'horizontal'
        ? { x: Math.random() * gameCanvas.width, y: Math.random() < 0.5 ? 0 : gameCanvas.height }
        : { x: Math.random() < 0.5 ? 0 : gameCanvas.width, y: Math.random() * gameCanvas.height };
    zombies.push({ ...position, size: 30, color: 'green', speed: 1 });
}

// Faire apparaître des zombies
function spawnZombies() {
    setInterval(() => {
        if (!gameOver) createZombie();
    }, 2000); // Un zombie toutes les 2 secondes
}

// Tirer des projectiles
gameCanvas.addEventListener('click', (e) => {
    if (!gameOver) {
        const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
        bullets.push({ x: player.x, y: player.y, angle, speed: 5 });
    }
});

// Déplacer les projectiles
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;

        // Supprimer les projectiles hors écran
        if (
            bullet.x < 0 || bullet.x > gameCanvas.width ||
            bullet.y < 0 || bullet.y > gameCanvas.height
        ) {
            bullets.splice(index, 1);
        }
    });
}

// Déplacer les zombies
function updateZombies() {
    zombies.forEach((zombie, index) => {
        const angle = Math.atan2(player.y - zombie.y, player.x - zombie.x);
        zombie.x += Math.cos(angle) * zombie.speed;
        zombie.y += Math.sin(angle) * zombie.speed;

        // Détecter collision avec le joueur (fin de jeu)
        if (
            Math.abs(zombie.x - player.x) < player.size &&
            Math.abs(zombie.y - player.y) < player.size
        ) {
            gameOver = true;
            alert('Game Over! Les zombies vous ont eu !');
        }
    });
}

// Collision entre zombies et projectiles
function checkCollisions() {
    zombies.forEach((zombie, zIndex) => {
        bullets.forEach((bullet, bIndex) => {
            if (
                Math.abs(zombie.x - bullet.x) < zombie.size &&
                Math.abs(zombie.y - bullet.y) < zombie.size
            ) {
                zombies.splice(zIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
    });
}

// Dessiner le joueur, les zombies, et les projectiles
function drawGameObjects() {
    // Dessiner le joueur
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

    // Dessiner les projectiles
    ctx.fillStyle = 'red';
    bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Dessiner les zombies
    ctx.fillStyle = 'green';
    zombies.forEach((zombie) => {
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y, zombie.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Boucle du jeu
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Mettre à jour les éléments du jeu
    updateBullets();
    updateZombies();
    checkCollisions();
    drawGameObjects();

    requestAnimationFrame(gameLoop);
}

// Suivre la position de la souris pour déplacer le joueur
gameCanvas.addEventListener('mousemove', (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});
