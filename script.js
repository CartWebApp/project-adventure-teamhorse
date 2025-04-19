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
    telepathy: 0,
};

class monster {
    // Ending # meaning
    // 0: Normal enemies. Only trigger an ending if the player has lost twice
    // 1: Used only for the first monster, which triggers the joke ending if the player wins against it.
    // 2: Used for the final boss, which ending occurs depends on the player's companion and if they won or lost.
    // 3: Used for the true final boss, which ending occurs depends on the player's companion and if they won or lost.
    constructor(name,health = 2,ending = 0,attackPhrase = ``,defendPhrase = ``,waitPhrase = ``){
        this.name = name;
        this.health = health;
        this.ending = ending;
        this.attackPhrase = attackPhrase;
        this.defendPhrase = defendPhrase;
        this.waitPhrase = waitPhrase;
    }
};

const firstMonster = new monster(`the monster`,5,1,`I don't know how you're seeing this, but he's planning to attack`,`I don't know how you're seeing this, but he's planning to defend`,`I don't know how you're seeing this, but he's planning to wait for you to defend`)

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

// Example story part
// In dialogue LEAVE A BLANK STRING AS THE FIRST ELEMENT IN THE ARRAY.
// If you are creating an ending, use the reset() funcition after the arrow in effect instead of moveTo() for options to restart the game.
const example = new storyPart(``,[``,``,``],[{name: `choice2`, effect: () => moveTo()},{name: `choice1`, effect: () => moveTo()}]);

