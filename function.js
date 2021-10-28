//thanks stackoverflow, now removing stuff from an array is easy
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function createUnit(name, props) {
    let unit = new Unit(props);
    units[name] = unit;
    app.stage.addChild(units[name]);
}

function createProjectile(owner, props) {
    // function to create projectile, store it in list and also get it onto the screen
    let proj = projectiles.push(new Projectile(owner, props));
    app.stage.addChild(projectiles[proj-1]);
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

function moveProjectile(proj, delta) {
    //proj.direction being the predefined direction in degrees
    if(elapsed>proj.birth+proj.lifespan) {
        let index = projectiles.indexOf(proj);
        app.stage.removeChild(proj);
        projectiles.splice(index, 1);
    }
    proj.x += proj.speed * delta * Math.sin(rad*proj.direction);
    proj.y += proj.speed * delta * Math.sin(rad*(proj.direction-90));
}

function bossMove(direction) {
    if(units.boss.moving.indexOf(direction)===-1) { //Only add keypress if it doesn't exist
        //hiring big brainers to make this a better function
        switch(direction) {
            case "W":
                units.boss.moving.remove("S");
                units.boss.moving.push("W");
                return;
            case "S":
                units.boss.moving.remove("W");
                units.boss.moving.push("S");
                return;
            case "A":
                units.boss.moving.remove("D");
                units.boss.moving.push("A");
                return;
            case "D":
                units.boss.moving.remove("A");
                units.boss.moving.push("D");
                return;
        }
    }
}

function bossAiMove() {
    let xDistance = units.player.x - units.boss.x;
    let yDistance = units.player.y - units.boss.y;
    
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