let currentDialogueNumber = 0;
let storyPathRecord = [];
let textSpeed = 10;
const player = {
    health: 3,
    // Companion # meaning
    // 0: No companion
    // 1: Chad
    // 2: Owain
    companion: 0,
    money: 10,
    inventory: {
        shieldP: 0,
        healthP: 0,
        egg: 0,
        fish: 0,
    },
    losses: 0,
    attack: 1,
    telepathy: 3,
};

class monster {
    // Ending # meaning
    // 0: Normal enemies. Only trigger an ending if the player has lost twice
    // 1: Used only for the first monster, which triggers the joke ending if the player wins against it.
    // 2: Used for the final boss, which ending occurs depends on the player's companion and if they won or lost.
    // 3: Used for the true final boss, which ending occurs depends on the player's companion and if they won or lost.
    constructor(name,health = 2,ending = 0,attack = ``,defend = ``,wait = ``){
        this.name = name;
        this.health = health;
        this.ending = ending;
        this.attack = attack;
        this.defend = defend;
        this.wait = wait;
    }
};

const firstMonster = new monster(`monster`,5,1)

class storyPart {
    constructor(order,dialogue = [], options = []){
        this.order = order;
        this.dialogue = dialogue;
        this.options = options;
    }
}

class fight {
    constructor(dialogue , monster, companion = 0){
        this.dialogue = dialogue
        this.monster = monster;
        this.companion = companion;
    }
}
const firstFight = new fight("",firstMonster,player.companion);

