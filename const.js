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

let units = {}
let projectiles = [];
let cards = {};
let hand = [];

//Define classes
class Unit extends PIXI.Sprite {
    constructor(spriteName, props) {
        let sprite = sheet.textures[spriteName+".png"];
        super(sprite);
        this.anchor.set(0.5);
        this.x = 100;
        this.y = 100;
        if(props.scale !== undefined) {this.scale.set(props.scale)}
        this.moving = [];
        this.speedX = 0;
        this.speedY = 0;
        props.moveSpeed !== undefined ? this.moveSpeed = props.moveSpeed : this.moveSpeed = 75;
    }
}

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