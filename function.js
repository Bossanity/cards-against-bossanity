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
    let animation = animations[unit.baseSprite+"Walk"];
    if(unit.moving && animation !== undefined && !unit.playing) {
        unit.textures = animation.arr;
        unit.animationSpeed = animation.speed;
        unit.play();
    }
    if(!unit.moving) {
        unit.resetAnimation();
    }
    if(Math.sin(rad*unit.direction)<0) { //negative values mean unit is going left
        unit.scale.x = Math.abs(unit.scale.x)*-1; //flip left
    } else {
        unit.scale.x = Math.abs(unit.scale.x); //flip right
    }
    if(unit.moving) {
        unit.speedX += Math.sin(rad * unit.direction);
        unit.speedY += Math.sin(rad * (unit.direction - 90));
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

    Object.keys(proj.effects).forEach(function(i) { //activate effects
        if(!Array.isArray(proj.effects[i])) {proj.effects[i] = [proj.effects[i]]}
        effects[i](proj, delta/60, proj.effects[i]);
    })

    proj.rotation = rad*(proj.direction-90); //Update rotation(if it changes)
    if(proj.scale.y !== proj.size) {proj.scale.set(proj.size)} //Update size(if it changes)
    proj.movedX += proj.speed * delta * Math.sin(rad*proj.direction);
    proj.movedY += proj.speed * delta * Math.sin(rad*(proj.direction-90));
    if(proj.locked) {
        proj.initX = units[proj.owner].x;
        proj.initY = units[proj.owner].y;
    }
    proj.x = proj.initX + proj.movedX;
    proj.y = proj.initY + proj.movedY;
}

function createAnimation(name, path, speed) {
    animations[name] = {arr: path, speed: speed};
}

function createCard(name, displayName, effect, cost, count, description) {
    cards[name] = new Card(displayName, effect, cost, count, description);
}

function bossAiMove() {
    let xDistance = units['player'].x - units['boss'].x;
    let yDistance = units['player'].y - units['boss'].y;
    let realDistance = Math.sqrt(xDistance**2 + yDistance**2);
    if(realDistance>5) {
        units['boss'].direction = Math.atan2(yDistance, xDistance) / rad + 90;
        units['boss'].moving = true;
    } else {
        units['boss'].moving = false;
    }
}