// All story parts go below this line. 
const firstLeft = new storyPart(`1a`,[``,`You are met with a clearing allowing for safe travel forward, but you can hear water flowing from a river. It might be a good idea to go fishing before continuing forward.`],[{name: "Go fishing", effect: ()=> moveTo(secondLeft),}, {name: "Continue without fishing", effect: ()=> moveTo(secondLeft),}]);
const secondLeft = new storyPart(`1b`,[``,`You continue to the clearing ahead but are ambushed by a series of hooded figures.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to town", effect: ()=> moveTo(firstTown),}]);
const firstMiddle = new storyPart(`2a`,[``,`You continue down the middle, but you quickly realize that the path ahead is blocked by a huge boulder about the size of a small house.`,`‘This wasn’t here before.’ You question the mysterious boulder, but there is nothing you can do about it.`,`You decide to go around it either to the right or left. Korai seems to want to go left.`],[{name: "Go back left", effect: ()=> moveTo(secondMiddle),} ,{name: "Go back right", effect: ()=> moveTo(thirdMiddle),}]);
const secondMiddle = new storyPart(`2b`,[``,`You reach a clearing and are ambushed by a group of hooded figures.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to Town", effect: "",}]);
const thirdMiddle = new storyPart(`2c`,[``,`You go right to avoid the boulder, but are very quickly ambushed by hooded figures hiding in the nearby shrubbery.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to Town", effect: "",}]);
const firstRight = new storyPart(`3a`,[``,`You decide to go right and take in the scenery as Korai strolls towards town.`,`“Rooooooaaaaar.”`,`Your peace is interrupted by a chilling roar and you realize too late that you have come face to face with a monster.`,`The monster attacks. You are knocked off of Korai and scramble to your feet.`,`Korai is startled and begins to thrash around violently. Scared beyond reason, you run.`,`After running for a while you realize that you can’t just leave your best friend behind, but that you have no chance of winning.`,`You can’t decide whether you should go back and fight or run towards town for help. `],[{name: "Go Back for Korai", effect: ()=> Fight(firstFight),}, {name: "Go to Town for Help", effect: ()=> moveTo(secondRight),}]);
const secondRight = new storyPart(`3b`,[``,`You are cornered by the monster and barely escape with your life.`],[{name: "Reach Town", effect: ()=> moveTo(firstTown),}])
const firstFightWin = new storyPart(`3c`,[``,`Your attack deals the final blow to the monster`,`You breathe a sigh of relief as you reunite with Korai.`,`You ride Korai back to your house and take the long way to the village.`,`As you ride you vow to never venture too deep into the forest and to never try something so frightening ever again.`,`THE END \n However, there are many other ways your story could've played out.`],[{name: "Restart Game", effect: ()=> moveTo(beginning),}]);


const firstTown = new storyPart()











// All story parts go above this line

function Fight(storyFight){
    let buttonHtml = ``;
    // Generates a random number between 0 and 2
    // enemyChoice # meanings
    // 0: enemy attacks
    // 1: enemy defends
    // 2: enemy waits
    let enemyChoice = Math.floor(((Math.random())) * 3); 
    buttonHtml += `<button id="attack" class="options">Attack</button>`;
    buttonHtml += `<button id="defend" class="options">Defend</button>`;
    buttonHtml += `<button id="wait" class="options">Wait</button>`;
    document.getElementById("buttonDisplay").innerHTML = buttonHtml;
    if(storyFight.companion !== 0){
        buttonHtml += `<button id="telepathy" class="options">Read Enemy's Mind</button>`;
        document.getElementById("buttonDisplay").innerHTML = buttonHtml;
        document.getElementById(`telepathy`).addEventListener("click",);
    };
    document.getElementById(`attack`).addEventListener("click", () => {
        if(enemyChoice == 0){
            player.health -= 1;
            storyFight.monster.health -= player.attack;
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to attack ${storyFight.monster.name}, but they also attacked and both of you took damage`);
                Fight(storyFight)
            }
        }
        if(enemyChoice == 1){
            player.health -= 0.5;
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to attack ${storyFight.monster.name}, but they blocked your attack, rendering it useless.`);
                Fight(storyFight)
            }
        }
        if(enemyChoice == 2){
            storyFight.monster.health -= player.attack;
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to attack ${storyFight.monster.name}, and they were caught off guard by the quick attack.`);
                Fight(storyFight);
            }

        }
        
    });
    document.getElementById(`defend`).addEventListener("click", () => {
        if(enemyChoice == 0){
            storyFight.monster.health -= (player.attack/2);
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to defend against ${storyFight.monster.name}'s attack, and it blocked their attack, allowing for a counter attack.`);
                Fight(storyFight)
            }

        }
        if(enemyChoice == 1){
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to defend against ${storyFight.monster.name}'s attack, but they also attempted to block, leaving no progress to be made in the battle.`);
                Fight(storyFight)
            }
        }
        if(enemyChoice == 2){
            player.health -= 1;
            if(player.health <= 0){
                fightLose(storyFight);
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight);
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to defend against ${storyFight.monster.name}'s attack, but they were waiting for your block and countered it without repercussion.`);
                Fight(storyFight);
            }
        }
        
    });
    document.getElementById(`wait`).addEventListener("click", () => {
        if(enemyChoice == 0){
            player.health -= 1;
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to wait for ${storyFight.monster.name} to block so you could counterattack, but they just attacked, leading to you taking damage.`);
                Fight(storyFight);
            }
        }
        if(enemyChoice == 1){
            storyFight.monster.health -= player.attack;
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to wait for ${storyFight.monster.name} to block so you could counterattack, and it worked, leading to a successful attack on ${storyFight.monster.name}.`);
                Fight(storyFight)
            }
        }
        if(enemyChoice == 2){
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to wait for ${storyFight.monster.name} to block so you could counterattack, but they had the same plan, leading to both of you awkwardly standing in place doing nothing.`);
                Fight(storyFight);
            }
        }
        
    });
    


}

function fightWin(storyFight){
    document.getElementById("textDisplay").textContent = ``;
    if(storyFight.monster.ending === 1){
        document.getElementById("textDisplay").textContent = ``;
        moveTo(firstFightWin);
    } else if (storyFight.monster.ending === 2){
        document.getElementById("textDisplay").textContent = ``;
        moveTo();
    } else if (storyFight.monster.ending === 3){
        document.getElementById("textDisplay").textContent = ``;
        moveTo();
    } else {
        document.getElementById("textDisplay").textContent = ``;
        if (player.losses === 2){
            moveTo();
        }
        
    }
}

function fightLose(storyFight){
    document.getElementById("textDisplay").textContent = ``;
    if(storyFight.monster.ending === 1){
        document.getElementById("textDisplay").textContent = ``;
        player.health = 2;
        moveTo(secondRight);
    } else if (storyFight.monster.ending === 2){
        document.getElementById("textDisplay").textContent = ``;
        moveTo();
    } else if (storyFight.monster.ending === 3){
        document.getElementById("textDisplay").textContent = ``;
        moveTo();
    } else {
        document.getElementById("textDisplay").textContent = ``;
        player.health = 1;
        player.losses += 1
        if (player.losses === 2){
            moveTo();
        }

    }
}

let currentPart = {};
const beginning = new storyPart(`0`,[`Your name is Guy, you are riding your beloved horse, Korai.`,`You have reached a crossroads where you can choose to go left, continue forward, or go right.`],[{name: "Turn Left", effect: ()=> moveTo(firstLeft) ,}, {name: "Continue Forward", effect: ()=> moveTo(firstMiddle),},{name: "Turn Right", effect: ()=> moveTo(firstRight),}]);
currentPart = beginning;
setTimeout(() => (arrow.style.opacity = 1), ((currentPart.dialogue[currentDialogueNumber].length + 10) * (textSpeed + 1)));

const body = document.getElementById("fullBody");
setTimeout(() => body.addEventListener("click",advanceDialogue), ((currentPart.dialogue[currentDialogueNumber].length + 10) * textSpeed))
const arrow = document.getElementById("textBoxArrow");

textType(document.getElementById("textDisplay"), currentPart.dialogue[0]);
function advanceDialogue(){
    body.removeEventListener("click",advanceDialogue);
    arrow.style.opacity = 0;
    if (currentPart.dialogue.length - 1 > currentDialogueNumber){
        currentDialogueNumber += 1;
        textType(document.getElementById("textDisplay"), currentPart.dialogue[currentDialogueNumber]);
        setTimeout(() => (arrow.style.opacity = 1), ((currentPart.dialogue[currentDialogueNumber].length + 10) * (textSpeed + 1)));
        setTimeout(() => body.addEventListener("click",advanceDialogue), ((currentPart.dialogue[currentDialogueNumber].length + 4) * textSpeed))
    } else {
        currentDialogueNumber = 0;
        let buttonHtml = ``;
        for(let i = 0; i < currentPart.options.length ; i++ ){
            buttonHtml += `<button id="option#${i}" class="options">${currentPart.options[i].name}</button>`
            console.log(buttonHtml);
        }
        document.getElementById("buttonDisplay").innerHTML = buttonHtml;
        for(let i = 0; i < currentPart.options.length ; i++ ){
            document.getElementById(`option#${i}`).addEventListener("click",() => storyPathRecord.push(currentPart.options[i].name));
            document.getElementById(`option#${i}`).addEventListener("click",currentPart.options[i].effect);
        };
    }
}

function textType(element, text, i = 0){
    if (i === 0){
        element.textContent = ``;
    }

    element.textContent += text[i];

    if(i === text.length - 1){
        return;
    }

    setTimeout(() => textType(element, text, i + 1), textSpeed);
}

function fish(){
    let fish = Math.floor(Math.random() * 15);
    let cast = 5
    if (fish === cast) {
        alert('YOU DID IT HUZZAH')
        player.fish += 1
    } else {
        alert('YOU SUCK')
    }
}


function moveTo(nextPart){
    console.log(storyPathRecord);
    currentPart = nextPart;
    document.getElementById("buttonDisplay").innerHTML = "";
    console.log(currentPart)
    advanceDialogue();
}