const images = [`/images/titleImage.jpeg`,`/images/path.jpg`,`/images/Riverside.jpg`,`/images/forest.jpg`,`/images/firstTown.jpeg`,`/images/firstTownKnightCommander.jpeg`,`/images/firstTownKnightGuild.jpeg`,`/images/Kameron.jpg`,`/images/shop.jpg`,`/images/healthPotion.png`,`/images/shieldPotion.png`,`/images/secondTown.jpeg`,`/images/bossDoor.jpeg`,`/images/chadKnightGuild.jpeg`,`/images/ChadVonChad.png`,`/images/egg.png`,`/images/evilTower.jpg`,`/images/fakeSgriobhadair.jpg`,`/images/magicTrick.jpeg`,`/images/Owain.png`,`/images/Owainhouse.jpg`,`/images/pubInterior.jpg`,`/images/ruinedTown.jpg`,`/images/stoneTablet.jpg`,`/images/THEBEAST.png`,`/images/TowerInterior1.jpg`,`/images/TowerInterior2.jpg`,`/images/trueBossDoor.jpeg`,`/images/trueHorse2.jpg`,`/images/wastelandOutpostCheckpoint.jpeg`,`/images/wastelands.jpeg`]
for (i = 0; i < images.length; i++ ){
    preload_image(images[i])
}
const body = document.getElementById("fullBody");
const arrow = document.getElementById("textBoxArrow");
const playerStats = document.getElementById(`playerStats`);
const inventoryDisplay = document.getElementById(`fullInventory`);
const background = document.getElementById(`backgroundDisplay`)
let currentDialogueNumber = 0;
let storyPathRecord = [];
let textSpeed = 8;
let inCombat = false;
const player = {
    health: 5,
    // Companion # meaning
    // 0: No companion
    // 1: Chad
    // 2: Owain
    companion: 0,
    money: 10,
    inventory: {
        energyP: 0,
        healthP: 0,
        egg: 0,
        fish: 0,
    },
    losses: 0,
    attack: 1,
    telepathy: -1,
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

const firstMonster = new monster(`the monster`,10,1,`I don't know how you're seeing this, but he's planning to attack`,`I don't know how you're seeing this, but he's planning to defend`,`I don't know how you're seeing this, but he's planning to wait for you to defend`)
const secondMonster = new monster(`the cloaked figure`, 6, 0,`The figure feels intense anger, and a want for the fight to be over.`,`The figure has a brief moment of fear.`,`The figure plots for something sneaky.`)
const finalBoss = new monster(`Sgrioghadair`,8,2,``,``,``)
const trueFinalBoss = new monster(`True Sgrioghadair`,10,3,``,``,``)

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
const secondFight = new fight("",secondMonster,player.companion);

// Example story part
// In dialogue LEAVE A BLANK STRING AS THE FIRST ELEMENT IN THE ARRAY.
// If you are creating an ending, use the reset() function after the arrow in effect instead of moveTo() for options to restart the game.
const example = new storyPart(``,[``,``,``],[{name: `choice2`, effect: () => moveTo()},{name: `choice1`, effect: () => moveTo()}]);

// All story parts go below this line. 
const beginning = new storyPart(`0`,[``,`Your name is Guy, you are riding your beloved horse, Korai.`,`You have reached a crossroads where you can choose to go left, continue forward, or go right.`],[{name: "Turn Left", effect: ()=> moveTo(firstLeft) ,}, {name: "Continue Forward", effect: ()=> moveTo(firstMiddle),},{name: "Turn Right", effect: ()=> moveTo(firstRight),}]);
const firstLeft = new storyPart(`1a`,[``,`You are met with a clearing allowing for safe travel forward, but you can hear water flowing from a river. It might be a good idea to go fishing before continuing forward.`],[{name: "Go fishing", effect: ()=> moveTo(fishing),}, {name: "Continue without fishing", effect: ()=> moveTo(secondLeft),}]);
const fishing = new storyPart(`1aa`,[``,`You pull out your rod and prepare bait.`],[{name: `Cast your Rod`, effect: () => {document.getElementById(`textDisplay`).textContent = ``; fish()}},{name: `Leave the River`, effect: () => moveTo(secondLeft)}]);
const secondLeft = new storyPart(`1b`,[``,`You continue to the clearing ahead but are ambushed by a series of hooded figures.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to town", effect: ()=> moveTo(firstTown),}]);
const firstMiddle = new storyPart(`2a`,[``,`You continue down the middle, but you quickly realize that the path ahead is blocked by a huge boulder about the size of a small house.`,`‘This wasn’t here before.’ You question the mysterious boulder, but there is nothing you can do about it.`,`You decide to go around it either to the right or left. Korai seems to want to go left.`],[{name: "Go back left", effect: ()=> moveTo(secondMiddle),} ,{name: "Go back right", effect: ()=> moveTo(thirdMiddle),}]);
const secondMiddle = new storyPart(`2b`,[``,`You reach a clearing and are ambushed by a group of hooded figures.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to Town", effect: ()=> moveTo(firstTown),}]);
const thirdMiddle = new storyPart(`2c`,[``,`You go right to avoid the boulder, but are very quickly ambushed by hooded figures hiding in the nearby shrubbery.`,`Korai pauses for a brief moment before getting frightened, knocking you off his back.`,`As Korai runs off in fear you gather yourself and try to follow your precious horse while avoiding the mysterious men.`,`You lose Korai and, despite your worry, you decide that it would be best to continue to town to get help.`],[{name: "Go to Town", effect: ()=> moveTo(firstTown),}]);
const firstRight = new storyPart(`3a`,[``,`You decide to go right and take in the scenery as Korai strolls towards town.`,`“Rooooooaaaaar.”`,`Your peace is interrupted by a chilling roar and you realize too late that you have come face to face with a monster.`,`The monster attacks. You are knocked off of Korai and scramble to your feet.`,`Korai is startled and begins to thrash around violently. Scared beyond reason, you run.`,`After running for a while you realize that you can’t just leave your best friend behind, but that you have no chance of winning.`,`You can’t decide whether you should go back and fight or run towards town for help. `],[{name: "Go Back for Korai", effect: ()=> Fight(firstFight),}, {name: "Go to Town for Help", effect: ()=> moveTo(firstTown),}]);
const secondRight = new storyPart(`3b`,[``,`You are cornered by the monster and barely escape with your life.`,`You hurry towards town to get help.`],[{name: "Reach Town", effect: ()=> {player.health = 1; moveTo(firstTown);}}])
const firstFightWin = new storyPart(`E1`,[``,`Your attack deals the final blow to the monster`,`You breathe a sigh of relief as you reunite with Korai.`,`You ride Korai back to your house and take the long way to the village.`,`As you ride you vow to never venture too deep into the forest and to never try something so frightening ever again.`,`THE END \n However, there are many other ways your story could've played out.`],[{name: "Restart game", effect: ()=> reset()}]);
const firstTown = new storyPart(`4a`,[``,`You arrive at town and are met with a decision.`,`Do you report what happened to the mayor or to the local knights?`,`You have never met the mayor before and worry that he will ignore you, but the knights are a small group and constantly busy keeping the town safe.`,`There is no guarantee either will be able to help you.`,`Who should you choose?`],[{name: "Talk to the Mayor", effect: ()=> moveTo(talkedToMayor),},{name: `Speak to the town knights`,effect: ()=> moveTo(talkedToKnights)}])
const talkedToMayor = new storyPart(`4b`,[``,`You quickly head towards Town Hall and insist that you must meet the mayor at once.`,`The secretaries reluctantly let you in and you are face to face with the mayor.`,`Mayor: “What brings you here?”`,`The mayor sounds displeased, but you proceed to tell him what happened in the forest.`,`Mayor: “That is worrisome, but unfortunately there is nothing I can do. The knights are too busy, and I have no intention of mobilizing them for a mere horse.”`,`The mayor then shoos you out of his office as he continues to work. You leave, dejected.`],[{name: "Return to the Town", effect: ()=> moveTo(returnFirstTown),}])
const talkedToKnights = new storyPart(`4c`,[``,`You head to the local knights' headquarters and you are happy to be met with the knight commander himself.`,`You inform the Commander of what happened.`,`Commander: “Hmmm”`,`Commander: “I will take my men to investigate the forest, but if what you said is true then it may be impossible to find your horse again. I suggest trying to move on.”`,`The commander responded with a cold, yet truthful voice as he suggested that Guy do the impossible.`],[{name: "Return to the Town", effect: ()=> moveTo(returnFirstTown),}])
const returnFirstTown = new storyPart(`4d`,[``,`After your fruitless attempt to ask for help you begin to head out of town defeated and, quite frankly, ready to cry.`,`Your horse had been with you more than your own parents and had been the only one you considered a friend.`,`Besides the horse, there was someone else you had remained by your side and told you tales of your parents' deeds.`,`But he was more of a grandfather to you than a friend.`,`You continue down the main street while holding back tears.`,'You: WAAAAAAAA *sobbing noises* WAAAAAAA', 'For a brief moment, you became a big fat baby.', `???: “Hel-”`,`???: “Gu-”`,`???: “GUY!”`,`You are startled by the roaring voice coming from behind and you spot a familiar face.`,`An old man with a large and fit physique approaches you. You immediately recognize him.`,`The only person you consider family: KAMERON!`,`Kameron: “What’s wrong, I haven’t seen you look so depressed since you lost your parents.” After hearing the concern in his deep voice you finally break and tell him everything that happened to you in the past few hours.`,`Kameron: “I see … I think it's time to show you what you are capable of”`,`You: “What do you mean?”`,`Kameron: “You see … there is more to you than meets the eye”`,`You: “What do you mean?”`,`Kameron: “You wield a special power that, along with myself, only a few in history have ever had”`,`You: “!?”`,`Kameron: “You're a telepath Guy!”`,`You: “What do you mean? I’m a telepath… and YOU are one too!?”`,`Kameron: “HAR HAR HAR!” “YES! Haven’t you ever felt like you knew a little too much about what that horse of yours was thinking”`,`You: “I- I guess? I mean I always thought that was just because we had been together since I was born.”`,`Kameron: “Gods no! Most horses don’t even live to be as nearly as old and healthy as that Korai of yours, and you think you can get that close to one within such a short amount of time?”`,`You: “Well …. No.” “But it’s not like I understood his every thought, it was always just a small feeling!” “Kinda like how you can feel another’s pain!”`,`Kameron: “Exactly, that is what our telepathy allows us to do.” “We can’t read another’s mind, but we can read emotions.” “It allows us to predict an enemy’s attack, or connect on a deeper level with friends and family.”`,`Kameron: “Your bond with Korai certainly played a role in it, but your powers are what allowed you to truly understand that horse.”`,`You: “Alright… but how will this help me get Korai back?”`,`Kameron: “Simple. A better ability to read emotions allows you to track another down easier.”`,`You: “Really?”`,`Kameron: “Yes, but there is much to prepare and training will take a while, so let’s begin your training after we thoroughly search the forest for Korai.”`,`You and Kameron return to the forest and, despite your desperation and best efforts, all traces of Korai mysteriously disappear after a certain point.`,`Now determined, you return to Kameron’s home and begin your training as a telepath.`],[{name: "Two Months Later...", effect: ()=> {player.telepathy = 4; moveTo(twoMonthsLater);}}]);
const twoMonthsLater = new storyPart(`5a`,[``,`Every week since your training began you would routinely search the forest for Korai after your cruel training sessions, but you never found any traces of Korai.`,`You did, however, find traces of what attacked you.`,`Now, prepared and trained by Kameron, you set out to the next town over after learning that their tracks lead in the same direction.`,`Before heading out Kameron tells you that you should visit the shop and stock up on potions.`],[{name: "Go Shopping", effect: ()=> moveTo(firstShop),},{name: "Move on without shopping", effect: ()=> moveTo(secondTown),}]);
const firstShop = new storyPart(`6a`,[``,`You decide to visit the store to stock up.`,`Shopkeeper: “Welcome to my shop! What are you looking for?”`],[{name: "Buy Health Potion: £3", effect: ()=> {if(player.money >= 3){player.inventory.healthP += 1; player.money -= 3}else{if(document.getElementById("textDisplay").textContent == `Shopkeeper: “Welcome to my shop! What are you looking for?”`){textType(document.getElementById("textDisplay"), `Shopkeeper: "I'm sorry, it appears you don't have enough money."`)};}; update();}},{name: "Buy Energy Potion: £3", effect: ()=> {if(player.money >= 3){player.inventory.energyP += 1; player.money -= 3}else{if(document.getElementById("textDisplay").textContent == `Shopkeeper: “Welcome to my shop! What are you looking for?”`){textType(document.getElementById("textDisplay"), `Shopkeeper: "I'm sorry, it appears you don't have enough money."`)};}; update();}},{name: "Leave Shop", effect: () => moveTo(secondTown)}])
const secondTown = new storyPart(`7a`,[``,`After finishing your preparations you are ready to continue onward.`,`You leave town with Kameron a little anxious, but determined.`,`A week passes and you finally arrive in the neighboring town to the east.`,`After a quick lap of the town square you and Kameron are split on what to do next.`,`Kameron suggests going to the Knights' Guild because he believes that they would be the most knowledgeable about the monsters and criminals that have entered the region.`,`However, it might be better to ask the locals about Korai and the monsters first before heading straight to the Knights' guild.`],[{name: "Go to the Knights' Guild", effect: ()=> moveTo(meetChad),},{name: "Ask the Locals", effect: ()=> moveTo(meetOwainPartOne),},{name: "Visit the Library", effect: ()=> moveTo(library),}])
const library = new storyPart(`7b`,[``,`You and Kameron head to the library to have a quiet place to think.`,`Librarian: “Welcome! You are free to browse our collection, and if you find a book you like just bring it to me and I will help you check it out!”`,`You smile at the librarian before continuing inside.`],[{name: "Browse books", effect: ()=> {if((Math.floor(Math.random() * 1001)) > 999){moveTo(libraryTome)}else{moveTo(libraryLore)}}},{name: "Leave the Library", effect: ()=> {moveTo(returnFromLibrary); player.health = 5; update();}}])
const libraryLore = new storyPart(`7ba`,[``,`You pick a random book off of the shelf and begin to read.`,`“The land of Horth has always been a secluded kingdom, far away from other lands.”`,`“We provide little of value to potential invaders, so most just pass us by.”`,`“However, deep in the Wastelands lies a terrible power.”`,`“It is said that in ancient times Horthians killed a wild pack of horses in what was then a large, green expanse.”`,`“This act, however, led to a curse to fall upon the land, making it so that nothing could live on the land.”`,`“This land is now ruled by the evil, terrible, ruthless S-”`,`Strangely, this part of the book has been torn out.`,`Oh, well.¯\\_(ツ)_/¯`],[{name: "Leave the Library", effect: ()=> {moveTo(returnFromLibrary); player.health = 3}}]);
const libraryTome = new storyPart(`7bb`,[``,`You pick a random book off of the shelf and begin to read.`,`Strangely, this book appears to resonate with your telepathic abilities.`,`As you channel energy from the book, you feel your power swell within you.`,`Out of sheer chance, this random book has increased your telepathic power ten-fold.`],[{name: "Leave the Library", effect: ()=> {moveTo(returnFromLibrary); player.health = 5; player.telepathy = 500; update();}}]);
const returnFromLibrary = new storyPart(`7c`,[``,`After returning from the library, you still have a choice on who to ask for help.`,`Kameron still suggests going to the Knight's guild.`],[{name: "Go to the Knight's Guild", effect: ()=> moveTo(meetChad),},{name: "Ask the Locals", effect: ()=> moveTo(meetOwainPartOne),}])
const meetOwainPartOne = new storyPart(`7c`,[``,`You decide to ask around the town square with Kameron before going straight to the Knights' Guild.`,`You and Kameron split up and each do a full lap of the square before meeting back up.`,`You: “The knights are leaving soon for the Wastelands, the local bakery has a new pastry, and the only 'monster' seen by any of the civilians lately was a pig that enjoyed itself a bit too much in the cellar of the pub down the street.”`,`You: “So, nothing of value.”`,`Kameron: “I, on the other hand, did find something of value.”`,`You: “Really? Among these people?”`,`Kameron: “It's all about where and how you ask.”`,`You: “So? What did you find?”`,`Kameron: “There is a detective on the outskirts of town. He’s pretty eccentric, but he is a genius and is currently going crazy trying to get new leads.”`,`You: “If he is so busy, will he really be able to help us?”`,`Kameron: “Of course, because he is currently investigating rampaging monsters and a group of cloaked men.”`,`You and Kameron head over to the detective’s agency, which is, in reality, an old house that looks as if it was built no less than 200 years ago.`],[{name: `Knock on the door`, effect: () => moveTo(meetOwainPartTwo)}]);
const meetOwainPartTwo = new storyPart(`7ca`,[``,`You knock on the door and 5 minutes pass without any sign of life from within the building.`,`Kameron goes to knock again but the door flies open, almost ripping off its hinges.`,`???: “Second floor, room at the end of the hall, don’t enter the room and state your business before without opening the door.”`,`You look around for the source of the voice in confusion, but you find nothing.`,`The voice seems to come from everywhere within the building, but has no clear source.`,`Kameron: “Magic! Hehehe it seems we are in good hands Guy.”`,`Magic, like telepathy, was one of the many powers that could be found in this world, and it normally signified that one had immense knowledge.`,`You and Kameron head up to the second floor and arrive at the door at the end of the hall.`,`You: “We have a request”`,`???: “Speak.”`,`You explain what happened two months ago and state how you may be able to help each other.`,`???: “Hmmm…  alright, come on in”`,`The doors swing open and you see the detective sitting in front of you at a desk filled with paperwork.`,`Owain: “I am Owain. As you seem to already know I am in desperate need of a lead for my latest case. I cannot disclose who commissioned the case, but I am willing to share information with you on one condition.”`,`Kameron: “What is it?”`,`Owain: “Around the town square you will find 10 golden eggs seemingly hiding in plain sight. A normal person without magic cannot see them, and I need you to gather them for me.”`,`Owain: “Once you have all of the eggs return to me and we can talk.”`,`You and Kameron are suddenly thrust out of the office and find yourselves in front of the building. You wonder if you will actually learn anything of value from this man by just finding a couple of eggs.`],[{name: `Collect the eggs`, effect: () => egg()},{name: `Refuse to retreive the eggs`, effect: () => moveTo(refusal)}]);
const refusal = new storyPart(`E2`,[``,`You realize it is ridiculous to expect anything of value out of Owain, even if he is a magician, and head back to town.`,`You arrive in the town square and begin to head over to the knights’ guild, but you find out that they have already left town.`,`With no other option left you reluctnantly gather the eggs, but by the time you return to Owain he too is gone.`,`Without any leads and no way to find your beloved horse you and Kameron are lost with nowhere to go.`,`Many years pass and you simply wither away in town. You have lost to your own powerlessness.`],[{name: `Restart game`, effect: () => {player.inventory.egg = 10; reset();}},{name: `Go back to before you refused`, effect: () => moveTo(meetOwainPartTwo)}]);
const afterEggs = new storyPart(`7cb`,[``,`You return to Owain with all 10 eggs and begin to share information with him`,`Owain particularly took note of your description of what attacked you back in the forest and the direction they went.`,`Owain: “You also said that the knights are headed to the Wastelands?”`,`Kameron: “Yes.”`,`Owain: “Then it seems we have our destination.” “The knights have also been investigating a similar problem to me so if they are going to the Wastelands then we must follow.”`,`You, Kameron, and Owain prepare to depart.`,`You: “Owain, what did you need the golden eggs for? When we gave them to you you just put them in that bag you have now.”`,`Kameron: “Are you short on money? Is that why you needed them?”`,`Kameron: “Gods no, I wanted them because they make the greatest omelet you will ever taste.”`,`With pure shock on both your's and Kameron's faces, your group departs on the journey to the Wastelands.`],[{name: `Journey to the Wastelands`, effect: () => moveTo(wastelandDepartOwain)}]);
const meetChad = new storyPart(`7d`,[``,`You decide to head to the Knights’ Guild.`,`When you arrive at the guild you ask around about who you can talk to about a request.`,`Knight: “A request you say? Hmmm….. Well I could take you to our commander, but we are currently preparing for an expedition so don’t expect much.”`,`As the Knight guides you through a long hallway you are filled with worry that you will be left without help just like in the last town.`,`The pair of large wooden double doors leading into an office swing open and the knight that guide you begins the introduction.`,`Knight: “I present you Sir Chad von Chad, commander of the knights of the square table!”\n “Sir, these two men have a request for you!”`,`Chad von Chad: “Let’s hear it, but make it quick we depart within the hour.”`,`You quickly explain what happened two months ago and ask Chad von Chad if he would be willing to help you in any way.`,`Chad von Chad: “That is troubling. You said you were attacked by something in the forest unprovoked?”`,`You: “Yes.”`,`Chad von Chad: “Then we may be able to help each other.” “You see we are currently heading to the Wastelands following the tracks of a group of men cloaked in black who seem to be trying to control monsters.” “The monsters they control often appear to go crazy and rampage without care for their own life.”`,`Chad von Chad: “It appears that we are chasing after the same thing. I would be more than willing to help you, but you must also help us achieve our goal.”`,`Kameron (aside to you): “He speaks the truth, he may be able to help us, but nothing in this world is free so we may end up biting off more than we can chew.”`,`You take Kameron’s words to heart, but right now you see no other option but to take the risk.`,`You: “Alright. We will help you, but make sure you don’t forget to help us either.”`,`Chad flashes you a wide smile. Chad von Chad: “GREAT! Prepare yourselves, we depart soon!”`],[{name: `Journey to the Wastelands`, effect: () => {player.companion = 1;moveTo(wastelandDepartChad);}}]);

// Chad's path below
const wastelandDepartChad = new storyPart(`8a`, [``,`It’s been a week since you departed with the knights to the Wastelands.`, `Faithful to its namesake, the Wastelands show no form of life besides the occasional monsters that cannibalize each other and feed off of unfortunate travelers.`, `You and the knights had a smooth journey so far, but everyone knew remained on guard.`, `"ROOOOAAAR!"`, `Stalking you from a distance a group of monsters reveal themselves.`, `Your vigilance paid off as everyone in the group remained calm.`, `Chad von Chad: “PREPARE FOR BATTLE! THERE APPEARS TO BE A GROUP OF TEN APPROACHING, THEY ARE WEAK BUT DON'T LET YOUR GUARD DOWN!”`,`A cloaked being appears to be leading the group and approaches you for combat.`], [{name: "FIGHT!", effect: ()=> Fight(secondFight)}])
const wastelandFightChadWin = new storyPart(`8aa`, [``,`Chad von Chad: “Great work! It seems we can pick up the pace if you are this strong!”`, `You continue onward with newfound confidence`], [{name: "Continue deeper into the wastelands", effect: ()=> moveTo(outpostChad),}])
const wastelandFightChadLose = new storyPart(`8ab`, [``,`Chad von Chad: “I expected more of you.”`, `Kameron (whispering): “Hmm.. should we have trained for longer?”`, `You are disappointed by your own weakness and follow the knights from behind as they move onwards.`], [{name: "Continue deeper into the wastelands", effect: ()=> moveTo(outpostChad),}])
const outpostChad = new storyPart(`9a`, [``,`You and the knights continue forward and eventually arrive at an outpost that marks the entrance into the depths of the Wastelands.`, `You, Kameron, and the knights split up and plan to meet back up before the sun sets to plan your next moves.`, `You can go to the shop and restock items, visit the pub and relax over a nice drink, or wait for the knights and Kameron at the meeting location.`], [{name: "Shop", effect: ()=> moveTo(secondShop)}, {name: "Visit pub", effect: ()=> moveTo(pubChad)}, {name: "Wait for the knights and Kameron", effect: ()=> moveTo(leaveOutpostChad)}])
const secondShop = new storyPart(`9bb`,[``,`You decide to visit the store to stock up.`,`Shopkeeper: “Welcome to my shop! What are you looking for?”`],[{name: "Buy Health Potion: £3", effect: ()=> {if(player.money >= 3){player.inventory.healthP += 1; player.money -= 3}else{if(document.getElementById("textDisplay").textContent == `Shopkeeper: “Welcome to my shop! What are you looking for?”`){textType(document.getElementById("textDisplay"), `Shopkeeper: "I'm sorry, it appears you don't have enough money."`)};}; update();}},{name: "Buy Energy Potion: £3", effect: ()=> {if(player.money >= 3){player.inventory.energyP += 1; player.money -= 3}else{if(document.getElementById("textDisplay").textContent == `Shopkeeper: “Welcome to my shop! What are you looking for?”`){textType(document.getElementById("textDisplay"), `Shopkeeper: "I'm sorry, it appears you don't have enough money."`)};}; update();}},{name: "Leave Shop", effect: () => {if(player.companion = 1){moveTo(outpostChad)}else{moveTo(outpostOwain)}}}])
const pubChad = new storyPart(`9ac`, [``,`You sit at the pub and visit with the people there.`, `One person in particular caught your attention.`,`He introduced himself as Owain, a magical detective.`, `You talk with him over a drink and he even shows you a few party tricks before you guys say goodbye and go your separate ways.`], [{name: "Continue", efffect: ()=> moveTo(outpostChad)}])
const leaveOutpostChad = new storyPart(`9ad`, [``, `You reunite with the knights and rest for the night.`, `After morning comes Chad pulls you aside.`, `Chad von Chad: “Take this, it is a sword of the highest quality.”`, `Chad von Chad:  “Once we continue the monsters will only get stronger and you will need it if you wish to survive.”`], [{name: "Leave Outpost", effect: ()=> Fight(ruinedTownChad)}])
const ruinedTownChad = new storyPart(`10a`, [ ``, `Your group eventually encounters a ruined town.`, `The town appeared to have been long since abandoned and only occosioanlly used as a base for people like yourselves.`, `As you move deeper into the ruins you encounter the bodies of a group that came before you.`, `You are horrified at the sight, but you have no time to collect yourself as monsters surround you.`], [{name: "Fight", effect: ()=> Fight(thirdFight)}])
const ruinedTownFightLose = new storyPart(`10aa`, [``, `Chad von Chad: “The fights are only going to get harder from here on. PULL IT TOGETHER!”`, `You are saddened by your own incompetence.`], [{name: "Continue", effect: ()=> moveTo(searchRuins)}])
const ruinedTownFightWin = new storyPart(`10ab`, [``, `Chad von Chad: “HAHAHA! You are an amazing fighter."`,`Chad von Chad: "Once we return please consider joining us as a fellow knight.”`, `Chad's sincere praise boosts your confidence and you begin to consider joining the Kights of the Square Table.`], [{name: "Continue", effect: ()=> moveTo(searchRuins)}])
const youSuckEndingChad = new storyPart(`E3a`,[``,`Chad von Chad: “The fights are only going to get harder from here on. PULL IT TOGETHER!”`,`The knights look at you with pity and begin to whisper among themselves.`, `You, Kameron, and Chad's knights investigate the ruins and prepare to bury the bodies of the deceased.`, `During your investigation one of the knights discover a note written in dried blood.`, `The note reads: ‘BEWARE SGRIOBHADAIR, MASTER OF THE ACCURSED TOWER’`, `Chad von Chad: “It seems that we have found our target.”`, `Kameron: “It seems this Sgri-”`, `Kameron: "Sgior..."`, `Kameron: "Sgribadaba...."`, `It appears that Kameron can't quite pronounce the name so you help him out.`, `You (whispering to Kameron): “It’s pronounced s̪kɾiːvətɛɾ.”`, `Kameron: “Ahem!” “It seems Sgrioghadair is the source of these rampaging monsters.”`, `Chad von Chad: “So our destination is the tower in the distance.”`, `You turn to look at the ominous tower that only recently came into veiw.`, `Chad von Chad: “REST UP MEN! We will have to fight our hardest if we wish to put an end to all of this.”`, `Before you can leave to set up your tent Chad pulls you aside with Kameron.`, `Chad von Chad: "Guy, you need to head back."`, `You: "What?", 'Kameron looks equally as surprised as you, but he nods his head in agreement.`, `Kameron: "CHad's right, you have held back the group too much."`, `You: "B-but what about Korai!?!"`, `Kameron: "I will escort you back to town and reunite with the knights before the tower."`, `Kameron: "I promise to continue the search in your stead."`, `Chad von Chad: "Will you be able to catch back up with us Kameron?"`, `Kameron: "Haha, don't worry about me I am stronger than these white hairs let on."`, `CHad von Chad: "Alright, once day breaks Kameron will escort you back Guy, then he will rendevous with us and continue teh journey from there."`, `You wish to refute the two men, but deep down you know you can't.`,`Deep down you know that you suck.`],[{name: `Return to town`, effect: () => moveTo(youSuckEndingChad2)}]);
const youSuckEndingChad2 = new storyPart(`E3aa`,[``,`You are escorted to town and told to wait at the Knight's Guild.`,`You wait`, `And wait`, `And wait`, `And wait`, `And wait`, `Weeks have past and Chad and Kameron have yet to return.`, `You finally decide to act and prepare to return back to the wastelands.`, `You gather your things and finally arrive at the border of the wastelands.`, `You cross the border with determination, but are immediately ambushed by a single small monster and get mauled to death.`, `Later Kameron and Chad return, but they are unable to find you.`,`THE END`], [{name: `Restart Game`, effect: () => {player.inventory.egg = 10; reset();}},{name: `Restart at last fight`, effect: () => moveTo(ruinedTownChad)}, {name: 'Restart at the beginningof the Wastelands', effect: () => moveTo(wastelandDepartChad)}]);
const searchRuins = new storyPart(`11a`, [``, `After the fight you, Kameron, and Chad's knights investigate the ruins and prepare to bury the bodies of the deceased.`, `During your investigation one of the knights discover a note written in dried blood.`, `The note reads: ‘BEWARE SGRIOBHADAIR, MASTER OF THE ACCURSED TOWER’`, `Chad von Chad: “It seems that we have found our target.”`, `Kameron: “It seems this Sgri-”`, `Kameron: "Sgior..."`, `Kameron: "Sgribadaba...."`, `It appears that Kameron can't quite pronounce the name so you help him out.`, `You (whispering to Kameron): “It’s pronounced s̪kɾiːvətɛɾ.”`, `Kameron: “Ahem!” “It seems Sgrioghadair is the source of these rampaging monsters.”`, `Chad von Chad: “So our destination is the tower in the distance.”`, `You turn to look at the ominous tower that only recently came into veiw.`, `Chad von Chad: “REST UP MEN! We will have to fight our hardest if we wish to put an end to all of this.”`, `You, Kameron, and the knights set up camp in the ruined village and night falls.`], [{name: "Rest", effect: () => moveTo(questionJourneyChad)}])
const questionJourneyChad = new storyPart(`11aa`, [``,`After checking your gear you finally have some time to yourself and you think about the journey ahead.`,`You begin to question whether you really want to fight an unknown monster beyond anything you have ever seen just to get some information on your horse.`], [{name: "Question the journey", effect: ()=> moveTo(questionJourney1Chad)}], [{name: "Don't question it", effect: ()=> moveTo(restBeforeTowerChad)}])
const questionJourney1Chad = new storyPart(`11ab`,[``,`You: ‘I mean I love Korai, but I might actually die if I continue forward.’`],[{name: `Question it even more`, effect: () => moveTo(questionJourney2Chad)},{name: `Ignore your doubts`, effect: () => moveTo(restBeforeTowerChad)}]);
const questionJourney2Chad = new storyPart(`11ac`,[``,`You: ‘Like, me and Korai were close, but at the end of the day he’s just a horse. Do I really have to fight this Sgrioghadair just to get a clue on where he is?’`],[{name: `Question it even more`, effect: () => moveTo(questionJourney3Chad)},{name: `Ignore your doubts`, effect: () => moveTo(restBeforeTowerChad)}]);
const questionJourney3Chad = new storyPart(`11ad`,[``,`You: ‘Honestly, I probably could have found at least some traces of Korai by now if me and Kameorn just searched on our own.’`],[{name: `Question it even more`, effect: () => moveTo(questionJourney4Chad)},{name: `Ignore your doubts (last chance)`, effect: () => moveTo(restBeforeTowerChad)}]);
const questionJourney4Chad = new storyPart(`11ae`,[``,`You: ‘Even if I couldn’t find Korai at the end of the day he’s just a horse.’`],[{name: `Question it even more`, effect: () => moveTo(questionJourney5Chad)},{name: `Ignore your doubts`, effect: () => moveTo(restBeforeTowerChad)}]);
const questionJourney5Chad = new storyPart(`11af`,[``,`You: ‘Heck, like Kameron said, Korai is way beyond the age a normal horse should be able to live.’`,`You: ‘There’s no guarantee that Korai hasn’t passed away somewhere or won’t pass away soon after I find him.’`],[{name: `Run away`, effect: () => moveTo(runAwayEndingChad)}]);
const runAwayEndingChad = new storyPart(`E4a`,[``,`As you continue to question the journey ahead you realize that risking your life for a horse past its prime is not really worth it.`,`You gather your things and prepare to sneak out in the middle of the night.`, `Once all of the knights have fallen asleep you leave them and Kameron behind and head back to town.`, `A week passes and you finally arrive at town feeling refreshed.`, `You spend the rest of your days in the town and marry a beautiful woman and have three children.`, `THE END`],[{name: `Restart game`, effect: () => {player.inventory.egg = 10; reset();}},{name: `Go back`, effect: () => moveTo(questionJourneyChad)}]);
const restBeforeTowerChad = new storyPart(`11ag`,[``,`Despite your concerns you decide to not question the viability of this journey any longer.`,`After all, this is all for your beloved and innocent horse.`, `You head off to bed prepared for the journey ahead.`],[{name: `Continue`, effect: () => moveTo(towerEntranceChad)}]);
const towerEntranceChad = new storyPart(`12a`,[``,`As dawn broke you, Kameron, and the knights all steel yourselves before heading off to the tower.`,`As you arrive at the tower the knights inspect the perimeter and you and Kameron use your telepathy to detect any nearby enemies.`, `The coast is clear.`, `You approach the entrance to the tower and place your hands on the large doors to open them.`, `They creak open and-`, `Kameron: “GUY! STOP! SOMETHING”S COMING!”`, `At Kameron’s warning your telepathic powers begin to flare up`, `You detect something akin to pure hatred.`, `But…`, `You: “There’s nothing?”`, `Then, the sky darkened, bleeding into a shadowed hue, and from the depths of that gloom, a shape loomed.`, `An impossible, grotesque semblance of a mountain, staggering and unearthly in its motion.`, `Its movements distorted that which existed around it.`, `It did not approach with sound; it was a thing of silence, a soundless behemoth drawing nearer.`, `It was so large that your eyes began to betray you as you tried to calculate its size.`, `Just moments ago it appeared to be a colossal mountain, but now it felt as though you were simply staring at the shadow of a larger being.`, `There is nowhere to run.`, `And it spoke to you.`, `The Beast: "You know, I'm not even mad. I'm just disapointed. *siiiiiigggggghhhhhh* I have things to do today, let's get this over with *ssssiiiiiigggghhhh*"`],[{name: `Fight`, effect: () => moveTo(beastFight)}]);
const afterBeastFightChad = new storyPart(`13a`,[``,`No matter what you do you can’t seem to injure the beast.`,`In fact the only reason you're alive is because Chad and Kameron have been going all out holding back the beast all by themselves.`, `Finally, Chad and Kameron hit the beast hard enough to stagger it, giving you a moment to breathe.`, `Kameron: “HEAD INSIDE THE TOWER!” “CHAD! TAKE YOUR KNIGHTS AND GUY AND FINISH THIS!”`, `Chad von Chad: “All right!”`, `Chad leads his knights inside and grabs you as he runs.`, `You realize too late that Kameron intends to hold back the beast all by himself so that you can finish the journey.`, `You: “WAIT!”`, `You struggle but Chad does not let you go.`, `You: “KAMERON!”`, `Kameron faces the beast as it regains its posture.`, `It looked like a speck of dust trying to erode a mountain.`, `Just before the door to the tower closed Kameron turned around.`, `He smiles at you.`, `Kameron: “GUY! FIND THAT HORSE OF YOURS AND LIVE A GOOD LIFE!”`, `The tower door shuts and Kameron leaves your sight.`, `This will be the last time to see Kameron.`],[{name: `Continue`, effect: () => moveTo(ripKameronChad)}]);
const ripKameronChad = new storyPart(`14a`,[``,`After being given some time to grieve Chad urges you to continue.`,`Chad von Chad: “I know your pain, but the end is near. Let's finish this.”`, `Chad von Chad: “For Kameron.”`],[{name: `For Kameron`, effect: () => moveTo(inTheTowerChad)}]);
const inTheTowerChad = new storyPart(`15a`,[``,`The door to the outside world won’t open and it urges you to continue forward.`,`You Chad, and a few other knights continue deeper into the tower.`, `You reach a room filled with the remains of unfortunate adventurers you entered the tower.`, `On the wall to the right there appears to be a map of a maze and in front of you there is a dark corridor.`, `Chad von Chad: “It appears that the way forward is blocked by a maze.”`, `You: “Luckily, it seems we have recieved help from our predecessors.”`, `Chad von Chad: “Yes. These brave men sacrificed themselves to create a map of the maze.”`, `You see a list of instructions carved into the walls.`, `The instructions are as follows:`, `At the first fork go right, then continue forward until you are met with only two paths.`, `Go left twice, then right once more.`, `Finally you must go straight until you see the end.`, `You finish reading the instructions and look towards the maze.`],[{name: `Enter maze`, effect: () => moveTo(mazeChad)},{name: `Review Instructions`, effect: () => moveTo(instructionsChad)}]);
const instructionsChad = new storyPart(`15aa`,[``,`The instructions are...`,`At the first fork go right, then continue forward until you are met with only two paths.`, `Go left twice, then right once more.`, `Finally you must go straight until you see the end.`, `Are you ready?`],[{name: `Yes`, effect: () => moveTo(maze1Chad)},{name: `No, I need to review again`, effect: () => moveTo(instructionsChad)}]);
const maze1Chad = new storyPart(`16a`,[``,`You enter the maze and are met with a fork in the paths`,`You can go right, forward, or left.`],[{name: `Go right`, effect: () => moveTo(maze2Chad)},{name: `Go Forward`, effect: () => Fight(mazeFight)}, {name: `Go left`, effect: ()=> Fight(mazeFight)}]);
const maze2Chad = new storyPart(`16aa`,[``,`You continue right and are met with another three way split in the path.`,`You can go right, forward, or left`], [{name: `Go right`, effect: () => moveTo(mazeFight)},{name: `Go Forward`, effect: () => moveTo(maze3Chad)}, {name: `Go left`, effect: ()=> Fight(mazeFight)}]);
const maze3Chad = new storyPart(`16ab`,[``,`You continue forward until you find a towering wall in front of you.`,`The paths available are left and right.`],[{name: `Go left`, effect: () => moveTo(maze4Chad)},{name: `Go right`, effect: () => Fight(mazeFight)}]);
const maze4Chad = new storyPart(`16ac`,[``,`You turn left and continue on.`,`You then find another split in the path forward.`, `You can go left or right.`],[{name: `Go left`, effect: () => moveTo(maze5Chad)},{name: `Go right`, effect: () => Fight(mazeFight)}]);
const maze5Chad = new storyPart(`16ad`,[``,`You turn left again.`,`You can feel yourself reaching the end of the maze.`, `But, once agin you must decide.`, `You can go left, forward, or right`],[{name: `Go left`, effect: () => Fight(mazeFight)},{name: `Go forward`, effect: () => moveTo(mazeFight)}, {name: 'Go right', effect: ()=> moveTo(maze6Chad)}]);
const maze6Chad = new storyPart(`16ae`,[``,`You turn right and can see a light straight ahead.`,`But you are met with another crossroads.`, `You should go forward, but you can also go right or left.`, `Again, you should go forward, if you go right or left you could jepordize the entire mission.`, `But the choice is yours.`],[{name: `Go left`, effect: () => moveTo(mazeEnd1Chad)},{name: `GO FORWARD (Pick this one)`, effect: () => moveTo(bossDoorsChad)}, {name: 'Go right', effect: ()=> moveTo(mazeEnd2Chad)}]);
const mazeFightLoseChad = new storyPart(`16af`,[``,`You are cornered by the monster, but before they can finish you off the floor beneath you opens up and you black out.`,`You awaken at the start of the maze.`, `Do you want to enter the maze again or review the instruction`],[{name: `Enter maze`, effect: () => moveTo(maze1Chad)},{name: `Review instructions`, effect: () => moveTo(instructionsChad)}]);
const mazeEnd1Chad = new storyPart(`E5a`,[``,`Despite all logic and common sense telling you to go forward, you go left.`,`Your irational decision confuses Chad and the knights, but they trust your instincts as a telepath.`, `And so, you continue left`, `You walk and walk`, `And walk`, `And walk`, `And walk`, `And walk`, `Eventually, you begin to think that going left wasn't such a good idea.`, `You try to turn back, but you can't.`, `There is only darkness, and you have no idea where Chad and the knights are.`, `Perhaps they used their brains and headed back in order to go down the correct path.`, `You look around.`, `You see nothing.`, `You hear nothing.`, `You feel nothing.`, `Left alone with your thoughts you begin to drift away.`, `THE END`], [{name: `Restart game`, effect: () => reset()}, {name: `Restart at crossroads`, effect: () => moveTo(maze6Chad)}]);
const mazeEnd2Chad = new storyPart(`E6a`,[``,`Despite all logic and common sense tellin you to go forward, you go right`,`Your irational decision confuses Chad and the knights, but they trust your instincts as a telepath.`, `And so you continue right.`, `You walk down a dimly lit path until you reach a dead end.`, `You awkwardly look back at the knights before deciding to head back.`, `But before you can take two steps the floor gives out beneath you and you along with the knights plunge into a pit filled with small spikes.`, `The spikes are small enough to do you no real harm, but they are laced with a neurotoxin.`, `Anxiety and dread begin to well up inside of you as your body slowly loses function.`, `You can feel every emotion all at once as your brain is being fried by the poison.`, `You and the knights slowly succumb to a deep insanity before dying.`, `THE END`], [{name: `Restart game`, effect: () => reset()},{name: `Restart at crossroads`, effect: () => moveTo(maze6Chad)}]);
const bossDoorsChad = new storyPart(`17a`,[``,`After clearing the maze you are met with two doors.`,`One is a lavish double door lined with gold and radiating a menacing aura from behind it.`,`The other appears to belong to a wooden shed.`],[{name: `Approach the lavish door`, effect: () => moveTo(lavishBossDoorChad)},{name: `Approach the shed door`, effect: () => moveTo(shedDoorChad)}]);
const lavishBossDoorChad = new storyPart(`17aa`,[``,`You approach the large black and gold double door`],[{name: `Open`, effect: () => moveTo(bossChad)},{name: `Go to other door`, effect: () => moveTo(shedDoorChad)}]);
const bossChad = new storyPart(`18a`,[``,`You approach the large set of double doors and push them open with all your might.`,`Behind them stands another cloaked figure, but he is much stronger than any other cloaked figure you have seen before.`, `???: “I …. Am Sgrioghadair.”`, `Sgrioghadair: “You have bested me up until this point, BUT NO LONGER!”`, `Sgrioghadair summoned hundreds of monsters separating you from Chad and the knights.`, `Sgrioghadair: “I will deal with you first.”`],[{name: `Fight`, effect: () => Fight(bossFight)}]);
const bossWinChad = new storyPart(`19aa`,[``,`You finally beat Sgrioghadair. You feel a huge weight off your shoulders and take a look around.`, `Chad and the knights finished off the last of the monsters.`, `Chad von Chad: “Everything is over. We did it!”`, `From behind a pillar in the room you hear a faint whine.`, `You quickly look around and spot your best friend.`, `You enjoy your reunion with Korai while Chad and the knights celebrate and prepare to head back.`, `As you leave the tower you see the remnants of Kameron’s battle with the beast.`, `A huge corpse lay still, and Kameron is nowhere to be seen.`, `You silently thank your Mentor and head back with the knights.`], [{name: `Continue`, effect: () => moveTo(bossEndCHad)}]);
const bossEndChad = new storyPart(`E7a`, [``,`2 years later.`,`You joined the knights and succeeded Chad as the commander.`, `Hailed as heroes you had to lead your men on many difficult missions, but none as hard as your first.`, `You enjoy the rest of your life as a hero and respected commander of the Knights of the Square Table.`, `THE END`], [{name: `Restart Game`, effect: ()=> reset()}, {name: `Return to doors`, effect: () => moveTo(bossDoorsChad)}])
const bossLoseChad = new storyPart(`E8a`,[``,`You lose to Sgrioghadair and are helpless as Sgrioghadair goes to wipe out the exhausted knights.`,`You can only hear screams and the crushing of bones and flesh as Sgrioghadair battles the knights with his monsters.`, `Sgrioghadair returns to you and looks at you with pity.`, `Sgrioghadair: “You were strong, but what is strength compared to my army?”`, `Sgrioghadair orders his monsters to finish you and the last thing you see is his twisted smile.`],[{name: `Restart Game`, effect: ()=> reset()}, {name: `Retry fight`, effect: ()=> moveTo(bossChad)}, {name: `Return to doors`, effect: () => moveTo(bossDoorsChad)}]);
const shedDoorChad = new storyPart(`17ab`,[``,`You approach the shed door`],[{name: `Open`, effect: () => moveTo()},{name: `Go to the other door`, effect: () => moveTo(lavishBossDoorChad)}]);
const shedDoorOpenChad = new storyPart(`17ac`,[``,`You approach the shed door and notice a strange keyhole on it.`,`The key hole is awkwardly shaped like a fish.`],[{name: `Try to open`, effect: () => moveTo()},{name: `Go to other door`, effect: () => moveTo(lavishBossDoorChad)}]);
const shedDoorLockedChad = new storyPart(`17ad`,[``,`You try to open the shed door but it is locked`],[{name: `Find another way`, effect: () => moveTo(knowledgeGain1Chad)}, {name: `Go to the other door`, effect: () => moveTo(lavishBossDoorChad)}]);
const knowledgeGain1Chad = new storyPart(`17ae`,[``,`As you try to find another way past the door Chad throws a heavy punch at the door.`,`Nothing happened.`, `Chad von Chad: “It appears to be protected by high tier magic.”`],[{name: `Try to decipher the magic`, effect: () => moveTo(knowledgeGain2Chad)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsChad)}]);
const knowledgeGain2Chad = new storyPart(`17af`,[``,`You try to decipher the magic, but to no avail.`,`You could try again.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain3Chad)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsChad)}]);
const knowledgeGain3Chad = new storyPart(`17ag`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain4Chad)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsChad)}]);
const knowledgeGain4Chad = new storyPart(`17ah`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain5Chad)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsChad)}]);
const knowledgeGain5Chad = new storyPart(`17ai`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain6Chad)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsChad)}]);
const knowledgeGain6Chad = new storyPart(`17aj`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain7Chad)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsChad)}]);
const knowledgeGain7Chad = new storyPart(`17ak`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`,`You now understand the meaning of life, but you have yet to decipher the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain8Chad)}]);
const knowledgeGain8Chad = new storyPart(`17al`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain9Chad)}]);
const knowledgeGain9Chad = new storyPart(`17am`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain10Chad)}]);
const knowledgeGain10Chad = new storyPart(`17an`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`,`Your knowledge and wisdom approaches omniscience.`],[{name: `choice2`, effect: () => moveTo(knowledgeGain11Chad)}]);
const knowledgeGain11Chad = new storyPart(`E9a`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`, `Hundreds of years pass and you find yourself understanding everything, but no closer to breaking past the door.`, `You finally give up and decide to enjoy your omniscience.`, `THE END`],[{name: `Restart game`, effect: () => reset}, {name: `Return to doors`, effect: ()=> moveTo(bossDoorsChad)}]);
const trueBossChad = new storyPart(`HorseA`,[``,`You examine the lock on the door and after thinking for a while you think to pull out the fish you got at the beginning of your journey.`,`You didn't think it would work, but to your surprise the fish glows and floats out of your hands.`, `The shed door opens and the fish disappears.`, `	Beyond the door you see something that shakes you to your very core.`],[{name: `Continue`, effect: () => moveTo(betrayalChad)}]);
const betrayalChad = new storyPart(`HorseAA`,[``,`???: “Welcome Guy.”`,`Before you sits a horse on a throne. He appears to know you, and you fear that you know why.`, `You: “Korai?”`, `Korai: “Yes, that is the name you gave me all those years ago.”`, `Korai: “But I prefer my true name: SGRIOGHADAIR!”`, `!!!!!!!!!!`, `You: “But …. How?”`, `Sgrioghadair: “Didn’t you ever find it weird?”`, `Sgrioghadair: “The unnatural intelligence I displayed, bmy ability to remain in my prime despite living almost ten years longer than every other horse.”`, `Sgrioghadair: “Didn’t you ever have even a sliver of doubt even after everything you have seen that maybe this was all orchestrated by me GUY!?!?!?”`, `Sgrioghadair: “Of course I did not expect you to find my key so effortlessly, but I have prepared myself to kill you ever since.”`, `Chad von Chad: “Guy, what is going on?”`, `You: “That’s Korai, my horse.”`, `Chad von Chad: “And he says he’s behind everything that has been happening lately?”`, `You: “... yes.”`, `Chad takes a moment to process what is going on, but he quickly prepares for battle and steps forward.`, `Chad von Chad: “Then there is no time to hesitate, throw away what sentiment you have and prepare for battle Guy!”`, `Confused, you draw your sword and point it at Korai - no Sgrioghadair.`],[{name: `Fight`, effect: () => Fight(trueBoss)}]);
const trueBossLoseChad = new storyPart(`E10a`,[``,`You and the knights fall to Sgrioghadair and fall unconscious.`,`As you awaken you find yourselves unable to control your own body.`, `Sgrioghadair: “I was planning to slowly take control of who I needed over the next hundred years but you guys are quite the splendid surprise.”`, `You and the knights once again fall unconscious.`, `The next time you awake you are surrounded by flames and covered in blood.`, `You have slaughtered thousands while your body wouldn’t listen to you.`, `Under Sgrioghadair’s command you plunge the world into chaos.`, `THE END`],[{name: `Restart game`, effect: () => reset()}, {name: `Restart fight`, effect: () => moveTo(betrayalChad)}, {name: 'Return to doors', effect: ()=> moveTo(bossDoorsChad)}]);
const trueBossWinChad = new storyPart(`E11a`,[``,`After a long battle you finally beat Sgrioghadair.`,`Sgrioghadair’s face scrunches in annoyance and frustration as he charges at you one last time while raising his magical power.`, `You: “HE'S GOING TO BLOW HIMSELF UP!”`, `You and the knights run to the door but you can’t leave.`, `Chad turns around and dashes to Sgrioghadair.`, `Chad wrestles Sgrioghadair to the ground and throws him as hard as he can against the wall.`, `Sgrioghadair breaks through the wall and falls to the ground below the tower, he blows up leaving no one harmed.`, `You take a moment to relive the good memories you and with Korai.`, `As you leave the tower you see the remnants of Kameron’s battle with the beast.`, `A huge corpse lay still, and Kameron is nowhere to be seen.`, `You silently thank your Mentor and head back with the knights.`, `You return to town and Chad offers you a position in the Knights of the Square Table, but you refuse.`, `You vow to never let something like this happen again under your watch and spend the rest of your days acting as the world’s hero and protector.`, `THE END`],[{name: `Restart game`, effect: () => reset()}, {name: `Return to doors`, effect: () => moveTo(bossDoorsChad)}]);

// Owain's path below
const wastelandDepartOwain = new storyPart(`8b`, [``,`It’s been a week since you departed with Owain and Kameron to the Wastelands.`, `Faithful to its namesake, the Wastelands show no form of life besides the occasional monsters that cannibalize each other and feed off of unfortunate travelers.`, `Your small group of three have had a smooth journey so far, but everyone knew remained on guard.`, `"ROOOOAAAR!"`, `Stalking you from a distance a large monster appears.`, `Your vigilance paid off as everyone in the group remained calm.`, `Owain: “Prepare yourselves! He's big but alone!”`,`A cloaked being appears to be leading the monster and approaches you with the monster for combat.`], [{name: "FIGHT!", effect: ()=> Fight(secondFight)}])
const wastelandFightOwainWin = new storyPart(`8ba`, [``,`Owain: “We did well. I believe we can move faster if we are this strong.”`, `You and Owain continue onward with newfound confidence`], [{name: "Continue deeper into the wastelands", effect: ()=> moveTo(outpostOwain),}])
const wastelandFightOwainLose = new storyPart(`8bb`, [``,`Owain: “Darnit! I didn't want to have to use this so soon”`, `Owain pulled out a small palm sized ball from his bag and began to inscribe runes onto it.`, `When he finished his inscriptions he threw the ball at the monster before the small item suddenly burst into a thick cloud of smoke.`, `Owain: "RUN NOW!"`, `As you and Owain run away defeated Kameron follows you from behind.`, `Kameron (whispering): “Hmm.. should we have trained for longer?”`], [{name: "Continue deeper into the wastelands", effect: ()=> moveTo(outpostOwain),}])
const outpostOwain = new storyPart(`9b`, [``,`You, Owain, and Kameron continue forward and eventually arrive at an outpost that marks the entrance into the depths of the Wastelands.`, `The three of you split up and plan to meet back up before the sun sets.`, `You can go to the shop and restock items, visit the pub and relax over a nice drink, or wait for Owain and Kameron at the meeting location.`], [{name: "Shop", effect: ()=> moveTo(secondShop)}, {name: "Visit pub", effect: ()=> moveTo(pubOwain)}, {name: "Wait for Owain and Kameron", effect: ()=> moveTo(stoneTabletOwain)}])
const pubOwain = new storyPart(`9bc`, [``,`You sit at the pub and visit with the people there.`, `One person in particular caught your attention.`,`He introduced himself as Chad, the commander of the Kinghts of the Square Table.`, `You talk with him over a couple of drinks as he recounts tales of his heroism.`,`Before you guys say goodbye and go your separate ways.`], [{name: "Continue", effect: ()=> moveTo(outpostOwain)}])
const leaveOutpostOwain = new storyPart(`9bd`,[``,`You reunite with Owain and Kameron for the night.`,`After morning comes Owain pulls you aside.`, `Owain: “Guy, I would like to give you a few suggestions on how to better use your telepathy.”`, `Owain: “Once we continue the monsters will only get stronger and you will need it if you wish to survive.”`, `Owain explains to you how a magician sees human emotion.`, `He explains that it may be a lot more black and white than you previously thought.`, `After an in depth discussion you can feel your understanding of your telepathic power increase.`, `Now better prepared, you head out.`],[{name: `Leave Outpost`, effect: () => moveTo(stoneTabletOwain)}]);
const stoneTabletOwain = new storyPart(`10b`, [``, `You follow Owain for a while before arriving at a giant stone tablet with writing carved into it.`, `This appears to be the result of a lead that Owain had.`, `Owain approaches the tablet to transcribe the writing, but he is interrupted by a low growl from behind the tablet.`, `“Grrrrrr”`, `A monster appears from behind the tablet.`, `It is heavily scarred and behind it stands a cloaked man.`, `Cloaked Man: “How dare you try to read the great scripture!”`, `Cloaked Man: "I WILL TEAR YOU TO PIECES AS PUNISHMENT!"`], [{name: "Fight", effect: ()=> Fight(thirdFight)}])
const stoneTabletFightWin = new storyPart(`10ba`,[``,`Owain: “Ha! It seems they are no match for us.”`,`Owain is beyond happy at your strength.`, `Owain: “Guy! Once we return, remind me to offer you a job at my agency!”`, `Owain’s offer makes you feel confident and gives you something to look forward to after the journey.`],[{name: `Continue`, effect: () => moveTo(owainTranslateTablet)}]);
const stoneTabletFightLose = new storyPart(`10bb`,[``,`Owain: “I didn’t want to have to use this!”`,`Owain pulls out a small cube from his bag.`, `After tinkering with the cube a bit he throws it at the monster and the cloaked man.`, `The cube explodes and completely eviscerates your enemies.`, ` Owain: “We are lucky they didn't have us surrounded or else we would have been caught in the explosion."`, `Owain: *sssiiiggghh* That was the only one I had. Are we really this weak?”`, `You are saddened by your own incompetence.`],[{name: `Continue`, effect: () => moveTo(owainTranslateTablet)}]);
const youSuckEndingOwain = new storyPart(`E3b`,[``,`Before translating the tablet Owain glances between you and Kameron and whispers to himself.`,`Owain moves forward and begins to translate.`, `Owain transcribes what the tablet says on a piece of paper before showing you and Kameron.`, `It reads: ‘SGRIOBHADAIR, MASTER OF THE BLESSED TOWER. HE WILL SAVE US ALL FROM THE LIMITATIONS OF THIS WORLD.’`, `Owain: “It seems that we have found our target.”`, `Kameron: “It seems Sgri- Sgior- Sgribada-”`, `Kameron seems to be having trouble reading the name so you decide to help him out.`,`You (whispering to Kameron): “It’s pronounced s̪kɾiːvətɛɾ”`, `Kameron: “Ahem! It seems Sgrioghadair is the source of these rampaging monsters.”`, `Owain: “So the goal is the tower in the distance."`, `Owain: "We should rest for the night."`, `You prepare yourself for the journey ahead, but Owain and Kameron approach yo with serious looks.`,`You: "What's wrong."`, `Kameron: "Well, Guy... Don't take this the wrong way but..."`, `Kameron seems to be struggling to tell you something.`, `Owain: "You suck at fighting Guy."`, `You: "What?"`, `Owain: "Both fights we have fought in have been lost because of you."`, `You look to Kameorn but he offers no consolation.`, `Kameron: "He's right. I thought I had trained you enough but you still lack in a lot of areas."`, `Owain: "Me and Kameron will continue the journey, but we will first escort you back to town where you will wait for us to return."`, `You: "B-but what about Korai!?! How am I supposed to find my horse!?!"`, `Kameron: "I will look for Korai, but you are far to weak to continue the journey."`, `You are shocked that you journey has to end so soon, but you can say nothing to Owain and Kameron because they are right.`, `You suck.`],[{name: `Return to town`, effect: () => moveTo(youSuckEndingOwain2)}]);
const youSuckEndingOwain2 = new storyPart(`E3ba`,[``,`You are escorted to town and told to wait at Owain's house.`,`You wait`, `And wait`, `And wait`, `And wait`, `And wait`, `Weeks have past and Owain and Kameron have yet to return.`, `You finally decide to act and prepare to return back to the wastelands.`, `You gather your things and finally arrive at the border of the wastelands.`, `You cross the border with determination, but are immediately ambushed by a single small monster and get mauled to death.`, `Later Kameron and Owain return, but they are unable to find you.`,`THE END`], [{name: `Restart Game`, effect: () => {player.inventory.egg = 10; reset();}},{name: `Restart at last fight`, effect: () => moveTo(stoneTabletOwain)}, {name: 'Restart at the beginningof the Wastelands', effect: () => moveTo(wastelandDepartOwain)}]);
const owainTranslateTablet = new storyPart(`11b`,[``,`You and Owain approach the tablet and Owain translates=s what it says on a piece of paper before showing you and Kameron`,`It reads: ‘SGRIOBHADAIR, MASTER OF THE BLESSED TOWER. HE WILL SAVE US ALL FROM THE LIMITATIONS OF THIS WORLD.’`, `Owain: “It seems that we have found our target.”`, `Kameron: “It seems Sgri- Sgior- Sgribada-”`, `It seems Kameron is having trouble pronouncing the name so you decide to help him.`, `You (whispering to Kameron): “It’s pronounced s̪kɾiːvətɛɾ”`, `Kameron: “Ahem!” “It seems Sgrioghadair is the source of these rampaging monsters.”`, `Owain: “So our destination is the tower in the distance.”`, `Owain: “Let’s rest up and prepare for the journey ahead.”`, `The three of you set up camp next to the tablet.`, `After checking your gear you finally have some time to yourself and you think about the journey ahead.`, `You begin to question whether you really want to fight an unknown monster beyond anything you have ever seen just to get some information on your horse.`, `You: ‘Is this really all worth it?’`, `You: ‘I know that Owain is the only lead I have to find Korai, but is it really viable to fight some unknown beast just for my Horse?’`, `You begin to doubt yourself.`],[{name: `Question it`, effect: () => moveTo(questionJourneyOwain)},{name: `Ignore your doubts`, effect: () => moveTo(restBeforeTowerOwain)}]);
const questionJourneyOwain = new storyPart(`11aa`, [``,`After checking your gear you finally have some time to yourself and you think about the journey ahead.`,`You begin to question whether you really want to fight an unknown monster beyond anything you have ever seen just to get some information on your horse.`], [{name: "Question the journey", effect: ()=> moveTo(questionJourney1Owain)}], [{name: "Ignore your doubts", effect: ()=> moveTo(restBeforeTowerOwain)}])
const questionJourney1Owain = new storyPart(`11ab`,[``,`You: ‘I mean I love Korai, but I might actually die if I continue forward.’`],[{name: `Question it even more`, effect: () => moveTo(questionJourney2Chad)},{name: `Ignore your doubts`, effect: () => moveTo(restBeforeTowerOwain)}]);
const questionJourney2Owain = new storyPart(`11ac`,[``,`You: ‘Like, me and Korai were close, but at the end of the day he’s just a horse. Do I really have to fight this Sgrioghadair just to get a clue on where he is?’`],[{name: `Question it even more`, effect: () => moveTo(questionJourney3Owain)},{name: `Ignore your doubts`, effect: () => moveTo(restBeforeTowerOwain)}]);
const questionJourney3Owain = new storyPart(`11ad`,[``,`You: ‘Honestly, I probably could have found at least some traces of Korai by now if me and Kameorn just searched on our own.’`],[{name: `Question it even more`, effect: () => moveTo(questionJourney4Owain)},{name: `Ignore your doubts (last chance)`, effect: () => moveTo(restBeforeTowerOwain)}]);
const questionJourney4Owain = new storyPart(`11ae`,[``,`You: ‘Even if I couldn’t find Korai at the end of the day he’s just a horse.’`],[{name: `Question it even more`, effect: () => moveTo(questionJourney5Chad)},{name: `Ignore your doubts`, effect: () => moveTo(restBeforeTowerOwain)}]);
const questionJourney5Owain = new storyPart(`11af`,[``,`You: ‘Heck, like Kameron said, Korai is way beyond the age a normal horse should be able to live.’`,`You: ‘There’s no guarantee that Korai hasn’t passed away somewhere or won’t pass away soon after I find him.’`],[{name: `Run away`, effect: () => moveTo(runAwayEndingOwain)}]);
const runAwayEndingOwain = new storyPart(`E4b`,[``,`As you continue to question the journey ahead you realize that risking your life for a horse past its prime is not really worth it.`,`You gather your things and prepare to sneak out in the middle of the night.`, `Once Owain and Kameron have fallen asleep you leave them behind and head back to town.`, `A week passes and you finally arrive at town feeling refreshed.`, `You spend the rest of your days in the town and marry a beautiful woman and have three children.`, `THE END`],[{name: `Restart game`, effect: () => {player.inventory.egg = 10; reset();}},{name: `Go back`, effect: () => moveTo(questionJourneyOwain)}]);
const restBeforeTowerOwain = new storyPart(`11bg`,[``,`Despite your concerns you decide to not question the viability of this journey any longer.`,`After all, this is all for your beloved and innocent horse.`, `You head off to bed prepared for the journey ahead.`],[{name: `Continue`, effect: () => moveTo(towerEntranceOwain)}]);
const towerEntranceOwain = new storyPart(`12b`,[``,`As you arrive at the tower Owain inspects the perimeter with magic and you and Kameron use your telepathy to detect any nearby enemies.`,`The coast is clear.`, `You approach the entrance to the tower and place your hands on the large doors to open them.`, `They creak open and-`, `Kameron: “GUY! STOP! SOMETHING”S COMING!”`, `At Kameron’s warning your telepathic powers begin to flare up.`, `You detect something akin to pure hatred.`, `But…`, `You: “There’s nothing?”`, `Then, the sky darkened, bleeding into a shadowed hue, and from the depths of that gloom, a shape loomed.`, `An impossible, grotesque semblance of a mountain, staggering and unearthly in its motion.`, `Its movements distorted that which existed around it.`, `It did not approach with sound; it was a thing of silence, a soundless behemoth drawing nearer.`, `It was so large that your eyes began to betray you as you tried to calculate its size.`, `Just moments ago it appeared to be a colossal mountain, but now it felt as though you were simply staring at the shadow of a larger being.`, `There is nowhere to run.`, `You must fight.`],[{name: `Fight`, effect: () => moveTo(beastFight)}]);
const afterBeastFightOwain = new storyPart(`13b`,[``,`No matter what you do you can’t seem to injure the beast.`,`In fact the only reason you're alive is because Kameron has been going all out while buffed by Owain holding back the beast all by himself.`, `Finally, Kameron hits the beast hard enough to stagger it, giving you a moment to breathe.`, `Kameron: “HEAD INSIDE THE TOWER!” “OWAIN TAKE GUY AND FINISH THIS!"`, `Owain: “All right."`, `Owain casts one last buff on Kameron and uses his magic to grab you and run towards the tower.`, `You realize too late that Kameron intends to hold back the beast all by himself so that you can finish the journey.`, `You: “WAIT!”`, `You struggle but Owain does not let you go.`, `You: “KAMERON!”`, `Kameron faces the beast as it regains its posture.`, `It looked like a speck of dust trying to erode a mountain.`, `Just before the door to the tower closed Kameron turned around.`, `He smiles at you.`, `Kameron: “GUY! FIND THAT HORSE OF YOURS AND LIVE A GOOD LIFE!”`, `The tower door shuts and Kameron leaves your sight.`, `This will be the last time to see Kameron.`],[{name: `Continue`, effect: () => moveTo(ripKameronOwain)}]);
const ripKameronOwian = new storyPart(`14b`,[``,`After being given some time to grieve Owain urges you to continue.`,`Owain: “I can offer no words of consolation, but the end is near. Let's finish this.”`, `Owain: “For Kameron.”`],[{name: `For Kameron`, effect: () => moveTo(inTheTowerOwain)}]);
const inTheTowerOwain = new storyPart(`15b`,[``,``,``],[{name: `choice2`, effect: () => moveTo()},{name: `choice1`, effect: () => moveTo()}]);


const instructionsOwain = new storyPart(`15ba`,[``,`The instructions are...`,`At the first fork go right, then continue forward until you are met with only two paths.`, `Go left twice, then right once more.`, `Finally you must go straight until you see the end.`, `Are you ready?`],[{name: `Yes`, effect: () => moveTo(maze1Owain)},{name: `No, I need to review again`, effect: () => moveTo(instructionsOwain)}]);
const maze1Owain = new storyPart(`16b`,[``,`You enter the maze and are met with a fork in the paths`,`You can go right, forward, or left.`],[{name: `Go right`, effect: () => moveTo(maze2Owain)},{name: `Go Forward`, effect: () => Fight(mazeFight)}, {name: `Go left`, effect: ()=> Fight(mazeFight)}]);
const maze2Owain = new storyPart(`16ba`,[``,`You continue right and are met with another three way split in the path.`,`You can go right, forward, or left`], [{name: `Go right`, effect: () => moveTo(mazeFight)},{name: `Go Forward`, effect: () => moveTo(maze3Owain)}, {name: `Go left`, effect: ()=> Fight(mazeFight)}]);
const maze3Owain = new storyPart(`16bb`,[``,`You continue forward until you find a towering wall in front of you.`,`The paths available are left and right.`],[{name: `Go left`, effect: () => moveTo(maze4Owain)},{name: `Go right`, effect: () => Fight(mazeFight)}]);
const maze4Owain = new storyPart(`16bc`,[``,`You turn left and continue on.`,`You then find another split in the path forward.`, `You can go left or right.`],[{name: `Go left`, effect: () => moveTo(maze5Owain)},{name: `Go right`, effect: () => Fight(mazeFight)}]);
const maze5Owain = new storyPart(`16bd`,[``,`You turn left again.`,`You can feel yourself reaching the end of the maze.`, `But, once agin you must decide.`, `You can go left, forward, or right`],[{name: `Go left`, effect: () => Fight(mazeFight)},{name: `Go forward`, effect: () => moveTo(mazeFight)}, {name: 'Go right', effect: ()=> moveTo(maze6Owain)}]);
const maze6Owain = new storyPart(`16be`,[``,`You turn right and can see a light straight ahead.`,`But you are met with another crossroads.`, `You should go forward, but you can also go right or left.`, `Again, you should go forward, if you go right or left you could jepordize the entire mission.`, `But the choice is yours.`],[{name: `Go left`, effect: () => moveTo(mazeEnd1Owain)},{name: `GO FORWARD (Pick this one)`, effect: () => moveTo(bossDoorsOwain)}, {name: 'Go right', effect: ()=> moveTo(mazeEnd2Owain)}]);

const mazeEnd1Owain = new storyPart(`E5b`,[``,`Despite all logic and common sense telling you to go forward, you go left.`,`Your irational decision confuses Owain, but he trusts your instincts as a telepath.`, `And so, you continue left`, `You walk and walk`, `And walk`, `And walk`, `And walk`, `And walk`, `Eventually, you begin to think that going left wasn't such a good idea.`, `You try to turn back, but you can't.`, `There is only darkness, and you have no idea where Owain is.`, `Perhaps he used his brain and headed back in order to go down the correct path.`, `You look around.`, `You see nothing.`, `You hear nothing.`, `You feel nothing.`, `Left alone with your thoughts you begin to drift away.`, `THE END`], [{name: `Restart game`, effect: () => reset()}, {name: `Restart at crossroads`, effect: () => moveTo(maze6Chad)}]);
const mazeEnd2Owain = new storyPart(`E6b`,[``,`Despite all logic and common sense tellin you to go forward, you go right`,`Your irational decision confuses Owian, but he trusts your instincts as a telepath.`, `And so you continue right.`, `You walk down a dimly lit path until you reach a dead end.`, `You awkwardly look back at Owain before deciding to head back.`, `But before you can take two steps the floor gives out beneath you and you along with the Owain plunge into a pit filled with small spikes.`, `The spikes are small enough to do you no real harm, but they are laced with a neurotoxin.`, `Anxiety and dread begin to well up inside of you as your body slowly loses function.`, `You can feel every emotion all at once as your brain is being fried by the poison.`, `You and Owain succumb to a deep insanity before dying.`, `THE END`], [{name: `Restart game`, effect: () => reset()},{name: `Restart at crossroads`, effect: () => moveTo(maze6Chad)}]);

const knowledgeGain2Owain = new storyPart(`17af`,[``,`You try to decipher the magic, but to no avail.`,`You could try again.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain3Owain)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsOwain)}]);
const knowledgeGain3Owain = new storyPart(`17ag`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain4Owain)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsOwain)}]);
const knowledgeGain4Owain = new storyPart(`17ah`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain5Owain)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsOwain)}]);
const knowledgeGain5Owain = new storyPart(`17ai`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain6Owain)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsOwain)}]);
const knowledgeGain6Owain = new storyPart(`17aj`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain7Owain)}, {name: `Stop and go to the other door`, effect: ()=> moveTo(bossDoorsOwain)}]);
const knowledgeGain7Owain = new storyPart(`17ak`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`,`You now understand the meaning of life, but you have yet to decipher the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain8Owain)}]);
const knowledgeGain8Owain = new storyPart(`17al`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain9Owain)}]);
const knowledgeGain9Owain = new storyPart(`17am`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`],[{name: `Continue to try to decipher the magic`, effect: () => moveTo(knowledgeGain10Owain)}]);
const knowledgeGain10Owain = new storyPart(`17an`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`,`Your knowledge and wisdom approaches omniscience.`],[{name: `choice2`, effect: () => moveTo(knowledgeGain11Owain)}]);
const knowledgeGain11Owain = new storyPart(`E9a`,[``,`Time passes and you feel yourself getting closer to deciphering the magic.`, `Hundreds of years pass and you find yourself understanding everything, but no closer to breaking past the door.`, `You finally give up and decide to enjoy your omniscience.`, `THE END`],[{name: `Restart game`, effect: () => reset}, {name: `Return to doors`, effect: ()=> moveTo(bossDoorsChad)}]);

const trueBossLoseOwain = new storyPart(`E10b`,[``,`You and Owain fall to Sgrioghadair and fall unconscious.`,`As you awaken you find yourselves unable to control your own body.`, `Sgrioghadair: “I was planning to slowly take control of who I needed over the next hundred years but you guys are quite the splendid surprise.”`, `You and Owain once again fall unconscious.`, `The next time you awake you are surrounded by flames and covered in blood.`, `You have slaughtered thousands while your body wouldn’t listen to you.`, `Under Sgrioghadair’s command you plunge the world into chaos.`, `THE END`],[{name: `Restart game`, effect: () => reset()}, {name: `Restart fight`, effect: () => moveTo(betrayalChad)}, {name: 'Return to doors', effect: ()=> moveTo(bossDoorsChad)}]);




// All story parts go above this line

function Fight(storyFight){
    storyFight.companion = player.companion;
    let buttonHtml = ``;
    inCombat = true;
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
        document.getElementById(`telepathy`).addEventListener("click", telepathyAttempt);
            function telepathyAttempt(){
                if(player.telepathy > 0){
                    document.getElementById(`telepathy`).removeEventListener("click", telepathyAttempt);
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
                    textDisplay(document.getElementById("textDisplay"), `You try to read the enemy's mind, but you are too tired to get a good reading.`);
                }
            };
    };
    document.getElementById(`attack`).addEventListener("click", attackAttempt);
    function attackAttempt() {
        document.getElementById(`attack`).removeEventListener("click", attackAttempt);
        if(enemyChoice == 0){
            player.health -= 1;
            update();
            storyFight.monster.health -= player.attack;
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                document.getElementById("textDisplay").textContent = ``;
                document.getElementById("buttonDisplay").innerHTML = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to attack ${storyFight.monster.name}, but they also attacked and both of you took damage.`);
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
                document.getElementById("textDisplay").textContent = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to attack ${storyFight.monster.name}, but they blocked your attack, rendering it useless.`);
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
                document.getElementById("textDisplay").textContent = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to attack ${storyFight.monster.name}, and they were caught off guard by the quick attack.`);
                Fight(storyFight);
            }
    
        }
    };

    document.getElementById(`defend`).addEventListener("click", defendAttempt)
        function defendAttempt() {
        if(enemyChoice == 0){
            storyFight.monster.health -= (player.attack/2);
            update();
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                document.getElementById("textDisplay").textContent = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to defend against ${storyFight.monster.name}'s attack, and it blocked their attack, allowing for a counter attack.`);
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
                document.getElementById("textDisplay").textContent = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to defend against ${storyFight.monster.name}'s attack, but they also attempted to block, leaving no progress to be made in the battle.`);
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
                document.getElementById("textDisplay").textContent = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to defend against ${storyFight.monster.name}'s attack, but they were waiting for your block and countered it without repercussion.`);
                Fight(storyFight);
            }
        }
         
    };
    document.getElementById(`wait`).addEventListener("click", waitAttempt)
        function waitAttempt() {
        if(enemyChoice == 0){
            player.health -= 1;
            update();
            if(player.health <= 0){
                fightLose(storyFight)
                
            }else if(storyFight.monster.health <= 0){
                fightWin(storyFight)
                
            } else {
                document.getElementById("textDisplay").textContent = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to wait for ${storyFight.monster.name} to block so you could counterattack, but they just attacked, leading to you taking damage.`);
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
                document.getElementById("textDisplay").textContent = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to wait for ${storyFight.monster.name} to block so you could counterattack, and it worked, leading to a successful attack on ${storyFight.monster.name}.`);
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
                document.getElementById("textDisplay").textContent = ``;
                textDisplay(document.getElementById("textDisplay"), `You attempted to wait for ${storyFight.monster.name} to block so you could counterattack, but they had the same plan, leading to both of you awkwardly standing in place doing nothing.`);
                Fight(storyFight);
            }
        }
        
    };
    


}


