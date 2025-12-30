window.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const groundY= 193;
let cameraY = 0;
let inventoryOpen = false;

window.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && !gameStarted) {
    gameStarted = true;
    goal.reached = false;
    playerX = 50;
    playerY = 160;
    velocityY = 0;
    cameraY = 0;
    startTime = performance.now();
    elapsedTime = 0;
  }
});


canvas.width = 320;
canvas.height = 240;

// Position
let playerX = 50;
let playerY = 160;
const speed = 2;

let velocityY = 0; 
const gravity = 0.5; 
const jumpStrength = -7; 
let onGround = true;

// Input 
const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
  }
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);




//* window.addEventListener("keydown", (e) => {
//    if (e.key.toLowerCase() === "i") {
//      inventoryOpen = !inventoryOpen; // Toggle
//    }
// });



// Bg
const bg = new Image();
let bgLoaded = false;
bg.src = "assets/bg/village.png";


const bgcave = new Image();
let bgcaveLoaded = false;
bgcave.src = "assets/bg/bg2cavemitsprites.png";



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

const playerWidth = 32;
const playerHeight = 32;

//Char Auswahl
const heroes = ["Magi.png","Assasine.png","bard.png","elf.png", "wizardcharacteror1.png" ];
let selectedHero = 0;

player.src = `assets/sprites/heroes/${heroes[selectedHero]}`;

window.addEventListener("keydown", e => {
  if(e.key === "ArrowLeft"){ selectedHero = (selectedHero + heroes.length - 1)% heroes.length;
    player.src = `assets/sprites/heroes/${heroes[selectedHero]}`;
  }
  if(e.key === "ArrowRight"){ selectedHero = (selectedHero + 1) % heroes.length;
  player.src = `assets/sprites/heroes/${heroes[selectedHero]}`;
  }
});



const sky = new Image();
sky.src = "assets/bg/sky.png";

const skyHeight = 240;



// Inventar
const UII = { img: new Image(), x: 160, y: 20, w: 360, h: 260
};

UII.img.src ="assets/sprites/ui/guiinventory.png"




const UI = { img: new Image(), offsetX: -50, offsetY: -130, x: 0, y: 0, w: 320, h: 240 };


UI.img.src = "assets/sprites/ui/gui.png";


const pet = { img: new Image(), offsetX: -20, offsetY: 0, x: 0, y: 0, w: 24, h: 24 };



pet.img.src = "assets/sprites/pet/Pat.png";


//Bilder (Bosse)
const bosses =  [
  {img: new Image(), x: 450, y: 127, w: 64, h: 64},
  {img: new Image(), x: 580, y: 110, w: 64, h: 64},
];

bosses[0]!.img.src = "assets/sprites/bosse/CursedKnight.png";
bosses[1]!.img.src = "assets/sprites/bosse/Bossspider.png";




//enemies

const enemies =  [
  {img: new Image(), x: 585, y: 170, w: 32, h: 32},
  {img: new Image(), x: 560, y: 160, w: 32, h: 32},
  {img: new Image(), x: 520, y: 95, w: 32, h: 32},
  {img: new Image(), x: 475, y: 80, w: 32, h: 32},
];
//*
//enemies[0]!.img.src = "assets/sprites/enemies/minispider.png";
//enemies[1]!.img.src = "assets/sprites/enemies/Ghost.png";
//enemies[2]!.img.src = "assets/sprites/enemies/deadskelet.png";
//enemies[3]!.img.src = "assets/sprites/enemies/1eye.png";




//npcs

const npcs = [ 
  {img: new Image(), x: 130, y: 0, w: 32, h: 32}, 
  {img: new Image(), x: 130, y: 0, w: 32, h: 32}, 
];

npcs[0]!.img.src ="assets/sprites/npcs/Doktor.png";



//Bilder (items)
const items =  [
  {img: new Image(), x: 495, y: 165, w: 32, h: 32},
  //Kerzen
  {img: new Image(), x: 200, y: 170, w: 32, h: 32},
  {img: new Image(), x: 302, y: 159, w: 32, h: 32},
  {img: new Image(), x: 405, y: 155, w: 32, h: 32},

  
];

