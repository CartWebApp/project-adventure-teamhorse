let currentDialogueNumber = 0;
let storyPathRecord = [];
const player = {
    health: 3,
    money: 10,
    inventory: {
        shieldP: 0,
        healthP: 0,
        egg: 0,
        fish: 0,
    },
    losses: 0,
};

class monster {
    constructor(name,health,ending = 0){
        this.name = name;
        this.health = health;
        this.ending = ending;
    }
};

class storyPart {
    constructor(order,dialogue = [], options = []){
        this.order = order;
        this.dialogue = dialogue;
        this.options = options;
    }
}

class fight {
    constructor(monster, companion = `none`){
        this.monster = monster;
        this.companion = companion;
    }
}

// All story parts go below this line. 
const firstLeft = new storyPart(`1a`,[``,`You are met with a clearing allowing for safe travel forward, but you can hear water flowing from a river. It might be a good idea to go fishing before continuing forward.`],[{name: "Go fishing", effect: ()=> moveTo(secondLeft),}, {name: "Continue without fishing", effect: ()=> moveTo(secondLeft),}]);
const secondLeft = new storyPart(`2a`,[``,`You continue to the clearing ahead but are ambushed by a series of hooded figures.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to town", effect: ()=> moveTo(firstLeft),}])
const firstMiddle = new storyPart(`1b`,[`Your name is Guy, you are riding your beloved horse, Korai.`,`You have reached a crossroads where you can choose to go left, continue forward, or go right.`],[{name: "Turn Left", effect: "",}, {name: "Continue Forward", effect: "",},{name: "Turn Right", effect: "",}])
const firstRight = new storyPart(`1c`,[`Your name is Guy, you are riding your beloved horse, Korai.`,`You have reached a crossroads where you can choose to go left, continue forward, or go right.`],[{name: "Turn Left", effect: "",}, {name: "Continue Forward", effect: "",},{name: "Turn Right", effect: "",}])

// All story parts go above this line
let currentPart = {}
currentPart = new storyPart(`0`,[`Your name is Guy, you are riding your beloved horse, Korai.`,`You have reached a crossroads where you can choose to go left, continue forward, or go right.`],[{name: "Turn Left", effect: ()=> moveTo(firstLeft) ,}, {name: "Continue Forward", effect: ()=> moveTo(firstMiddle),},{name: "Turn Right", effect: ()=> moveTo(firstRight),}])
setTimeout(() => (arrow.style.opacity = 1), ((currentPart.dialogue[currentDialogueNumber].length + 4) * 35));












const firstEnemy = new monster("Goblin",5);

const body = document.getElementById("fullBody");
setTimeout(() => body.addEventListener("click",advanceDialogue), ((currentPart.dialogue[currentDialogueNumber].length + 4) * 30))
const arrow = document.getElementById("textBoxArrow");

textType(document.getElementById("textDisplay"), currentPart.dialogue[0])
function advanceDialogue(){
    body.removeEventListener("click",advanceDialogue);
    arrow.style.opacity = 0;
    if (currentPart.dialogue.length - 1 > currentDialogueNumber){
        currentDialogueNumber += 1;
        textType(document.getElementById("textDisplay"), currentPart.dialogue[currentDialogueNumber])
        setTimeout(() => (arrow.style.opacity = 1), ((currentPart.dialogue[currentDialogueNumber].length + 4) * 30));
        setTimeout(() => body.addEventListener("click",advanceDialogue), ((currentPart.dialogue[currentDialogueNumber].length + 4) * 30))
    } else {
        currentDialogueNumber = 0;
        let buttonHtml = ``;
        for(let i = 0; i < currentPart.options.length ; i++ ){
            buttonHtml += `<button id="option#${i}" class="options">${currentPart.options[i].name}</button>`
            console.log(buttonHtml);
        }
        document.getElementById("buttonDisplay").innerHTML = buttonHtml;
        for(let i = 0; i < currentPart.options.length ; i++ ){
            document.getElementById(`option#${i}`).addEventListener("click",currentPart.options[i].effect)
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

    setTimeout(() => textType(element, text, i + 1), 30);
}

function fish(){

}

function moveTo(nextPart){
    for(let i = 0; i < currentPart.options.length - 1; i++){
        if (String(currentPart.options[i].effect) == `() => moveTo(${nextPart})`){
            storyPathRecord.push(currentPart.options[i].name)
            console.log(storyPathRecord);
        }
    }
    currentPart = nextPart;
    document.getElementById("buttonDisplay").innerHTML = "";
    console.log(currentPart)
    advanceDialogue();
}