// All story parts go below this line. 
const firstLeft = new storyPart(`1a`,[``,`You are met with a clearing allowing for safe travel forward, but you can hear water flowing from a river. It might be a good idea to go fishing before continuing forward.`],[{name: "Go fishing", effect: ()=> moveTo(secondLeft),}, {name: "Continue without fishing", effect: ()=> moveTo(secondLeft),}]);
const secondLeft = new storyPart(`1b`,[``,`You continue to the clearing ahead but are ambushed by a series of hooded figures.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to town", effect: ()=> moveTo(firstTown),}]);
const firstMiddle = new storyPart(`2a`,[``,`You continue down the middle, but you quickly realize that the path ahead is blocked by a huge boulder about the size of a small house.`,`‘This wasn’t here before.’ You question the mysterious boulder, but there is nothing you can do about it.`,`You decide to go around it either to the right or left. Korai seems to want to go left.`],[{name: "Go back left", effect: ()=> moveTo(secondMiddle),} ,{name: "Go back right", effect: ()=> moveTo(thirdMiddle),}]);
const secondMiddle = new storyPart(`2b`,[``,`You reach a clearing and are ambushed by a group of hooded figures.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to Town", effect: ()=> moveTo(firstTown),}]);
const thirdMiddle = new storyPart(`2c`,[``,`You go right to avoid the boulder, but are very quickly ambushed by hooded figures hiding in the nearby shrubbery.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to Town", effect: ()=> moveTo(firstTown),}]);
const firstRight = new storyPart(`3a`,[``,`You decide to go right and take in the scenery as Korai strolls towards town.`,`“Rooooooaaaaar.”`,`Your peace is interrupted by a chilling roar and you realize too late that you have come face to face with a monster.`,`The monster attacks. You are knocked off of Korai and scramble to your feet.`,`Korai is startled and begins to thrash around violently. Scared beyond reason, you run.`,`After running for a while you realize that you can’t just leave your best friend behind, but that you have no chance of winning.`,`You can’t decide whether you should go back and fight or run towards town for help. `],[{name: "Go Back for Korai", effect: ()=> Fight(firstFight),}, {name: "Go to Town for Help", effect: ()=> moveTo(secondRight),}]);
const secondRight = new storyPart(`3b`,[``,`You are cornered by the monster and barely escape with your life.`,`You hurry towards town to get help.`],[{name: "Reach Town", effect: ()=> {player.health = 1; moveTo(firstTown);}}])
const firstFightWin = new storyPart(`E1`,[``,`Your attack deals the final blow to the monster`,`You breathe a sigh of relief as you reunite with Korai.`,`You ride Korai back to your house and take the long way to the village.`,`As you ride you vow to never venture too deep into the forest and to never try something so frightening ever again.`,`THE END \n However, there are many other ways your story could've played out.`],[{name: "Restart Game", effect: ()=> reset()}]);
const firstTown = new storyPart(`4a`,[``,`You arrive at town and are met with a decision.`,`Do you report what happened to the mayor or to the local knights?`,`You have never met the mayor before and worry that he will ignore you, but the knights are a small group and constantly busy keeping the town safe.`,`There is no guarantee either will be able to help you.`,`Who should you choose?`],[{name: "Talk to the Mayor", effect: ()=> moveTo(talkedToMayor),},{name: `Speak to the town knights`,effect: ()=> moveTo(talkedToKnights)}])
const talkedToMayor = new storyPart(`4b`,[``,`You quickly head towards Town Hall and insist that you must meet the mayor at once.`,`The secretaries reluctantly let you in and you are face to face with the mayor.`,`Mayor: “What brings you here?”`,`The mayor sounds displeased, but you proceed to tell him what happened in the forest.`,`Mayor: “That is worrisome, but unfortunately there is nothing I can do. The knights are too busy, and I have no intention of mobilizing them for a mere horse.”`,`The mayor then shoos you out of his office as he continues to work. You leave, dejected.`],[{name: "Return to the Town", effect: ()=> moveTo(returnFirstTown),}])
const talkedToKnights = new storyPart(`4c`,[``,`You head to the local knights' headquarters and you are happy to be met with the knight commander himself.`,`You inform the Commander of what happened.`,`Commander: “Hmmm”`,`Commander: “I will take my men to investigate the forest, but if what you said is true then it may be impossible to find your horse again. I suggest trying to move on.”`,`The commander responded with a cold, yet truthful voice as he suggested that Guy do the impossible.`],[{name: "Return to the Town", effect: ()=> moveTo(returnFirstTown),}])
const returnFirstTown = new storyPart(`4d`,[``,`After your fruitless attempt to ask for help you begin to head out of town defeated and, quite frankly, ready to cry.`,`Your horse had been with you more than your own parents and had been the only one you considered a friend.`,`Besides the horse, there was someone else you had remained by your side and told you tales of your parents' deeds.`,`But he was more of a grandfather to you than a friend.`,`You continue down the main street while holding back tears.`,'You: WAAAAAAAA *sobbing noises* WAAAAAAA', 'For a brief moment, you became a big fat baby', `???: “Hel-”`,`???: “Gu-”`,`???: “GUY!”`,`You are startled by the roaring voice coming from behind and you spot a familiar face.`,`An old man with a large and fit physique approaches you. You immediately recognize him.`,`The only person you consider family: KAMERON!`,`Kameron: “What’s wrong, I haven’t seen you look so depressed since you lost your parents.” After hearing the concern in his deep voice you finally break and tell him everything that happened to you in the past few hours.`,`Kameron: “I see … I think it's time to show you what you are capable of”`,`You: “What do you mean?”`,`Kameron: “You see … there is more to you than meets the eye”`,`You: “What do you mean?”`,`Kameron: “You wield a special power that, along with myself, only a few in history have ever had”`,`You: “!?”`,`Kameron: “You're a telepath Guy!”`,`You: “What do you mean? I’m a telepath… and YOU are one too!?”`,`Kameron: “HAR HAR HAR!” “YES! Haven’t you ever felt like you knew a little too much about what that horse of yours was thinking”`,`You: “I- I guess? I mean I always thought that was just because we had been together since I was born.”`,`Kameron: “Gods no! Most horses don’t even live to be as nearly as old and healthy as that Korai of yours, and you think you can get that close to one within such a short amount of time?”`,`You: “Well …. No.” “But it’s not like I understood his every thought, it was always just a small feeling!” “Kinda like how you can feel another’s pain!”`,`Kameron: “Exactly, that is what our telepathy allows us to do.” “We can’t read another’s mind, but we can read emotions.” “It allows us to predict an enemy’s attack, or connect on a deeper level with friends and family.”`,`Kameron: “Your bond with Korai certainly played a role in it, but your powers are what allowed you to truly understand that horse.”`,`You: “Alright… but how will this help me get Korai back?”`,`Kameron: “Simple. A better ability to read emotions allows you to track another down easier.”`,`You: “Really?”`,`Kameron: “Yes, but there is much to prepare and training will take a while, so let’s begin your training after we thoroughly search the forest for Korai.”`,`You and Kameron return to the forest and, despite your desperation and best efforts, all traces of Korai mysteriously disappear after a certain point.`,`Now determined, you return to Kameron’s home and begin your training as a telepath.`],[{name: "Two Months Later...", effect: ()=> {player.telepathy = 3; moveTo(twoMonthsLater);}}]);
const twoMonthsLater = new storyPart(`5a`,[``,`Every week since your training began you would routinely search the forest for Korai after your cruel training sessions, but you never found any traces of Korai.`,`You did, however, find traces of what attacked you.`,`Now, prepared and trained by Kameron, you set out to the next town over after learning that their tracks lead in the same direction.`,`Before heading out Kameron tells you that you should visit the shop and stock up on potions.`],[{name: "Go Shopping", effect: ()=> moveTo(firstShop),},{name: "Move on without shopping", effect: ()=> moveTo(secondTown),}]);
const firstShop = new storyPart(`6a`,[``,`You decide to visit the store to stock up.`,`Shopkeeper: “Welcome to my shop! What are you looking for?”`],[{name: "Buy Health Potion: £3", effect: ()=> {if(player.money >= 3){player.inventory.healthP += 1; player.money -= 3}else{textType(document.getElementById("textDisplay"), `Shopkeeper: I'm sorry, it appears you don't have enough money.`);}}},{name: "Buy Shield Potion: £3", effect: ()=> {if(player.money >= 3){player.inventory.shieldP += 1; player.money -= 3}else{textType(document.getElementById("textDisplay"), `Shopkeeper: I'm sorry, it appears you don't have enough money.`);}}},{name: "Leave Shop", effect: () => moveTo(secondTown)}])
const secondTown = new storyPart(`7a`,[``,`After finishing your preparations you are ready to continue onward.`,`You leave town with Kameron a little anxious, but determined.`,`A week passes and you finally arrive in the neighboring town to the east.`,`After a quick lap of the town square you and Kameron are split on what to do next.`,`Kameron suggests going to the Knights' Guild because he believes that they would be the most knowledgeable about the monsters and criminals that have entered the region.`,`However, it might be better to ask the locals about Korai and the monsters first before heading straight to the Knights' guild.`],[{name: "Go to the Knights' Guild", effect: ()=> moveTo(meetChad),},{name: "Ask the Locals", effect: ()=> moveTo(meetOwainPartOne),},{name: "Visit the Library", effect: ()=> moveTo(library),}])
const library = new storyPart(`7b`,[``,`You and Kameron head to the library to have a quiet place to think.`,`Librarian: “Welcome! You are free to browse our collection, and if you find a book you like just bring it to me and I will help you check it out!”`,`You smile at the librarian before continuing inside.`],[{name: "Browse books", effect: ()=> {if((Math.floor(Math.random() * 1001)) < 999){moveTo(libraryTome)}else{moveTo(libraryLore)}}},{name: "Leave the Library", effect: ()=> {moveTo(returnFromLibrary); player.health = 3}}])
const libraryLore = new storyPart(`7ba`,[``,`You pick a random book off of the shelf and begin to read.`,`“The land of Horth has always been a secluded kingdom, far away from other lands.”`,`“We provide little of value to potential invaders, so most just pass us by.”`,`“However, deep in the wastelands lies a terrible power.”`,`“It is said that in ancient times Horthians killed a wild pack of horses in what was then a large, green expanse.”`,`“This act, however, led to a curse to fall upon the land, making it so that nothing could live on the land.”`,`“This land is now ruled by the evil, terrible, ruthless S-”`,`Strangely, this part of the book has been torn out.`,`Oh, well.¯\\_(ツ)_/¯`],[{name: "Leave the Library", effect: ()=> {moveTo(returnFromLibrary); player.health = 3}}]);
const libraryTome = new storyPart(`7bb`,[``,`You pick a random book off of the shelf and begin to read.`,`Strangely, this book appears to resonate with your telepathic abilities.`,`As you channel energy from the book, you feel your power swell within you.`,`Out of sheer chance, this random book has increased your telepathic power ten-fold.`],[{name: "Leave the Library", effect: ()=> {moveTo(returnFromLibrary); player.health = 3; player.telepathy = 500}}]);
const returnFromLibrary = new storyPart(`7c`,[``,`After returning from the library, you still have a choice on who to ask for help.`,`Kameron still suggests going to the Knight's guild.`],[{name: "Go to the Knight's Guild", effect: ()=> moveTo(meetChad),},{name: "Ask the Locals", effect: ()=> moveTo(meetOwainPartOne),}])
const meetOwainPartOne = new storyPart(`7c`,[``,`You decide to ask around the town square with Kameron before going straight to the Knights' Guild.`,`You and Kameron split up and each do a full lap of the square before meeting back up.`,`You: “The knights are leaving soon for the wastelands, the local bakery has a new pastry, and the only 'monster' seen by any of the civilians lately was a pig that enjoyed itself a bit too much in the cellar of the pub down the street.”`,`You: “So, nothing of value.”`,`Kameron: “I, on the other hand, did find something of value.”`,`You: “Really? Among these people?”`,`Kameron: “It's all about where and how you ask.”`,`You: “So? What did you find?”`,`Kameron: “There is a detective on the outskirts of town. He’s p'retty eccentric, but he is a genius and is currently going crazy trying to get new leads.”`,`You: “If he is so busy, will he really be able to help us?”`,`Kameron: “Of course, because he is currently investigating rampaging monsters and a group of cloaked men.”`,`You and Kameron head over to the detective’s agency, which is, in reality, an old house that looks as if it was built no less than 200 years ago.`],[{name: `Knock on the door`, effect: () => moveTo(meetOwainPartTwo)}]);
const meetOwainPartTwo = new storyPart(`7ca`,[``,`You knock on the door and 5 minutes pass without any sign of life from within the building.`,`Kameron goes to knock again but the door flies open, almost ripping off its hinges.`,`???: “Second floor, room at the end of the hall, don’t enter the room and state your business before without opening the door.”`,`You look around for the source of the voice in confusion, but you find nothing.`,`The voice seems to come from everywhere within the building, but has no clear source.`,`Kameron: “Magic! Hehehe it seems we are in good hands Guy.”`,`Magic, like telepathy, was one of the many powers that could be found in this world, and it normally signified that one had immense knowledge.`,`You and Kameron head up to the second floor and arrive at the door at the end of the hall.`,`You: “We have a request”`,`???: “Speak.”`,`You explain what happened two months ago and state how you may be able to help each other.`,`???: “Hmmm…  alright, come on in”`,`The doors swing open and you see the detective sitting in front of you at a desk filled with paperwork.`,`Owain: “I am Owain. As you seem to already know I am in desperate need of a lead for my latest case. I cannot disclose who commissioned the case, but I am willing to share information with you on one condition.”`,`Kameron: “What is it?”`,`Owain: “Around the town square you will find 10 golden eggs seemingly hiding in plain sight. A normal person without magic cannot see them, and I need you to gather them for me.”`,`Owain: “Once you have all of the eggs return to me and we can talk.”`,`You and Kameron are suddenly thrust out of the office and find yourselves in front of the building. You wonder if you will actually learn anything of value from this man by just finding a couple of eggs.`],[{name: `Collect the eggs`, effect: () => egg()},{name: `Refuse to retreive the eggs`, effect: () => egg()}]);
const refusal = new storyPart(`E2`,[``,`You realize it is ridiculous to expect anything of value out of Owain, even if he is a magician, and head back to town.`,`You realize it is ridiculous to expect anything of value out of Owain, even if he is a magician, and head back to town.`,`You arrive in the town square and begin to head over to the knights’ guild, but you find out that they have already left town.`,`With no other option you gather the eggs, but by the time you return to Owain he too is gone.`,`Without any leads and no way to find your beloved horse you and Kameron are lost with nowhere to go.`,`Many years pass and you simply wither away in town. You have lost to your own powerlessness.`],[{name: `Restart Game`, effect: () => {player.inventory.egg = 10; reset();}},{name: `Go back to before you refused`, effect: () => moveTo(meetOwainPartTwo)}]);
const afterEggs = new storyPart(`7cb`,[``,`You return to Owain with all 10 eggs and begin to share information with him`,`Owain particularly took note of your description of what attacked you back in the forest and the direction they went.`,`Owain: “You also said that the knights are headed to the wastelands?”`,`Kameron: “Yes.”`,`Owain: “Then it seems we have our destination.” “The knights have also been investigating a similar problem to me so if they are going to the wastelands then we must follow.”`,`You, Kameron, and Owain prepare to depart.`,`You: “Owain, what did you need the golden eggs for? When we gave them to you you just put them in that bag you have now.”`,`Kameron: “Are you short on money? Is that why you needed them?”`,`Kameron: “Gods no, I wanted them because they make the greatest omelet you will ever taste.”`,`With pure shock on both your's and Kameron's faces, your group departs on the journey to the Wastelands.`],[{name: `Journey to the Wastelands`, effect: () => moveTo()}]);
const meetChad = new storyPart(`7d`,[``,`You decide to head to the Knights’ Guild.`,`When you arrive at the guild you ask around about who you can talk to about a request.`,`Knight: “A request you say? Hmmm….. Well I could take you to our commander, but we are currently preparing for an expedition so don’t expect much.”`,`As the Knight guides you through a long hallway you are filled with worry that you will be left without help just like in the last town.`,`The pair of large wooden double doors leading into an office swing open and the knight that guide you begins the introduction.`,`Knight: “I present you Sir Chad von Chad, commander of the knights of the square table!”\n “Sir, these two men have a request for you!”`,`Chad von Chad: “Let’s hear it, but make it quick we depart within the hour.”`,`You quickly explain what happened two months ago and ask Chad von Chad if he would be willing to help you in any way.`,`Chad von Chad: “That is troubling. You said you were attacked by something in the forest unprovoked?”`,`You: “Yes.”`,`Chad von Chad: “Then we may be able to help each other.” “You see we are currently heading to the wastelands following the tracks of a group of men cloaked in black who seem to be trying to control monsters.” “The monsters they control often appear to go crazy and rampage without care for their own life.”`,`Chad von Chad: “It appears that we are chasing after the same thing. I would be more than willing to help you, but you must also help us achieve our goal.”`,`Kameron (aside to you): “He speaks the truth, he may be able to help us, but nothing in this world is free so we may end up biting off more than we can chew.”`,`You take Kameron’s words to heart, but right now you see no other option but to take the risk.`,`You: “Alright. We will help you, but make sure you don’t forget to help us either.”`,`Chad flashes you a wide smile. Chad von Chad: “GREAT! Prepare yourselves, we depart soon!”`],[{name: `Journey to the Wastelands`, effect: () => moveTo()}]);

// All story parts go above this line

function Fight(storyFight){
    storyFight.companion = player.companion;
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
    if(storyFight.companion > 0){
        buttonHtml += `<button id="telepathy" class="options">Read Enemy's Mind</button>`;
        document.getElementById("buttonDisplay").innerHTML = buttonHtml;
        document.getElementById(`telepathy`).addEventListener("click",() => {
            if(player.telepathy > 0){
                if(enemyChoice == 0){
                    document.getElementById("textDisplay").textContent = ``;
                    textType(document.getElementById("textDisplay"), `You read ${storyFight.monster.name}'s mind. ${storyFight.monster.attackPhrase}`);
                }
                if(enemyChoice == 1){
                    document.getElementById("textDisplay").textContent = ``;
                    textType(document.getElementById("textDisplay"), `You read ${storyFight.monster.name}'s mind. ${storyFight.monster.defendPhrase}`);
                }
                if(enemyChoice == 2){
                    document.getElementById("textDisplay").textContent = ``;
                    textType(document.getElementById("textDisplay"), `You read ${storyFight.monster.name}'s mind. ${storyFight.monster.waitPhrase}`);
                }
                player.telepathy -= 1;
                update();
            } else {
                document.getElementById("textDisplay").textContent = ``;
                textType(document.getElementById("textDisplay"), `You try to read the enemy's mind, but you are too tired to get a good reading.`);
            }

        });
    };
    document.getElementById(`attack`).addEventListener("click", () => {
        if(enemyChoice == 0){
            player.health -= 1;
            update();
            storyFight.monster.health -= player.attack;
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                textType(document.getElementById("textDisplay"), `You attempted to attack ${storyFight.monster.name}, but they also attacked and both of you took damage.`);
                Fight(storyFight)
            }
        }
        if(enemyChoice == 1){
            player.health -= 0.5;
            update();
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
            update();
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
            update();
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
            update();
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
            update();
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
            update();
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
            update();
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
            update();
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
        if (player.losses >= 2){
            moveTo();
        }
        
    }
}

function fightLose(storyFight){
    document.getElementById("textDisplay").textContent = ``;
    if(storyFight.monster.ending === 1){
        document.getElementById("textDisplay").textContent = ``;
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
        if (player.losses >= 2){
            moveTo();
        }

    }
}

let currentPart = {};
const beginning = new storyPart(`0`,[`Your name is Guy, you are riding your beloved horse, Korai.`,`You have reached a crossroads where you can choose to go left, continue forward, or go right.`],[{name: "Turn Left", effect: ()=> moveTo(firstLeft) ,}, {name: "Continue Forward", effect: ()=> moveTo(firstMiddle),},{name: "Turn Right", effect: ()=> moveTo(firstRight),}]);
currentPart = beginning;
setTimeout(() => (arrow.style.opacity = 1), ((currentPart.dialogue[currentDialogueNumber].length + 11) * (textSpeed + 1)));

const body = document.getElementById("fullBody");
setTimeout(() => body.addEventListener("click",advanceDialogue), ((currentPart.dialogue[currentDialogueNumber].length + 11) * textSpeed))
const arrow = document.getElementById("textBoxArrow");

textType(document.getElementById("textDisplay"), currentPart.dialogue[0]);
function advanceDialogue(){
    body.removeEventListener("click",advanceDialogue);
    arrow.style.opacity = 0;
    if (currentPart.dialogue.length - 1 > currentDialogueNumber){
        currentDialogueNumber += 1;
        textType(document.getElementById("textDisplay"), currentPart.dialogue[currentDialogueNumber]);
        setTimeout(() => (arrow.style.opacity = 1), ((currentPart.dialogue[currentDialogueNumber].length + 11) * (textSpeed + 1)));
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

function egg(){
    document.getElementById(`fullTextBox`).style.opacity = 0;
    document.getElementById(`buttonDisplay`).style.opacity = 0;
    document.getElementById(`eggDisplay`).style.zIndex = 0;
    let eggtml =``
    let width = Number(window.innerWidth);
    let height = Number(window.innerHeight);
    for(let i = 0; i < 10; i++){
        width = Number(window.innerWidth) * 0.85;
        height = Number(window.innerHeight) * 0.85;
        eggtml += `<button class="egg" id="egg${i}" style="position:absolute; top:${Math.floor((Math.random()) * height)}px; left:${Math.floor((Math.random()) * width)}px" ><img src="/images/egg.png"></button>`;
    }
    document.getElementById("eggDisplay").innerHTML = eggtml;
    for(let i = 0; i < 10; i++){
        document.getElementById(`egg${i}`).addEventListener(`click`, (e) =>{
            e.target.style.opacity = 0;
            player.inventory.egg += 1;
            if(player.inventory.egg === 10){
                document.getElementById(`fullTextBox`).style.opacity = 1;
                document.getElementById(`buttonDisplay`).style.opacity = 1;
                document.getElementById(`eggDisplay`).style.zIndex = -1;
                moveTo(meetOwainPartOne);
                player.companion = 2;
            }
        });
    }
}

function moveTo(nextPart){
    console.log(storyPathRecord);
    update();
    currentPart = nextPart;
    document.getElementById("buttonDisplay").innerHTML = "";
    console.log(currentPart)
    advanceDialogue();
}

function update(){
    document.getElementById(`health`).innerText = `Health: ${player.health}`;
    document.getElementById(`money`).innerText = `Money: £${player.money}`;
    if(player.telepathy >= 3){
        document.getElementById(`telepathyContain`).innerHTML = `<p id="telepathy"></p>`
        document.getElementById(`telepathy`).innerText = `Energy: ${player.telepathy}`;
    }
}

function reset(){
    player.attack = 1;
    player.companion = 0;
    player.health = 3;
    player.losses = 0;
    player.money = 10;
    player.telepathy = 0;
    player.inventory.egg = 0;
    player.inventory.fish = 0;
    player.inventory.healthP = 0;
    player.inventory.shieldP = 0;
    update();
    moveTo(beginning);
}