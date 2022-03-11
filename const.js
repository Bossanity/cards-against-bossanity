let app = new PIXI.Application({ 
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xeeeeee,
    antialias: true
    });
const b = new Bump();

document.body.appendChild(app.view);

// noinspection JSConstantReassignment
PIXI.settings.ROUND_PIXELS = true;

app.loader.add("assets/sprites.json");
app.loader.add("card", "assets/card.png");
let sheet;
app.loader.load(() => {run()});

//establish constants
const frictionFactor = 0.85;
const rad = Math.PI/180;

const cardText = new PIXI.TextStyle({
    align: "center",
    fontFamily: "VT323",
    fontSize: 18
});

const cardDescText = new PIXI.TextStyle({
    align: "center",
    fontFamily: "VT323",
    fontSize: 18,
    wordWrap: true,
    wordWrapWidth: 100
});

//Define classes
//Unit properties: moveSpeed, scale
class Unit extends PIXI.AnimatedSprite {
    constructor(spriteName, props) {
        let sprite = sheet.textures[spriteName+".png"];
        super([sprite]);
        this.baseSprite = spriteName;
        this.anchor.set(0.5);
        props.x !== undefined ? this.x = props.x : this.x = app.view.width/2;
        props.y !== undefined ? this.y = props.y : this.y = app.view.height/2;
        if(props.scale !== undefined) {this.scale.set(props.scale)}
        this.direction = 0;
        this.moving = false;
        props.maxHp !== undefined ? this.maxHp = props.maxHp : this.maxHp = 100;
        props.hp !== undefined ? this.hp = props.hp : this.hp = this.maxHp;
        props.damage !== undefined ? this.damage = props.damage : this.damage = 10;
        this.lastHit = 0;
        props.invTime !== undefined ? this.invTime = props.invTime : this.invTime = 45;
        props.ai !== undefined ? this.ai = props.ai : this.ai = false;
        this.speedX = 0;
        this.speedY = 0;
        props.moveSpeed !== undefined ? this.moveSpeed = props.moveSpeed : this.moveSpeed = 75;
    }
    resetAnimation() {
        this.textures = [sheet.textures[this.baseSprite+".png"]];
    }
    takeDamage(amount) {
        this.hp -= amount;
        if(this.hp<=0) {
            deleteUnit(this);
        }
    }
}

//Projectile properties: speed, scale, direction, lifespan
class Projectile extends PIXI.AnimatedSprite {
    constructor(spriteName, owner, props) { //props will contain all properties, allowing for default values
        let sprite = sheet.textures[spriteName+".png"];
        super([sprite]);
        this.baseSprite = spriteName;
        this.anchor.set(0.5);
        this.owner = owner;
        props.locked !== undefined ? this.locked = props.locked : this.locked = false;
        props.initX !== undefined ? this.initX = props.initX : this.initX = units[owner].x;
        props.initY !== undefined ? this.initY = props.initY : this.initY = units[owner].y;
        props.movedX !== undefined ? this.movedX = props.movedX : this.movedX = 0;
        props.movedY !== undefined ? this.movedY = props.movedY : this.movedY = 0;
        this.x = this.initX + this.movedX;
        this.y = this.initY + this.movedY;
        props.size !== undefined ? this.size = props.size : this.size = 1;
        props.birth !== undefined ? this.birth = props.birth : this.birth = Math.round(elapsed);
        props.lifespan !== undefined ? this.lifespan = props.lifespan : this.lifespan = 60;
        props.speed !== undefined ? this.speed = props.speed : this.speed = 12;
        props.direction !== undefined ? this.direction = props.direction : this.direction = 0;
        props.damage !== undefined ? this.damage = props.damage : this.damage = 10;
        this.rotation = rad*(this.direction-90);
        props.effects !== undefined ? this.effects = props.effects : this.effects = {};
        props.tracerEffects !== undefined ? this.tracerEffects = props.tracerEffects : this.tracerEffects = {};
    }

    get lived() {
        return elapsed - this.birth;
    }

    set size(amount) {
        this.scale.set(amount);
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.handCards = ["", "", "", "", "", ""];
    }

    get drawPileCards() {
        let sum = 0;
        this.cards.forEach(function(e) {sum += e.count});
        return sum;
    }

    get discardPileCards() {
        let sum = 0;
        this.cards.forEach(function(e) {sum += e.inDiscard});
        return sum;
    }

    get handCardCount() {
        let sum = 0;
        this.handCards.forEach(function(e) {if(e!==""){sum++;}})
        return sum;
    }

    get firstEmptySlot() {
        return deck.handCards.indexOf("");
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
                renderCard(card);
                this.handCards[this.firstEmptySlot] = card.displayName;
                return card;
            }
            roll -= card.count;
        }
    }

    resetDrawPile() {
        this.cards.forEach(function(e) {e.inDiscard = 0});
        console.log("Reset draw pile")
    }

    debugCounts() {
        this.cards.forEach(function(i){console.log(i.displayName+": "+(i.count)+" left")});
    }

}

