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

//Similiar to unit except always moving in one direction
//maybe in the future add slight curving if shot while moving (think binding of isaac)
class Projectile extends PIXI.Graphics {
    constructor(owner, speed, direction) {
        super();
        this.x = owner.x; //Perhaps hardcoding this is fine
        this.y = owner.y; //For projectiles generated based on the environment could use dummy units as owners
        this.beginFill(0xff0000);
        this.drawRect(0, 0, 25, 5);
        this.endFill();
        this.speed = speed;
        this.direction = direction;
    }
}

function moveUnit(unit, delta) {
    let input = unit.moving;
    //Perhaps this list of ifs could be done better
    //Some sort of genius solution
    if(input.includes("W")) {
        unit.speedY-=1;
    }
    if(input.includes("A")) {
        unit.speedX-=1;
    }
    if(input.includes("D")) {
        unit.speedX+=1;
    }
    if(input.includes("S")) {
        unit.speedY+=1;
    }
    unit.speedX *= frictionFactor;
    unit.speedY *= frictionFactor;
    //speedX and speedY effectively act as acceleration
    unit.x += unit.speedX * delta/60 * unit.moveSpeed;
    unit.y += unit.speedY * delta/60 * unit.moveSpeed;
}

function createProjectile(owner, speed, direction) {
    // function to create projectile, store it in list and also get it onto the screen
    let proj = projectiles.push(new Projectile(owner, speed, direction));
    proj = projectiles[proj-1];
    proj.rotation = rad*(proj.direction-90);
    app.stage.addChild(proj);
}

function moveProjectile(proj, delta) {
    //proj.direction being the predefined direction in degrees
   proj.x += proj.speed * delta * Math.sin(rad*proj.direction);
   proj.y += proj.speed * delta * Math.sin(rad*(proj.direction-90));
}

//load units
let units = {
    player: new Unit(50, 50, 75),
    boss: new Unit(125, 125, 20)
}
let projectiles = [];

//add units to screen
app.stage.addChild(units.player);
app.stage.addChild(units.boss);

//key handler
document.addEventListener('keydown', function(key) {
    let movements = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    let shoots = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if(movements.includes(key.code)) {
        let input = key.code.slice(3,4); //'W', 'A', 'S', 'D'
        if(units.player.moving.indexOf(input)===-1) { //Only add keypress if it doesn't exist
            units.player.moving.push(input);
        }
        return;
    }
    if(shoots.includes(key.code)) {
        let input = key.code.slice(5,10); //'Left', 'Right', 'Up', 'Down'
        let direction;
        switch(input) {
            case "Up":
                direction = 0;
                break;
            case "Right":
                direction = 90;
                break;
            case "Down":
                direction = 180;
                break;
            case "Left":
                direction = 270;
                break;
        }
        createProjectile(units.player, 10, direction);
    }
})
document.addEventListener('keyup', function(key) {
    let movements = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    if(movements.includes(key.code)) {
        let input = key.code.slice(3,4);
        units.player.moving.splice(units.player.moving.indexOf(input), 1); //remove keypress
    }
})

//Global ticker
let elapsed = 0.0; //Total milliseconds
app.ticker.add((delta) => {
    elapsed += delta; //add time since last tick
    let frameCount = Math.floor(elapsed/60); // Total framecount
    for(let i in units) {
        //units move based on their moving property
        moveUnit(units[i], delta);
    }
    for(let i in projectiles) {
        //projectiles always move in their predefined direction
        moveProjectile(projectiles[i], delta);
    }
});