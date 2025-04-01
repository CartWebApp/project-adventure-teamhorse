let currentDialogueNumber = 0
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
let currentPart = new storyPart(0,[`Test1`,`TestTwosd`,`Test3engf`],[`Option 1`, `Option 2`, `option 3`])

const firstEnemy = new monster("Goblin",5);

const body = document.getElementById("fullBody");
body.addEventListener("click",advanceDialogue);

textType(document.getElementById("textDisplay"), currentPart.dialogue[0])
function advanceDialogue(){
    if (currentPart.dialogue.length - 1 > currentDialogueNumber){
        currentDialogueNumber += 1;
        textType(document.getElementById("textDisplay"), currentPart.dialogue[currentDialogueNumber])
    } else {
        currentDialogueNumber = 0;
        let buttonHtml = ``;
        for(let i = 0; i < currentPart.options.length ; i++ ){
            buttonHtml += `<button id="option#${i}" class="option">${currentPart.options[i]}</button>`
            console.log(buttonHtml);
        }
        document.getElementById("buttonDisplay").innerHTML = buttonHtml;
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

    setTimeout(() => textType(element, text, i + 1), 35);
}