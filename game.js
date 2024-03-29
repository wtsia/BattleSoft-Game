// MUSIC & SOUNDS
let backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.2;

// SHIP CLASS DECLARATION
class Ship {
    constructor(health, laserClip = 0, laserDamage, shield = `off`, name, fightingType="fighter") {
        this.health = health;
        this.laserClip = laserClip;
        this.laserDamage = laserDamage;
        this.shield = shield;
        this.name = name;
        this.fightingType = fightingType;
        }

    attackEnemy() {
        if (playerShip.laserClip > 0 && playerShip.laserClip <= 3) {
            if (enemy.fightingType == "attacker") {
                moveChoiceEnemyAttacker();               
                updateUserConsole();
            }
            if (enemy.fightingType == "defender") {
                moveChoiceEnemyDefender();
                updateUserConsole();
            }

            if (enemy.shield == `off`) {
                enemy.health = enemy.health - this.laserDamage;

                //display action
                let action = document.getElementById("encounter");

                action.innerHTML += `Player has attacked the enemy (health: ${enemy.health})` + `<br \>`;
                console.log("Player has attacked the enemy!")
                console.log("Enemy health is now " + enemy.health);
                
                //Play laser shot sound
                let laserSound = new Audio("audio/pew.wav");

                laserSound.play();
                this.laserClip--;
                updateUserConsole();
                checkWinorLoss();
                console.log("total rounds are " + totalRounds);
            }
            if (enemy.shield == `on`) {
                console.log("Enemy shield state is " + enemy.shield);
                console.log("Enemy shield deflected shot");
                this.laserClip--;
                updateUserConsole();
                checkWinorLoss();

                let laserSound = new Audio("audio/pew.wav");

                laserSound.play();
                disableShields();
            }
        } else {
            let updateNoAmmo = document.getElementById("encounter")
            updateNoAmmo.innerHTML += `No Ammo!` + `<br \>`;
            console.log("No ammo!");
            updateUserConsole();
        }
    }

    attackPlayer() {
        console.log("Enemy has attacked Player!");
        if (playerShip.shield == `off`) {
            let action = document.getElementById("encounter");
            playerShip.health = playerShip.health - this.laserDamage;
            action.innerHTML += `Player has been attacked (health: ${playerShip.health})` + `<br \>`;
            console.log("Player health is now " + playerShip.health);
        } else {
            let action = document.getElementById("encounter");
            action.innerHTML += `Player has deflected enemy shot!` + `<br \>`;
            console.log("Player shield deflected shot");
        }
        this.laserClip--;
        updateUserConsole();
        addRound();
    }

    chargeLaser() {
        if (this.laserClip == 0 || this.laserClip < 3) {
            let action = document.getElementById("encounter");
            this.laserClip++;
            console.log(this.name + " has loaded ammo");
            console.log(this.name + " has " + this.laserClip + " shots");
            action.innerHTML += `${this.name} has loaded ammo` + `<br \>`;
            updateUserConsole();
            addRound();
            console.log("total moves are " + totalRounds);
        } else {
            if (this.fightingType == "attacker" || this.fightingType == "defender") {
                this.attackPlayer();
            } else {
            console.log("maximum clip");
            updateUserConsole();
            }
        }
    }

    activateShield() {
        let action = document.getElementById("encounter");
        this.shield = `on`;
        action.innerHTML += `${this.name} has activated shield!` + `<br \>`;
        console.log(this.name + " shield is now " + this.shield);
        updateUserConsole();
    }
}

// GLOBAL FUNCTIONS
async function delay() {
    console.log('start timer');
    await delay(1000);
    console.log('after 1 second');
}

function generateNewEnemy() {
    alienName = ["TrojanHorse", "Adware", "Spyware", "Rootkit"];
    fightingType = ["attacker", "defender"];

    let i = Math.floor(Math.random()*alienName.length);
    let j = Math.floor(Math.random()*2);
    
    enemy = new Ship(100, 0, 10, `off`, name = alienName[i], fightingType[j]);
    let encounterNew = document.getElementById("encounter")
    encounterNew.innerHTML += `${enemy.name} has been encountered` + `<br \>`;
    console.log("New enemy " + enemy.name);
    updateUserConsole();
}

