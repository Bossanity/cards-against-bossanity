//thanks stackoverflow, now removing stuff from an array is easy
Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function createUnit(spriteName, name, props) {
    units[name] = new Unit(spriteName, props);
    app.stage.addChild(units[name]);
}

function createProjectile(sprite, owner, props) {
    // function to create projectile, store it in list and also get it onto the screen
    let proj = projectiles.push(new Projectile(sprite, owner, props));
    app.stage.addChild(projectiles[proj-1]);
}

function moveUnit(unit, delta) {
    let input = unit.moving;
    let animation = animations[unit.baseSprite+"Walk"];
    if(input.length !== 0 && animation !== undefined && !unit.playing) {
        unit.textures = animation.arr;
        unit.animationSpeed = animation.speed;
        unit.play();
    }
    if(input.length === 0) {
        unit.resetAnimation();
    }
    //Perhaps this list of ifs could be done better
    //Some sort of genius solution
    if(input.includes("D")) {
        unit.speedX+=1;
        unit.scale.x = Math.abs(unit.scale.x); //Face right
    }
    if(input.includes("S")) {
        unit.speedY+=1;
    }
    if(input.includes("A")) {
        unit.speedX-=1;
        unit.scale.x = Math.abs(unit.scale.x)*-1; //Face left
    }
    if(input.includes("W")) {
        unit.speedY-=1;
    }
    unit.speedX *= frictionFactor;
    unit.speedY *= frictionFactor;
    //speedX and speedY effectively act as acceleration
    unit.x += unit.speedX * delta/60 * unit.moveSpeed;
    unit.y += unit.speedY * delta/60 * unit.moveSpeed;
}

function moveProjectile(proj, delta) {
    //proj.direction being the predefined direction in degrees
    if(elapsed>proj.birth+proj.lifespan) {
        let index = projectiles.indexOf(proj);
        app.stage.removeChild(proj);
        projectiles.splice(index, 1);
    }
    proj.rotation = rad*(proj.direction-90); //Update rotation(if it changes)
    proj.x += proj.speed * delta * Math.sin(rad*proj.direction);
    proj.y += proj.speed * delta * Math.sin(rad*(proj.direction-90));
}

function createAnimation(name, path, speed) {
    animations[name] = {arr: path, speed: speed};
}

function bossMove(direction) {
    let bossMoving = units['boss'].moving;
    if(bossMoving.indexOf(direction)===-1) { //Only add keypress if it doesn't exist
        //hiring big brains to make this a better function
        switch(direction) {
            case "W":
                bossMoving.remove("S");
                bossMoving.push("W");
                return;
            case "S":
                bossMoving.remove("W");
                bossMoving.push("S");
                return;
            case "A":
                bossMoving.remove("D");
                bossMoving.push("A");
                return;
            case "D":
                bossMoving.remove("A");
                bossMoving.push("D");
                return;
        }
    }
}

function bossAiMove() {
    let xDistance = units['player'].x - units['boss'].x;
    let yDistance = units['player'].y - units['boss'].y;
    
    if(xDistance>0) { //if the player is to the right
        bossMove("D");
    } else {
        bossMove("A")
    }
    if(yDistance>0) { //if the player is below (remember positive Y is down)
        bossMove("S");
    } else {
        bossMove("W");
    }
}