function fightWin(storyFight){
    inCombat = false;
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
        player.money += 4;
        if (player.losses >= 2 && player.companion == 2){
            moveTo(youSuckEndingOwain);
        }
        if (player.losses >= 2 && player.companion == 1) {
            moveTo(youSuckEndingChad)
        }
        if (currentPart.order == `8a`){
            moveTo(wastelandFightChadWin)
        }
        
    }
    update();
}

function fightLose(storyFight){
    inCombat = false;
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
        if (player.losses >= 2 && player.companion == 2){
            moveTo(youSuckEndingOwain);
        }
        if (player.losses >= 2 && player.companion == 1) {
            moveTo(youSuckEndingChad)
        }
        if (currentPart.order == `8a`){
            moveTo(wastelandFightChadLose)
        }

    }

}

document.getElementById(`inventoryButton`).addEventListener(`click`, () => {
    update();
    if(inventoryDisplay.style.opacity == 0){
        playerStats.style.borderRadius = `0.5rem 0rem 0rem 0.5rem`;
        inventoryDisplay.style.opacity = 1;
    }else{
        playerStats.style.borderRadius = `0.5rem`;
        inventoryDisplay.style.opacity = 0;
    }
});


let currentPart = {};
document.getElementById(`startButton`).addEventListener(`click`, () =>{
    playerStats.style.opacity = 1;
    document.getElementById(`fullTextBox`).style.opacity = 1;
    document.getElementById(`title`).style.opacity = 0;
    moveTo(beginning);
})