function enemyHealthCheck() {
    if (enemy.health > 0.66 && enemy.health <= enemyMaxHealth) {
        document.getElementById("enemyShipNew").style.display = "inline-block";
    }
    if (enemy.health > 0.33 && enemy.health <= 0.66*enemyMaxHealth) {
        document.getElementById("enemyShipNew").style.display = "none";
        document.getElementById("enemyShipMid").style.display = "inline-block";
    }
    if (enemy.health > 0 && enemy.health <= 0.33*enemyMaxHealth) {
        document.getElementById("enemyShipMid").style.display = "none";
        document.getElementById("enemyShipOld").style.display = "inline-block";
    }
    if (enemy.health <= 0) {
        document.getElementById("enemyShipOld").style.display = "none";
        document.getElementById("enemyShipDestroyed").style.display = "inline-block";
    }
}

function playerHealthCheck() {
    if (playerShip.health > 0.66 && playerShip.health <= playerMaxHealth) {
        document.getElementById("playerShipNew").style.display = "inline-block";
    }
    if (playerShip.health > 0.33 && playerShip.health <= 0.66*playerMaxHealth) {
        document.getElementById("playerShipNew").style.display = "none";
        document.getElementById("playerShipMid").style.display = "inline-block";
    }
    if (playerShip.health > 0 && playerShip.health <= 0.33*playerMaxHealth) {
        document.getElementById("playerShipMid").style.display = "none";
        document.getElementById("playerShipOld").style.display = "inline-block";
    }
    if (playerShip.health <= 0) {
        document.getElementById("playerShipOld").style.display = "none";
        document.getElementById("playerShipDestroyed").style.display = "inline-block";
    }
}

// Function for Enemy Attacker
function moveChoiceEnemyAttacker() {
    let choice = Math.random();
    if (playerShip.laserClip == 0 && enemy.laserClip < 3) {
        enemy.chargeLaser();
        return;
    } 
    if (enemy.laserClip == 0) {
        enemy.chargeLaser();
    } else if (choice <= 0.66) {
        if (enemy.laserClip == 0) {
            enemy.chargeLaser();
            return;
        } else {
        enemy.attackPlayer();
        addRound();
        console.log("total moves are " + totalRounds);
        }
    } else {
        enemy.activateShield();
    }
}

// Function for Enemy Defender
function moveChoiceEnemyDefender() {
    let choice = Math.random();
    if (playerShip.laserClip == 0) {
        enemy.chargeLaser();
        return;
    }
    if (enemy.laserClip == 0) {
        enemy.chargeLaser();
    } else if (choice <= 0.66) {
        enemy.activateShield();
    } else {
        enemy.attackPlayer();
    }
}

// Disable shields after each turn
function disableShields() {
    playerShip.shield = `off`;
    enemy.shield = `off`;
}

// Game display
function changeDisplay(string) {
    let element = document.getElementsByClassName(string)
    for(i=0; i<element.length; i++) {
        element[i].style.display = `none`;
    }
    if (string == 'start') {
        document.getElementById('loadingtext').style.display = 'inline-block';
        document.getElementById('loadingbar').style.display = 'inline-block';
        move();
    }
    if (string == 'loadingbar') {
        document.getElementById('loadingtext').style.display = 'none';
        document.getElementById('loadingbar').style.display = `none`;
        document.getElementById('chooseDiff').style.display = `inline-block`;
        document.getElementById(`levelOne`).style.display = `inline-block`;
        document.getElementById(`levelTwo`).style.display = `inline-block`;
        document.getElementById(`levelThree`).style.display = `inline-block`;
    }
    if (string == `levelChoice`) {
        document.getElementById(`game`).style.display = `inline-block`;
        document.getElementById(`reset`).style.display = `inline-block`;
    }
    if (sting == 'loadingbar') {
        document.getElementById('loadingbar').style.display = 'inline-block';
    }
}

// Start button to loadingbar
document.getElementById(`startButton`).addEventListener(`click`,
    function() {
        let string = `start`;
        changeDisplay(string);
        move();
});

