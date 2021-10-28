let app = new PIXI.Application({ 
    width: 1600, 
    height: 900,
    backgroundColor: 0xeeeeee
    });
document.body.appendChild(app.view);

function loadSprite(name) {
    return PIXI.Sprite.from('assets/'+name+'.png');
}

//establish constants
const frictionFactor = 0.85;
const rad = Math.PI/180;

let units = {}
let projectiles = [];
let cards = {};
let hand = [];

//Define classes
class Unit extends PIXI.Graphics {
    constructor(props) {
        super();
        this.x = 100;
        this.y = 100;
        //the color and filling section may be completely reworked once we have sprites
        props.color !== undefined ? this.beginFill(props.color) : this.beginFill(0x000000);
        props.size !== undefined ? this.drawCircle(0, 0, props.size, props.size) : this.drawCircle(0, 0, 50, 50);
        this.endFill();
        this.moving = [];
        this.speedX = 0;
        this.speedY = 0;
        props.moveSpeed !== undefined ? this.moveSpeed = props.moveSpeed : this.moveSpeed = 75;
    }
}

class Projectile extends PIXI.Graphics {
    constructor(owner, props) { //props will contain all properties, allowing for default values
        super();
        this.owner = owner;
        this.x = units[owner].x;
        this.y = units[owner].y;
        this.beginFill(0xff0000);
        props.size !== undefined ? this.drawRect(0, 0, props.size, props.size) : this.drawRect(0,0,8,8);
        this.endFill();
        this.birth = elapsed;
        props.lifespan !== undefined ? this.lifespan = props.lifespan : this.lifespan = 60;
        props.speed !== undefined ? this.speed = props.speed : this.speed = 12;
        props.direction !== undefined ? this.direction = props.direction : this.direction = 0;
        this.rotation = rad*(this.direction-90);
    }
}