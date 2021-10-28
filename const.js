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

//Define classes and functions
class Unit extends PIXI.Graphics {
    constructor(height, width, moveSpeed) {
        super();
        this.beginFill(0x000000);
        this.drawCircle(0, 0, width, height);
        this.endFill();
        this.moving = [];
        this.speedX = 0;
        this.speedY = 0;
        this.moveSpeed = moveSpeed;
    }
}

class Projectile extends PIXI.Graphics {
    constructor(owner, props) { //props will contain all properties, defaults are used for undefined ones
        super();
        this.owner = owner;
        this.x = units[owner].x; //Perhaps hardcoding this is fine
        this.y = units[owner].y; //For projectiles generated based on the environment could use dummy units as owners
        this.beginFill(0xff0000);
        props.size !== undefined ? this.drawRect(0, 0, props.size, props.size) : this.drawRect(0,0,10,10);
        this.endFill();
        this.birth = elapsed;
        props.lifespan !== undefined ? this.lifespan = props.lifespan : this.lifespan = 60;
        props.speed !== undefined ? this.speed = props.speed : this.speed = 12;
        props.direction !== undefined ? this.direction = props.direction : this.direction = 0;
        this.rotation = rad*(this.direction-90);
    }
}