// Move loadingbar
function move() {
    let elem = document.getElementById("loadingbar");   
    let width = 1;
    let id = setInterval(frame, 20);
    function frame() {
        if (width >= 100) {
        clearInterval(id);
        let string = 'loadingbar';
        changeDisplay(string);
        } else {
        width++; 
        elem.style.width = width + '%'; 
        }
    }
}

// LEVEL CHOICE: Takes the choice of level to the actual game
document.getElementById(`levelOne`).addEventListener(`click`, 
function() {
    let string = `levelChoice`;
    iterations = 0;
    console.log(`Chosen ` + iterations + ` Enemies`);
    console.log("Difficulty is Easy");
    changeDisplay(string);
});
document.getElementById(`levelTwo`).addEventListener(`click`, 
function() {
    let string = `levelChoice`;
    iterations = 1;
    console.log(`Chosen ` + iterations + ` Enemies`);
    console.log("Difficulty is Normal");
    changeDisplay(string);
});
document.getElementById(`levelThree`).addEventListener(`click`, 
function() {
    let string = `levelChoice`;
    iterations = 2;
    console.log(`Chosen ` + iterations + ` Enemies`);
    console.log("Difficulty is Unbeatable");
    changeDisplay(string);
});

// DECLARE SHIPS
let playerShip = new Ship (100, 0, 20, `off`, "Player")
let playerMaxHealth = playerShip.health;
console.log(playerShip);
generateNewEnemy();
let enemyMaxHealth = enemy.health;
console.log(enemy);

// DISPLAY USER CONSOLE
function updateUserConsole() {
    document.getElementById(`displayPlayerClip`).innerHTML = playerShip.laserClip;
    document.getElementById(`displayPlayerHealth`).innerHTML = playerShip.health;
    document.getElementById(`displayPlayerShield`).innerHTML = playerShip.shield;
    document.getElementById(`displayEnemyClip`).innerHTML = enemy.laserClip;
    document.getElementById(`displayEnemyHealth`).innerHTML = enemy.health;
    document.getElementById(`displayEnemyShield`).innerHTML = enemy.shield;
    let objDiv = document.getElementById("encounter");
    objDiv.scrollTop = objDiv.scrollHeight;
}

// TURN COUNTER
let totalRounds = 0;
function addRound() {
    checkWinorLoss();
    totalRounds++;
    playerHealthCheck();
    enemyHealthCheck();
    disableShields();
}

// WIN STAGE
function winStage() {
    document.getElementById("game").style.display = `none`;
    document.getElementById("winGame").style.display = `inline-block`;
}

function checkWinorLoss() {
    if (playerShip.health <= 0) {
        console.log("You Lose!")
        document.getElementById("game").style.display = `none`;
        document.getElementById("endGame").style.display = `flex`;
        document.getElementById("reset").style.display = `flex`;
    }
    if (enemy.health <= 0) {
        iterations--;
        console.log(`iterations is ${iterations}`);
        if (iterations < 0 && playerShip.health > 0) {
            winStage();
            return;
        }
        let enemyLossUpdate = document.getElementById("encounter");
        enemyLossUpdate.innerHTML += `${enemy.name} has been defeated` + `<br \>`;
        generateNewEnemy();
        console.log(`iterations remaining: ` + iterations);
    }
}

// USER INPUT FOR FIRING
document.getElementById("fire").addEventListener("click",
function() {
    playerShip.attackEnemy();
});

document.getElementById("charge").addEventListener("click", function() {
    if (playerShip.laserClip == 3) {
        let updateMaxClip = document.getElementById("encounter")
        updateMaxClip.innerHTML += `Max Clip!` + `<br \>`;
        updateUserConsole();
        return;
    }
    playerShip.chargeLaser()
    if (enemy.fightingType == "attacker") {
        moveChoiceEnemyAttacker();
    }
    if (enemy.fightingType == "defender") {
        moveChoiceEnemyDefender();
    }
});

document.getElementById("shield").addEventListener("click", function() {
    playerShip.activateShield();
    if (enemy.fightingType == "attacker") {
        moveChoiceEnemyAttacker();
    }
    if (enemy.fightingType == "defender") {
        moveChoiceEnemyDefender();
    }
});

document.getElementById("reset").addEventListener("click", 
function() {
    location.reload();
})