class Card {
    constructor(name, effect, cost, count, description) {
        this.displayName = name;
        this.effect = effect;
        this.description = description;
        this.playedTime = -1;
        this.cost = cost;
        this.baseCount = count;
        this.inHand = 0;
        this.inDiscard = 0;
    }

    get count() {
        return this.baseCount - this.inHand - this.inDiscard;
    }

    play() {
        this.effect();
        this.playedTime = elapsed;
        this.inHand -= 1;
        this.inDiscard += 1;
    }

    discard() {
        this.inHand -= 1;
        this.inDiscard += 1;
    }

    playFree() {
        this.effect();
    }

}

class Obstacle extends PIXI.AnimatedSprite {
    constructor(spriteName, props) {
        let sprite = sheet.textures[spriteName+".png"];
        super([sprite]);
        this.baseSprite = spriteName;
        this.anchor.set(0.5);
        props.x !== undefined ? this.x = props.x : this.x = app.view.width*Math.random();
        props.y !== undefined ? this.y = props.y : this.y = app.view.height*Math.random();
        props.effects !== undefined ? this.effects = props.effects : this.effects = {};
        if(props.opacity !== undefined) {this.alpha = props.opacity}
        if(props.scale !== undefined) {this.scale.set(props.scale)}
    }
}

let units = {}
let projectiles = [];
let obstacles = [];
let animations = {};
let cards = {};
let keysDown = [];
let timers = {playerShoot: 0, cardDraw: 0};
let timersLength = {playerShoot: 12, cardDraw: 105};
let states = {discarding: false};
let triggers = {discard: [], playerDamage: [], bossDamage: []}
const tileSize = 25;
const tileThresholds = [0.5, -0.5, 0.3, -0.1] //chances: 10%, 20%, 30%, 40% source: trust me bro
let deck = new Deck();
let effects = {
    accelerate: function(proj, delta, power) {proj.speed += delta*power[0]},
    decelerate: function(proj, delta, power) {proj.speed -= delta*power[0]; if(proj.speed<0) {proj.speed = 0}},
    grow: function(proj, delta, power) {proj.size += delta*power[0]},
    shrink: function(proj, delta, power) {proj.size -= delta*power[0]; if(proj.size<0.01) {proj.size = 0.01}},
    tracer: function(proj, delta, power) {
        if(Math.round(proj.lived)%power[0]===0) { //Tracer is unique in that it uses an array of two power values, the first multiplies lifespan and speed, the second describes the frequency of tracers appearing (every nth frame)
            createProjectile(proj.baseSprite, proj.owner, {initX: proj.initX, initY: proj.initY, movedX: proj.movedX, movedY: proj.movedY, lifespan: proj.lifespan*power[1], speed: proj.speed*power[1], direction: proj.direction, x: proj.x, y: proj.y, locked: proj.locked, size: proj.size, effects: proj.tracerEffects})
        }
    },
    tracerSync: function(proj, delta, power) {
        if(Math.round(proj.lived)%power[0]===0) {
            createProjectile(proj.baseSprite, proj.owner, {initX: proj.initX, initY: proj.initY, movedX: proj.movedX, movedY: proj.movedY, birth: proj.birth, lifespan: proj.lifespan, speed: proj.speed*power[1], direction: proj.direction, x: proj.x, y: proj.y, locked: proj.locked, size: proj.size, effects: proj.tracerEffects})
        }
    },
    turn: function(proj, delta, power) {proj.direction += delta*power[0]},
    turnAfter: function(proj, delta, power) {
        if(Math.round(proj.lived)%power[0]===0) {
            proj.direction += power[1];
            proj.effects.turnAfter = [10000, 0]; // Turn off the effect once it triggers
        }
    },
    turnSquare: function(proj, delta, power) {
        if(Math.round(proj.lived)%power[0]===0) {
            proj.direction += power[1];
        }
    },
    homing: function(proj) {
        proj.direction = getPlayerDirection(proj);
    }
}
let obstacleEffects = {
    unitCollide: function(obs, unit, delta) {
        let dir = Math.atan2(unit.y - obs.y, unit.x - obs.x) / rad + 90;
        if (dir < 0) {
            dir += 360
        }
        unit.x += Math.sin(rad * dir) * delta / 60 * unit.moveSpeed * 2.1;
        unit.y += Math.sin(rad * (dir - 90)) * delta / 60 * unit.moveSpeed * 2.1;
        unit.speedX *= 0.66;
        unit.speedY *= 0.66;
    },
    projDelete: function(obs, proj) {
        deleteProjectile(proj);
    },
    unitCardTrigger: function(obs, unit, delta, card) {
        if(unit === units["player"]) {
            card.playFree();
            deleteObstacle(obs);
        }
    }
}