textType(document.getElementById("textDisplay"), currentPart.dialogue[0]);
function advanceDialogue(){
    body.removeEventListener("click",advanceDialogue);
    arrow.style.opacity = 0;
    if (currentPart.dialogue.length - 1 > currentDialogueNumber){
        currentDialogueNumber += 1;
        document.getElementById("textDisplay").textContent = ``;
        textType(document.getElementById("textDisplay"), currentPart.dialogue[currentDialogueNumber]);
    } else {
        body.removeEventListener("click",advanceDialogue);
        currentDialogueNumber = 0;
        let buttonHtml = ``;
        for(let i = 0; i < currentPart.options.length ; i++ ){
            buttonHtml += `<button id="option#${i}" class="options">${currentPart.options[i].name}</button>`
        }
        document.getElementById("buttonDisplay").innerHTML = buttonHtml;
        for(let i = 0; i < currentPart.options.length ; i++ ){
            document.getElementById(`option#${i}`).addEventListener("click",() => storyPathRecord.push(currentPart.options[i].name));
            document.getElementById(`option#${i}`).addEventListener("click",currentPart.options[i].effect);
        };
    }
    changeBackgroundTo(currentPart);
}

function textType(element, text, i = 0){
    arrow.style.opacity = 0;
    body.removeEventListener("click",advanceDialogue)
    if (i === 0){
        element.textContent = ``;
    }

    element.textContent += text[i];

    if(i === text.length - 1){
        if(!inCombat){
            arrow.style.opacity = 1
            body.addEventListener("click",advanceDialogue)
        }
        return;
    }

    setTimeout(() => textType(element, text, i + 1), textSpeed - 1);
}