items[0]!.img.src = "assets/sprites/items/CursedChest.png";
//Kerzen
items[1]!.img.src = "assets/sprites/items/Kerzedunkelbrennt.png"
items[2]!.img.src ="assets/sprites/items/Kerzedunkelhalbvollbrennt.png"
items[3]!.img.src ="assets/sprites/items/Kerzedunkelabgebrannt.png"


const platformImgRed = new Image();
platformImgRed.src = "assets/platformen/platform1.png";

const platformImgBlue = new Image();
platformImgBlue.src = "assets/platformen/platform2.png";

type Platform = {
  x: number;
  y: number;
  w: number;
  h: number;
  img: HTMLImageElement;
};

const platforms: Platform[] = [
  //Ebene 1 L nach R

  { x: 20, y: 150, w: 16, h: 8, img: platformImgRed },
  { x: 90, y: 150, w: 16, h: 8, img: platformImgRed},
  { x: 160, y: 150, w: 16, h: 8, img: platformImgRed},
  { x: 230, y: 150, w: 16, h: 8, img: platformImgRed},
  { x: 300, y: 150, w: 16, h: 8, img: platformImgRed},
  //Ebene 2 L nach R

  { x: 5, y: 110, w: 16, h: 8, img: platformImgRed},
  { x: 130, y: 110, w: 16, h: 8, img: platformImgRed},
  { x: 270, y: 110, w: 16, h: 8, img: platformImgRed},

  //Ebene 3 L nach R

  { x: 75, y: 65, w: 16, h: 8, img: platformImgRed},
  { x: 180, y: 65, w: 16, h: 8, img: platformImgRed},
  { x: 300, y: 65, w: 16, h: 8, img: platformImgRed},

  //Ebene 4 L nach R

  { x: 10, y: 20, w: 16, h: 8, img: platformImgRed},
  { x: 250, y: 20, w: 16, h: 8, img: platformImgRed},

  //Ebene 5 L nach R

  { x: 80, y: -25, w: 16, h: 8, img: platformImgRed},
  { x: 200, y: -25, w: 16, h: 8, img: platformImgRed},

 //Ebene Start Blau 6 L nach R

  { x: 140, y: -70, w: 16, h: 8, img: platformImgBlue},
  { x: 270 , y: -70, w: 16, h: 8, img: platformImgBlue},

  //Ebene Start Blau 7 L nach R

  { x: 205, y: -110, w: 16, h: 8, img: platformImgBlue},

  //Ebene Start Blau 8 L nach R

  { x: 135, y: -155, w: 16, h: 8, img: platformImgBlue},

  //Ebene Start Blau 9 L nach R

  { x: 65, y: -200, w: 16, h: 8, img: platformImgBlue},
  { x: 205, y: -200, w: 16, h: 8, img: platformImgBlue},



]


for (const npc of npcs) { 
  npc.y = groundY - npc.h; }

  //Map + Sprites dort reinladen 

  type MapData = {
  bg: HTMLImageElement;
  enemies: typeof enemies;
  items: typeof items;
};


let currentMapIndex = 0;

const maps: MapData[] = [
  {
    bg: bg,
    enemies: enemies,
    items: items
  },
  {
    bg: bgcave,
    enemies: enemies, 
    items: items
  }
];

const goal = {
  img: new Image(),
  x: 127,
  y: -245,
  w: 32,
  h: 16,
  reached: false
};
goal.img.src = "assets/platformen/goal.png";

