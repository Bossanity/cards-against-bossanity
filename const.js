let app = new PIXI.Application({ 
    width: 1600, 
    height: 900,
    backgroundColor: 0xeeeeee
    });
document.body.appendChild(app.view);

let sheet;
PIXI.Loader.shared.add("assets/sprites.json").load(setup);

function setup() {
    sheet = PIXI.Loader.shared.resources["assets/sprites.json"].spritesheet;
    run();
}

//establish constants
const frictionFactor = 0.85;
const rad = Math.PI/180;

//Define classes
//Unit properties: moveSpeed, scale
class Unit extends PIXI.AnimatedSprite {
    constructor(spriteName, props) {
        let sprite = sheet.textures[spriteName+".png"];
        super([sprite]);
        this.baseSprite = spriteName;
        this.anchor.set(0.5);
        this.x = 100;
        this.y = 100;
        if(props.scale !== undefined) {this.scale.set(props.scale)}
        this.moving = [];
        this.speedX = 0;
        this.speedY = 0;
        props.moveSpeed !== undefined ? this.moveSpeed = props.moveSpeed : this.moveSpeed = 75;
    }
    resetAnimation() {
        this.textures = [sheet.textures[this.baseSprite+".png"]];
    }
}

//Projectile properties: speed, scale, direction, lifespan
class Projectile extends PIXI.Sprite {
    constructor(spriteName, owner, props) { //props will contain all properties, allowing for default values
        let sprite = sheet.textures[spriteName+".png"];
        super(sprite);
        this.anchor.set(0.5);
        this.owner = owner;
        this.x = units[owner].x;
        this.y = units[owner].y;
        if(props.scale !== undefined) {this.scale.set(props.scale)}
        this.birth = elapsed;
        props.lifespan !== undefined ? this.lifespan = props.lifespan : this.lifespan = 60;
        props.speed !== undefined ? this.speed = props.speed : this.speed = 12;
        props.direction !== undefined ? this.direction = props.direction : this.direction = 0;
        this.rotation = rad*(this.direction-90);
    }
}

class Deck {
    constructor() {
        this.cards = [];
    }

    drawCard() {
        let totalCount = 0;
        this.cards.forEach(function(i) {totalCount += i.count}); //Get total amount of cards in deck
        if(totalCount === 0 ){return}
        let roll = Math.ceil(Math.random()*totalCount); //Roll between 1 and the total card count
        for(let i in this.cards) {
            let card = this.cards[i];
            if(card.count >= roll) {
                card.inHand += 1;
                return card;
            }
            roll -= card.count; //the scuff
        }
    }

    debugCounts() {
        this.cards.forEach(function(i){console.log(i.displayName+": "+(i.count)+" left")});
    }

}

class Card {
    constructor(name, effect, cost, count) {
        this.displayName = name;
        this.effect = effect;
        this.playedTime = -1;
        this.cost = cost;
        this.baseCount = count;
        this.inHand = 0;
    }

    get count() {
        return this.baseCount - this.inHand;
    }

    play() {
        this.effect();
        this.playedTime = elapsed;
        this.inHand -= 1;
        console.log("Played "+this.displayName);
    }

}

let units = {}
let projectiles = [];
let animations = {};
let cards = {};
let deck = new Deck();