function textDisplay(element, text, i = 0){
    arrow.style.opacity = 0;
    body.removeEventListener("click",advanceDialogue)
    if (i === 0){
        element.textContent = ``;
    }

    element.textContent = text;

    if(i === text.length - 1){
        return;
    }
}

function fish(){
    document.getElementById("textDisplay").textContent = ``;
    textDisplay(document.getElementById("textDisplay"), `A Bite!!`);
    body.removeEventListener("click",advanceDialogue);
    setTimeout(() => body.addEventListener("click", ()=> {textDisplay(document.getElementById("textDisplay"),`You caught a fish!`); player.fish = 1}),1) 
    setTimeout(() => {body.removeEventListener("click",()=> {textDisplay(document.getElementById("textDisplay"),`You caught a fish!`); player.fish = 1}); if(player.fish == 0){textType(document.getElementById("textDisplay"),`The fish got away`)}}, 5);
}

function egg(){
    background.style.backgroundImage = `url(/images/secondTown.jpeg)`
    document.getElementById(`fullTextBox`).style.opacity = 0;
    document.getElementById(`buttonDisplay`).style.opacity = 0;
    document.getElementById(`eggDisplay`).style.zIndex = 70;
    playerStats.style.opacity = 0;
    inventoryDisplay.style.opacity = 0;

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
                document.getElementById(`playerStats`).style.opacity = 1;
                moveTo(afterEggs);
                player.companion = 2;
                for(let i = 0; i < 10; i++){
                    document.getElementById(`egg${i}`).style.opacity = 0;
                }
            }
        });
    }
}