const allPlatforms = [...platforms, goal];

  // Timer & Start
  let gameStarted = false;
  let startTime = 0;
  let elapsedTime = 0;
  const times: number[] = [];

  const startBtn = document.getElementById("startBtn")!;
  const timerDisplay = document.getElementById("timer")!;
  const timeTableBody = document.querySelector("#timeTable tbody")!;

  startBtn.addEventListener("click", () => {
  startBtn.blur(); 
  gameStarted = true;
  goal.reached = false;
  playerX = 50;
  playerY = 160;
  startTime = performance.now();
  elapsedTime = 0;
});

  function stopTimer() {
    gameStarted = false;
    times.push(elapsedTime);
    updateTable();
  }

  function updateTable() {
    timeTableBody.innerHTML = "";
    times.forEach((time, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${index + 1}</td><td>${time.toFixed(2)}</td>`;
      timeTableBody.appendChild(row);
    });
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

    onGround =false;

    // Plattform-Kollision 

for (const platform of allPlatforms) {
  const playerBottom = playerY + playerHeight;
  const playerPrevBottom = playerBottom - velocityY;
  const platformTop = platform.y;

  const horizontalOverlap =
    playerX + playerWidth > platform.x &&
    playerX < platform.x + platform.w;

  const fallingOntoPlatform =
    playerPrevBottom <= platformTop &&
    playerBottom >= platformTop;

  if (horizontalOverlap && fallingOntoPlatform && velocityY >= 0) {
    playerY = platformTop - playerHeight;
    velocityY = 0;
    onGround = true;
  }
}
        if (playerY >= 160) {
        playerY = 160;
        velocityY = 0;
        onGround = true;
    }





    if (playerY - cameraY < 80) {
        cameraY = playerY - 80;
    }

        pet.x = playerX + pet.offsetX;
        pet.y = playerY + pet.offsetY;

        UI.x = playerX + UI.offsetX;
        UI.y = playerY + UI.offsetY;

    if (playerY - cameraY > canvas.height - 80) {
      cameraY = playerY - (canvas.height - 80);
  }




// Rechts raus → nächste Map
if (playerX > canvas.width) {
  currentMapIndex = Math.min(currentMapIndex + 1, maps.length - 1);
  playerX = 0;
}

// Links raus → vorherige Map
if (playerX < -32) {
  currentMapIndex = Math.max(currentMapIndex - 1, 0);
  playerX = canvas.width - 32

}

    // Timer
    if (gameStarted && !goal.reached) {
      elapsedTime = (performance.now() - startTime) / 1000;
      timerDisplay.textContent = `Zeit: ${elapsedTime.toFixed(2)} s`;
    }

    // Ziel prüfen
const playerBottom = playerY + playerHeight;
const playerPrevBottom = playerBottom - velocityY;

const standingOnGoal =
  playerX + playerWidth > goal.x &&
  playerX < goal.x + goal.w &&
  playerPrevBottom <= goal.y &&
  playerBottom >= goal.y &&
  velocityY >= 0;

if (!goal.reached && standingOnGoal) {
  goal.reached = true;
  stopTimer();
}
}


function draw() {



  ctx.clearRect(0, 0, canvas.width, canvas.height);



  for (let i = -3; i <= 1; i++) {
  ctx.drawImage(
    sky,
    0,
    i * skyHeight - cameraY,
    canvas.width,
    skyHeight
  );
}


  


const currentMap = maps[currentMapIndex]!;


ctx.drawImage(
  currentMap.bg,
  0,
  -cameraY,
  canvas.width,
  canvas.height
);

// Platformen 
for (const platform of platforms) {
  ctx.drawImage(
    platform.img,
    platform.x,
    platform.y - cameraY,
    platform.w,
    platform.h
  );

}

ctx.drawImage(
  goal.img,
  goal.x,
  goal.y - cameraY,
  goal.w,
  goal.h
);

// Items
for (const item of currentMap.items) {
  ctx.drawImage(item.img, item.x, item.y - cameraY, item.w, item.h);
}

// Enemies
for (const enemy of currentMap.enemies) {
  ctx.drawImage(enemy.img, enemy.x, enemy.y - cameraY, enemy.w, enemy.h);
}



// Bosse
for (const boss of bosses) {
  ctx.drawImage(boss.img, boss.x, boss.y - cameraY, boss.w, boss.h);
}

// Pet + UI zeichnen

    ctx.drawImage(pet.img, pet.x, pet.y - cameraY, pet.w, pet.h);

    //* ctx.drawImage(UI.img, UI.x, UI.y - cameraY, UI.w, UI.h);

// Npcs zeichnen 
  for (const npc of npcs) { 
    ctx.drawImage(npc.img, npc.x, npc.y - cameraY, npc.w, npc.h); 
  }




  // Char zeichnen

  if (playerLoaded) {
    ctx.drawImage(player, playerX, playerY - cameraY, 32, 32); // Sprite zeichnen
  } 

  if (inventoryOpen) {
  ctx.drawImage(UII.img, UII.x, UII.y - cameraY, UII.w, UII.h);
}
}



function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
});
