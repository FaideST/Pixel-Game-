window.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const groundY= 193;
let cameraY = 0;
const cameraHeight = canvas.height;
const worldHeight = 600;


canvas.width = 640;
canvas.height = 240;

// Position
let playerX = 50;
let playerY = 160;
const speed = 2;

let velocityY = 0; 
const gravity = 0.5; 
const jumpStrength = -5; 
let onGround = true;

// Input 
const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// Bg
const bg = new Image();
let bgLoaded = false;
bg.src = "assets/bg/village.png";

bg.onload = () => {
    bgLoaded = true;
    console.log("Background loaded!");
};

bg.onerror = () => {
    console.error("Failed to load background:", bg.src);
};


const bgcave = new Image();
let bgcaveLoaded = false;
bgcave.src = "assets/bg/bg2cavemitsprites.png";

bgcave.onload = () => {
    bgcaveLoaded = true;
    console.log("Background loaded!");
};

bgcave.onerror = () => {
    console.error("Failed to load background:", bgcave.src);
};


//Char setup
const player = new Image();
let playerLoaded = false;

player.onload = () => {
  console.log("Player image loaded!", player.src);
  playerLoaded = true;
};

player.onerror = () => {
  console.error("Failed to load image:", player.src);
};

//Char Auswahl
const heroes = ["Magi.png","Assasine.png","bard.png","elf.png", "wizardcharacteror1.png" ];
let selectedHero = 0;

window.addEventListener("keydown", e => {
  if(e.key === "ArrowLeft"){ selectedHero = (selectedHero + heroes.length - 1)% heroes.length;
    player.src = `assets/sprites/heroes/${heroes[selectedHero]}`;
  }
  if(e.key === "ArrowRight"){ selectedHero = (selectedHero + 1) % heroes.length;
  player.src = `assets/sprites/heroes/${heroes[selectedHero]}`;
  }
});



//Häuser / Bosse Posi + Laden


//Bilder (Bosse)
const bosses =  [
  {img: new Image(), x: 140, y: 0, w: 64, h: 64},
];

bosses[0]!.img.src = "assets/sprites/bosse/CursedKnight.png";



//Bilder (items)
const items =  [
  {img: new Image(), x: 210, y: 0, w: 32, h: 32},
  {img: new Image(), x: 240, y: 0, w: 32, h: 32},
];

items[0]!.img.src = "assets/sprites/items/CursedChest.png";
items[1]!.img.src = "assets/sprites/items/CursedKey.png";

//enemies

const enemies =  [
  {img: new Image(), x: 210, y: 0, w: 32, h: 32},
  {img: new Image(), x: 560, y: 150, w: 32, h: 32},
];

enemies[0]!.img.src = "assets/sprites/enemies/minispider.png";
enemies[1]!.img.src = "assets/sprites/enemies/Ghost.png";

//npcs





for (const boss of bosses) {
  boss.y = groundY - boss.h;
}

for (const item of items) {
  item.y = groundY - item.h + 5;
}





// Game Loop
function update() {
    if  ( keys["a"]) playerX -= speed;
    if  ( keys["d"]) playerX += speed;

    if ((keys["arrowup"] || keys["space"] || keys[" "]) && onGround) {
    velocityY = jumpStrength;
    onGround = false;
}
    velocityY += gravity;
    playerY += velocityY;

        if (playerY >= 160) {
        playerY = 160;
        velocityY = 0;
        onGround = true;
    }

    if (playerY - cameraY < 80) {
        cameraY = playerY - 80;
    }

    if (playerY - cameraY > canvas.height - 80) {
        cameraY = playerY - (canvas.height - 80);
  }

//Char im Feld behalten
  playerX = Math.max(0, Math.min(canvas.width - 16, playerX));
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Bg zeichnen
  if (bgLoaded) {
    ctx.drawImage (bg, 0, -cameraY, 320, 240)
  } else {
    ctx.fillStyle ="black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }


    if (bgcaveLoaded) {
    ctx.drawImage (bgcave, 320, -cameraY,  320, 240)
  } else {
    ctx.fillStyle ="black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }



  //Items zeichnen

    for (const item of items) {
      ctx.drawImage(item.img, item.x, item.y - cameraY, item.w, item.h )
    }

  // enemies zeichnen
      for (const enemy of enemies) {
      ctx.drawImage(enemy.img, enemy.x, enemy.y - cameraY, enemy.w, enemy.h )
    }

  //Bosse zeichnen
  for (const boss of bosses) {
    ctx.drawImage(boss.img, boss.x, boss.y - cameraY, boss.w, boss.h);
    }

  // Char zeichnen
  if (playerLoaded) {
    ctx.drawImage(player, playerX, playerY - cameraY, 32, 32); // Sprite zeichnen
  } else {
    ctx.fillStyle = "red"; // Platzhalter
    ctx.fillRect(playerX, playerY, 16, 16);
  }

}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
});