function moveTo(nextPart){
    console.log(storyPathRecord);
    update();
    currentPart = nextPart;
    changeBackgroundTo(nextPart);
    document.getElementById("buttonDisplay").innerHTML = "";
    console.log(currentPart)
    advanceDialogue();
}

function update(){
    if(player.telepathy >= 0){
        document.getElementById(`telepathyContain`).innerHTML = `<p id="telepathyNumber"></p>`
        document.getElementById(`telepathyNumber`).innerText = `Energy: ${player.telepathy}`;
    };
    let inventoryHtml = ``;
    if((player.inventory.healthP > 0) && (player.inventory.energyP > 0)){
        inventoryHtml += `<div class="inventoryItem" id="healthPotionButton" ><img src="/images/healthPotion.png"><p>Health Potion</p><p>Amount: ${player.inventory.healthP}</p></div>`;
        inventoryHtml += `<div class="inventoryItem" id="energyPotionButton" ><img src="/images/shieldPotion.png"><p>Energy Potion</p><p>Amount: ${player.inventory.energyP}</p></div>`;
        inventoryDisplay.innerHTML = inventoryHtml;
        document.getElementById(`energyPotionButton`).addEventListener(`click`,()=>{
            if((player.telepathy == 4) || (player.telepathy < 0)){
                return;
            } else if(player.telepathy == 3){
                player.telepathy += 1;
                player.inventory.energyP -= 1;
            } else {
                player.telepathy += 2;
                player.inventory.energyP -= 1;
            }
            update();
        });
        document.getElementById(`healthPotionButton`).addEventListener(`click`,()=>{
            if(player.health >= 5){
                return;
            } else {
                player.health += 2;
                player.inventory.healthP -= 1;
                if(player.health > 5){
                    player.health = 5;
                }
            }
            update();
        });
    }else if(player.inventory.healthP > 0){
        inventoryHtml += `<div class="inventoryItem" id="healthPotionButton" ><img src="/images/healthPotion.png"><p>Health Potion</p><p>Amount: ${player.inventory.healthP}</p></div>`;
        inventoryDisplay.innerHTML = inventoryHtml;
        document.getElementById(`healthPotionButton`).addEventListener(`click`,()=>{
            if(player.health >= 5){
                return;
            } else {
                player.health += 2;
                player.inventory.healthP -= 1;
                if(player.health > 5){
                    player.health = 5;
                }
            }
            update();
        });
    }else if(player.inventory.energyP > 0){
        inventoryHtml += `<div class="inventoryItem" id="energyPotionButton" ><img src="/images/shieldPotion.png"><p>Energy Potion</p><p>Amount: ${player.inventory.energyP}</p></div>`;
        inventoryDisplay.innerHTML = inventoryHtml;
        document.getElementById(`energyPotionButton`).addEventListener(`click`,()=>{
            if((player.telepathy == 4) || (player.telepathy < 0)){
                return;
            } else if(player.telepathy == 3){
                player.telepathy += 1;
                player.inventory.energyP -= 1;
            } else {
                player.telepathy += 2;
                player.inventory.energyP -= 1;
            }
            update();
        });
    }
    if(player.inventory.energyP == 0 && player.inventory.healthP == 0){
        inventoryHtml = `<p>You have no items</p>`;
        inventoryDisplay.innerHTML = inventoryHtml;
    }
    document.getElementById(`health`).innerText = `Health: ${player.health}`;
    document.getElementById(`money`).innerText = `Money: £${player.money}`;
}

function reset(){
    player.attack = 1;
    player.companion = 0;
    player.health = 5;
    player.losses = 0;
    player.money = 10;
    player.telepathy = -1;
    player.inventory.egg = 0;
    player.inventory.fish = 0;
    player.inventory.healthP = 0;
    player.inventory.energyP = 0;
    update();
    moveTo(beginning);
}

function changeBackgroundTo(nextPart){
    if(nextPart == beginning){
        background.style.backgroundImage = `url(/images/path.jpg)`;
    } else if((nextPart == firstRight) || (nextPart == twoMonthsLater) || (nextPart == secondMiddle) || (nextPart == thirdMiddle) || (nextPart == secondLeft)){
        background.style.backgroundImage = `url(/images/forest.jpg)`;
    } else if(nextPart == firstLeft){
        background.style.backgroundImage = `url(/images/Riverside.jpg)`;
    } else if(nextPart == firstTown){
        background.style.backgroundImage = `url(/images/firstTown.jpeg)`;
    } else if(nextPart == talkedToMayor){
        background.style.backgroundImage = `url(/images/firstTownKnightCommander.jpeg)`
    } else if(nextPart == talkedToKnights){
        background.style.backgroundImage = `url(/images/firstTownKnightGuild.jpeg)`
    } else if(nextPart == returnFirstTown){
        background.style.backgroundImage = `url(/images/firstTown.jpeg)`
        if(currentDialogueNumber >= 14){
            background.style.backgroundImage = `url(/images/Kameron.jpg)`
        }
    } else if((nextPart == firstShop) || (nextPart == secondShop)){
        background.style.backgroundImage = `url(/images/shop.jpg)`
    } else if((nextPart == secondTown) || (nextPart == returnFromLibrary) || (nextPart == refusal)){
        background.style.backgroundImage = `url(/images/secondTown.jpeg)`
    } else if(nextPart == library){
        background.style.backgroundImage = `url(/images/library.png)`
    } else if(nextPart == meetOwainPartOne){
        background.style.backgroundImage = `url(/images/secondTown.jpeg)`
    } else if(nextPart == meetOwainPartTwo){
        background.style.backgroundImage = `url(/images/Owainhouse.jpg)`
        if(currentDialogueNumber >= 14){
            background.style.backgroundImage = `url(/images/Owain.png)`
        }
    } else if(nextPart == afterEggs){
        background.style.backgroundImage = `url(/images/Owain.png)`
    } else if(nextPart == meetChad){
        background.style.backgroundImage = `url(/images/chadKnightGuild.jpeg)`
        if(currentDialogueNumber >= 7){
            background.style.backgroundImage = `url(/images/ChadVonChad.png)`
        }
    } 
}

function preload_image(im_url) {
    let img = new Image();
    img.src = im_url;
}